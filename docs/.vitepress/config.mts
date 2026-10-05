import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'

// GitHub Pages project sites live at https://<user>.github.io/<repo>/.
// The deploy workflow injects BASE_PATH; local dev keeps '/'.
const base = process.env.BASE_PATH || '/'

const zhNav = [
  { text: '开始使用', link: '/guide/' },
  { text: '工具接入', link: '/tools/' },
  { text: '常见问题', link: '/faq' },
  { text: '关于', link: '/about' },
]

const zhSidebar = [
  {
    text: '开始使用',
    items: [
      { text: '概览', link: '/guide/' },
      { text: '准备 API Key', link: '/guide/api-key' },
      { text: '选择接入方式', link: '/guide/endpoints' },
      { text: '概念说明', link: '/guide/concepts' },
    ],
  },
  {
    text: '工具接入',
    collapsed: false,
    items: [
      { text: '工具列表', link: '/tools/' },
      {
        text: 'OpenAI 兼容',
        collapsed: false,
        items: [
          { text: 'Codex', link: '/tools/codex' },
          { text: 'OpenCode', link: '/tools/opencode' },
        ],
      },
      {
        text: 'Anthropic 兼容',
        collapsed: false,
        items: [{ text: 'Claude Code', link: '/tools/claude-code' }],
      },
    ],
  },
  {
    text: '排障',
    items: [
      { text: '常见问题', link: '/faq' },
      { text: '关于本文档', link: '/about' },
    ],
  },
]

const enNav = [
  { text: 'Getting Started', link: '/en/guide/' },
  { text: 'Tools', link: '/en/tools/' },
  { text: 'FAQ', link: '/en/faq' },
  { text: 'About', link: '/en/about' },
]

const enSidebar = [
  {
    text: 'Getting Started',
    items: [
      { text: 'Overview', link: '/en/guide/' },
      { text: 'Prepare an API Key', link: '/en/guide/api-key' },
      { text: 'Choose an Endpoint', link: '/en/guide/endpoints' },
      { text: 'Concepts', link: '/en/guide/concepts' },
    ],
  },
  {
    text: 'Tool Setup',
    collapsed: false,
    items: [
      { text: 'Tools', link: '/en/tools/' },
      {
        text: 'OpenAI-compatible',
        collapsed: false,
        items: [
          { text: 'Codex', link: '/en/tools/codex' },
          { text: 'OpenCode', link: '/en/tools/opencode' },
        ],
      },
      {
        text: 'Anthropic-compatible',
        collapsed: false,
        items: [{ text: 'Claude Code', link: '/en/tools/claude-code' }],
      },
    ],
  },
  {
    text: 'Troubleshooting',
    items: [
      { text: 'FAQ', link: '/en/faq' },
      { text: 'About', link: '/en/about' },
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
  head: [
    ['link', { rel: 'icon', href: base + 'favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#4f46e5' }],
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
        },
      }),
    ],
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: zhNav,
    sidebar: zhSidebar,
    outline: { level: [2, 3], label: '本页目录' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],
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
        'A provider-agnostic setup reference for AI coding tools. No service required.',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        outline: { level: [2, 3], label: 'On this page' },
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
