import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'

// GitHub Pages project sites live at https://<user>.github.io/<repo>/.
// The deploy workflow injects BASE_PATH; local dev keeps '/'.
const base = process.env.BASE_PATH || '/'
const siteUrl = 'https://120403.xyz/kuncode-docs/'
const ogImageUrl = `${siteUrl}og-image.png`

const zhNav = [
  { text: '开始使用', link: '/guide/' },
  { text: '工具接入', link: '/tools/' },
  {
    text: '排障',
    items: [
      { text: '常见问题', link: '/faq' },
      { text: '错误码与排障', link: '/guide/errors' },
    ],
  },
  {
    text: 'KunCode 控制台',
    link: 'https://kuncode.120403.xyz',
    target: '_blank',
    rel: 'noreferrer',
  },
]

const zhSidebar = [
  {
    text: '新手入门',
    collapsed: false,
    items: [
      { text: '零基础上手', link: '/beginner/' },
      { text: '15 分钟最小接入', link: '/beginner/quickstart' },
      { text: 'Windows 用户必读', link: '/beginner/windows' },
      { text: '免费与试用模型', link: '/beginner/free-models' },
      { text: '让 AI 安装并配置工具', link: '/beginner/first-run' },
      { text: '配置提示词库', link: '/beginner/prompts' },
      { text: '配置失败怎么办', link: '/beginner/help' },
    ],
  },
  {
    text: '开始使用',
    items: [
      { text: '概览', link: '/guide/' },
      { text: '概念说明', link: '/guide/concepts' },
      { text: '准备 API Key', link: '/guide/api-key' },
      { text: '选择接入方式', link: '/guide/endpoints' },
      { text: '模型与能力', link: '/guide/models' },
      { text: '配置后怎么用', link: '/guide/usage' },
      { text: 'API Key 安全与轮换', link: '/guide/security' },
      { text: '网络、代理与自定义 CA', link: '/guide/network' },
      { text: '成本控制', link: '/guide/cost-control' },
      { text: 'CC Switch 多服务商管理', link: '/guide/cc-switch' },
    ],
  },
  {
    text: '工具接入',
    collapsed: false,
    items: [
      { text: '工具列表', link: '/tools/' },
      { text: '工具能力对比', link: '/tools/compare' },
      { text: 'Codex', link: '/tools/codex' },
      { text: 'Claude Code', link: '/tools/claude-code' },
      { text: 'OpenCode', link: '/tools/opencode' },
      { text: 'GitHub Copilot CLI', link: '/tools/copilot' },
      { text: 'Crush', link: '/tools/crush' },
      { text: 'Goose', link: '/tools/goose' },
      { text: 'Qwen Code', link: '/tools/qwen-code' },
      { text: 'Cline', link: '/tools/cline' },
      { text: 'Kilo Code', link: '/tools/kilo-code' },
      { text: 'Gemini CLI', link: '/tools/gemini-cli' },
      { text: 'VS Code + Copilot BYOK', link: '/tools/vscode-copilot' },
      { text: 'Trae', link: '/tools/trae' },
      { text: 'CodeBuddy', link: '/tools/codebuddy' },
      { text: 'Pi', link: '/tools/piagent' },
    ],
  },
  {
    text: '排障',
    items: [
      { text: '常见问题', link: '/faq' },
      { text: '错误码与排障', link: '/guide/errors' },
    ],
  },
  {
    text: '关于',
    items: [
      { text: '关于本文档', link: '/about' },
      { text: '免责声明', link: '/disclaimer' },
    ],
  },
]

const enNav = [
  { text: 'Getting Started', link: '/en/guide/' },
  { text: 'Tools', link: '/en/tools/' },
  { text: 'Tool Comparison', link: '/en/tools/compare' },
  {
    text: 'Troubleshooting',
    items: [
      { text: 'FAQ', link: '/en/faq' },
      { text: 'Errors & Troubleshooting', link: '/en/guide/errors' },
    ],
  },
  {
    text: 'KunCode Console',
    link: 'https://kuncode.120403.xyz',
    target: '_blank',
    rel: 'noreferrer',
  },
]

const enSidebar = [
  {
    text: 'Start Here',
    collapsed: false,
    items: [
      { text: 'Getting Started from Zero', link: '/en/beginner/' },
      { text: '15-Minute Minimal Setup', link: '/en/beginner/quickstart' },
      { text: 'Windows: Read This First', link: '/en/beginner/windows' },
      { text: 'Free and Trial Models', link: '/en/beginner/free-models' },
      { text: 'Let AI Install and Configure', link: '/en/beginner/first-run' },
      { text: 'Configuration Prompt Library', link: '/en/beginner/prompts' },
      { text: 'When Setup Fails', link: '/en/beginner/help' },
    ],
  },
  {
    text: 'Getting Started',
    items: [
      { text: 'Overview', link: '/en/guide/' },
      { text: 'Concepts', link: '/en/guide/concepts' },
      { text: 'Prepare an API Key', link: '/en/guide/api-key' },
      { text: 'Choose an Endpoint', link: '/en/guide/endpoints' },
      { text: 'Models & Capabilities', link: '/en/guide/models' },
      { text: 'After Setup: How to Use It', link: '/en/guide/usage' },
      { text: 'API Key Security and Rotation', link: '/en/guide/security' },
      { text: 'Network, Proxy and Custom CA', link: '/en/guide/network' },
      { text: 'Cost Control', link: '/en/guide/cost-control' },
      { text: 'Managing Multiple Providers with CC Switch', link: '/en/guide/cc-switch' },
    ],
  },
  {
    text: 'Tool Setup',
    collapsed: false,
    items: [
      { text: 'Tools', link: '/en/tools/' },
      { text: 'Codex', link: '/en/tools/codex' },
      { text: 'Claude Code', link: '/en/tools/claude-code' },
      { text: 'OpenCode', link: '/en/tools/opencode' },
      { text: 'GitHub Copilot CLI', link: '/en/tools/copilot' },
      { text: 'Crush', link: '/en/tools/crush' },
      { text: 'Goose', link: '/en/tools/goose' },
      { text: 'Qwen Code', link: '/en/tools/qwen-code' },
      { text: 'Cline', link: '/en/tools/cline' },
      { text: 'Kilo Code', link: '/en/tools/kilo-code' },
      { text: 'Gemini CLI', link: '/en/tools/gemini-cli' },
      { text: 'VS Code + Copilot BYOK', link: '/en/tools/vscode-copilot' },
      { text: 'Trae', link: '/en/tools/trae' },
      { text: 'CodeBuddy', link: '/en/tools/codebuddy' },
      { text: 'Pi', link: '/en/tools/piagent' },
    ],
  },
  {
    text: 'Troubleshooting',
    items: [
      { text: 'FAQ', link: '/en/faq' },
      { text: 'Errors & Troubleshooting', link: '/en/guide/errors' },
    ],
  },
  {
    text: 'About',
    items: [
      { text: 'About These Docs', link: '/en/about' },
      { text: 'Disclaimer', link: '/en/disclaimer' },
    ],
  },
]

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: 'KunCode API 文档',
  description: '一份面向所有人的 AI 编程工具接入参考，不绑定任何服务。',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: siteUrl },
  transformHead({ page, title, description, siteData }) {
    if (page === '404.md') return []

    const cleanPath = page
      .replace(/\.md$/, '')
      .replace(/(^|\/)index$/, '$1')
      .replace(/^\/+/, '')
    const pageUrl = new URL(cleanPath, siteUrl).toString()
    const siteName = siteData.title ?? ''

    return [
      ['link', { rel: 'canonical', href: pageUrl }],
      ['meta', { property: 'og:url', content: pageUrl }],
      ['meta', { property: 'og:site_name', content: siteName }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ]
  },
  head: [
    ['link', { rel: 'icon', href: base + 'favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#4f46e5' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: ogImageUrl }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: ogImageUrl }],
  ],
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    lineNumbers: false,
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    // The plugin ships raw .vue files, so it must not be externalized during SSR.
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/ui',
      ],
    },
    plugins: [
      // Keys match case-insensitively as substrings of the code-group label.
      groupIconVitePlugin({
        customIcon: {
          bash: 'vscode-icons:file-type-shell',
          'macos / linux': 'vscode-icons:file-type-shell',
          powershell: 'vscode-icons:file-type-powershell',
          homebrew: 'simple-icons:homebrew',
          toml: 'vscode-icons:file-type-toml',
          json: 'vscode-icons:file-type-json',
          codex: 'simple-icons:openai',
          claude: 'simple-icons:anthropic',
          opencode: 'simple-icons:opencode',
          copilot: 'simple-icons:githubcopilot',
        },
      }),
    ],
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: zhNav,
    sidebar: zhSidebar,
    outline: { level: [2, 3], label: '本页目录' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/MY-Final/kuncode-docs' }],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
        miniSearch: {
          options: {
            // Default tokenization is poor for Chinese; segment with Intl.Segmenter.
            tokenize: (text) =>
              Array.from(
                new Intl.Segmenter('zh-CN', { granularity: 'word' }).segment(
                  text
                )
              )
                .filter((part) => part.isWordLike)
                .map((part) => part.segment.toLowerCase()),
          },
        },
      },
    },
    editLink: {
      pattern: 'https://github.com/MY-Final/kuncode-docs/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '外观',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    lastUpdatedText: '最后更新',
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'KunCode API Docs',
      description:
        'A provider-agnostic setup reference for AI coding tools. Works with any compatible service.',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        outline: { level: [2, 3], label: 'On this page' },
        editLink: {
          pattern: 'https://github.com/MY-Final/kuncode-docs/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },
        docFooter: { prev: 'Previous', next: 'Next' },
        darkModeSwitchLabel: 'Appearance',
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        lastUpdatedText: 'Last updated',
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Reset search',
                footer: {
                  selectText: 'select',
                  navigateText: 'navigate',
                  closeText: 'close',
                },
              },
            },
          },
        },
      },
    },
  },
})