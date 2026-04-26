// P1-④: 回到顶部按钮 — 毛玻璃效果，300px 后浮现
// 防御性编程：所有外部依赖都做空值检查
;(function () {
  const waitForAddCleanup = (): Promise<((fn: () => void) => void) | null> => {
    return new Promise((resolve) => {
      if (typeof window.addCleanup === "function") {
        resolve(window.addCleanup)
        return
      }
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

  function initBackToTop() {
    const btn = document.querySelector(".back-to-top") as HTMLElement | null
    if (!btn) return

    let ticking = false
    let isVisible = false

    function toggleVisibility() {
      const shouldShow = window.scrollY > 300
      if (shouldShow !== isVisible) {
        isVisible = shouldShow
        if (isVisible) {
          btn.classList.add("visible")
        } else {
          btn.classList.remove("visible")
        }
      }
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(toggleVisibility)
      }
    }

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    })

    window.addEventListener("scroll", onScroll, { passive: true })
    toggleVisibility()

    // 安全注册 cleanup
    waitForAddCleanup().then((cleanup) => {
      if (cleanup) {
        cleanup(() => {
          window.removeEventListener("scroll", onScroll)
          btn.removeEventListener("click", () => {})
        })
      }
    })
  }

  document.addEventListener("nav", () => {
    initBackToTop()
  })

  initBackToTop()
})()
