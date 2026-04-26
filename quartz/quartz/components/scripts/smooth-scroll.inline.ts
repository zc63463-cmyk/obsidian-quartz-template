/**
 * Smooth Scroll with Offset
 * 
 * 覆盖原生锚点跳转行为，提供平滑滚动 + 顶部偏移
 * 不修改 spa.inline.ts（核心禁忌），通过事件拦截实现
 * 
 * 安全模式：IIFE + addCleanup + 只监听事件，不操作 DOM 结构
 */
;(() => {
  const SCROLL_OFFSET = 20 // 顶部呼吸空间（无固定 header，仅留少量间距）

  /**
   * 平滑滚动到目标元素，带偏移量
   */
  function smoothScrollToElement(el: HTMLElement) {
    const elPosition = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
    window.scrollTo({ top: elPosition, behavior: "smooth" })
  }

  /**
   * 处理 URL hash 变化后的滚动
   * spa.inline.ts 的 scrollIntoView() 先执行，我们用一个微任务覆盖
   */
  function handleHashScroll() {
    const hash = window.location.hash
    if (!hash) return
    const targetId = decodeURIComponent(hash.substring(1))
    const el = document.getElementById(targetId)
    if (el) {
      // 用 requestAnimationFrame 确保 spa.inline.ts 的 scrollIntoView 先执行
      requestAnimationFrame(() => {
        smoothScrollToElement(el)
      })
    }
  }

  // 监听 SPA 导航完成事件
  document.addEventListener("nav", () => {
    handleHashScroll()
  })

  // 监听浏览器原生 hashchange（非 SPA 场景，如直接输入 URL）
  const onHashChange = () => {
    requestAnimationFrame(() => handleHashScroll())
  }
  window.addEventListener("hashchange", onHashChange)
  window.addCleanup(() => window.removeEventListener("hashchange", onHashChange))

  // 覆盖同页面锚点链接的点击行为（spa.inline.ts 第 156-161 行的处理）
  // spa.inline.ts 中的 isSamePage hash 处理用的是 scrollIntoView()
  // 我们在捕获阶段拦截，调用 smoothScrollToElement 并阻止默认行为
  const onClickCapture = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null
    if (!target) return
    const anchor = target.closest("a")
    if (!anchor) return
    const href = anchor.getAttribute("href")
    if (!href || !href.startsWith("#")) return

    // 同页面锚点链接
    const targetId = decodeURIComponent(href.substring(1))
    const el = document.getElementById(targetId)
    if (el) {
      // 不阻止默认行为（让 spa.inline.ts 继续处理 URL 更新）
      // 但在下一帧覆盖滚动位置
      requestAnimationFrame(() => smoothScrollToElement(el))
    }
  }
  document.addEventListener("click", onClickCapture, true) // 捕获阶段
  window.addCleanup(() => document.removeEventListener("click", onClickCapture, true))
})()
