# FAQ

These issues are provider-agnostic and apply to any compatible gateway.

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

::: tip Not set up yet, or not sure where to start?
This page is organized by status code. It is meant for people who can already send requests and want to look up a specific error.

If you are new to the command line, not set up yet, or unsure who to send an error to, start with [When setup fails](/en/beginner/help).
:::

## 401 Unauthorized

1. Make sure the key is complete with no whitespace.
2. Make sure the header is `Authorization: Bearer sk-xxx`.
3. Make sure the key is not expired, disabled, or out of quota.
4. Verify with `curl` to rule out tool-specific issues.

```bash
curl https://your-gateway.example.com/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

See [Errors and troubleshooting](/en/guide/errors).

## 403 Forbidden

- The key is valid but lacks permission for the group, IP, or model. Use `/v1/models` first to see whether every call fails or only one model fails.
- If every model fails, check group permission and whether the account is disabled. If only one model fails, check key model limits and models available to the group.
- If the message mentions IP or an allowlist, verify the egress IP seen by the gateway. A proxy, CDN, or corporate network can change the source IP.
- If the response does not identify the cause, record the time, model, endpoint, and full error body for the provider.

See [Errors and troubleshooting](/en/guide/errors).

## 429 Too Many Requests

- 429 means rate limiting, not an invalid key. Check whether the response includes `Retry-After`.
- Without `Retry-After`, use exponential backoff with jitter instead of retrying immediately in a loop.
- Lower concurrency and avoid repeated requests in a short window. If only one model is affected, the limit may be model-specific.
- If it persists, record the time range, model, and concurrency level, then ask the provider about the limit.

See [Errors and troubleshooting](/en/guide/errors).

## 5xx or Anthropic 529

- 500, 502, 503, and 504 may be transient gateway or upstream failures. 529 is commonly used by Anthropic for overload, while some gateways may map it to 429 or 503.
- Back off briefly and retry once. If it keeps reproducing, stop retrying in a loop and try another model or channel.
- After a streaming response has emitted partial output, do not retry blindly until you know whether the retry can be billed twice.
- When reporting the issue, include the request time, model, endpoint, HTTP status, and full error body.

See [Errors and troubleshooting](/en/guide/errors).

## Quota exhausted, or balance remains but requests are rejected

- Account balance and a single key's token quota are separate limits. A positive account balance does not mean the current key still has quota.
- An exhausted token quota commonly returns 401 or 403; the exact status and `code` depend on the gateway.
- With pre-authorization or concurrent requests, part of the available balance may be temporarily held. Use the provider's billing and request logs as the source of truth.
- After topping up or increasing quota, check whether the key must be re-enabled or recreated; behavior varies by provider.
- Record codes such as `insufficient_user_quota` and the request ID so the provider can investigate.

See [Errors and troubleshooting](/en/guide/errors) and [Concepts](/en/guide/concepts).

## Context length exceeded

- A common code is `context_length_exceeded`; the HTTP status may be 400, and some gateways may map it to 413.
- Shorten the context, reduce the output limit, and remove unnecessary history or attachments before retrying.
- Context window and maximum output differ by model. `/v1/models` does not guarantee that these limits are returned.
- If you need long context, switch to a model that supports it or confirm the actual limit with the provider.

See [Models and capabilities](/en/guide/models) and [Errors and troubleshooting](/en/guide/errors).

## Streaming request interrupted

- If the client cuts off after a fixed total time, it is likely a total timeout. If it cuts off only after a long silence, it is likely an idle timeout. The exact behavior depends on the client and gateway.
- Whether an interrupted SSE request is billed or its pre-authorization is refunded depends on the provider's settlement rules. Use the bill and request log as the source of truth.
- If partial output was already emitted, do not retry blindly; this may create a second upstream request and be billed twice.
- Preserve the request ID, last received event, emitted content, and interruption time before deciding whether to retry or report the issue.

See [Errors and troubleshooting](/en/guide/errors) and [Concepts](/en/guide/concepts).

## The key leaked

- Revoke or delete the leaked key in the provider console immediately, then create a new key.
- Remove the old key from config files, environment variables, CI secrets, shell history, and logs.
- Check billing and request logs for unusual models, times, or source IPs.
- After rotation, verify `/v1/models` with the new key before updating tool configurations.
- Never commit keys to Git, include them in screenshots, or paste them into public issues. Redact them when reporting a problem.

See [Concepts](/en/guide/concepts).

## Proxy or custom CA

- First check whether `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` are read by the current tool; support varies by tool and environment.
- A corporate proxy or self-signed certificate can cause TLS verification failures. Configure a custom CA as documented by the tool instead of disabling all certificate checks.
- Run `curl` or the tool's diagnostic command from the same terminal to determine whether the problem is the tool, proxy, or certificate.
- If the proxy changes the egress IP, also check whether the IP allowlist still matches.

See [Errors and troubleshooting](/en/guide/errors).

## Model list does not return capabilities or prices

- `/v1/models` commonly returns only basic fields such as model ID, object type, creation time, and owner.
- The model list does not guarantee context window, tool calling, vision, reasoning, streaming support, or pricing.
- Treat the provider console, model documentation, and actual tests as the source of truth for capabilities, limits, and billing.
- Verify basic chat with a minimal request, then test tool calling, images, and long context one capability at a time.

See [Models and capabilities](/en/guide/models) and [Choose an endpoint](/en/guide/endpoints).

## Can one key use multiple protocols?

- It depends on the gateway implementation and key permissions. One key may support Chat Completions, Responses, and Anthropic Messages, or only one of them.
- Protocol support and model support are separate. A model that works through Chat Completions is not guaranteed to work through Anthropic Messages.
- Different protocols may use different paths, authentication headers, and parameter formats. Read [Choose an endpoint](/en/guide/endpoints) before configuring.
- Verify each protocol with its own minimal request. If a protocol returns 404 or 400, first confirm that the gateway exposes that endpoint.

See [Choose an endpoint](/en/guide/endpoints) and [Models and capabilities](/en/guide/models).

## 404 Not Found

- The base URL is wrong or has extra path segments.
- The service does not expose that protocol endpoint.
- The tool appended a duplicate `/v1`.

See [Errors and troubleshooting](/en/guide/errors).

## Unknown model

Call `/v1/models` and use one of the returned names. Note a missing model usually returns 503, not 404.

See [Models and capabilities](/en/guide/models) and [Errors and troubleshooting](/en/guide/errors).

## Timeouts

- Check local network and proxy settings.
- Retry with another model or channel.
- For long requests only, raise the tool's timeout.
- For streaming, distinguish total timeout from idle timeout; see [Streaming request interrupted](#streaming-request-interrupted).

See [Errors and troubleshooting](/en/guide/errors).

## Cost or usage mismatch

Filter by time range in your provider's log or billing page and compare per-request input, output, cache and cost.
This documentation does not assume any specific platform; check your provider's own docs for entry points.

See [Concepts](/en/guide/concepts) and [Errors and troubleshooting](/en/guide/errors).