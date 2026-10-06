# CodeBuddy (Tencent Cloud Code Assistant)

::: info Tested with
Last verified: 2026-10-06 · Current stable client · official docs https://codebuddy.cn/docs/ide/Features/models

No specific version is pinned; the steps follow the official docs and may differ across releases.
:::

Tencent Cloud's AI coding assistant. It can connect to custom models through a user-level or project-level `models.json` file.

This page uses KunCode as an example. Replace the addresses, keys and model names with your own service's values. See [placeholder conventions](/en/guide/#placeholder-conventions). The CodeBuddy UI and config fields can change between versions; refer to the current client and official docs.

- Website: <https://codebuddy.cn/>
- Product introduction: <https://codebuddy.cn/docs/ide/Introduction>
- Custom models docs: <https://codebuddy.cn/docs/ide/Features/models>

## 1. Install

1. Open the [CodeBuddy website](https://codebuddy.cn/)
2. Download and install the IDE or the editor extension
3. Launch CodeBuddy and sign in

CodeBuddy supports Windows 10 and later. It does not support Windows 7, Windows 8, or Windows 8.1. Check the website for support on other platforms and IDEs.

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key). Note two things:

- **API key** - your service key, e.g. `sk-xxxxxxxx`
- **Full request URL** - the `url` field in the custom-model config must be the complete request path, usually ending in `/chat/completions`, e.g. `https://kuncode.120403.xyz/v1/chat/completions`

::: warning `url` is not a Base URL
CodeBuddy's `models.json` expects `url` to be a complete request path. Do not enter only `https://kuncode.120403.xyz`, and do not enter only `https://kuncode.120403.xyz/v1`; it normally needs to go all the way to `/chat/completions`, for example:

```text
https://kuncode.120403.xyz/v1/chat/completions
```

Follow the actual service endpoint and current official docs.
:::

## 3. Find the config file

CodeBuddy supports two levels of `models.json`:

| Level | Path | Scope |
| --- | --- | --- |
| User | `~/.codebuddy/models.json` | All projects for the current user |
| Project | `.codebuddy/models.json` | The current project |

Project-level config usually takes precedence over user-level config. Check the current client and official docs for the exact merge rules.

## 4. Fill in the config

Add a custom model to `models.json` using the official field format. Common fields include:

| Field | Description |
| --- | --- |
| `id` | Model ID; must exactly match the real model ID returned by the service |
| `apiKey` | API key, e.g. `sk-xxxxxxxx` |
| `url` | Full request path, usually ending in `/chat/completions` |
| `maxInputTokens` | Maximum input tokens; use the model's real limit |
| `maxOutputTokens` | Maximum output tokens; use the model's real limit |
| `supportsToolCall` | Whether the model supports tool calls; use its real capability |

Example structure:

```json
{
  "models": [
    {
      "id": "deepseek-flash",
      "apiKey": "sk-xxxxxxxx",
      "url": "https://kuncode.120403.xyz/v1/chat/completions",
      "maxInputTokens": 128000,
      "maxOutputTokens": 8192,
      "supportsToolCall": true
    }
  ]
}
```

::: tip Field names and structure follow the official docs
The fields above are common entries from the CodeBuddy custom-model documentation. Different versions may use a different top-level structure or extra fields; refer to the current client and the [official docs](https://codebuddy.cn/docs/ide/Features/models).
:::

## 5. Verify

After saving, restart or reload CodeBuddy, then:

1. Select the newly configured model in the model list
2. Start a new conversation and send a simple message such as `print hello`
3. Once it replies, ask it to read a file or perform an operation that requires a tool call

Both chat and tool calls need to work before the setup is considered complete.

## 6. Common settings

### Switch models

Edit or add model entries in `models.json`, then reload the client.

### User-level vs. project-level

Use the project-level `.codebuddy/models.json` when only the current project should use a model. Use the user-level `~/.codebuddy/models.json` when every project should have it.

### Adjust context and output

Set `maxInputTokens` and `maxOutputTokens` to the model's real limits. Too high can make requests fail; too low can truncate context or limit output.

### Tool calls

If the model does not support tool calls, set `supportsToolCall` to `false` or switch to a model that does. CodeBuddy's coding features depend on tool calls, so some features will not work without them.

## 7. Troubleshooting

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Wrong or expired API key | Paste the full key again; make sure there is no extra whitespace |
| `404 Not Found` | Wrong `url`, such as entering only a Base URL or missing `/chat/completions` | Check that `url` is the complete request path and exactly matches the service endpoint |
| Model not found / unavailable | Wrong `id`, or the model is not on your service | Re-enter the ID returned by `/v1/models` |
| Request timeout | Request too large, service slow, or unstable network | Reduce the request, raise the timeout, or retry later |
| Tool calls fail | The model lacks tool-call support, or `supportsToolCall` is wrong | Switch to a model that supports tool calls and set `supportsToolCall` to `true` |

## Advanced: configure multiple models

Add more entries to the model array in `models.json`. Each entry uses its own `id`, `apiKey`, and full `url`. If the service model ID or request path differs, do not reuse the same entry.

::: warning Never commit your key
If the project-level `.codebuddy/models.json` contains an API key, add it to `.gitignore` and never commit it. Mask it in screenshots and shared configs too.
:::
