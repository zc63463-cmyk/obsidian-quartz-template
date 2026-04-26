// @ts-ignore
import searchEnhancedScript from "./scripts/search-enhanced.inline"
import style from "./styles/search-enhanced.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

/**
 * SearchEnhanced 组件
 * 
 * 搜索增强：最近搜索历史记录
 * 叠加在 Search 组件之上，不修改核心搜索逻辑
 */
const SearchEnhanced: QuartzComponent = ({}) => {
  return null
}

SearchEnhanced.afterDOMLoaded = searchEnhancedScript
SearchEnhanced.css = style

export default (() => SearchEnhanced) satisfies QuartzComponentConstructor
