# 错误码与排障

请求失败时，服务端会返回一个 HTTP 状态码和一段 JSON 错误信息。**状态码告诉你错误的大类，`code` 字段才说明具体原因**，两者要一起看。

这一页按状态码整理常见错误，并给出确认方法和修复步骤。

## 怎么读错误响应

OpenAI 兼容入口的错误格式：

```json
{
  "error": {
    "message": "token quota is not enough",
    "type": "insufficient_user_quota",
    "param": "",
    "code": "insufficient_user_quota"
  }
}
```

Anthropic Messages 入口的错误格式：

```json
{
  "type": "error",
  "error": {
    "type": "authentication_error",
    "message": "invalid token"
  }
}
```

先看 HTTP 状态码，再看 `type` / `code` 字段，最后读 `message`。

## 额度与错误码

`code` / `type` 的命名可能因网关实现不同而变化；下表用于建立排查顺序，不能替代服务商的实际文档。遇到无法确认的 code，以网关实际返回为准。

| HTTP 状态 | 典型 `code` / `type` | 业务含义 | 是否可重试 | 用户动作 |
| --- | --- | --- | --- | --- |
| 401 / 403（以网关实际返回为准） | `insufficient_user_quota` | 账户余额或令牌额度不足，请求被拒绝 | 否，充值或调整额度后再试 | 检查账户余额和当前 Key 的令牌额度；确认预扣是否占用了可用额度 |
| 400（部分网关为 413） | `context_length_exceeded` | 输入、输出或两者合计超过模型上下文限制 | 否，缩短请求后再试 | 减少历史消息、附件或输出上限，或换用更长上下文的模型 |
| 429 | `rate_limit_exceeded` | 请求频率、并发或模型级限额触发限流 | 是，必须退避后重试 | 查看 `Retry-After`，降低并发，或申请更高限额 |
| 529（部分网关映射为 429 或 503） | `overloaded_error` | Anthropic 兼容上游过载，网关可能原样透传或改写 | 是，短暂退避后有限重试 | 稍后重试、降低并发，或切换模型和渠道 |

::: warning 不要只凭状态码判断额度
余额不足、令牌额度不足、Key 被禁用和限流可能使用相同或相邻的 HTTP 状态码。必须同时记录 HTTP 状态、`code` / `type`、`message` 和请求时间，才能区分。
:::

## 客户端错误（4xx）

### 400 Bad Request

请求体本身有问题：JSON 语法错误、缺少必填字段、参数类型不对。

| 项目 | 说明 |
| --- | --- |
| 常见 `code` | `invalid_request`、`bad_request_body`、`convert_request_failed` |
| 怎么确认 | 用 `curl` 发一条最小请求，看是否同样报错 |
| 怎么修 | 检查 JSON 是否合法、必填字段是否齐全、参数类型是否正确 |

```bash
curl https://your-gateway.example.com/v1/chat/completions \
  -H "Authorization: Bearer sk-xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-5","messages":[{"role":"user","content":"hi"}]}'
```

如果 `curl` 正常、只有工具报 400，说明是工具生成的请求有问题，检查工具的模型名和参数配置。

### 401 Unauthorized

密钥没有通过校验。

| 项目 | 说明 |
| --- | --- |
| 常见 `code` | `invalid_request`、`authentication_error` |
| 怎么确认 | 确认请求头是 `Authorization: Bearer sk-xxx`，密钥完整无空格 |
| 怎么修 | 检查密钥是否复制完整、是否过期、是否被禁用、额度是否用尽 |

最常见的原因按顺序排查：

1. 密钥没填或填错
2. 密钥带了多余空格或换行
3. 密钥已过期或被禁用
4. 令牌额度已用尽

用 `curl` 直接验证，排除工具自身问题：

```bash
curl https://your-gateway.example.com/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

::: tip 认证变量用错了也会 401
Claude Code 的 `ANTHROPIC_AUTH_TOKEN` 走 `Authorization: Bearer`，`ANTHROPIC_API_KEY` 走 `x-api-key`。

如果网关只认其中一种，用错变量就会 401。详见 [Claude Code 配置教程](/tools/claude-code)。
:::

### 403 Forbidden

密钥有效，但没有权限。

| 项目 | 说明 |
| --- | --- |
| 常见 `code` | `access_denied` |
| 怎么确认 | 看错误信息里是否提到分组或 IP |
| 怎么修 | 换一个有权限的分组，或把 IP 加入白名单 |

常见原因：

- **分组无权限**：密钥指定的分组，你的账户无权访问
- **IP 不在白名单**：密钥设置了 IP 白名单，当前 IP 不在列表里
- **模型被限制**：密钥设置了模型限制，请求的模型不在允许列表里
- **用户被禁用**：账户本身被停用

按最少步骤区分权限类型：

1. 用同一个 Key 请求 `/v1/models`。如果也返回 403，优先检查账户状态和分组权限。
2. 如果列表成功，但调用某个模型返回 403，检查密钥的模型限制和分组是否提供该模型。
3. 如果错误信息提到 IP、白名单或来源地址，核对网关实际看到的出口 IP；代理、CDN 和公司网络可能改变它。
4. 如果响应没有可区分的描述，不要猜测，携带请求时间、模型、端点、出口 IP 和完整错误 body 联系服务方。

### 404 Not Found

请求的地址不存在。

| 项目 | 说明 |
| --- | --- |
| 怎么确认 | 检查 Base URL 和路径是否写对 |
| 怎么修 | 先对照下方表格按工具填写：Codex / OpenCode / GitHub Copilot CLI 的 Base URL 必须带 `/v1`，Claude Code 只填域名。 |

常见原因：

- Base URL 写错
- Base URL 带了多余路径，例如同时写了 `/v1`
- 工具又自动拼了一次 `/v1`，变成 `/v1/v1/...`
- 服务不支持这个协议入口

各工具的 Base URL 规则：

| 工具 | Base URL 写法 |
| --- | --- |
| Codex | `https://your-gateway.example.com/v1` |
| Claude Code | `https://your-gateway.example.com` |
| OpenCode | `https://your-gateway.example.com/v1` |
| GitHub Copilot CLI | `https://your-gateway.example.com/v1` |

详见[选择接入方式](./endpoints)。

### 413 Payload Too Large

请求体超过服务端限制，通常是单次请求带了过大的文件或超长上下文。

减小请求体积，或联系管理员调整限制。

### 429 Too Many Requests

触发了限流。分两种：

| 类型 | 说明 |
| --- | --- |
| 请求频率限制 | 单位时间内请求次数太多 |
| 模型请求限制 | 针对某个模型的请求次数超限 |

| 项目 | 说明 |
| --- | --- |
| 怎么确认 | 看响应头是否带 `Retry-After`，以及错误信息里的限制描述 |
| 怎么修 | 等待后重试，降低并发，或申请更高限额 |

::: tip 不要立即重试
429 表示"你太快了"，立刻重试通常会继续失败。按 `Retry-After` 等待，或加指数退避。
:::

最少判断步骤：

1. 看响应是否有 `Retry-After`；有就按该时间等待。
2. 没有 `Retry-After` 时，使用带抖动的指数退避，并限制最大重试次数。
3. 降低并发和短时间内的重复请求，确认是否仍复现。
4. 如果只有某个模型触发，按模型级限额排查；如果所有模型都触发，按账户或网关级限额排查。
5. 持续触发时，记录时间范围、模型、并发量和错误 body，交给服务方确认限额规则。

## 服务端错误（5xx）

先按下面顺序处理 5xx，避免把临时上游故障扩大成重复请求：

1. 记录 HTTP 状态、`code` / `type`、请求时间、模型、端点和 request ID。
2. 短暂退避后最多重试一次，确认是否稳定复现。
3. 如果换模型或渠道后恢复，通常是单个上游或渠道问题。
4. 如果所有模型都持续 5xx，停止自动重试并联系服务方。
5. 流式请求已输出部分内容时，先确认重复计费规则，不要盲目自动重试。

### 500 Internal Server Error

服务端内部错误，通常是网关自身的异常。

| 项目 | 说明 |
| --- | --- |
| 常见 `code` | `new_api_error`、`count_token_failed`、`query_data_error` |
| 怎么确认 | 重试一次，看是否稳定复现 |
| 怎么修 | 偶发则重试；持续复现请联系服务方并提供请求时间 |

### 502 Bad Gateway

网关成功连上了上游，但上游返回了错误响应。

| 项目 | 说明 |
| --- | --- |
| 常见 `code` | `bad_response_status_code`、`upstream_error` |
| 怎么确认 | 换一个模型或稍后重试，看是否上游问题 |
| 怎么修 | 多为上游临时故障，重试通常可恢复 |

### 503 Service Unavailable

当前没有可用的渠道，或系统过载。

| 项目 | 说明 |
| --- | --- |
| 常见 `code` | `channel:no_available_key`、`model_not_found` |
| 怎么确认 | 看错误信息是"无可用渠道"还是"系统过载" |
| 怎么修 | 换模型或分组重试；持续出现请联系服务方 |

常见原因：

- 当前分组里，这个模型没有可用渠道
- 渠道密钥失效或余额不足，被自动禁用
- 服务端触发性能保护（CPU、内存、磁盘过载）

::: tip 模型不存在也会是 503
当分组里找不到能提供该模型的渠道时，服务端返回 503 而不是 404。

所以"模型不存在"要同时检查模型名拼写和分组可用性，见[模型与能力](./models)。
:::

### 504 Gateway Timeout

上游响应超时。

减小请求规模（更短的上下文、更小的输出），或稍后重试。长请求可以在工具侧调大超时，见各工具页的「调整超时」。

### 529 Overloaded（Anthropic 兼容入口）

Anthropic 兼容入口可能返回 529 或 `overloaded_error`，表示上游过载。部分网关会把它改写为 429 或 503，因此应先以实际 HTTP 状态和 `code` / `type` 为准。

短暂退避后重试，降低并发，或切换模型和渠道。持续复现时，按 5xx 报障信息提交给服务方。

## 流式请求、超时与重试

流式请求的超时行为取决于客户端、SDK 和网关实现。没有明确文档时，可以这样判断：

- **总超时**：请求从发出后经过固定总时长就被中断，即使期间持续收到数据也会触发。
- **空闲超时**：只有在一段时间内没有收到任何新数据时才中断；持续输出时通常不会触发。
- **不确定时**：同时记录请求开始时间、最后一次收到数据的时间和中断时间，再结合工具配置判断。

SSE 中断、上游超时或连接断开后，是否计费、是否退还预扣、已输出内容是否计入用量，必须以服务商的结算规则和请求日志为准。本页不假定任何特定平台的计费行为。

重试时注意：

- 4xx 通常是请求本身的问题，不应自动重试；429 按 `Retry-After` 或指数退避处理。
- 5xx 可以有限重试，但网关可能已经向上游发出请求，重试有重复计费的可能。
- 流式请求已经输出部分内容后，不要盲目自动重试；先确认是否会创建第二个上游请求。
- 不确定时，先查看账单和日志中的请求 ID，再决定是否重试或报障。

## 按工具排查

| 工具 | 排障入口 |
| --- | --- |
| Codex | [Codex 排障](/tools/codex#_7-排障) |
| Claude Code | [Claude Code 排障](/tools/claude-code#_7-排障) |
| OpenCode | [OpenCode 排障](/tools/opencode#_8-排障) |
| GitHub Copilot CLI | [GitHub Copilot CLI 排障](/tools/copilot#_6-排障) |

## 排障检查清单

按顺序排查，大多数问题能定位到：

1. **密钥对不对**：用 `curl /v1/models` 验证，排除工具配置问题
2. **模型在不在**：确认模型名在 `/v1/models` 返回列表里，见[模型与能力](./models)
3. **分组有没有权限**：密钥指定的分组你是否有权访问
4. **额度够不够**：账户余额和令牌额度都要检查
5. **工具配置对不对**：Base URL、配置文件路径、认证变量名
6. **报障信息全不全**：至少提供 request ID / trace ID、请求时间（含时区）、模型、端点、HTTP 状态和完整错误 body；不要提供未脱敏的 Key

## 接下来

- [常见问题](/faq)
- [模型与能力](./models)
- [概念说明](./concepts)