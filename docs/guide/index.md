# 概览

这份文档帮助你把 AI 编程工具（Codex、Claude Code、OpenCode、GitHub Copilot CLI 等）接入任意兼容网关。

无论你使用自建服务、第三方网关，还是官方 API，配置思路都是一样的：**把工具的请求地址和密钥指向你的服务**。

## 三步接入

1. **准备 API Key**：从你使用的服务获取密钥，通常是 `sk-` 开头的字符串。
2. **选择协议入口**：确认工具支持的协议，是 OpenAI Chat Completions、OpenAI Responses 还是 Anthropic Messages。
3. **填写配置并验证**：把 Base URL 和 Key 写进工具的配置文件，用一条命令确认能跑通。

不熟悉 API Key、分组、渠道、倍率这些概念？先看[概念说明](./concepts)。

## 你需要准备什么

| 项目 | 说明 |
| --- | --- |
| API Key | 服务商提供的密钥，形如 `sk-xxxx` |
| Base URL | 你的服务地址，自建/第三方/官方均可 |
| 模型名 | 要调用的模型，例如 `gpt-5`、`claude-sonnet-4` |
| 工具本体 | 已安装好的 Codex / Claude Code / OpenCode / GitHub Copilot CLI |

::: tip 关于示例地址
文中的 `https://your-gateway.example.com` 是通用占位地址，请替换成你自己的服务地址。
部分页面会用 KunCode 作为演示，那只是其中一个可选项，不是唯一选择。
:::

## 接下来

- [准备 API Key](./api-key)
- [选择接入方式](./endpoints)
- [概念说明](./concepts)
- [模型与能力](./models)
- [工具列表](/tools/)
