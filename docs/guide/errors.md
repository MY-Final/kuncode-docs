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

### 404 Not Found

请求的地址不存在。

| 项目 | 说明 |
| --- | --- |
| 怎么确认 | 检查 Base URL 和路径是否写对 |
| 怎么修 | 只填域名，让工具自己拼 `/v1/...` |

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

## 服务端错误（5xx）

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

## 接下来

- [常见问题](/faq)
- [模型与能力](./models)
- [概念说明](./concepts)