// P1-③: 阅读进度条 — 60fps 流畅渐变进度
// 防御性编程：所有外部依赖都做空值检查，避免阻断其他组件初始化
;(function () {
  // 等待 addCleanup 可用（由 spa.inline.ts 定义，可能在当前脚本之后加载）
  const waitForAddCleanup = (): Promise<((fn: () => void) => void) | null> => {
    return new Promise((resolve) => {
      if (typeof window.addCleanup === "function") {
        resolve(window.addCleanup)
        return
      }
      // 最多等 2s，超时则放弃 cleanup 注册（不影响核心功能）
      const start = Date.now()
      const interval = setInterval(() => {
        if (typeof window.addCleanup === "function") {
          clearInterval(interval)
          resolve(window.addCleanup)
        } else if (Date.now() - start > 2000) {
          clearInterval(interval)
          resolve(null)
        }
      }, 50)
    })
  }

  function initReadingProgress() {
    const bar = document.querySelector(".reading-progress-bar") as HTMLElement | null
    if (!bar) return

    let ticking = false
    let lastPercent = -1

    function updateProgress() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const percent = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0

      if (Math.abs(percent - lastPercent) > 0.3) {
        bar.style.transform = `scaleX(${percent / 100})`
        lastPercent = percent
      }
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(updateProgress)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    updateProgress()

    // 安全注册 cleanup
    waitForAddCleanup().then((cleanup) => {
      if (cleanup) {
        cleanup(() => {
          window.removeEventListener("scroll", onScroll)
        })
      }
    })
  }

  // 导航后重新初始化
  document.addEventListener("nav", () => {
    initReadingProgress()
  })

  initReadingProgress()
})()
