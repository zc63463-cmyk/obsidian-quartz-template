import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "CS Wiki",
    pageTitleSuffix: " - CS Base",
    enableSPA: true,
    enablePopovers: true,
    locale: "zh-CN",
    // Replace this with your custom domain after binding it in Cloudflare.
    baseUrl: "obsidian-csbase.pages.dev",
    ignorePatterns: ["private", "templates", ".obsidian", "_archive", "_templates", "00-Raw素材"],
    defaultDateType: "modified",
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
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage({
        // 智能排序：提取 "第XX章" 中的章节号数值排序，非章节项回退到字母序
        sort: (f1, f2) => {
          // 文件夹优先
          const f1IsFolder = f1.slug && /\/$/.test(f1.slug)
          const f2IsFolder = f2.slug && /\/$/.test(f2.slug)
          if (f1IsFolder && !f2IsFolder) return -1
          if (!f1IsFolder && f2IsFolder) return 1

          const extractChapterNum = (title: string): number | null => {
            const m = title.match(/第(\d+)章/)
            return m ? parseInt(m[1], 10) : null
          }

          const n1 = extractChapterNum(f1.frontmatter?.title ?? "")
          const n2 = extractChapterNum(f2.frontmatter?.title ?? "")

          // 都有章节号 → 按数值升序
          if (n1 !== null && n2 !== null) return n1 - n2
          // 只有一个是章节 → 章节排前面
          if (n1 !== null) return -1
          if (n2 !== null) return 1
          // 都不是章节 → 字母序
          const t1 = (f1.frontmatter?.title ?? "").toLowerCase()
          const t2 = (f2.frontmatter?.title ?? "").toLowerCase()
          return t1.localeCompare(t2, "zh-CN", { numeric: true, sensitivity: "base" })
        },
      }),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time.
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
