# Pi

::: info Tested with
Last verified: 2026-10-06 · Pi 0.74.2
:::

A minimal terminal coding agent (`@earendil-works/pi-coding-agent`) that connects to any compatible gateway through `models.json`.

This page uses KunCode as an example. Replace the addresses, keys and model names with your own service's values. See [placeholder conventions](/en/guide/#placeholder-conventions).

- Website: <https://pi.dev>
- GitHub: <https://github.com/earendil-works/pi-mono>

## 1. Install

::: code-group

```bash [npm]
npm install -g @earendil-works/pi-coding-agent
```

```bash [Install script]
curl -fsSL https://pi.dev/install.sh | sh
```

:::

Verify the install:

```bash
pi --version
```

Printing a version number, e.g. `0.74.2`, is enough.

::: tip Windows needs bash
On Windows, Pi depends on bash and looks for it in order: a custom path in `settings.json`, Git Bash (`C:\Program Files\Git\bin\bash.exe`), then `bash.exe` on PATH (Cygwin / MSYS2 / WSL).

[Git for Windows](https://git-scm.com/download/win) is enough for most users. To point at a different shell, set it in `~/.pi/agent/settings.json`:

```json
{
  "shellPath": "C:\\cygwin64\\bin\\bash.exe"
}
```
:::

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key). Note two things:

- **API key** - usually looks like `sk-...`; use whatever format your provider issues
- **API node** - your service address, e.g. `https://kuncode.120403.xyz`

## 3. Find the config file

Pi's custom-model config lives at:

| System | Path |
| --- | --- |
| macOS / Linux | `~/.pi/agent/models.json` |
| Windows | `%USERPROFILE%\.pi\agent\models.json` |

Create the directory or file by hand if it does not exist.

::: tip Other files live in the same directory
`~/.pi/agent/` also holds `settings.json` (default model, theme, shell, and more) and `auth.json` (credentials). This page only edits `models.json`; the default model is set in step 5.
:::

## 4. Fill in the config

Open `models.json` in an editor and add your service under `providers`:

```json
{
  "providers": {
    "kuncode": {
      "baseUrl": "https://kuncode.120403.xyz/v1",
      "api": "openai-completions",
      "apiKey": "sk-xxxxxxxx",
      "models": [
        {
          "id": "deepseek-flash",
          "name": "DeepSeek Flash",
          "contextWindow": 128000,
          "maxTokens": 8192
        }
      ]
    }
  }
}
```

Field reference:

| Field | Description |
| --- | --- |
| `kuncode` | Custom provider ID; any string works |
| `baseUrl` | Your API node + `/v1` |
| `api` | API type, see below |
| `apiKey` | Replace with your own API key |
| `models` | Available models; each entry's `id` is the model ID |

::: tip `api` decides which endpoint is used
- `openai-completions` → `/v1/chat/completions` (most compatible, prefer this)
- `openai-responses` → `/v1/responses`
- `anthropic-messages` → Anthropic Messages endpoint
- `google-generative-ai` → Google Generative AI endpoint

Most OpenAI-compatible gateways work with `openai-completions`.
:::

::: tip baseUrl must end with /v1
In `openai-completions` and `openai-responses` mode, `baseUrl` must be written as `https://kuncode.120403.xyz/v1`.

Pi appends `/chat/completions` or `/responses` itself, so do not write the concrete endpoint.
:::

::: tip `models[].id` must be a real model ID
`models[].id` must exactly match the model ID returned by the service. List available models with:

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```
:::

Each model entry also accepts these optional fields:

| Field | Default | Description |
| --- | --- | --- |
| `name` | same as `id` | Display label; also used for `--model` matching |
| `reasoning` | `false` | Whether the model supports extended thinking |
| `input` | `["text"]` | Input types; use `["text", "image"]` for image support |
| `contextWindow` | `128000` | Context window size in tokens |
| `maxTokens` | `16384` | Maximum output tokens |

## 5. Set the default model (optional)

`models.json` only registers providers and models. To make one the startup default, set it in `~/.pi/agent/settings.json`:

```json
{
  "defaultProvider": "kuncode",
  "defaultModel": "deepseek-flash"
}
```

`defaultProvider` is the provider ID from `models.json` (`kuncode` above); `defaultModel` is the model ID.

This is optional. You can also just pick a model with `/model` or Ctrl+L after launch.

## 6. Verify

First confirm the model is recognized:

```bash
pi --list-models
```

Your provider and model should appear in the output. Then run a one-shot command:

```bash
pi -p "print hello"
```

A normal reply means the setup works.

You can also start the interactive interface:

```bash
pi
```

Select the model with `/model` and ask something.

::: tip `models.json` needs no restart
Pi re-reads `models.json` every time `/model` is opened, so you can switch right after editing.
:::

## 7. Common settings

### Switch models

Use `/model` or Ctrl+L in the interface, or `--model` on the command line:

```bash
pi --model deepseek-flash "Refactor this function"
```

The `provider/id` form works too, so you do not need a separate provider flag:

```bash
pi --model kuncode/deepseek-flash "Refactor this function"
```

### Add more models

Append to the `models` array:

```json
"models": [
  { "id": "deepseek-flash", "name": "DeepSeek Flash" },
  { "id": "gpt-5", "name": "GPT-5" },
  { "id": "claude-sonnet-4-5", "name": "Claude Sonnet 4.5" }
]
```

### Different model ID and display name

`id` is the model name sent to the service; `name` only affects the UI label and `--model` matching. They can differ:

```json
{
  "id": "deepseek-flash",
  "name": "DeepSeek Flash (KunCode)"
}
```

### Keep the key in an environment variable

To avoid writing the key into `models.json`, point `apiKey` at an environment variable name:

```json
"apiKey": "KUNCODE_API_KEY"
```

Then set that variable in your terminal:

```bash
export KUNCODE_API_KEY="sk-xxxxxxxx"
```

```powershell
$env:KUNCODE_API_KEY = "sk-xxxxxxxx"
```

Pi also supports the `"!command"` form, which runs a shell command and uses its stdout as the key (for example, reading from a password manager).

### Configure thinking levels

For models that support extended thinking, use `thinkingLevelMap` to describe the available levels:

```json
{
  "id": "deepseek-v4-pro",
  "reasoning": true,
  "thinkingLevelMap": {
    "minimal": null,
    "low": null,
    "medium": null,
    "high": "high",
    "xhigh": "max"
  }
}
```

A `null` value means the level is unsupported and is hidden in the UI; a string is sent to the provider. Pick one at launch with `--thinking`, or cycle levels in the UI with Shift+Tab.

## 8. Troubleshooting

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Wrong key, or `apiKey` did not take effect | Check that `apiKey` is complete; with the env-var form, make sure the variable is set in the same terminal |
| `404 Not Found` | Wrong `baseUrl` | Confirm it ends with `/v1` and does not repeat the endpoint path |
| Model not found | `models[].id` is not a model your gateway supports | Use an ID returned by `/v1/models` |
| Provider missing from `/model` | Wrong `models.json` path or a JSON syntax error | Confirm the file is at `~/.pi/agent/models.json` and validate the JSON |
| Launch error on Windows | bash not found | Install [Git for Windows](https://git-scm.com/download/win), or set `shellPath` in `settings.json` |
| Tool calls fail | The model lacks tool-call support | Switch to a model that supports tool calls |
| Request timeout | Network, proxy, or upstream issue | Check DNS, proxy, and firewall, or retry with another model |

## Advanced: Anthropic Messages and multiple providers

If your gateway exposes an Anthropic Messages endpoint, set `api` to `anthropic-messages`. In this mode `baseUrl` is the domain only:

```json
{
  "providers": {
    "kuncode-anthropic": {
      "baseUrl": "https://kuncode.120403.xyz",
      "api": "anthropic-messages",
      "apiKey": "sk-xxxxxxxx",
      "models": [
        {
          "id": "claude-sonnet-4-5",
          "reasoning": true,
          "input": ["text", "image"]
        }
      ]
    }
  }
}
```

`providers` can hold several providers side by side, each with its own `baseUrl` and `api`:

```json
{
  "providers": {
    "kuncode": {
      "baseUrl": "https://kuncode.120403.xyz/v1",
      "api": "openai-completions",
      "apiKey": "sk-xxxxxxxx",
      "models": [{ "id": "deepseek-flash" }]
    },
    "kuncode-anthropic": {
      "baseUrl": "https://kuncode.120403.xyz",
      "api": "anthropic-messages",
      "apiKey": "sk-xxxxxxxx",
      "models": [{ "id": "claude-sonnet-4-5" }]
    }
  }
}
```

::: warning The key is stored in plain text
Keys in `models.json` are stored in plain text. Never commit the file with keys to Git, and mask it in screenshots and screen shares. Prefer the "keep the key in an environment variable" approach above.
:::

---

::: tip Found an error or outdated content?
These docs track tool releases. Please [open an issue](https://github.com/MY-Final/kuncode-docs/issues/new), or use "Edit this page on GitHub" in the footer to submit a fix.
:::
