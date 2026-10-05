# 工具能力对比

帮你按需求选工具，详细配置见各自工具页。

## 主对比表

| 工具 | 形态 | 支持协议 | Tool Call | 流式 | 图片输入 | Windows | 免费 / 低成本方案 | 配置难度 | 适合谁 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Codex](/tools/codex) | 终端 | Responses | 编码功能必需（取决于模型） | 客户端支持（取决于模型/服务） | 取决于模型/服务 | 支持 | 使用自己的 API Key；费用取决于服务商 | 中 | OpenAI 官方 CLI 用户、需要 Responses 的场景 |
| [Claude Code](/tools/claude-code) | 终端 | Anthropic Messages | 编码功能必需（取决于模型） | 客户端支持（取决于模型/服务） | 取决于模型/服务 | 支持 | 使用自己的 API Key；费用取决于服务商 | 中 | Anthropic 官方 CLI 用户、需要 Messages 的场景 |
| [OpenCode](/tools/opencode) | 终端 | Responses / Chat Completions | 编码功能必需（取决于模型） | 客户端支持（取决于模型/服务） | 取决于模型/服务 | 支持 | 开源，可接免费或低成本模型 | 中 | 终端用户、想用自定义 provider |
| [GitHub Copilot CLI](/tools/copilot) | 终端 | Chat Completions / Responses / Anthropic Messages | 编码功能必需（取决于模型） | 客户端支持（取决于模型/服务） | 取决于模型/服务 | 支持，需 PowerShell 6+ | BYOK，费用取决于服务商 | 中 | GitHub 生态用户、终端用户 |
| [Crush](/tools/crush) | 终端 | OpenAI Compatible / Anthropic Compatible | 编码功能必需（取决于模型） | 客户端支持（取决于模型/服务） | 取决于模型/服务 | 支持 | 开源，可接免费或低成本模型 | 低 | 想快速配置终端工具的新手 |
| [Goose](/tools/goose) | 终端 + 桌面 | OpenAI Compatible / Anthropic Compatible / Ollama | 编码功能必需（取决于模型） | 客户端支持（取决于模型/服务） | 取决于模型/服务 | 支持 | 开源，可接本地或低成本模型 | 中 | 想要桌面端或本地 Agent 的用户 |
| [Qwen Code](/tools/qwen-code) | 终端 | OpenAI / Anthropic / Gemini | 编码功能必需（取决于模型） | 客户端支持（取决于模型/服务） | 取决于模型/服务 | 支持 | 开源，可接第三方兼容服务；Qwen OAuth 免费层已停止 | 中 | 国内用户、需要多协议切换 |
| [Cline](/tools/cline) | VS Code / 桌面 | OpenAI Compatible（可切换其他接口，以扩展为准） | 编码功能必需（取决于模型） | 客户端支持（取决于模型/服务） | 取决于模型/服务 | 支持 | 开源，可接免费或低成本模型 | 低 | VS Code 用户、偏好图形界面 |
| [Kilo Code](/tools/kilo-code) | VS Code / JetBrains | OpenAI Compatible / Responses / Anthropic Messages | 编码功能必需（取决于模型） | 客户端支持（取决于模型/服务） | 取决于模型/服务 | 支持 | 开源，可接免费或低成本模型 | 低 | VS Code 或 JetBrains 用户 |
| [Gemini CLI](/tools/gemini-cli) | 终端 | Gemini 原生协议 | 编码功能必需（取决于模型） | 客户端支持（取决于模型/服务） | 取决于模型/服务 | 支持，需 Windows 11 24H2+ | Google 账号登录有免费层，额度以官方为准 | 中 | 只想用 Gemini 官方模型的用户 |
| [VS Code + Copilot BYOK](/tools/vscode-copilot) | VS Code | Chat Completions / Responses / Messages | 编码功能必需（取决于模型） | 客户端支持（取决于模型/服务） | 取决于模型/服务 | 支持 | VS Code 免费；模型费用取决于服务商 | 中 | VS Code 用户、需要 Custom endpoint |
| [Trae](/tools/trae) | IDE | OpenAI Chat Completions / Anthropic Messages | 编码功能必需（取决于模型） | 客户端支持（取决于模型/服务） | 取决于模型/服务 | 支持 Windows 10/11 | 客户端有免费层，额度以官方为准；自定义模型费用取决于服务商 | 低 | 国内用户、偏好中文 IDE |
| [CodeBuddy](/tools/codebuddy) | IDE / 插件 | OpenAI Chat Completions | 编码功能必需（取决于模型） | 客户端支持（取决于模型/服务） | 取决于模型/服务 | 支持 Windows 10+ | 有免费 / 企业方案，具体以官网为准 | 中 | 国内用户、使用 `models.json` 配置 |

> Tool Call、流式和图片输入同时取决于**客户端、协议入口、模型和服务商**，不是工具单方面能保证的。编码类工具要能读写文件、执行命令，模型必须支持 Tool Call；否则只能聊天，不能真正改代码。接入前请以工具、模型和服务商的官方说明为准。

## 按需求推荐

| 你的需求 | 推荐 | 原因 |
| --- | --- | --- |
| 完全新手 | [Crush](/tools/crush) 或 [Cline](/tools/cline) | 配置短或图形界面友好，容易先跑通一次对话和工具调用 |
| 想免费 / 低成本 | [OpenCode](/tools/opencode)、[Crush](/tools/crush) 或 [Gemini CLI](/tools/gemini-cli) | 开源工具可接低成本模型；Gemini CLI 有官方免费层，额度以官方为准 |
| 国内网络 | [Qwen Code](/tools/qwen-code)、[Trae](/tools/trae) 或 [CodeBuddy](/tools/codebuddy) | 国内用户较多，中文界面或中文文档更友好 |
| 用 VS Code | [Cline](/tools/cline)、[Kilo Code](/tools/kilo-code) 或 [VS Code + Copilot BYOK](/tools/vscode-copilot) | 直接在编辑器里配置和使用 |
| 用 JetBrains | [Kilo Code](/tools/kilo-code) | 当前工具页明确支持 JetBrains 扩展形态 |
| 想要桌面端 | [Goose](/tools/goose) 或 [Cline](/tools/cline) | 工具页明确提供桌面端形态 |
| 想要最简配置 | [Crush](/tools/crush) | 一条 `crush provider add` 命令即可接入 |
| 只想用 Gemini 官方模型 | [Gemini CLI](/tools/gemini-cli) | 使用 Gemini 原生协议，支持 Google 账号登录和 Gemini API Key |

## 怎么验证一个工具能不能满足需求

对比表只能帮你缩小范围，最终要按下面三步验证：

1. **先确认协议入口**：你的服务提供 Chat Completions、Responses、Anthropic Messages 还是 Gemini 原生协议？工具的协议列表里必须包含这一项。
2. **再确认模型 ID**：把 `/v1/models` 返回的 ID 原样填进工具。不要凭记忆写模型名，也不要把其他协议的模型名混用。
3. **最后验证 Tool Call**：配置完成后，让工具读取一个文件或执行一条需要工具调用的命令。能对话不代表能编码；只有 Tool Call 成功，编码类工具才算真正可用。

流式、图片输入等能力可能同时取决于工具、协议入口、模型和服务商转发范围。接入前请以工具官方文档、模型官方文档和服务商说明为准。
