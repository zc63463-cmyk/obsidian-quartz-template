// @ts-ignore
import lightboxScript from "./scripts/lightbox.inline"
import style from "./styles/lightbox.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

/**
 * Lightbox 组件
 * 
 * 图片灯箱查看器：点击放大 → 毛玻璃遮罩 + 居中查看 + 键盘导航
 * 纯脚本 + CSS 组件，不渲染静态 HTML
 */
const Lightbox: QuartzComponent = ({}) => {
  return null
}

Lightbox.afterDOMLoaded = lightboxScript
Lightbox.css = style

export default (() => Lightbox) satisfies QuartzComponentConstructor
