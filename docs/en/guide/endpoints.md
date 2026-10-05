# Choose an Endpoint

Compatible gateways usually expose several protocol entry points. Tools differ in what they support, so choose the endpoint first and then configure the matching Base URL.

::: tip This page is the authority for Base URLs
An **API node** is usually the service root, for example `https://gateway.example.com`. A **Base URL** is the value a specific tool expects in its configuration field. They are not always the same.

Use the table on this page as the authoritative Base URL convention for the tool guides in this documentation. If your service requires something different, follow that service's instructions.
:::

## Common endpoints

| Endpoint | Path | Common authentication header | Typical clients |
| --- | --- | --- | --- |
| OpenAI Chat Completions | `/v1/chat/completions` | `Authorization: Bearer <key>` | Most OpenAI-compatible tools, OpenCode's `openai-compatible` provider, Copilot CLI |
| OpenAI Responses | `/v1/responses` | `Authorization: Bearer <key>` | Codex, OpenCode's `openai` provider, GitHub Copilot CLI |
| Anthropic Messages | `/v1/messages` | `x-api-key: <key>`; some compatible gateways also accept `Authorization: Bearer <key>` | Claude Code, GitHub Copilot CLI, Anthropic SDKs |

These paths are common conventions relative to the gateway root. A compatible service may implement a subset, and actual availability still depends on the gateway, group, model and key permissions.

## Base URL reference

The examples below assume the API node is `https://gateway.example.com` with no trailing `/`. "Adds `/v1` automatically" means whether the tool supplies the `/v1` prefix itself; it does not mean the tool supplies the final endpoint path.

| Tool | Configuration field or method | Value to enter | Adds `/v1` automatically? | Final request path |
| --- | --- | --- | --- | --- |
| **Codex** | `model_providers.<id>.base_url` in `~/.codex/config.toml` | `https://gateway.example.com/v1` | **No**; the value must include `/v1`, and the tool appends `/responses` | `https://gateway.example.com/v1/responses` |
| **Claude Code** | `ANTHROPIC_BASE_URL` in `settings.json` or the environment | `https://gateway.example.com` | **Yes**; the tool appends `/v1/messages` | `https://gateway.example.com/v1/messages` |
| **OpenCode** | `provider.<id>.options.baseURL` in `opencode.json` | `https://gateway.example.com/v1` | **No**; the value must include `/v1`, and the AI SDK appends the endpoint path | With `@ai-sdk/openai`, `/v1/responses`; with `@ai-sdk/openai-compatible`, `/v1/chat/completions` |
| **GitHub Copilot CLI** | `COPILOT_PROVIDER_BASE_URL` in OpenAI-compatible mode | `https://gateway.example.com/v1` | **No**; the value must include `/v1`, and the tool appends the path selected by the wire API | `/v1/chat/completions` when `COPILOT_PROVIDER_WIRE_API=completions`; `/v1/responses` when set to `responses` |

### Rules

1. **Separate the API node from the Base URL.** The node shown in a console usually has no `/v1`; the value entered into a tool depends on that tool's requirements.
2. **Codex must use a Base URL containing `/v1`.** Do not enter `https://gateway.example.com` directly in `base_url`, and do not enter `/v1/responses`.
3. **Claude Code uses the domain only.** `ANTHROPIC_BASE_URL` must not include `/v1`, `/v1/messages` or a trailing slash.
4. **OpenCode and Copilot CLI use a Base URL containing `/v1` in OpenAI-compatible mode.** For Anthropic provider types, follow the relevant tool page and provider instructions instead of copying the OpenAI example.
5. **Do not add a trailing `/`.** It can produce `//v1` or otherwise fail to match the service's route.
6. **Do not repeat the endpoint path in the Base URL.** If the final URL contains `/v1/v1/...` or `/v1/responses/responses`, check this first.

## Minimal verification requests

The examples below confirm that at least one combination of key, Base URL, model and protocol works. Replace `API_KEY`, `MODEL_ID` and the domain. These use bash syntax; on Windows PowerShell, prefer `curl.exe` and use PowerShell-compatible quoting for the JSON body.

### Chat Completions

```bash
curl https://gateway.example.com/v1/chat/completions \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MODEL_ID",
    "messages": [{"role": "user", "content": "Reply with OK"}],
    "max_tokens": 16
  }'
```

### Responses

```bash
curl https://gateway.example.com/v1/responses \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MODEL_ID",
    "input": "Reply with OK",
    "max_output_tokens": 16
  }'
```

### Anthropic Messages

```bash
curl https://gateway.example.com/v1/messages \
  -H "x-api-key: $API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MODEL_ID",
    "max_tokens": 16,
    "messages": [{"role": "user", "content": "Reply with OK"}]
  }'
```

If the gateway accepts only Bearer authentication, replace `x-api-key` in the Anthropic example with `Authorization: Bearer $API_KEY`. Conversely, if an OpenAI-style endpoint on a compatible service requires `x-api-key`, follow that service. Some compatible implementations may ignore `anthropic-version`.

A successful minimal request only proves that this key, model and endpoint work together. It does not prove that the tool-call, reasoning or streaming capabilities required by a coding tool will also work.

## Protocol compatibility matrix

| Endpoint | Common authentication | Request shape | Best fit | Not guaranteed |
| --- | --- | --- | --- | --- |
| **Chat Completions** | `Authorization: Bearer` | A `messages` array and a mature parameter set | Most OpenAI-compatible clients and chat | Responses-only parameters, or every tool's requirements |
| **Responses** | `Authorization: Bearer` | `input`, `max_output_tokens` and related fields | Codex, OpenCode's OpenAI provider, Copilot CLI in responses mode | Every compatible gateway implements it; changing one parameter is not a workaround |
| **Anthropic Messages** | Usually `x-api-key`; compatible gateways may also accept Bearer | Top-level `system`, `max_tokens`, content blocks and Anthropic semantics | Claude Code, Anthropic SDKs, Copilot CLI's Anthropic provider | OpenAI parameters are not fully equivalent; unsupported fields may be ignored or rejected |

For the same key and model:

- **Whether one key can call several endpoints depends on the gateway.** Some services allow every endpoint; others restrict by protocol, group or key permissions.
- **A model appearing in `/v1/models` does not mean it supports every endpoint.** Confirm that the model has a usable channel in the current group and protocol.
- **Protocol parameters are not guaranteed to be equivalent.** A tool may send a request successfully while the gateway ignores fields, changes tool-call behavior, changes streaming events or returns a different error shape. Trust the actual response and service logs.

## Which one

- **Codex**: use the Responses endpoint and set `base_url` to `https://gateway.example.com/v1`.
- **Claude Code**: use Anthropic Messages and set `ANTHROPIC_BASE_URL` to `https://gateway.example.com`.
- **OpenCode**: the default example uses Responses with `baseURL` set to `https://gateway.example.com/v1`; if the service supports only Chat Completions, use `@ai-sdk/openai-compatible` with the same `/v1` Base URL.
- **GitHub Copilot CLI**: use Chat Completions by default and set the OpenAI-compatible Base URL to `https://gateway.example.com/v1`; set `COPILOT_PROVIDER_WIRE_API=responses` when Responses is required.

::: tip Not sure which one
Check the tool guide first, then use the Base URL table and minimal requests on this page. Do not treat Chat Completions as a universal fallback: Codex needs Responses, and Claude Code needs Anthropic Messages.
:::

## Authentication

- OpenAI Chat Completions and Responses usually use `Authorization: Bearer <your API key>`.
- Anthropic Messages usually uses `x-api-key: <your API key>`; some compatible gateways also accept Bearer.
- Follow the actual service. A wrong authentication header or Base URL can produce `401` or `404`.
