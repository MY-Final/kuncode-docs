# Errors and troubleshooting

When a request fails, the server returns an HTTP status code and a JSON error body. **The status code tells you the broad category; the `code` field tells you the actual cause.** Read them together.

This page groups the common errors by status code, with how to confirm and how to fix each one.

## How to read an error response

OpenAI-compatible endpoints return:

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

The Anthropic Messages endpoint returns:

```json
{
  "type": "error",
  "error": {
    "type": "authentication_error",
    "message": "invalid token"
  }
}
```

Read the HTTP status code first, then the `type` / `code` field, then the `message`.

## Quota and error codes

`code` / `type` naming can vary between gateways. The table below establishes a troubleshooting order; it does not replace your provider's documentation. If a code cannot be confirmed, use the gateway's actual response as the source of truth.

| HTTP status | Typical `code` / `type` | Meaning | Retry? | User action |
| --- | --- | --- | --- | --- |
| 401 / 403 (use the actual gateway response) | `insufficient_user_quota` | Account balance or token quota is insufficient and the request was rejected | No; top up or adjust quota first | Check both account balance and the current key's token quota; check whether pre-authorization is holding part of the balance |
| 400 (some gateways use 413) | `context_length_exceeded` | Input, output, or their sum exceeds the model context limit | No; shorten the request first | Reduce history, attachments, or the output limit, or switch to a model with a longer context window |
| 429 | `rate_limit_exceeded` | A request-rate, concurrency, or model-level limit was reached | Yes, after backoff | Check `Retry-After`, lower concurrency, or request a higher limit |
| 529 (some gateways map it to 429 or 503) | `overloaded_error` | The Anthropic-compatible upstream is overloaded; the gateway may pass it through or rewrite it | Yes, with limited retries after a short backoff | Retry later, lower concurrency, or switch model or channel |

::: warning Do not infer quota only from the status code
Insufficient balance, exhausted token quota, a disabled key, and rate limiting may use the same or adjacent HTTP status codes. Record the HTTP status, `code` / `type`, `message`, and request time together to distinguish them.
:::

## Client errors (4xx)

### 400 Bad Request

The request body itself is wrong: invalid JSON, a missing required field, or a wrong parameter type.

| Item | Detail |
| --- | --- |
| Common `code` | `invalid_request`, `bad_request_body`, `convert_request_failed` |
| Confirm | Send a minimal request with `curl` and see whether it fails too |
| Fix | Check the JSON is valid, required fields are present, and types are correct |

```bash
curl https://your-gateway.example.com/v1/chat/completions \
  -H "Authorization: Bearer sk-xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-5","messages":[{"role":"user","content":"hi"}]}'
```

If `curl` works and only the tool returns 400, the tool is generating a bad request. Check its model name and parameters.

### 401 Unauthorized

The key did not pass validation.

| Item | Detail |
| --- | --- |
| Common `code` | `invalid_request`, `authentication_error` |
| Confirm | Check the header is `Authorization: Bearer sk-xxx` and the key has no whitespace |
| Fix | Check the key is complete, not expired, not disabled, and still has quota |

Check in this order:

1. Key missing or wrong
2. Key has extra whitespace or a newline
3. Key expired or disabled
4. Key quota exhausted

Verify with `curl` to rule out tool-specific issues:

```bash
curl https://your-gateway.example.com/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

::: tip The wrong credential variable also gives 401
In Claude Code, `ANTHROPIC_AUTH_TOKEN` is sent as `Authorization: Bearer`, while `ANTHROPIC_API_KEY` is sent as `x-api-key`.

If the gateway only reads one of them, using the other returns 401. See the [Claude Code setup](/en/tools/claude-code).
:::

### 403 Forbidden

The key is valid but lacks permission.

| Item | Detail |
| --- | --- |
| Common `code` | `access_denied` |
| Confirm | Read the message: does it mention a group or an IP? |
| Fix | Use a group you may access, or add your IP to the allowlist |

Common causes:

- **No permission for the group** - your account may not use the group set on the key
- **IP not allowlisted** - the key has an IP allowlist and your IP is not on it
- **Model restricted** - the key has model limits and the requested model is not allowed
- **User disabled** - the account itself is disabled

Use these minimum steps to distinguish the permission type:

1. Request `/v1/models` with the same key. If that also returns 403, check account status and group permission first.
2. If the list works but one model returns 403, check the key's model limits and whether the group serves that model.
3. If the message mentions IP, allowlist, or source address, verify the egress IP seen by the gateway. A proxy, CDN, or corporate network can change it.
4. If the response does not identify the cause, do not guess. Give the provider the request time, model, endpoint, egress IP, and full error body.

### 404 Not Found

The address does not exist.

| Item | Detail |
| --- | --- |
| Confirm | Check the base URL and path |
| Fix | Follow the table below for your tool: Codex, OpenCode, and GitHub Copilot CLI must include `/v1` in the Base URL; Claude Code should use the domain only. |

Common causes:

- Wrong base URL
- Base URL contains extra path segments, e.g. a `/v1` you added
- The tool appended `/v1` again, producing `/v1/v1/...`
- The service does not expose that protocol endpoint

Base URL rules per tool:

| Tool | Base URL |
| --- | --- |
| Codex | `https://your-gateway.example.com/v1` |
| Claude Code | `https://your-gateway.example.com` |
| OpenCode | `https://your-gateway.example.com/v1` |
| GitHub Copilot CLI | `https://your-gateway.example.com/v1` |

See [Choose an endpoint](./endpoints).

### 413 Payload Too Large

The request body exceeds the server limit, usually from a very large file or an extremely long context.

Shrink the request, or ask your administrator to raise the limit.

### 429 Too Many Requests

Rate limited. Two kinds:

| Kind | Meaning |
| --- | --- |
| Request rate limit | Too many requests in a time window |
| Model request limit | Too many requests for one model |

| Item | Detail |
| --- | --- |
| Confirm | Check for a `Retry-After` header and the limit description in the message |
| Fix | Wait and retry, lower concurrency, or request a higher limit |

::: tip Do not retry immediately
429 means "you are going too fast". Retrying right away usually fails again. Wait for `Retry-After`, or back off exponentially.
:::

Minimum steps:

1. Check for `Retry-After`; if present, wait that long.
2. Without `Retry-After`, use exponential backoff with jitter and cap the number of retries.
3. Lower concurrency and repeated requests in a short window, then see whether the issue still reproduces.
4. If only one model triggers it, investigate a model-level limit. If every model triggers it, investigate an account or gateway-level limit.
5. If it persists, record the time range, model, concurrency, and error body for the provider to confirm the limit.

## Server errors (5xx)

Handle 5xx in this order so a transient upstream failure does not turn into repeated requests:

1. Record the HTTP status, `code` / `type`, request time, model, endpoint, and request ID.
2. Back off briefly and retry at most once to see whether it reproduces.
3. If another model or channel recovers, the issue is likely limited to one upstream or channel.
4. If every model keeps returning 5xx, stop automatic retries and contact the provider.
5. If a streaming response already emitted partial output, confirm the duplicate-billing rules before retrying blindly.

### 500 Internal Server Error

An internal gateway error.

| Item | Detail |
| --- | --- |
| Common `code` | `new_api_error`, `count_token_failed`, `query_data_error` |
| Confirm | Retry once and see whether it reproduces |
| Fix | Retry if it was transient; if it persists, contact your provider with the request time |

### 502 Bad Gateway

The gateway reached the upstream, but the upstream returned an error response.

| Item | Detail |
| --- | --- |
| Common `code` | `bad_response_status_code`, `upstream_error` |
| Confirm | Try another model or retry later |
| Fix | Usually a transient upstream problem; retrying normally recovers |

### 503 Service Unavailable

No channel is available, or the system is overloaded.

| Item | Detail |
| --- | --- |
| Common `code` | `channel:no_available_key`, `model_not_found` |
| Confirm | Read the message: "no available channel" or "system overloaded"? |
| Fix | Retry with another model or group; contact your provider if it persists |

Common causes:

- The current group has no channel serving this model
- Channel keys are invalid or out of balance and were auto-disabled
- The server is protecting itself from CPU, memory or disk overload

::: tip A missing model also returns 503
When no channel in the group can serve the model, the server returns 503 rather than 404.

So for "unknown model", check both the spelling and whether the group serves it. See [Models and capabilities](./models).
:::

### 504 Gateway Timeout

The upstream took too long.

Shrink the request (shorter context, smaller output) or retry later. For long requests, raise the timeout on the tool side; each tool page has an "Adjust the timeout" section.

### 529 Overloaded (Anthropic-compatible endpoints)

An Anthropic-compatible endpoint may return 529 or `overloaded_error` for an overloaded upstream. Some gateways rewrite it as 429 or 503, so use the actual HTTP status and `code` / `type` as the source of truth.

Back off briefly, lower concurrency, or switch model or channel. If it persists, report it as a 5xx using the information below.

## Streaming, timeouts, and retries

Streaming timeout behavior depends on the client, SDK, and gateway. When there is no explicit documentation, use these signals:

- **Total timeout**: the request is cut off after a fixed total duration, even if data keeps arriving.
- **Idle timeout**: it is cut off only after no new data arrives for a period; continuous output normally does not trigger it.
- **If uncertain**: record the request start time, the time the last data was received, and the time of interruption, then compare them with the tool configuration.

Whether an interrupted SSE request is billed, whether pre-authorization is refunded, and whether emitted output counts toward usage depend on the provider's settlement rules and request log. This page does not assume any platform's billing behavior.

Retry notes:

- 4xx usually indicates a request problem and should not be retried automatically. For 429, use `Retry-After` or exponential backoff.
- 5xx can be retried a limited number of times, but the gateway may already have sent the request upstream, so a retry may be billed twice.
- After a streaming request has emitted partial output, do not retry blindly until you know whether it creates a second upstream request.
- If unsure, check the request ID in the bill and logs before deciding to retry or report the issue.

## Troubleshooting per tool

| Tool | Entry |
| --- | --- |
| Codex | [Codex troubleshooting](/en/tools/codex#_7-troubleshooting) |
| Claude Code | [Claude Code troubleshooting](/en/tools/claude-code#_7-troubleshooting) |
| OpenCode | [OpenCode troubleshooting](/en/tools/opencode#_8-troubleshooting) |
| GitHub Copilot CLI | [GitHub Copilot CLI troubleshooting](/en/tools/copilot#_6-troubleshooting) |

## Checklist

Work through this order; it locates most problems:

1. **Is the key right?** Verify with `curl /v1/models` to rule out tool config issues
2. **Does the model exist?** Check the name is in `/v1/models`; see [Models and capabilities](./models)
3. **Is the group allowed?** Check you may access the group set on the key
4. **Is there enough quota?** Check both account balance and key quota
5. **Is the tool config right?** Base URL, config file path, credential variable name
6. **Is the report complete?** Include the request ID / trace ID, request time with timezone, model, endpoint, HTTP status, and full error body; never include an unredacted key

## Next

- [FAQ](/en/faq)
- [Models and capabilities](./models)
- [Concepts](./concepts)