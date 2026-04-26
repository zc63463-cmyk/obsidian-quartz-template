# Obsidian + Quartz v4 + Cloudflare Pages 项目模板

> 基于 [CS Wiki](https://obsidian-csbase.pages.dev) 项目实战经验封装，开箱即用的知识库站点脚手架。
>
> 包含 **94 个文件**，涵盖完整组件、交互脚本、样式模块和所有 bug 修复。

## 📁 模板结构

```
obsidian-quartz-template/
├── README.md                          ← 你在这里
├── docs/
│   └── migration-guide.md             ← 完整迁移部署文档（10 章）
│
└── quartz/                            ← 覆盖到新项目 quartz/ 目录
    ├── quartz.config.ts               # 主配置模板
    ├── quartz.layout.ts               # 布局配置模板
    ├── wrangler.toml                  # Cloudflare Pages 配置
    │
    └── quartz/
        ├── components/                # 🧩 全部组件（31 个 TSX）
        │   ├── index.ts               #   组件注册（含自定义组件）
        │   │
        │   │  # ── Quartz 核心组件 ──
        │   ├── ArticleTitle.tsx        #   文章标题
        │   ├── Backlinks.tsx           #   反向链接
        │   ├── Body.tsx                #   页面主体
        │   ├── Breadcrumbs.tsx         #   面包屑导航
        │   ├── Comments.tsx            #   评论区
        │   ├── ContentMeta.tsx         #   内容元信息
        │   ├── Darkmode.tsx            #   暗色模式切换
        │   ├── DesktopOnly.tsx         #   桌面端专用
        │   ├── Explorer.tsx            #   文件树导航
        │   ├── Footer.tsx              #   页脚
        │   ├── Graph.tsx               #   关系图谱
        │   ├── Head.tsx                #   HTML head
        │   ├── Header.tsx              #   页头
        │   ├── MobileOnly.tsx          #   移动端专用
        │   ├── PageList.tsx            #   页面列表
        │   ├── PageTitle.tsx           #   页面标题
        │   ├── ReaderMode.tsx          #   阅读模式
        │   ├── RecentNotes.tsx         #   最近笔记
        │   ├── Search.tsx              #   全文搜索
        │   ├── TableOfContents.tsx     #   目录大纲
        │   ├── TagList.tsx             #   标签列表
        │   │
        │   │  # ── 自定义增强组件 ──
        │   ├── P1Interactions.tsx      #   阅读进度条 + 回到顶部
        │   ├── KeyboardShortcuts.tsx   #   键盘导航
        │   ├── Lightbox.tsx            #   图片灯箱
        │   ├── SearchEnhanced.tsx      #   搜索增强
        │   ├── SmoothScroll.tsx        #   平滑滚动
        │   │
        │   ├── scripts/               # 📜 交互脚本（19 个 .ts）
        │   │   # ── 核心脚本（已包含关键 bug 修复）──
        │   │   ├── search.inline.ts          # 全文搜索（✅ z-index 修复）
        │   │   ├── search-enhanced.inline.ts # 搜索历史 + sidebar z-index boost
        │   │   ├── toc.inline.ts             # 目录大纲（✅ loop bug 修复）
        │   │   ├── spa.inline.ts             # SPA 导航（⚠️ 不建议修改）
        │   │   ├── explorer.inline.ts        # Explorer 交互
        │   │   ├── darkmode.inline.ts        # 暗色模式
        │   │   ├── graph.inline.ts           # 关系图谱
        │   │   ├── callout.inline.ts         # Callout 折叠
        │   │   ├── clipboard.inline.ts       # 复制功能
        │   │   ├── mermaid.inline.ts         # Mermaid 图表
        │   │   │
        │   │   # ── 自定义增强脚本 ──
        │   │   ├── reading-progress.inline.ts # 阅读进度条
        │   │   ├── back-to-top.inline.ts      # 回到顶部
        │   │   ├── smooth-scroll.inline.ts    # 平滑滚动+偏移
        │   │   ├── keyboard-shortcuts.inline.ts # 键盘导航
        │   │   ├── lightbox.inline.ts         # 图片灯箱
        │   │   │
        │   │   # ── 工具 ──
        │   │   └── util.ts                    # 共享工具函数
        │   │
        │   └── styles/                # 🎨 组件样式（18 个 .scss）
        │       # ── 核心组件样式 ──
        │       ├── search.scss              # 搜索（✅ isolation:isolate + z-index 修复）
        │       ├── toc.scss                 # 目录大纲
        │       ├── explorer.scss            # Explorer
        │       ├── darkmode.scss            # 暗色模式
        │       ├── graph.scss               # 关系图谱
        │       ├── backlinks.scss           # 反向链接
        │       ├── breadcrumbs.scss         # 面包屑
        │       ├── footer.scss              # 页脚
        │       │
        │       # ── 自定义增强样式 ──
        │       ├── p1-interactions.scss      # 进度条+回到顶部+键盘 toast
        │       ├── lightbox.scss             # 灯箱样式
        │       ├── search-enhanced.scss      # 搜索历史样式
        │       ├── clipboard.scss            # 复制增强样式
        │       │
        │       # ── 其他 ──
        │       ├── callout.inline.scss       # Callout 样式
        │       ├── contentMeta.scss          # 元信息
        │       ├── listPage.scss             # 列表页
        │       ├── mermaid.inline.scss       # Mermaid
        │       ├── popover.scss              # 弹出预览
        │       ├── readermode.scss           # 阅读模式
        │       └── recentNotes.scss          # 最近笔记
        │
        └── styles/                      # 🎨 全局样式（15 个 .scss）
            ├── base.scss                  # ⚠️ 核心样式（尽量不修改）
            ├── custom.scss                # 📌 自定义样式入口（@use 导入子模块）
            ├── variables.scss             # 断点变量：$mobile(800px), $desktop(1200px)
            ├── syntax.scss                # 代码高亮
            │
            ├── _variables-extended.scss   # CSS 变量扩展 + 自定义断点
            │                              #   $tablet=900px, $small=600px
            ├── callouts.scss              # 自定义 callout（[!def]/[!problem]/[!faq]/[!proof]）
            │
            ├── _homepage.scss             # 首页专用（cssclasses: homepage）
            ├── _subject-page.scss         # 学科页专用
            ├── _comparison-list.scss      # 对比列表页
            ├── _theorem-list.scss         # 定理列表页
            ├── _concept-hub.scss          # 概念中心页
            │
            ├── _explorer-enhanced.scss    # Explorer 侧边栏增强
            ├── _toc-enhanced.scss         # TOC 大纲增强（✅ 右侧栏布局修复 + ::root 修正）
            ├── _page-list.scss            # 页面列表样式
            ├── _prose-content.scss        # 内容排版增强（含 KaTeX 居中修复）
            └── _darkmode-overrides.scss   # 暗色模式覆盖（最后加载）
```

## 🚀 快速使用

### 1. 克隆模板

```bash
git clone https://github.com/zc63463-cmyk/obsidian-quartz-template.git
```

### 2. 创建新项目

```bash
npx quartz create --name my-wiki
cd my-wiki
git init && git add . && git commit -m "init"
```

### 3. 应用模板

```bash
# 将模板 quartz/ 内容覆盖到新项目
cp -r /path/to/obsidian-quartz-template/quartz/* ./quartz/

# 粘贴 Obsidian 笔记到 content/
cp -r /path/to/obsidian-vault/* ./content/
```

### 4. 修改配置

打开 `quartz/quartz.config.ts`，修改以下内容：

```typescript
pageTitle: "My Wiki",              // 改为你的站点名
baseUrl: "my-wiki.pages.dev",      // 改为你的域名
ignorePatterns: [...],              // 改为你要忽略的目录
```

打开 `quartz/wrangler.toml`：

```toml
name = "my-wiki"                    // 改为你的项目名
```

### 5. 修改布局

打开 `quartz/quartz.layout.ts`，按需调整：

- `Breadcrumbs.nameMap` → 改为你的目录 emoji 映射
- `Explorer.filterFn` → 改为你要隐藏的目录
- `Explorer.mapFn` → 改为你的目录名映射
- `Explorer.sortFn` → 改为你的排序逻辑
- `Footer.links` → 改为你的链接

### 6. 本地预览 & 部署

```bash
# 本地预览
npx quartz dev --port 8080

# 推送到 GitHub → Cloudflare 自动构建
git add . && git commit -m "apply template" && git push
```

## ✅ 已包含的关键 Bug 修复

| Bug | 修复 | 文件 |
|-----|------|------|
| 🔴 搜索遮罩层内容泄露 | `isolation:isolate` + `z-index: 2147483000` + sidebar boost | `search.scss`, `search.inline.ts`, `search-enhanced.inline.ts` |
| 🔴 TOC 大纲右侧栏溢出 | `flex: 0 0 auto` + `max-height: calc(100dvh - 24rem)` | `_toc-enhanced.scss` |
| 🔴 TOC 脚本提前退出 | `setupToc` 循环内 `return` → `continue` | `toc.inline.ts` |
| 🟡 暗色模式 `::root` 无效 | 全部改为 `:root` 单冒号 | `_toc-enhanced.scss`, `_darkmode-overrides.scss` |
| 🟡 搜索 `display: inline-block` | 改为 `display: flex; flex-direction: column` | `search.scss` |

## ⚠️ 必读踩坑经验

详见 [docs/migration-guide.md](./docs/migration-guide.md) 第 8 章，核心禁忌：

1. ❌ 对 `.center` 加 CSS transition → 全站崩溃
2. ❌ 修改 `spa.inline.ts` → SPA 导航异常
3. ❌ 暗色模式用 `::root` → 样式不生效（必须 `:root`）
4. ❌ layout 数组字段整行注释 → 构建失败（用 `[]` 空数组）

## 📦 说明

此模板是一个**完整的项目快照**，包含 Quartz v4 的所有组件、脚本和样式（含自定义增强）。

使用时需要注意：
- 先通过 `npx quartz create` 创建基础框架（获取 `package.json`、`tsconfig.json`、`plugins/` 等）
- 然后用模板文件覆盖 `quartz/` 目录
- 核心文件 `base.scss` 和 `spa.inline.ts` 已包含但**不建议修改**

## 📄 许可

本模板基于 CS Wiki 项目经验提取，可自由使用和修改。
