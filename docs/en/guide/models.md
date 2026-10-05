# Models and capabilities

This page covers three things: **how to list the models you have, how to tell whether a model fits your tool, and why the model name must be exact.**

## List the available models

Call `/v1/models` with your own key:

```bash
curl https://your-gateway.example.com/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

The OpenAI-compatible endpoint returns:

```json
{
  "object": "list",
  "data": [
    { "id": "gpt-5", "object": "model", "created": 1626777600, "owned_by": "openai" },
    { "id": "deepseek-flash", "object": "model", "created": 1626777600, "owned_by": "deepseek" }
  ]
}
```

Field reference:

| Field | Meaning |
| --- | --- |
| `id` | The model ID - **this is what you put in your config** |
| `object` | Always `model` |
| `created` | Creation timestamp; usually not meaningful |
| `owned_by` | The upstream channel name, useful to identify the source |

::: tip The list is filtered by your permissions
The response only contains models **available to your current group**, and excludes:

- Models excluded by your key's model limits
- Models with no billing configuration

So someone else's list may be longer. A model that is missing from your list will fail when called.
:::

::: tip Different groups have different models
On the same service, the `default` group and the `vip` group may serve different models.

Change the key's group and the `/v1/models` result changes too.
:::

The Anthropic Messages endpoint returns a different shape:

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

## Context and output limits

`/v1/models` usually tells you only whether a key can currently see a model. It does not necessarily return the context window, maximum output or price. Those limits are determined by the actual model, channel and gateway configuration.

Keep these limits separate:

| Limit | Meaning | How to check |
| --- | --- | --- |
| **Context window** | Maximum combined input + output for one request | Service model documentation, console model details or the actual error |
| **Maximum output** | Maximum tokens generated in one reply | Service or model documentation; `max_tokens` / `max_output_tokens` in a request must not exceed it |
| **Request body limit** | Gateway or upstream limit on HTTP body size | Retry with fewer attachments, less history or a smaller input |
| **Client-side limit** | A context or output limit built into Claude Code, Codex or another client | Tool documentation; you may need to configure the client when the gateway model window differs from its default |

When a limit is exceeded, gateways may return `400`, `413` or an upstream-specific error. The message may contain `context_length_exceeded`, `max_tokens` or `too large`. Do not rely on the status code alone: read the response `code` and `message`, and follow the actual service's documentation.

::: tip Do not infer the window from the model name
The same model name can have different context windows, output limits and billing across channels. Use the actual service response or documentation rather than assuming a `128k` or `200k` name guarantees a particular limit.
:::

## What `/v1/models` does not promise

The main purpose of `/v1/models` is to return the **model IDs visible to the current credential**. Fields other than `id` should not be treated as a complete capability inventory.

It usually does not guarantee:

- Context window, maximum output or request body limit
- Input, output, cache or reasoning token prices
- Model ratio, group ratio or final billed amount
- Whether tool call, vision, reasoning, streaming or attachments are supported
- Which protocol endpoints the model supports, such as Chat Completions, Responses or Anthropic Messages
- Rate limits, concurrency limits, availability or current channel health
- A one-to-one mapping between `owned_by` and the real upstream provider

A model ID in the list only means it may be available to the current key and group. Whether it works in your tool still depends on the endpoint, channel state, model limits, quota and the capabilities the tool needs. Check the service documentation, console or actual request result, and treat the service as authoritative when in doubt.

## How to pick a model

Filter in this order:

1. **Check what capability the tool needs**, narrowing with the table below
2. **Check `/v1/models`**, confirming your group serves it
3. **Make the name exact**, copying the `id` rather than typing it

::: warning Coding tools have hard model requirements
Not every model works in a coding assistant.

- **Codex** needs the Responses API and reasoning
- **Claude Code** needs tool call support
- **OpenCode**'s `variants` only work when the model supports reasoning
- **GitHub Copilot CLI** needs tool call and streaming support; the GPT-5 series works best over Responses

Configure a model without tool call support in Claude Code and tool calls fail outright.
:::

## Capability reference

Models differ in what they support. The common ones:

| Capability | Meaning | Impact |
| --- | --- | --- |
| **tool call** | Can invoke tools (read/write files, run commands) | The core capability for coding tools |
| **reasoning** | Supports reasoning effort control | Codex and OpenCode reasoning settings |
| **vision** | Can read images | Screenshots and design mockups |
| **streaming** | Supports streamed output | Interactive experience |
| **attachment** | Supports file attachments | OpenCode's `attachment` field |

::: tip Capabilities come from the upstream model
What a model supports is decided by the upstream model serving it. The same model name can behave differently across channels.

Trust what actually works: get one known-good model running first, then try others.
:::

## What each tool needs

| Tool | Required | Recommended endpoint | Notes |
| --- | --- | --- | --- |
| **Codex** | Responses + reasoning | `/v1/responses` | Set `model` in `config.toml` |
| **Claude Code** | tool call | `/v1/messages` | Map the `sonnet` / `opus` / `haiku` aliases to real models |
| **OpenCode** | At least chat; `variants` need reasoning | `/v1/responses` | Declared under `models` in `opencode.json` |
| **GitHub Copilot CLI** | tool call + streaming | `/v1/chat/completions` or `/v1/responses` | Set the model with `COPILOT_MODEL`; pick the wire API as needed |

Without tool call support, a coding assistant cannot read or write files and fails with a tool-related error.

## The model name must be exact

All these tools require the name to **match the `id` returned by `/v1/models` exactly**:

| Tool | Where |
| --- | --- |
| Codex | `model` in `config.toml` |
| Claude Code | `ANTHROPIC_DEFAULT_*_MODEL` in `settings.json` |
| OpenCode | The `models` key in `opencode.json` |
| GitHub Copilot CLI | The `COPILOT_MODEL` environment variable |

If the API returns `deepseek-flash`, write `deepseek-flash`, not `DeepSeek-Flash` or `deepseek_flash`.

::: tip Case and separators matter
Model names are case-sensitive, and `-` is not interchangeable with `_`. The safest approach is to copy from `/v1/models`.
:::

## Common questions

### Model missing or request failing: diagnostic tree

Work through these steps instead of assuming every "model does not exist" message is a model-name problem:

1. **Check the request URL and protocol endpoint**
   - Confirm the tool's Base URL follows [Choose an endpoint](./endpoints#base-url-reference).
   - If `/v1/models` also returns `404`, check the Base URL, endpoint path and whether the service implements that protocol.
   - If the final URL contains `/v1/v1/...`, remove the duplicate `/v1`.

2. **Check the model ID and the current key/group**
   - Copy the complete `id` from `/v1/models`; do not type an alias or guess the case.
   - If the model is not listed, the current group may not serve it, the key's model limits may exclude it, or the service may have no billing/channel configuration for it.
   - If it is listed but the request still fails, continue.

3. **Classify by the response**
   - `404`: commonly a Base URL or endpoint path problem, though the model or endpoint may genuinely not exist; read the response body.
   - `403`: commonly group permission, a key model limit or an IP allowlist problem.
   - `401`, insufficient quota or rate limiting: gateways may use `401`, `402`, `429` or another status; check account balance, key quota and rate limits.
   - `503`: commonly no usable channel in the current group, a transient upstream failure, or a model that does not support the selected protocol.
   - `400` / `413`: commonly parameters, context window or request body size; inspect `code` and `message`.
   - Other `5xx`: treat as a transient upstream failure and retry or switch model/channel while checking service logs.

4. **Finally check capabilities and protocol**
   - Chat support does not imply tool call, reasoning, streaming or the protocol you are using.
   - The same model may behave differently over different endpoints; switch to the endpoint recommended for your tool when needed.

Status and error codes vary by gateway implementation; this page lists common mappings only. If the cause is still unclear, keep the full response, request time and model ID for the service provider.

### The tool reports a tool-call failure

The model does not support tool call. Switch to one that does.

### The same model costs different amounts

The model ratio is the same, but the group ratio differs. See [Concepts](./concepts#what-a-ratio-is).

### The model is listed, but the request fails

Possible causes: not enough quota, model limits, or a transient upstream problem. Work through the [troubleshooting checklist](./errors#checklist).

## Next

- [Errors and troubleshooting](./errors)
- [Concepts](./concepts)
- [Tools](/en/tools/)