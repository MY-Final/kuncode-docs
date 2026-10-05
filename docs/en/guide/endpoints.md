# Choose an Endpoint

Compatible gateways usually expose several protocol entry points. Tools differ in what they support.

| Endpoint | Path | Typical client |
| --- | --- | --- |
| OpenAI Chat Completions | `/v1/chat/completions` | Most OpenAI-compatible tools |
| OpenAI Responses | `/v1/responses` | Codex, OpenCode, GitHub Copilot CLI, newer OpenAI SDKs |
| Anthropic Messages | `/v1/messages` | Claude Code, GitHub Copilot CLI, Anthropic SDKs |

## Which one

- **Codex** - use the Responses endpoint, Base URL points at the root.
- **Claude Code** - use the Anthropic Messages endpoint, overriding the official address in `settings.json`.
- **OpenCode** - use the Responses endpoint with a custom provider.
- **GitHub Copilot CLI** - uses Chat Completions by default; set `COPILOT_PROVIDER_WIRE_API=responses` when the model works better over Responses.

## Authentication

```
Authorization: Bearer <your API key>
```

The Anthropic Messages endpoint usually also accepts `x-api-key`.

::: tip Not sure
Check where the tool expects a Base URL, then match the table above. When in doubt, start with Chat Completions.
:::
