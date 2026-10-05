# Choose an Endpoint

Compatible gateways usually expose several protocol entry points. Tools differ in what they support.

| Endpoint | Path | Typical client |
| --- | --- | --- |
| OpenAI Chat Completions | `/v1/chat/completions` | Most OpenAI-compatible tools |
| OpenAI Responses | `/v1/responses` | Codex, OpenCode, newer OpenAI SDKs |
| Anthropic Messages | `/v1/messages` | Claude Code, Anthropic SDKs |

## Which one

- **Codex** - use the Responses endpoint, Base URL points at the root.
- **Claude Code** - use the Anthropic Messages endpoint via environment variables.
- **OpenCode** - use the Responses endpoint with a custom provider.

## Authentication

```
Authorization: Bearer <your API key>
```

The Anthropic Messages endpoint usually also accepts `x-api-key`.

::: tip Not sure
Check where the tool expects a Base URL, then match the table above. When in doubt, start with Chat Completions.
:::
