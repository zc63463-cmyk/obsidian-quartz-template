/**
 * Search Enhancement - Recent History + Overlay Z-index Fix
 * 
 * 1. 为搜索框添加最近搜索历史记录功能
 * 2. 修复搜索遮罩层 z-index 堆叠上下文问题
 *    （.search-container 在 .sidebar.left 内，sidebar 的 z-index:1 + position:sticky
 *     创建 stacking context，导致 search-container 的 z-index:999 实际只在 sidebar 内有效，
 *     根层等效 z-index 仍为 1，底层内容透过遮罩泄露）
 * 不修改 search.inline.ts，通过监听搜索框事件叠加功能
 * 
 * 安全模式：IIFE + addCleanup + 只操作 fixed/absolute 定位元素
 */
;(() => {
  const STORAGE_KEY = "cswiki-search-history"
  const MAX_HISTORY = 8

  function getHistory(): string[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    } catch {
      return []
    }
  }

  function saveHistory(term: string) {
    if (!term.trim()) return
    const history = getHistory().filter((t) => t !== term)
    history.unshift(term)
    if (history.length > MAX_HISTORY) history.length = MAX_HISTORY
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY)
  }

  document.addEventListener("nav", () => {
    const searchInput = document.querySelector<HTMLInputElement>('input[name="search"]')
    const searchSpace = document.querySelector(".search-space")
    if (!searchInput || !searchSpace) return

    let historyEl: HTMLElement | null = null

    // ===== Z-index 堆叠修复 =====
    // 搜索打开时提升侧边栏 z-index，关闭时恢复
    const sidebar = document.querySelector(".sidebar.left") as HTMLElement | null

    function boostSidebarZIndex() {
      if (sidebar) {
        sidebar.style.zIndex = "99999"
      }
    }

    function resetSidebarZIndex() {
      if (sidebar) {
        sidebar.style.zIndex = ""
      }
    }

    // ===== 搜索历史 =====
    function showHistory() {
      const history = getHistory()
      if (history.length === 0 || searchInput.value.trim()) return
      removeHistory()

      historyEl = document.createElement("div")
      historyEl.className = "search-history"

      const header = document.createElement("div")
      header.className = "search-history-header"
      header.innerHTML = `<span>最近搜索</span><button class="search-history-clear">清除</button>`

      const list = document.createElement("div")
      list.className = "search-history-list"

      for (const term of history) {
        const item = document.createElement("button")
        item.className = "search-history-item"
        item.textContent = term
        list.appendChild(item)
      }

      historyEl.appendChild(header)
      historyEl.appendChild(list)

      // 点击历史项
      list.addEventListener("click", (e) => {
        const target = e.target as HTMLElement
        if (target.classList.contains("search-history-item")) {
          searchInput.value = target.textContent || ""
          searchInput.dispatchEvent(new Event("input", { bubbles: true }))
          removeHistory()
        }
      })

      // 清除按钮
      header.querySelector(".search-history-clear")?.addEventListener("click", (e) => {
        e.stopPropagation()
        clearHistory()
        removeHistory()
      })

      // 插入到 search-space 中
      searchSpace.appendChild(historyEl)
    }

    function removeHistory() {
      if (historyEl) {
        historyEl.remove()
        historyEl = null
      }
    }

    // 聚焦时显示历史
    const onFocus = () => showHistory()
    searchInput.addEventListener("focus", onFocus)

    // 输入时隐藏历史
    const onInput = () => {
      if (searchInput.value.trim()) {
        removeHistory()
      } else {
        showHistory()
      }
    }
    searchInput.addEventListener("input", onInput)

    // 提交搜索时保存历史
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && searchInput.value.trim()) {
        saveHistory(searchInput.value.trim())
        removeHistory()
      }
    }
    searchInput.addEventListener("keydown", onKeyDown)

    // 搜索容器开关时：清理历史 + 修复 z-index
    const searchContainer = document.querySelector(".search-container")
    const observer = new MutationObserver(() => {
      if (searchContainer) {
        if (searchContainer.classList.contains("active")) {
          boostSidebarZIndex()
        } else {
          resetSidebarZIndex()
          removeHistory()
        }
      }
    })
    if (searchContainer) {
      observer.observe(searchContainer, { attributes: true, attributeFilter: ["class"] })
    }

    window.addCleanup(() => {
      searchInput.removeEventListener("focus", onFocus)
      searchInput.removeEventListener("input", onInput)
      searchInput.removeEventListener("keydown", onKeyDown)
      observer.disconnect()
      removeHistory()
      resetSidebarZIndex()
    })
  })
})()
