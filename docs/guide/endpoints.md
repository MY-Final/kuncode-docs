# 选择接入方式

兼容网关通常提供多种协议入口，不同工具支持的协议不一样。先确认工具要哪种，再对照配置。

::: tip 本页是 Base URL 的权威口径
**API 节点**通常指服务的根地址，例如 `https://gateway.example.com`；**Base URL** 是某个工具配置字段实际应填的值。两者不总是相同。

本文档各工具页的 Base URL 写法以本页对照表为准。若你使用的服务有特殊要求，以服务商说明为准。
:::

## 三种常见入口

| 入口 | 路径 | 常见认证头 | 典型使用方 |
| --- | --- | --- | --- |
| OpenAI Chat Completions | `/v1/chat/completions` | `Authorization: Bearer <key>` | 大多数 OpenAI 兼容工具、OpenCode 的 `openai-compatible` provider、Copilot CLI |
| OpenAI Responses | `/v1/responses` | `Authorization: Bearer <key>` | Codex、OpenCode 的 `openai` provider、GitHub Copilot CLI |
| Anthropic Messages | `/v1/messages` | `x-api-key: <key>`；部分兼容网关也接受 `Authorization: Bearer <key>` | Claude Code、GitHub Copilot CLI、Anthropic SDK |

路径是网关相对根地址的常见约定。实际服务可能提供兼容层，但请求最终是否可用仍取决于网关实现、分组、模型和密钥权限。

## Base URL 对照表

下表假设 API 节点为 `https://gateway.example.com`，且地址末尾不带 `/`。表中的“是否自动拼 `/v1`”指工具是否会替你补上 `/v1`，不是指它是否会补具体接口路径。

| 工具 | 配置字段/方式 | 应填值示例 | 工具是否自动拼 `/v1` | 最终请求路径 |
| --- | --- | --- | --- | --- |
| **Codex** | `~/.codex/config.toml` 中的 `model_providers.<id>.base_url` | `https://gateway.example.com/v1` | **否**；配置值必须带 `/v1`，工具只在其后拼接 `/responses` | `https://gateway.example.com/v1/responses` |
| **Claude Code** | `settings.json` 或环境变量中的 `ANTHROPIC_BASE_URL` | `https://gateway.example.com` | **是**；工具会拼接 `/v1/messages` | `https://gateway.example.com/v1/messages` |
| **OpenCode** | `opencode.json` 中的 `provider.<id>.options.baseURL` | `https://gateway.example.com/v1` | **否**；配置值必须带 `/v1`，AI SDK 再拼接接口路径 | 使用 `@ai-sdk/openai` 时为 `/v1/responses`；使用 `@ai-sdk/openai-compatible` 时为 `/v1/chat/completions` |
| **GitHub Copilot CLI** | OpenAI 兼容模式下设置 `COPILOT_PROVIDER_BASE_URL` | `https://gateway.example.com/v1` | **否**；配置值必须带 `/v1`，工具按 wire API 拼接接口路径 | `COPILOT_PROVIDER_WIRE_API=completions` 时为 `/v1/chat/completions`；设为 `responses` 时为 `/v1/responses` |

### 使用规则

1. **先区分 API 节点和 Base URL**：控制台里的节点通常不带 `/v1`；填进工具的值要看工具要求。
2. **Codex 必须写带 `/v1` 的 Base URL**。不要再把 `https://gateway.example.com` 直接填进 `base_url`，也不要把 `/v1/responses` 写进去。
3. **Claude Code 只写域名**。`ANTHROPIC_BASE_URL` 不要带 `/v1`、`/v1/messages` 或末尾斜杠。
4. **OpenCode 和 Copilot CLI 在 OpenAI 兼容模式下写带 `/v1` 的 Base URL**。如果换成 Anthropic provider 类型，按对应工具页和 provider 的说明填写，不要套用 OpenAI 模式的示例。
5. **不要在 Base URL 末尾加 `/`**。否则可能形成 `//v1`，也可能被工具或服务商判定为不匹配。
6. **不要把接口路径重复写进 Base URL**。如果最终请求出现 `/v1/v1/...` 或 `/v1/responses/responses`，优先检查这一项。

## 最小验证请求

下面的示例用于确认“Key、Base URL、模型、协议入口”至少有一组能走通。请替换 `API_KEY`、`MODEL_ID` 和域名。示例使用 bash 语法；Windows PowerShell 建议使用 `curl.exe`，并按 PowerShell 的引号规则转义 JSON。

### Chat Completions

```bash
curl https://gateway.example.com/v1/chat/completions \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MODEL_ID",
    "messages": [{"role": "user", "content": "Reply with OK"}],
    "max_tokens": 16
  }'
```

### Responses

```bash
curl https://gateway.example.com/v1/responses \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MODEL_ID",
    "input": "Reply with OK",
    "max_output_tokens": 16
  }'
```

### Anthropic Messages

```bash
curl https://gateway.example.com/v1/messages \
  -H "x-api-key: $API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MODEL_ID",
    "max_tokens": 16,
    "messages": [{"role": "user", "content": "Reply with OK"}]
  }'
```

如果网关只接受 Bearer 认证，把 Anthropic 示例里的 `x-api-key` 换成 `Authorization: Bearer $API_KEY` 再试。反过来，如果 OpenAI 风格入口在某个兼容服务上要求 `x-api-key`，也应以该服务的实际要求为准。`anthropic-version` 在部分兼容实现中可能被忽略。

最小请求成功只能说明这一组“Key + 模型 + 入口”可用，不代表编码工具需要的工具调用、推理或流式能力都已经通过验证。

## 协议兼容矩阵

| 协议入口 | 常见认证 | 请求特征 | 适合场景 | 不保证 |
| --- | --- | --- | --- | --- |
| **Chat Completions** | `Authorization: Bearer` | `messages` 数组，参数体系成熟 | 大多数 OpenAI 兼容客户端、普通对话 | 不保证支持 Responses 专属参数，也不保证所有工具可用 |
| **Responses** | `Authorization: Bearer` | `input`、`max_output_tokens` 等字段 | Codex、OpenCode 的 OpenAI provider、Copilot CLI 的 responses 模式 | 不是所有兼容网关都实现；不支持时通常不能靠改一个参数解决 |
| **Anthropic Messages** | 通常为 `x-api-key`；兼容网关也可能接受 Bearer | 顶层 `system`、`max_tokens`、内容块等 Anthropic 语义 | Claude Code、Anthropic SDK、Copilot CLI 的 Anthropic provider | OpenAI 参数不会自动完全等价；未支持的字段可能被忽略或报错 |

关于同一 Key 和同一模型：

- **同一 Key 能否调用多个入口，以网关实现为准。** 有些服务允许一个 Key 走全部入口，有些会按协议、分组或密钥权限做限制。
- **模型出现在 `/v1/models`，不等于它支持所有入口。** 还要确认该模型在当前分组和当前协议下确实有可用渠道。
- **协议参数不保证完全等价。** 工具能发出请求，不代表网关会完整翻译字段、工具调用、流式事件或错误格式；应以实际返回和日志为准。

## 怎么选

- **Codex**：使用 Responses 入口，`base_url` 填 `https://gateway.example.com/v1`。
- **Claude Code**：使用 Anthropic Messages 入口，`ANTHROPIC_BASE_URL` 只填 `https://gateway.example.com`。
- **OpenCode**：默认示例使用 Responses 入口，`baseURL` 填 `https://gateway.example.com/v1`；如果服务只支持 Chat Completions，改用 `@ai-sdk/openai-compatible` 并保持相同的 `/v1` Base URL。
- **GitHub Copilot CLI**：默认使用 Chat Completions 入口，OpenAI 兼容模式的 Base URL 填 `https://gateway.example.com/v1`；需要 Responses 时设置 `COPILOT_PROVIDER_WIRE_API=responses`。

::: tip 不确定选哪个
先看工具页要求哪个协议，再对照本页的最小请求和 Base URL 表。不要把 Chat Completions 当作所有工具的通用兜底；Codex 需要 Responses，Claude Code 需要 Anthropic Messages。
:::

## 认证说明

- OpenAI Chat Completions 和 Responses 通常使用 `Authorization: Bearer <你的 API Key>`。
- Anthropic Messages 通常使用 `x-api-key: <你的 API Key>`；部分兼容网关同时接受 Bearer。
- 以实际服务的认证要求为准。认证头和 Base URL 任一项写错，都可能得到 `401` 或 `404`。
