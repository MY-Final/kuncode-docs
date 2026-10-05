# 选择接入方式

兼容网关通常提供多种协议入口，不同工具支持的协议不一样。先确认工具要哪种，再对照配置。

## 三种常见入口

| 入口 | 路径 | 典型使用方 |
| --- | --- | --- |
| OpenAI Chat Completions | `/v1/chat/completions` | 大多数 OpenAI 兼容工具 |
| OpenAI Responses | `/v1/responses` | Codex、OpenCode、GitHub Copilot CLI、新版 OpenAI SDK |
| Anthropic Messages | `/v1/messages` | Claude Code、GitHub Copilot CLI、Anthropic SDK |

## 怎么选

- **Codex**：优先使用 Responses 入口，Base URL 填到根路径。
- **Claude Code**：使用 Anthropic Messages 入口，在 `settings.json` 里覆盖官方地址。
- **OpenCode**：使用 Responses 入口，在配置文件里声明 provider。
- **GitHub Copilot CLI**：默认使用 Chat Completions 入口；模型更适合 Responses 时，把 `COPILOT_PROVIDER_WIRE_API` 设为 `responses`。

## 统一说明

无论哪种入口，认证方式都是：

```
Authorization: Bearer <你的 API Key>
```

Anthropic Messages 入口通常也接受 `x-api-key` 头，便于 Claude Code 直接使用。

::: tip 不确定选哪个
先看工具文档里配置 Base URL 的位置，再对照上表。拿不准就先用 Chat Completions，兼容性最好。
:::
