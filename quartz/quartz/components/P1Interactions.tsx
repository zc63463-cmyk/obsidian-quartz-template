// @ts-ignore
import readingProgressScript from "./scripts/reading-progress.inline"
// @ts-ignore
import backToTopScript from "./scripts/back-to-top.inline"
import styles from "./styles/p1-interactions.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const P1Interactions: QuartzComponent = ({}) => {
  return (
    <>
      {/* ③ 阅读进度条 */}
      <div class="reading-progress" aria-hidden="true">
        <div class="reading-progress-bar" />
      </div>

      {/* ④ 回到顶部按钮 */}
      <button class="back-to-top" aria-label="回到顶部" title="回到顶部">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  )
}

P1Interactions.afterDOMLoaded = [readingProgressScript, backToTopScript]
P1Interactions.css = styles

export default (() => P1Interactions) satisfies QuartzComponentConstructor
