# Qwen Code

::: info Tested with
Last verified: 2026-10-06 · Qwen Code 0.25.0
:::

An open-source terminal coding assistant that speaks OpenAI, Anthropic, Gemini and other protocols, and can reach any compatible gateway through a custom provider.

This page uses KunCode as an example. Replace the addresses, keys and model names with your own service's values. See [placeholder conventions](/en/guide/#placeholder-conventions).

::: warning The Qwen OAuth free tier is gone
The Qwen OAuth free tier was discontinued on **2026-04-15**, and it is no longer an option in `/auth`. Use an Alibaba Cloud ModelStudio Coding Plan, or an API key from a third-party compatible service instead.
:::

## 1. Install

Requires **Node.js 22 or later**. The official standalone PowerShell installer does not need Node.

::: code-group

```powershell [Windows one-liner]
irm https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen-standalone.ps1 | iex
```

```bash [npm]
npm install -g @qwen-code/qwen-code@latest
```

```bash [Homebrew]
brew install qwen-code
```

:::

Restart your terminal after installing, then check:

```bash
qwen --version
```

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key). Note two things:

- **API key** - usually looks like `sk-...`; use whatever format your provider issues
- **API endpoint** - your service address, e.g. `https://kuncode.120403.xyz`

## 3. Find the config file

Qwen Code reads its user-level config from:

| OS | Path |
| --- | --- |
| macOS / Linux | `~/.qwen/settings.json` |
| Windows | `%USERPROFILE%\.qwen\settings.json` |

Create the directory or file if it does not exist.

::: tip You can also keep it per project
Besides the user-level config, Qwen Code also reads `.qwen/settings.json` from a project root, applying it only to that project.

The official docs recommend defining `modelProviders` in the user-level `~/.qwen/settings.json` to avoid merge conflicts between project and user settings.
:::

## 4. Fill in the config

Open `settings.json` and add your service under `modelProviders`:

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "deepseek-flash",
        "name": "DeepSeek Flash",
        "baseUrl": "https://kuncode.120403.xyz/v1",
        "envKey": "KUNCODE_API_KEY",
        "wireApi": "chat-completions"
      }
    ]
  },
  "security": {
    "auth": {
      "selectedType": "openai"
    }
  },
  "model": {
    "name": "deepseek-flash"
  }
}
```

Field reference:

| Field | Meaning |
| --- | --- |
| `modelProviders` | Declares available models per protocol; the keys `openai` / `anthropic` / `gemini` / `vertex-ai` are the protocols |
| `id` | Model ID; must match the ID the API returns exactly |
| `name` | Display name in the `/model` picker; optional, defaults to `id` |
| `baseUrl` | Your API endpoint, with whatever path the protocol requires |
| `envKey` | Name of the environment variable holding the key; when omitted, the protocol default is used (e.g. `OPENAI_API_KEY`) |
| `wireApi` | OpenAI-compatible request format: `chat-completions` or `responses` |
| `security.auth.selectedType` | Default protocol on startup: `openai` / `anthropic` / `gemini` |
| `model.name` | Default model on startup; must match one of the `id` values |

::: tip Not sure which protocol to use
Start with `openai` + `chat-completions`, which is the most compatible. If your service prefers Responses, change `wireApi` to `responses`.

For Anthropic or Gemini, follow the qwen-code version you have installed and the official docs.
:::

::: tip You can also use the interactive `/auth`
If you would rather not write the config by hand, start `qwen`, run `/auth`, and pick **Custom Provider**. Follow the prompts for the protocol (OpenAI / Anthropic / Gemini and so on), `baseUrl`, model ID and API key. The flow writes the result into `settings.json`, with the same field meanings as above.

Menu labels and fields follow the qwen-code version you have installed and the official docs.
:::

::: tip id must be a real model ID
The `id` must match the model IDs the API returns exactly. List them with:

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```
:::

## 5. Add the key

Qwen Code does not store the key in the config; it reads it from an environment variable named by `envKey`.

**Option 1: environment variable (recommended)**

::: code-group

```powershell [Windows PowerShell]
$env:KUNCODE_API_KEY = "sk-xxxxxxxx"
```

```bash [macOS / Linux]
export KUNCODE_API_KEY="sk-xxxxxxxx"
```

:::

**Option 2: the `env` field in `settings.json` (lowest priority)**

```json
{
  "env": {
    "KUNCODE_API_KEY": "sk-xxxxxxxx"
  }
}
```

Key precedence, highest to lowest: CLI flags, system environment, `.env` files, then the `env` field in `settings.json`.

::: warning Never commit your key
If you put the key in `settings.json` or `.env`, keep it out of Git and mask it in screenshots. For project-local secrets, prefer `.qwen/.env` and add it to `.gitignore`.
:::

## 6. Verify

Start Qwen Code:

```bash
qwen
```

Then type:

```
/doctor
```

Check that the auth method and model are what you expect, pick the model you configured with `/model`, and send any message. A normal reply means the setup works.

You can also verify with a single headless command:

```bash
qwen -p "print hello"
```

## 7. Common settings

### Add more models

Just keep appending to the array for that protocol:

```json
"openai": [
  {
    "id": "deepseek-flash",
    "name": "DeepSeek Flash",
    "baseUrl": "https://kuncode.120403.xyz/v1",
    "envKey": "KUNCODE_API_KEY",
    "wireApi": "chat-completions"
  },
  {
    "id": "gpt-5",
    "name": "GPT-5",
    "baseUrl": "https://kuncode.120403.xyz/v1",
    "envKey": "KUNCODE_API_KEY",
    "wireApi": "responses"
  }
]
```

Use `/model` to switch between them; your selection persists across sessions.

### Mix multiple protocols

`modelProviders` can declare several protocols at once, for example `openai`, `anthropic` and `gemini` side by side, and you switch with `/model`. Each protocol has its own credential variable and request format; follow the qwen-code version you have installed and the official docs.

### Adjust timeout and retries

`generationConfig` tunes timeout, retry count and similar options per model:

```json
{
  "id": "deepseek-flash",
  "name": "DeepSeek Flash",
  "baseUrl": "https://kuncode.120403.xyz/v1",
  "envKey": "KUNCODE_API_KEY",
  "wireApi": "chat-completions",
  "generationConfig": {
    "timeout": 600000,
    "maxRetries": 2
  }
}
```

Field names and defaults can change between versions; follow the qwen-code version you have installed and the official docs.

## 8. Troubleshooting

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors). Start with `/doctor` to confirm the active auth method and model.

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Environment variable not loaded, or wrong key | Run `/doctor` to inspect credentials; make sure the variable named by `envKey` is the one you set |
| `404 Not Found` | Wrong `baseUrl` | Check the protocol, path and trailing slash against what your service expects |
| Model not found | `id` does not match the API's model name | Check the real model ID with `/v1/models`; `id` must match exactly |
| Request timeout | Default timeout too short | Raise `generationConfig.timeout` |
| Tool calls fail | Model lacks tool-call support | Switch to a model that supports tool calls |

## Advanced: manage the key with `.env`

If you would rather not put the key in `settings.json`, drop a `.qwen/.env` in your project:

```bash
KUNCODE_API_KEY=sk-xxxxxxxx
```

Qwen Code loads it automatically, and `.qwen/.env` is less likely to clash with other tools than `.env`. Remember to add it to `.gitignore`.

For more options, see the [Qwen Code official docs](https://qwenlm.github.io/qwen-code-docs/).
