// @ts-ignore
import keyboardShortcutsScript from "./scripts/keyboard-shortcuts.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

/**
 * KeyboardShortcuts 组件
 * 
 * 键盘导航快捷键：/ 搜索 · t TOC · e Explorer · j/k 跳标题 · Esc 关闭
 * 纯脚本组件，不渲染 HTML
 */
const KeyboardShortcuts: QuartzComponent = ({}) => {
  return null
}

KeyboardShortcuts.afterDOMLoaded = keyboardShortcutsScript

export default (() => KeyboardShortcuts) satisfies QuartzComponentConstructor
