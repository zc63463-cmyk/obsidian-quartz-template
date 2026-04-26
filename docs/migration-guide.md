# Obsidian + Quartz v4 + Cloudflare Pages 项目搭建指南

> 从零搭建一个基于 Obsidian 知识库 + Quartz v4 静态生成 + Cloudflare Pages 部署的站点。  
> 本文档基于 CS Wiki 项目的实战经验，包含完整的架构说明、踩坑记录和复用模板。

---

## 📋 目录

1. [技术栈概览](#1-技术栈概览)
2. [快速开始（5分钟搭建）](#2-快速开始5分钟搭建)
3. [项目结构详解](#3-项目结构详解)
4. [核心配置文件](#4-核心配置文件)
5. [自定义组件开发指南](#5-自定义组件开发指南)
6. [自定义样式架构](#6-自定义样式架构)
7. [Cloudflare Pages 部署](#7-cloudflare-pages-部署)
8. [踩坑经验（必读）](#8-踩坑经验必读)
9. [可选增强功能清单](#9-可选增强功能清单)
10. [迁移 Checklist](#10-迁移-checklist)

---

## 1. 技术栈概览

| 层级 | 技术 | 说明 |
|------|------|------|
| **知识编辑** | Obsidian | 本地 Markdown 编辑，支持 wiki-links、callouts、frontmatter |
| **静态生成** | Quartz v4 | 基于 TypeScript 的 SSG，支持 SPA、全文搜索、图谱 |
| **部署** | Cloudflare Pages | push 到 main 自动构建，全球 CDN |
| **样式** | SCSS + CSS 变量 | 暗色模式 `:root[saved-theme="dark"]` |
| **交互** | TypeScript inline scripts | IIFE + `addCleanup`，不修改核心文件 |
| **数学** | KaTeX (`output: "html"`) | 需要额外 CSS 修复（见踩坑） |

---

## 2. 快速开始（5分钟搭建）

### 前置条件

```bash
node >= 20  # 推荐使用 nvm 管理
git
```

### 初始化项目

```bash
# 1. 克隆 Quartz 模板
npx quartz create --name my-wiki
cd my-wiki

# 2. 初始化 git
git init
git add .
git commit -m "init: quartz v4 scaffold"

# 3. 创建 GitHub 仓库并推送
gh repo create my-wiki --public --source=. --push
# 或手动: git remote add origin https://github.com/xxx/my-wiki.git && git push -u origin main
```

### 粘贴 Obsidian 笔记

```bash
# 将 Obsidian vault 中的 .md 文件复制到 content/ 目录
cp -r /path/to/obsidian-vault/*.md content/
# 保留目录结构
cp -r /path/to/obsidian-vault/ content/
```

### 本地预览

```bash
npx quartz dev --port 8080
# 浏览器打开 http://localhost:8080
```

---

## 3. 项目结构详解

```
my-wiki/
├── content/                    # 📝 Obsidian Markdown 源文件（自动同步）
│   ├── index.md               # 首页
│   ├── 离散数学/               # 学科文件夹
│   │   ├── concepts/          # 概念笔记
│   │   ├── theorems/          # 定理笔记
│   │   └── comparisons/       # 对比笔记
│   └── ...
│
├── quartz/
│   ├── quartz.config.ts       # ⚙️ 主配置（标题/主题/插件）
│   ├── quartz.layout.ts       # 📐 布局配置（组件排列）
│   ├── quartz/
│   │   ├── components/        # 🧩 组件（TSX + SCSS + inline.ts）
│   │   │   ├── index.ts       #   组件导出注册
│   │   │   ├── scripts/       #   交互脚本
│   │   │   └── styles/        #   组件样式
│   │   ├── plugins/           # 📦 内置插件（transformers/filters/emitters）
│   │   ├── styles/            # 🎨 全局样式
│   │   │   ├── base.scss      #   核心（⚠️ 尽量不修改）
│   │   │   ├── custom.scss    #   自定义入口（@use 导入子模块）
│   │   │   ├── variables.scss #   断点/间距变量
│   │   │   ├── callouts.scss  #   自定义 callout 样式
│   │   │   ├── syntax.scss    #   代码高亮
│   │   │   └── _*.scss        #   自定义子模块
│   │   ├── i18n/              # 🌐 国际化
│   │   └── util/              # 🔧 工具函数
│   ├── wrangler.toml          # Cloudflare Pages 配置
│   └── public/                # 构建输出（gitignore）
│
├── package.json
├── tsconfig.json
└── .gitignore
```

---

## 4. 核心配置文件

### 4.1 `quartz.config.ts` — 主配置

```typescript
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "My Wiki",                    // 站点标题
    pageTitleSuffix: " - My Wiki",           // 页面后缀
    enableSPA: true,                         // SPA 模式（推荐开启）
    enablePopovers: true,                    // 链接预览弹出
    locale: "zh-CN",                         // 中文语言
    baseUrl: "my-wiki.pages.dev",            // ⚠️ 改为你的域名
    ignorePatterns: ["private", "templates", ".obsidian"],  // 忽略文件
    defaultDateType: "modified",             // 日期类型

    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },

  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: { light: "github-light", dark: "github-dark" },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),  // 数学公式
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({ enableSiteMap: true, enableRSS: true }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
```

### 4.2 `quartz.layout.ts` — 布局配置

```typescript
import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// 全局共享组件
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],                    // 大多数项目不需要 header
  afterBody: [
    // 自定义交互组件放这里（阅读进度、回到顶部等）
  ],
  footer: Component.Footer({
    links: {
      "GitHub": "https://github.com/xxx/my-wiki",
    },
  }),
}

// 内容页布局
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({ rootName: "📚 首页" }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "📖 导航",
      folderDefaultState: "collapsed",
      folderClickBehavior: "link",
      useSavedState: true,
      filterFn: (node) => !["tags", "private", "templates"].includes(node.slugSegment),
      sortFn: (a, b) => a.displayName.localeCompare(b.displayName, "zh-CN", { numeric: true }),
      order: ["filter", "sort"],
    }),
  ],
  right: [
    Component.Graph(),
    Component.TableOfContents(),
    Component.Backlinks(),
  ],
}

// 列表页布局
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({ rootName: "📚 首页" }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "📖 导航",
      folderDefaultState: "collapsed",
      folderClickBehavior: "link",
      useSavedState: true,
    }),
  ],
  right: [
    Component.Graph(),
    Component.TableOfContents(),
  ],
}
```

### 4.3 `wrangler.toml` — Cloudflare Pages

```toml
name = "my-wiki"                  # ⚠️ 改为你的项目名
compatibility_date = "2024-01-01"
pages_build_output_dir = "public"
```

---

## 5. 自定义组件开发指南

### 5.1 组件开发模式（三件套）

每个自定义组件由三部分组成：

```
MyComponent.tsx              # 组件定义（HTML 结构 + 脚本/CSS 注册）
scripts/my-component.inline.ts  # 交互逻辑（IIFE + addCleanup）
styles/my-component.scss     # 样式
```

### 5.2 组件模板

**纯脚本组件（无 HTML 元素）**：

```tsx
// MyComponent.tsx
// @ts-ignore
import script from "./scripts/my-component.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const MyComponent: QuartzComponent = ({}) => {
  return <></>  // 不需要渲染任何 HTML
}

MyComponent.afterDOMLoaded = script

export default (() => MyComponent) satisfies QuartzComponentConstructor
```

**带 HTML + 样式的组件**：

```tsx
// P1Interactions.tsx
// @ts-ignore
import readingProgressScript from "./scripts/reading-progress.inline"
// @ts-ignore
import backToTopScript from "./scripts/back-to-top.inline"
import styles from "./styles/p1-interactions.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const P1Interactions: QuartzComponent = ({}) => {
  return (
    <>
      <div class="reading-progress" aria-hidden="true">
        <div class="reading-progress-bar" />
      </div>
      <button class="back-to-top" aria-label="回到顶部">
        <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
      </button>
    </>
  )
}

P1Interactions.afterDOMLoaded = [readingProgressScript, backToTopScript]
P1Interactions.css = styles

export default (() => P1Interactions) satisfies QuartzComponentConstructor
```

### 5.3 脚本安全模板

```typescript
// my-component.inline.ts
/**
 * My Component - 功能描述
 * 安全模式：IIFE + waitForAddCleanup + 只操作 fixed/absolute 定位元素
 */
;(() => {
  // 防御性等待 addCleanup（spa.inline.ts 可能还未加载）
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

  function init() {
    // 你的逻辑...
  }

  // SPA 导航后重新初始化
  document.addEventListener("nav", () => {
    init()
  })

  // 首次加载初始化
  init()
})()
```

### 5.4 注册组件到项目

1. **`components/index.ts`** — 添加导出：

```typescript
import MyComponent from "./MyComponent"

export {
  // ...existing exports
  MyComponent,
}
```

2. **`quartz.layout.ts`** — 添加到布局：

```typescript
afterBody: [Component.MyComponent()],
// 或
left: [Component.MyComponent()],
```

---

## 6. 自定义样式架构

### 6.1 样式文件组织

```
styles/
├── custom.scss              # 📌 入口文件（@use 导入所有子模块）
├── base.scss                # ⚠️ 核心（尽量不修改）
├── variables.scss           # 断点变量：$mobile(800px), $desktop(1200px)
├── syntax.scss              # 代码高亮
├── callouts.scss            # 自定义 callout
│
├── _variables-extended.scss # CSS 变量扩展 + 自定义断点
│                            #   $tablet=900px, $small=600px
│
├── _homepage.scss           # 首页专用（cssclasses: homepage）
├── _subject-page.scss       # 学科页专用
├── _comparison-list.scss    # 对比列表页
├── _theorem-list.scss       # 定理列表页
├── _concept-hub.scss        # 概念中心页
│
├── _explorer-enhanced.scss  # Explorer 侧边栏增强
├── _toc-enhanced.scss       # TOC 大纲增强
├── _page-list.scss          # 页面列表样式
├── _prose-content.scss      # 内容排版增强
├── _darkmode-overrides.scss # 暗色模式覆盖（最后加载）
```

### 6.2 `custom.scss` 入口模板

```scss
@use "./base.scss";

/* CSS 变量扩展 */
@use "./variables-extended";

/* 页面专用样式（按 cssclasses 触发）*/
@use "./homepage";
@use "./subject-page";
/* ...其他页面样式 */

/* 导航组件增强 */
@use "./explorer-enhanced";
@use "./toc-enhanced";
@use "./page-list";

/* 内容排版增强 */
@use "./prose-content";

/* 暗色模式覆盖（需最后加载，确保优先级）*/
@use "./darkmode-overrides";
```

### 6.3 暗色模式写法

```scss
// ✅ 正确：单冒号 :root
:root[saved-theme="dark"] .my-element {
  background: rgba(30, 30, 32, 0.8);
}

// ❌ 错误：双冒号 ::root 是无效 CSS 伪类，整块样式不生效！
::root[saved-theme="dark"] .my-element {
  background: rgba(30, 30, 32, 0.8);
}
```

### 6.4 SCSS 变量引用

```scss
// 子模块文件需要手动导入 variables.scss
@use "../../styles/variables.scss" as *;

// 可用变量：
// $mobile = "(max-width: 800px)"
// $desktop = "(min-width: 1200px)"
// $pageWidth, $sidePanelWidth(320px), $topSpacing(6rem)

.my-element {
  @media all and ($mobile) {
    // 移动端样式
  }
}
```

---

## 7. Cloudflare Pages 部署

### 7.1 构建配置

在 Cloudflare Dashboard → Pages → Create a project：

| 配置项 | 值 |
|--------|-----|
| **Framework preset** | None |
| **Build command** | `npx quartz build` |
| **Build output directory** | `public` |
| **Root directory** | `/`（默认） |
| **Node.js version** | `20`（环境变量 `NODE_VERSION=20`） |

### 7.2 自定义域名

1. Cloudflare Pages → 项目 → Custom domains → Add
2. 添加 CNAME 记录指向 `<project>.pages.dev`
3. 更新 `quartz.config.ts` 中的 `baseUrl`

### 7.3 构建限制

- ⚠️ Cloudflare Pages 是**浅克隆**（shallow clone），无法本地构建后推 public/
- 每次 push 到 main 触发自动构建
- 构建时间约 2-5 分钟（取决于内容量）
- `CustomOgImages` 会显著增加构建时间，可注释掉加速

---

## 8. 踩坑经验（必读）

### 🔴 核心禁忌（会导致全站崩溃）

| # | 禁忌 | 后果 | 替代方案 |
|---|------|------|---------|
| 1 | 对 `.center` 容器添加 CSS `opacity`/`transform` transition | 与 micromorph DOM morphing 冲突 → Mermaid 不渲染、图片加载失败、布局错乱 | 用 JS 层事件（prenav/nav）实现过渡效果 |
| 2 | 修改 `spa.inline.ts` 的 loading 逻辑 | 干扰 SPA 导航生命周期 | 用独立脚本拦截 nav 事件 |
| 3 | 修改 `base.scss` 的 `navigation-progress` 样式 | 影响 SPA loading bar 初始化 | 创建自定义进度条组件 |
| 4 | layout 中数组字段整行注释掉 | `"xxx is not iterable"` 构建失败 | 用 `[]` 空数组替代 |

### 🟡 堆叠上下文陷阱

**问题**：`.search-container` 设了 `z-index: 999` 但被父元素限制。

```
.sidebar.left { position: sticky; z-index: 1 }  ← 创建 stacking context
  └─ .search-container { z-index: 999 }          ← 只在 sidebar 内有效！
```

**解决方案**：搜索打开时动态提升父级 z-index：

```typescript
const sidebar = document.querySelector(".sidebar.left") as HTMLElement
const searchContainer = document.querySelector(".search-container")
const observer = new MutationObserver(() => {
  if (searchContainer?.classList.contains("active")) {
    sidebar.style.zIndex = "99999"
  } else {
    sidebar.style.zIndex = ""
  }
})
observer.observe(searchContainer, { attributes: true, attributeFilter: ["class"] })
```

### 🟡 KaTeX 居中失效

**根因**：`base.scss` 设 `.katex-display { display: initial }` 把 KaTeX 原生 block 改成 inline → 居中样式全部失效。

**修复**：

```scss
.katex-display {
  display: block !important;    // 必须先恢复 block
  text-align: center;           // 然后 center 才有效
  margin: 1em 0;
}
```

### 🟡 CSS 覆盖优先级

- `custom.scss` 覆盖组件样式**不可靠**（CSS 编译顺序/优先级问题）
- 需要覆盖组件样式时，**直接修改组件源文件**
- 或用 `!important`（不推荐但有时必要）

### 🟡 Explorer 移动端展开重叠

**根因**：`toggleExplorer()` 只加了 `mobile-no-scroll`，漏了 `lock-scroll`（内容区右移 100vw）。

**修复**：所有 explorer 状态切换处同步 `quartzBody.classList.toggle("lock-scroll")`。

### 🟡 非桌面端右侧栏布局

**问题**：默认 `flex-direction: row` 导致 Graph/TOC/Backlinks 横向挤压。

**修复**：

```scss
@media all and not ($desktop) {
  .sidebar.right {
    flex-direction: column;     // 纵向堆叠
    & > * {
      flex: unset;              // 不要 flex:1 横向瓜分
      width: 100%;
    }
  }
}
```

### 🟡 图片来源限制

- ✅ Unsplash、`https://picsum.photos/`
- ❌ Pexels（返回 403）

---

## 9. 可选增强功能清单

以下功能已验证可用，按 ROI 排序：

| 功能 | 文件 | 说明 |
|------|------|------|
| 📊 **阅读进度条** | `reading-progress.inline.ts` + `p1-interactions.scss` | 固定顶部，渐变色，rAF 驱动 60fps |
| ⬆️ **回到顶部** | `back-to-top.inline.ts` + `p1-interactions.scss` | 毛玻璃按钮，滚动超过 300px 显示 |
| 🔗 **平滑滚动+偏移** | `smooth-scroll.inline.ts` | 拦截锚点导航，20px 呼吸空间 |
| ⌨️ **键盘导航** | `keyboard-shortcuts.inline.ts` + `p1-interactions.scss` | `/` 搜索·`t` TOC·`e` Explorer·`j/k` 标题·`Esc` 关闭 |
| 🔍 **图片灯箱** | `lightbox.inline.ts` + `lightbox.scss` | 毛玻璃遮罩+居中+←/→多图+Esc，排除 KaTeX/SVG |
| 📋 **复制增强** | `clipboard.inline.ts` + `clipboard.scss` | "已复制!" tooltip + 绿色边框 |
| 📜 **搜索历史** | `search-enhanced.inline.ts` + `search-enhanced.scss` | 8 条上限，localStorage 持久化 |
| 📝 **自定义 Callout** | `callouts.scss` | `[!def]` 紫·`[!problem]` 橙·`[!faq]` 青·`[!proof]` 绿 |
| 📂 **Explorer 智能排序** | `quartz.config.ts` + `quartz.layout.ts` | 章节号排序+emoji 映射+隐藏过滤 |

---

## 10. 迁移 Checklist

从头搭建一个新知识库站点时，按此顺序操作：

### Phase 0：基础搭建

- [ ] `npx quartz create --name <项目名>`
- [ ] 初始化 git + 推送到 GitHub
- [ ] 配置 Cloudflare Pages（构建命令 `npx quartz build`，输出 `public`）
- [ ] 复制 Obsidian 笔记到 `content/`
- [ ] 修改 `quartz.config.ts`：`pageTitle`、`baseUrl`、`ignorePatterns`
- [ ] 修改 `wrangler.toml`：`name`

### Phase 1：布局与导航

- [ ] 配置 `quartz.layout.ts`：选择需要的组件
- [ ] 配置 Explorer：`filterFn`（隐藏目录）、`sortFn`（排序）、`mapFn`（emoji 映射）
- [ ] 配置 Breadcrumbs：`rootName`、`nameMap`
- [ ] 验证搜索功能正常
- [ ] 验证暗色模式切换

### Phase 2：视觉定制

- [ ] 修改主题颜色（`quartz.config.ts` → `colors`）
- [ ] 修改字体（`typography`）
- [ ] 创建 `custom.scss` 子模块（按 `cssclasses` 触发的页面样式）
- [ ] 创建 `callouts.scss`（自定义 callout 类型）
- [ ] 修复 KaTeX 居中（`_prose-content.scss`）
- [ ] 非桌面端右侧栏纵向布局

### Phase 3：交互增强

- [ ] 添加阅读进度条（`P1Interactions` 组件）
- [ ] 添加回到顶部按钮
- [ ] 添加平滑滚动
- [ ] 添加键盘导航
- [ ] 添加图片灯箱
- [ ] 添加代码复制增强
- [ ] 添加搜索历史
- [ ] 修复搜索遮罩层 z-index（sidebar stacking context）

### Phase 4：部署验证

- [ ] push 到 main → Cloudflare 自动构建
- [ ] 检查构建日志无错误
- [ ] 验证 SPA 导航正常
- [ ] 验证搜索正常
- [ ] 验证暗色模式
- [ ] 验证移动端布局
- [ ] 绑定自定义域名（可选）

---

## 📎 附录：关键文件速查

| 用途 | 文件路径 |
|------|---------|
| 主配置 | `quartz/quartz.config.ts` |
| 布局配置 | `quartz/quartz.layout.ts` |
| 组件注册 | `quartz/quartz/components/index.ts` |
| 样式入口 | `quartz/quartz/styles/custom.scss` |
| 断点变量 | `quartz/quartz/styles/variables.scss` |
| 扩展变量 | `quartz/quartz/styles/_variables-extended.scss` |
| 核心样式 | `quartz/quartz/styles/base.scss`（⚠️ 谨慎修改） |
| SPA 脚本 | `quartz/quartz/components/scripts/spa.inline.ts`（⚠️ 禁止修改） |
| 搜索脚本 | `quartz/quartz/components/scripts/search.inline.ts`（叠加而非修改） |
| Cloudflare | `quartz/wrangler.toml` |
| 国际化 | `quartz/quartz/i18n/` |

---

*最后更新：2026-04-26 | 基于 CS Wiki 项目实战经验*
