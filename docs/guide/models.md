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

### 模型名写对了，还是说模型不存在

模型名对，但**当前分组没有这个模型的可用渠道**。这时服务端返回的是 503 而不是 404。

检查：

1. 密钥的分组是不是有权限的那个
2. 换一个分组试试
3. 用 `/v1/models` 确认这个模型确实在你的列表里

详见[错误码与排障](./errors#_503-service-unavailable)。

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