import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [Component.P1Interactions()],
  footer: Component.Footer({
    links: {
      "GitHub": "https://github.com/zc63463-cmyk/Obsidian-csbase",
      "CS Wiki": "https://obsidian-csbase.pages.dev",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({
        rootName: "📚 首页",
        nameMap: {
          "离散数学": "📐 离散数学",
          "逻辑学": "🧠 逻辑学",
          "算法导论": "💻 算法导论",
          "Wiki": "📚 Wiki",
          "concepts": "📖 概念",
          "notes": "📝 笔记",
          "theorems": "📕 定理",
          "comparisons": "⚖️ 对比",
          "queries": "🔍 题型",
        },
      }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "📖 知识导航",
      folderDefaultState: "collapsed",
      folderClickBehavior: "link",
      useSavedState: true,

      // ⚠️ 所有函数会被序列化为字符串在浏览器端执行
      // 绝对不能引用外部变量，所有数据必须内联！
      filterFn: (node) => {
        const hidden = ["tags", "00-Raw素材", "private", "templates", "_templates", "index"]
        return !hidden.includes(node.slugSegment)
      },

      mapFn: (node) => {
        const s = node.slugSegment
        const subjectMap = { "离散数学": "📐 离散数学", "逻辑学": "🧠 逻辑学", "算法导论": "💻 算法导论", "Wiki": "📚 Wiki" }
        const typeMap = { "concepts": "📖 概念", "notes": "📝 笔记", "theorems": "📕 定理", "comparisons": "⚖️ 对比", "queries": "🔍 题型" }
        if (subjectMap[s]) node.displayName = subjectMap[s]
        else if (typeMap[s]) node.displayName = typeMap[s]
        return node
      },

      sortFn: (a, b) => {
        const subjects = new Set(["离散数学", "逻辑学", "算法导论", "Wiki"])
        const aIsSubject = subjects.has(a.slugSegment)
        const bIsSubject = subjects.has(b.slugSegment)
        if (aIsSubject && !bIsSubject) return -1
        if (!aIsSubject && bIsSubject) return 1
        return a.displayName.localeCompare(b.displayName, "zh-CN", { numeric: true, sensitivity: "base" })
      },

      order: ["filter", "map", "sort"],
    }),
  ],
  right: [
    Component.Graph(),
    Component.TableOfContents(),
    Component.Backlinks(),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "📝 最近更新",
        limit: 5,
        showTags: true,
        filter: (f) => {
          const hidden = ["tags", "00-Raw素材", "private", "templates", "_templates", "index"]
          return !f.slug!.split("/").some((s) => hidden.includes(s))
        },
      }),
    ),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({
      rootName: "📚 首页",
      nameMap: {
        "离散数学": "📐 离散数学",
        "逻辑学": "🧠 逻辑学",
        "算法导论": "💻 算法导论",
        "Wiki": "📚 Wiki",
        "concepts": "📖 概念",
        "notes": "📝 笔记",
        "theorems": "📕 定理",
        "comparisons": "⚖️ 对比",
        "queries": "🔍 题型",
      },
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "📖 知识导航",
      folderDefaultState: "collapsed",
      folderClickBehavior: "link",
      useSavedState: true,
      filterFn: (node) => {
        const hidden = ["tags", "00-Raw素材", "private", "templates", "_templates", "index"]
        return !hidden.includes(node.slugSegment)
      },
      mapFn: (node) => {
        const s = node.slugSegment
        const subjectMap = { "离散数学": "📐 离散数学", "逻辑学": "🧠 逻辑学", "算法导论": "💻 算法导论", "Wiki": "📚 Wiki" }
        const typeMap = { "concepts": "📖 概念", "notes": "📝 笔记", "theorems": "📕 定理", "comparisons": "⚖️ 对比", "queries": "🔍 题型" }
        if (subjectMap[s]) node.displayName = subjectMap[s]
        else if (typeMap[s]) node.displayName = typeMap[s]
        return node
      },
      sortFn: (a, b) => {
        const subjects = new Set(["离散数学", "逻辑学", "算法导论", "Wiki"])
        const aIsSubject = subjects.has(a.slugSegment)
        const bIsSubject = subjects.has(b.slugSegment)
        if (aIsSubject && !bIsSubject) return -1
        if (!aIsSubject && bIsSubject) return 1
        return a.displayName.localeCompare(b.displayName, "zh-CN", { numeric: true, sensitivity: "base" })
      },
      order: ["filter", "map", "sort"],
    }),
  ],
  right: [
    Component.Graph(),
    Component.TableOfContents(),
  ],
}
