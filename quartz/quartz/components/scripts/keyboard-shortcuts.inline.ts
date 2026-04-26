/**
 * Keyboard Shortcuts
 * 
 * 为 CS Wiki 提供键盘导航快捷键，提升知识库阅读效率
 * 
 * 快捷键列表：
 *   /     → 聚焦搜索框
 *   t     → 切换 TOC 展开/折叠
 *   e     → 切换 Explorer（移动端）
 *   j/k   → 下一个/上一个标题（h1-h6）
 *   Esc   → 关闭搜索/灯箱/侧栏弹窗
 * 
 * 安全模式：IIFE + addCleanup + 只操作已有 DOM 元素的类名/焦点
 */
;(() => {
  // 避免在输入框中触发快捷键
  function isEditable(el: EventTarget | null): boolean {
    if (!(el instanceof HTMLElement)) return false
    const tag = el.tagName
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      el.isContentEditable
    )
  }

  // ===== / 键：聚焦搜索框 =====
  function focusSearch() {
    const searchInput = document.querySelector<HTMLInputElement>('input[name="search"]')
    if (searchInput) {
      // 先打开搜索容器（如果有关闭状态的）
      const searchButton = document.querySelector<HTMLButtonElement>(".search-button")
      if (searchButton && searchButton.offsetParent !== null) {
        searchButton.click()
      }
      setTimeout(() => searchInput.focus(), 50)
    }
  }

  // ===== t 键：切换 TOC =====
  function toggleToc() {
    const tocHeader = document.querySelector<HTMLElement>(".toc-header")
    if (tocHeader) {
      tocHeader.click()
    }
  }

  // ===== e 键：切换 Explorer（移动端） =====
  function toggleExplorer() {
    const explorerToggle = document.querySelector<HTMLElement>(".explorer-toggle")
    if (explorerToggle) {
      explorerToggle.click()
    }
  }

  // ===== j/k 键：跳转标题 =====
  function getHeadings(): HTMLElement[] {
    return Array.from(document.querySelectorAll("article h1[id], article h2[id], article h3[id], article h4[id], article h5[id], article h6[id]"))
  }

  function getCurrentHeadingIndex(headings: HTMLElement[]): number {
    const scrollY = window.scrollY
    let closest = -1
    let closestDist = Infinity
    for (let i = 0; i < headings.length; i++) {
      const dist = Math.abs(headings[i].getBoundingClientRect().top)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    }
    return closest
  }

  function navigateHeading(direction: "next" | "prev") {
    const headings = getHeadings()
    if (headings.length === 0) return

    const currentIdx = getCurrentHeadingIndex(headings)
    let targetIdx: number

    if (direction === "next") {
      targetIdx = currentIdx + 1
      if (targetIdx >= headings.length) return // 已在最后
    } else {
      targetIdx = currentIdx - 1
      if (targetIdx < 0) return // 已在最前
    }

    const target = headings[targetIdx]
    const offset = 20
    const elPosition = target.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: elPosition, behavior: "smooth" })

    // 高亮闪烁效果
    target.style.transition = "background-color 0.3s ease"
    target.style.backgroundColor = "rgba(132, 165, 157, 0.15)"
    setTimeout(() => {
      target.style.backgroundColor = ""
    }, 800)
  }

  // ===== Esc 键：关闭弹窗 =====
  function handleEscape() {
    // 1. 关闭搜索
    const searchContainer = document.querySelector(".search-container")
    if (searchContainer?.classList.contains("active")) {
      const searchInput = document.querySelector<HTMLInputElement>('input[name="search"]')
      searchInput?.blur()
      searchContainer.classList.remove("active")
      return
    }

    // 2. 关闭灯箱
    const lightbox = document.querySelector(".lightbox-overlay")
    if (lightbox) {
      lightbox.remove()
      document.body.style.overflow = ""
      return
    }

    // 3. 关闭移动端 Explorer
    const explorer = document.querySelector(".explorer")
    if (explorer && !explorer.classList.contains("collapsed")) {
      const explorerToggle = document.querySelector<HTMLElement>(".explorer-toggle")
      explorerToggle?.click()
      return
    }

    // 4. 关闭 popover
    const popover = document.querySelector(".popover")
    if (popover) {
      popover.remove()
      return
    }
  }

  // ===== 主事件处理 =====
  const onKeyDown = (e: KeyboardEvent) => {
    if (isEditable(e.target)) return

    switch (e.key) {
      case "/":
        e.preventDefault()
        focusSearch()
        break
      case "t":
        e.preventDefault()
        toggleToc()
        break
      case "e":
        e.preventDefault()
        toggleExplorer()
        break
      case "j":
        e.preventDefault()
        navigateHeading("next")
        break
      case "k":
        e.preventDefault()
        navigateHeading("prev")
        break
      case "Escape":
        handleEscape()
        break
    }
  }

  document.addEventListener("keydown", onKeyDown)
  window.addCleanup(() => document.removeEventListener("keydown", onKeyDown))

  // ===== 快捷键提示（首次访问 3 秒后显示 toast） =====
  const TOAST_KEY = "cswiki-keyboard-hint-shown"
  document.addEventListener("nav", () => {
    if (localStorage.getItem(TOAST_KEY)) return
    setTimeout(() => {
      const toast = document.createElement("div")
      toast.className = "keyboard-hint-toast"
      toast.innerHTML = `
        <div class="hint-content">
          <strong>⌨️ 快捷键</strong>
          <span><kbd>/</kbd> 搜索 · <kbd>t</kbd> 目录 · <kbd>j/k</kbd> 跳标题 · <kbd>Esc</kbd> 关闭</span>
        </div>
      `
      document.body.appendChild(toast)
      setTimeout(() => {
        toast.style.opacity = "0"
        setTimeout(() => toast.remove(), 300)
      }, 5000)
      localStorage.setItem(TOAST_KEY, "1")
    }, 3000)
  })
})()
