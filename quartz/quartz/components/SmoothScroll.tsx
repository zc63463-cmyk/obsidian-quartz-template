// @ts-ignore
import smoothScrollScript from "./scripts/smooth-scroll.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

/**
 * SmoothScroll 组件
 * 
 * 平滑滚动 + 顶部偏移量补偿
 * 不修改 spa.inline.ts（核心禁忌），通过事件拦截实现
 * 纯脚本组件，不渲染任何 HTML
 */
const SmoothScroll: QuartzComponent = ({}) => {
  return null
}

SmoothScroll.afterDOMLoaded = smoothScrollScript

export default (() => SmoothScroll) satisfies QuartzComponentConstructor
