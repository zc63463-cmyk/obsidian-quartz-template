# Obsidian + Quartz v4 + Cloudflare Pages 项目模板

> 基于 [CS Wiki](https://obsidian-csbase.pages.dev) 项目实战经验封装，开箱即用的知识库站点脚手架。

## 📁 模板结构

```
project-template/
├── README.md                          ← 你在这里
├── docs/
│   └── migration-guide.md             ← 完整迁移部署文档
│
└── quartz/                            ← 覆盖到新项目 quartz/ 目录
    ├── quartz.config.ts               # 主配置模板
    ├── quartz.layout.ts               # 布局配置模板
    ├── wrangler.toml                  # Cloudflare Pages 配置
    │
    └── quartz/
        ├── components/
        │   ├── index.ts               # 组件注册（含自定义组件）
        │   ├── P1Interactions.tsx      # 阅读进度条 + 回到顶部
        │   ├── scripts/
        │   │   ├── reading-progress.inline.ts   # 阅读进度逻辑
        │   │   ├── back-to-top.inline.ts        # 回到顶部逻辑
        │   │   ├── smooth-scroll.inline.ts      # 平滑滚动+偏移
        │   │   ├── keyboard-shortcuts.inline.ts # 键盘导航
        │   │   ├── lightbox.inline.ts           # 图片灯箱
        │   │   └── search-enhanced.inline.ts    # 搜索历史+z-index修复
        │   └── styles/
        │       ├── p1-interactions.scss   # 进度条+回到顶部+键盘toast
        │       ├── lightbox.scss          # 灯箱样式
        │       ├── search-enhanced.scss   # 搜索历史样式
        │       └── clipboard.scss         # 复制增强样式
        │
        └── styles/
            ├── custom.scss              # 自定义样式入口
            ├── variables.scss           # 断点变量
            ├── _variables-extended.scss  # 扩展变量
            ├── callouts.scss            # 自定义 callout
            ├── _prose-content.scss      # 内容排版增强（含KaTeX修复）
            └── _darkmode-overrides.scss # 暗色模式覆盖
```

## 🚀 快速使用

### 1. 创建新项目

```bash
npx quartz create --name my-wiki
cd my-wiki
git init && git add . && git commit -m "init"
```

### 2. 应用模板

```bash
# 将 project-template/quartz/ 内容覆盖到新项目
cp -r /path/to/project-template/quartz/* ./quartz/

# 粘贴 Obsidian 笔记到 content/
cp -r /path/to/obsidian-vault/* ./content/
```

### 3. 修改配置

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

### 4. 修改布局

打开 `quartz/quartz.layout.ts`，按需调整：

- `Breadcrumbs.nameMap` → 改为你的目录 emoji 映射
- `Explorer.filterFn` → 改为你要隐藏的目录
- `Explorer.mapFn` → 改为你的目录名映射
- `Explorer.sortFn` → 改为你的排序逻辑
- `Footer.links` → 改为你的链接

### 5. 本地预览 & 部署

```bash
# 本地预览
npx quartz dev --port 8080

# 推送到 GitHub → Cloudflare 自动构建
git add . && git commit -m "apply template" && git push
```

## ⚠️ 必读踩坑经验

详见 [docs/migration-guide.md](./docs/migration-guide.md) 第 8 章，核心禁忌：

1. ❌ 对 `.center` 加 CSS transition → 全站崩溃
2. ❌ 修改 `spa.inline.ts` → SPA 导航异常
3. ❌ 暗色模式用 `::root` → 样式不生效（必须 `:root`）
4. ❌ layout 数组字段整行注释 → 构建失败（用 `[]` 空数组）

## 📦 依赖说明

这些文件是**覆盖层**，需要 Quartz v4 基础框架（通过 `npx quartz create` 获得）。

不包含的文件（由 Quartz 框架提供）：
- `base.scss`、`syntax.scss` — 核心样式
- `spa.inline.ts`、`search.inline.ts` — 核心脚本
- `package.json`、`tsconfig.json` — 项目配置
- 所有内置组件（Search、Explorer、Darkmode 等）

## 📄 许可

本模板基于 CS Wiki 项目经验提取，可自由使用和修改。
