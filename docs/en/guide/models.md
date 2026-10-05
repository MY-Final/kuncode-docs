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

### The name is right, but it says the model does not exist

The name is right, but **the current group has no channel serving it**. The server returns 503, not 404.

Check:

1. Whether the key's group is one you may use
2. Whether another group works
3. Whether `/v1/models` really lists it

See [Errors and troubleshooting](./errors#_503-service-unavailable).

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