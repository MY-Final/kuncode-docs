# 模型与能力

这一页讲三件事：**怎么查有哪些模型、怎么判断模型能不能用于你的工具、模型名为什么必须写对。**

## 查看可用模型

调用 `/v1/models`，用你自己的密钥：

```bash
curl https://your-gateway.example.com/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

OpenAI 兼容入口返回：

```json
{
  "object": "list",
  "data": [
    { "id": "gpt-5", "object": "model", "created": 1626777600, "owned_by": "openai" },
    { "id": "deepseek-flash", "object": "model", "created": 1626777600, "owned_by": "deepseek" }
  ]
}
```

字段说明：

| 字段 | 说明 |
| --- | --- |
| `id` | 模型 ID，**配置里要填的就是这个** |
| `object` | 固定为 `model` |
| `created` | 创建时间戳，通常没有实际意义 |
| `owned_by` | 上游渠道名称，方便识别来源 |

::: tip 这个列表是按你的权限过滤过的
返回结果只包含**你当前分组可用**的模型，并且会排除：

- 你的令牌设置了模型限制、但不在允许列表里的模型
- 没有计费配置的模型

所以别人的列表可能比你的长。列表里没有的模型，你调用时会失败。
:::

::: tip 不同分组的模型不一样
同一个服务，`default` 分组和 `vip` 分组可用的模型可能不同。

密钥换了分组，`/v1/models` 的结果也会变。
:::

Anthropic Messages 入口返回的格式不同：

```json
{
  "data": [
    {
      "id": "claude-sonnet-4-5",
      "type": "model",
      "display_name": "claude-sonnet-4-5",
      "created_at": "2021-07-20T00:00:00Z"
    }
  ],
  "first_id": "claude-sonnet-4-5",
  "last_id": "claude-sonnet-4-5",
  "has_more": false
}
```

## 上下文与输出限制

`/v1/models` 通常只用于确认“这个 Key 当前能不能看到这个模型”，它不一定返回上下文窗口、最大输出或价格。具体限制由实际模型、渠道和网关配置决定。

需要区分：

| 限制 | 含义 | 常见排查方式 |
| --- | --- | --- |
| **上下文窗口** | 单次请求可处理的输入 + 输出总量上限 | 查服务商模型文档、控制台模型信息或实际报错 |
| **最大输出** | 单次回复最多能生成多少 token | 查服务商或模型文档；请求里的 `max_tokens` / `max_output_tokens` 不能超过它 |
| **请求体上限** | 网关或上游对 HTTP 请求体大小的限制 | 减少附件、历史消息或单次输入后再试 |
| **工具自身限制** | Claude Code、Codex 等客户端内置的上下文或输出限制 | 查工具文档；网关模型窗口与客户端默认值不一致时可能需要单独配置 |

超出限制时，不同网关可能返回 `400`、`413` 或上游特有的错误；错误信息里可能出现 `context_length_exceeded`、`max_tokens`、`too large` 等字样。不要只看状态码，应该读取响应体的 `code` 和 `message`，并以实际服务商说明为准。

::: tip 不要从模型名猜窗口
同名模型在不同渠道可能有不同的上下文窗口、输出上限和计费配置。以当前服务实际返回或文档为准，不要因为模型名里有 `128k`、`200k` 就默认可用。
:::

## `/v1/models` 不承诺返回什么

`/v1/models` 的主要用途是给出**当前凭据可见的模型 ID**。除了 `id` 之外，不应把返回字段当作完整的模型能力清单。

它通常不保证返回：

- 上下文窗口、最大输出和请求体上限
- 输入、输出、缓存或推理 token 的价格
- 模型倍率、分组倍率或最终计费金额
- 是否支持 tool call、vision、reasoning、streaming 或附件
- 模型支持哪些协议入口，例如 Chat Completions、Responses、Anthropic Messages
- 限流阈值、并发上限、可用性和当前渠道健康状态
- `owned_by` 与真实上游服务商的一一对应关系

同一个模型 ID 出现在列表里，只能说明它可能对当前 Key/分组可用。真正能否用于你的工具，还要看协议入口、渠道状态、模型限制、额度和工具所需能力。需要这些信息时，查服务商模型文档、控制台或实际调用结果；不确定时以服务商为准。

## 怎么挑模型

按这个顺序筛选：

1. **看工具要求什么能力**，先用下面的能力表缩小范围
2. **看 `/v1/models` 有没有**，确认你的分组支持
3. **确认模型名完全一致**，直接复制 `id`，不要手写

::: warning 编码工具对模型能力有硬性要求
不是所有模型都能用于编程助手。

- **Codex** 需要支持 Responses 接口和 reasoning
- **Claude Code** 需要支持 tool call（工具调用）
- **OpenCode** 的 `variants` 只在模型支持 reasoning 时生效
- **GitHub Copilot CLI** 需要支持 tool call 和 streaming；GPT-5 系列建议使用 Responses 接口

把不支持 tool call 的模型配进 Claude Code，工具调用会直接失败。
:::

## 能力对照表

不同模型支持的能力不一样。下面是最常见的几种：

| 能力 | 说明 | 影响 |
| --- | --- | --- |
| **tool call** | 能调用工具（读写文件、执行命令） | 编码工具的核心能力 |
| **reasoning** | 支持推理强度控制 | Codex、OpenCode 的 reasoning 配置 |
| **vision** | 能读图片 | 需要截图、设计稿的场景 |
| **streaming** | 支持流式输出 | 交互式使用体验 |
| **attachment** | 支持附件上传 | OpenCode 的 `attachment` 字段 |

::: tip 能力由上游模型决定
模型支持什么能力，由提供它的上游模型决定。同一个模型名在不同渠道，能力可能不完全一致。

配置时以**实际能跑通**为准：先配一个已知可用的模型，跑通后再试其他。
:::

## 各工具对模型的要求

| 工具 | 必需能力 | 推荐入口 | 说明 |
| --- | --- | --- | --- |
| **Codex** | Responses + reasoning | `/v1/responses` | 需要在 `config.toml` 里填 `model` |
| **Claude Code** | tool call | `/v1/messages` | 需要把 `sonnet` / `opus` / `haiku` 别名映射到真实模型 |
| **OpenCode** | 至少能对话；`variants` 需要 reasoning | `/v1/responses` | 在 `opencode.json` 的 `models` 里声明 |
| **GitHub Copilot CLI** | tool call + streaming | `/v1/chat/completions` 或 `/v1/responses` | 用 `COPILOT_MODEL` 指定模型，按需设置 wire API |

如果模型不支持工具调用，编码助手无法完成读写文件等操作，会报工具调用相关的错误。

## 模型名必须完全一致

模型名在这些工具里都有专门的位置，且都要求**和 `/v1/models` 返回的 `id` 完全一致**：

| 工具 | 配置位置 |
| --- | --- |
| Codex | `config.toml` 里的 `model` |
| Claude Code | `settings.json` 里的 `ANTHROPIC_DEFAULT_*_MODEL` |
| OpenCode | `opencode.json` 里的 `models` 键名 |
| GitHub Copilot CLI | 环境变量 `COPILOT_MODEL` |

例如接口返回 `deepseek-flash`，就必须写 `deepseek-flash`，不能写 `DeepSeek-Flash` 或 `deepseek_flash`。

::: tip 大小写和分隔符都敏感
模型名区分大小写，`-` 和 `_` 不能互换。最稳妥的做法是从 `/v1/models` 复制。
:::

## 常见问题

### 模型不存在或请求失败：诊断树

先按下面的顺序判断，不要把所有“模型不存在”都归因于模型名：

1. **确认请求地址和协议入口**
   - 先确认工具的 Base URL 写法符合[选择接入方式](./endpoints#base-url-对照表)。
   - 如果 `/v1/models` 也返回 `404`，优先排查 Base URL、入口路径和服务是否提供该协议。
   - 如果最终 URL 出现 `/v1/v1/...`，先去掉重复的 `/v1`。

2. **确认模型 ID 和当前 Key/分组**
   - 从 `/v1/models` 复制完整的 `id`，不要手写别名或猜大小写。
   - 模型不在列表中时，可能是当前分组没有该模型、Key 的模型限制排除了它，或服务没有配置计费/渠道。
   - 模型在列表中，但请求仍失败时，继续下一步。

3. **按响应区分原因**
   - `404`：常见于 Base URL/入口路径错误，也可能是该模型或入口不存在；以响应体为准。
   - `403`：常见于分组无权限、模型被 Key 限制、IP 不在白名单。
   - `401`、额度不足或限流错误：不同网关可能用 `401`、`402`、`429` 或其他状态；先检查账户余额、Key 额度和限流。
   - `503`：常见于当前分组没有可用渠道、上游临时故障，或模型不支持当前协议入口。
   - `400` / `413`：常见于参数、上下文窗口或请求体超过限制，检查 `code` 和 `message`。
   - 其他 `5xx`：按上游临时故障处理，结合服务商日志重试或切换模型/渠道。

4. **最后确认能力和协议**
   - 模型支持对话，不等于支持 tool call、reasoning、streaming 或你正在使用的协议。
   - 同一个模型在不同协议入口下的行为可能不同；必要时换用工具推荐的入口。

状态码和错误码会因网关实现不同而变化，本文只给出常见映射。遇到无法确定的情况，保留完整响应、请求时间和模型 ID，交给服务商排查。

### 工具报工具调用失败

模型不支持 tool call。换一个支持工具调用的模型。

### 同一个模型，不同分组价格不一样

模型倍率相同，但分组倍率不同。详见[概念说明](./concepts#什么是倍率)。

### 列表里有模型，但请求失败

可能原因：额度不足、模型限制、上游临时故障。按[排障检查清单](./errors#排障检查清单)逐项排查。

## 接下来

- [错误码与排障](./errors)
- [概念说明](./concepts)
- [工具列表](/tools/)