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

### 404 Not Found

The address does not exist.

| Item | Detail |
| --- | --- |
| Confirm | Check the base URL and path |
| Fix | Use the domain only and let the tool append `/v1/...` |

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

## Server errors (5xx)

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

## Troubleshooting per tool

| Tool | Entry |
| --- | --- |
| Codex | [Codex troubleshooting](/en/tools/codex#_7-troubleshooting) |
| Claude Code | [Claude Code troubleshooting](/en/tools/claude-code#_7-troubleshooting) |
| OpenCode | [OpenCode troubleshooting](/en/tools/opencode#_8-troubleshooting) |

## Checklist

Work through this order; it locates most problems:

1. **Is the key right?** Verify with `curl /v1/models` to rule out tool config issues
2. **Does the model exist?** Check the name is in `/v1/models`; see [Models and capabilities](./models)
3. **Is the group allowed?** Check you may access the group set on the key
4. **Is there enough quota?** Check both account balance and key quota
5. **Is the tool config right?** Base URL, config file path, credential variable name

## Next

- [FAQ](/en/faq)
- [Models and capabilities](./models)
- [Concepts](./concepts)