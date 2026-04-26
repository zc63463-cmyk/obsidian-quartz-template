/**
 * Image Lightbox
 * 
 * 点击文章内图片 → 全屏毛玻璃遮罩 + 居中放大查看
 * 支持键盘操作：Esc 关闭、←/→ 切换多图
 * 
 * 安全模式：IIFE + addCleanup + 只创建 fixed 定位元素
 */
;(() => {
  let currentOverlay: HTMLElement | null = null
  let currentIndex = 0
  let imageList: HTMLImageElement[] = []

  function createOverlay(img: HTMLImageElement, images: HTMLImageElement[], index: number) {
    // 清理已有 overlay
    closeOverlay()

    imageList = images
    currentIndex = index

    const overlay = document.createElement("div")
    overlay.className = "lightbox-overlay"

    const container = document.createElement("div")
    container.className = "lightbox-container"

    // 图片
    const imgEl = document.createElement("img")
    imgEl.className = "lightbox-image"
    imgEl.src = img.src
    imgEl.alt = img.alt || ""
    imgEl.style.animation = "lightbox-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"

    // 关闭按钮
    const closeBtn = document.createElement("button")
    closeBtn.className = "lightbox-close"
    closeBtn.innerHTML = "✕"
    closeBtn.ariaLabel = "关闭"

    // 图片计数（多图时显示）
    const counter = document.createElement("div")
    counter.className = "lightbox-counter"
    if (images.length > 1) {
      counter.textContent = `${index + 1} / ${images.length}`
    }

    // 上一张/下一张按钮（多图时显示）
    const prevBtn = document.createElement("button")
    prevBtn.className = "lightbox-nav lightbox-prev"
    prevBtn.innerHTML = "‹"
    prevBtn.ariaLabel = "上一张"
    prevBtn.style.display = images.length > 1 ? "" : "none"

    const nextBtn = document.createElement("button")
    nextBtn.className = "lightbox-nav lightbox-next"
    nextBtn.innerHTML = "›"
    nextBtn.ariaLabel = "下一张"
    nextBtn.style.display = images.length > 1 ? "" : "none"

    container.appendChild(imgEl)
    overlay.appendChild(closeBtn)
    overlay.appendChild(counter)
    overlay.appendChild(prevBtn)
    overlay.appendChild(nextBtn)
    overlay.appendChild(container)
    document.body.appendChild(overlay)
    document.body.style.overflow = "hidden"

    currentOverlay = overlay

    // 事件绑定
    const onClose = () => closeOverlay()
    closeBtn.addEventListener("click", onClose)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) onClose()
    })

    const onPrev = () => navigateImage(-1)
    const onNext = () => navigateImage(1)
    prevBtn.addEventListener("click", (e) => { e.stopPropagation(); onPrev() })
    nextBtn.addEventListener("click", (e) => { e.stopPropagation(); onNext() })

    const onKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          closeOverlay()
          break
        case "ArrowLeft":
          onPrev()
          break
        case "ArrowRight":
          onNext()
          break
      }
    }
    document.addEventListener("keydown", onKeydown)

    // 存储 cleanup
    ;(overlay as any)._cleanup = () => {
      closeBtn.removeEventListener("click", onClose)
      prevBtn.removeEventListener("click", onPrev)
      nextBtn.removeEventListener("click", onNext)
      document.removeEventListener("keydown", onKeydown)
    }
  }

  function navigateImage(direction: number) {
    if (!currentOverlay || imageList.length <= 1) return
    currentIndex = (currentIndex + direction + imageList.length) % imageList.length

    const imgEl = currentOverlay.querySelector(".lightbox-image") as HTMLImageElement
    const counter = currentOverlay.querySelector(".lightbox-counter") as HTMLDivElement
    if (imgEl) {
      imgEl.style.animation = "none"
      // 触发 reflow
      void imgEl.offsetHeight
      imgEl.style.animation = "lightbox-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards"
      imgEl.src = imageList[currentIndex].src
      imgEl.alt = imageList[currentIndex].alt || ""
    }
    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${imageList.length}`
    }
  }

  function closeOverlay() {
    if (!currentOverlay) return
    ;(currentOverlay as any)._cleanup?.()
    currentOverlay.style.opacity = "0"
    const overlay = currentOverlay
    setTimeout(() => {
      overlay.remove()
    }, 200)
    currentOverlay = null
    document.body.style.overflow = ""
  }

  // 初始化：为文章内图片添加点击事件
  document.addEventListener("nav", () => {
    const articleImages = Array.from(
      document.querySelectorAll<HTMLImageElement>("article img")
    ).filter((img) => {
      // 排除 SVG 图标
      if (img.closest("svg")) return false
      if (img.src.includes("data:image/svg")) return false
      // 排除 KaTeX 渲染的公式图片
      if (img.closest(".katex") || img.closest(".katex-display")) return false
      return true
    })

    for (let i = 0; i < articleImages.length; i++) {
      const img = articleImages[i]
      img.style.cursor = "zoom-in"

      const onClick = (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        createOverlay(img, articleImages, i)
      }
      img.addEventListener("click", onClick)
      window.addCleanup(() => img.removeEventListener("click", onClick))
    }
  })
})()
