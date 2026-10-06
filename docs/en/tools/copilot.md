# GitHub Copilot CLI

::: info Tested with
Last verified: 2026-10-06 · GitHub Copilot CLI 1.0.91
:::

GitHub's official terminal coding assistant. With BYOK (Bring Your Own Key) you can point its model requests at any compatible gateway.

This page uses KunCode as an example. Replace the addresses, keys and model names with your own service's values. See [placeholder conventions](/en/guide/#placeholder-conventions). No screenshots are needed here; everything is configured from the terminal.

## 1. Install

::: code-group

```bash [npm]
npm install -g @github/copilot
```

```powershell [WinGet]
winget install GitHub.Copilot
```

```bash [Homebrew]
brew install --cask copilot-cli
```

:::

Check the install:

```bash
copilot --version
```

Any version string works, e.g. `GitHub Copilot CLI 1.0.91.`.

::: tip Windows requires PowerShell 6+
On Windows, Copilot CLI requires PowerShell 6 or later. Run `$PSVersionTable.PSVersion` to check.
:::

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key). Note two things:

- **API key** - usually looks like `sk-...`; use whatever format your provider issues
- **API endpoint** - your service address, e.g. `https://kuncode.120403.xyz`

## 3. Configure BYOK

Copilot CLI has no separate `config.toml`; it reads the custom provider from environment variables. Set these **before starting `copilot`**:

::: code-group

```bash [macOS / Linux]
export COPILOT_PROVIDER_BASE_URL="https://kuncode.120403.xyz/v1"
export COPILOT_PROVIDER_TYPE="openai"
export COPILOT_PROVIDER_API_KEY="sk-xxxxxxxx"
export COPILOT_MODEL="deepseek-flash"
```

```powershell [Windows PowerShell]
$env:COPILOT_PROVIDER_BASE_URL = "https://kuncode.120403.xyz/v1"
$env:COPILOT_PROVIDER_TYPE = "openai"
$env:COPILOT_PROVIDER_API_KEY = "sk-xxxxxxxx"
$env:COPILOT_MODEL = "deepseek-flash"
```

:::

Field reference:

| Variable | Meaning |
| --- | --- |
| `COPILOT_PROVIDER_BASE_URL` | Your API endpoint plus `/v1`; also the switch that enables BYOK |
| `COPILOT_PROVIDER_TYPE` | `openai` for any OpenAI-compatible endpoint; see below for Azure and Anthropic |
| `COPILOT_PROVIDER_API_KEY` | Replace with your own API key |
| `COPILOT_MODEL` | The model ID to use; must match what `/v1/models` returns |
| `COPILOT_PROVIDER_WIRE_API` | Optional: `completions` (default) or `responses` |

::: tip base URL must include /v1
Write `COPILOT_PROVIDER_BASE_URL` as `https://kuncode.120403.xyz/v1`.

Copilot CLI appends `/chat/completions` or `/responses` itself, so do not point it at a concrete endpoint.
:::

::: tip The wire API decides the endpoint
- `completions` → `/v1/chat/completions` (default)
- `responses` → `/v1/responses`

If your gateway or model works better over the Responses API (for example the GPT-5 series), set:

```bash
export COPILOT_PROVIDER_WIRE_API="responses"
```

```powershell
$env:COPILOT_PROVIDER_WIRE_API = "responses"
```
:::

::: tip Authentication
With `COPILOT_PROVIDER_TYPE=openai`, Copilot CLI sends `COPILOT_PROVIDER_API_KEY` in the `Authorization: Bearer` header, matching most compatible gateways.

BYOK does not require a GitHub login, but GitHub integrations such as the GitHub MCP server, issues and pull requests still do.
:::

::: warning The key lives in plain-text environment variables
The key is stored in plain text in your environment or shell profile:

- Never commit a file containing the key to Git
- Mask it before sharing a screenshot
:::

## 4. Verify

From any directory:

```bash
copilot -p "print hello"
```

A normal reply means the setup works.

You can also start the interactive UI:

```bash
copilot
```

Then send any message. If it keeps asking you to log in, the BYOK variables were not set in the terminal that launched `copilot`; check the names and make sure it is the same shell.

::: tip When tool calls are needed
In non-interactive `-p` mode, tasks that read files or run commands need explicit tool permission:

```bash
copilot -p "list the current directory" --allow-all-tools
```

Plain chat does not need that flag.
:::

## 5. Common settings

### Switch models

Change `COPILOT_MODEL`:

```bash
export COPILOT_MODEL="gpt-5"
```

```powershell
$env:COPILOT_MODEL = "gpt-5"
```

List the available models with:

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

### When the model ID differs from the upstream model name

Some gateways expose an internal model ID that differs from the name forwarded upstream. Set both:

```bash
export COPILOT_MODEL="gpt-5"
export COPILOT_PROVIDER_MODEL_ID="gpt-5"
export COPILOT_PROVIDER_WIRE_MODEL="gpt-5-2025-08-07"
```

`COPILOT_PROVIDER_MODEL_ID` is used to match Copilot CLI's built-in capabilities and token limits, while `COPILOT_PROVIDER_WIRE_MODEL` is the name actually sent upstream. For most gateways the two are identical, so you can skip this.

### Persist the environment variables

Variables set this way only last for the current terminal. To keep them:

- macOS / Linux: add the exports to `~/.zshrc` or `~/.bashrc`
- Windows: add them to your PowerShell `$PROFILE`

Print the profile path with:

```powershell
$PROFILE
```

### Multiple providers

To manage several providers, Copilot CLI supports the user-level registry `~/.copilot/providers.json`, or point `COPILOT_PROVIDERS_CONFIG` at another location.

When that file declares any provider or model, it takes precedence over the `COPILOT_PROVIDER_*` environment variables. See the official examples with:

```bash
copilot help providers
```

## 6. Troubleshooting

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Wrong key, or the variables did not take effect | Check `COPILOT_PROVIDER_API_KEY` is complete and launch `copilot` in the same terminal |
| `404 Not Found` | Wrong `BASE_URL`, or the wire API does not match the gateway | It must end with `/v1`; `responses` uses `/v1/responses`, `completions` uses `/v1/chat/completions` |
| Unknown model | `COPILOT_MODEL` is not served by the gateway | Use a model ID from `/v1/models` |
| Keeps asking to log in | BYOK variables are missing in the current terminal | Set them again and launch `copilot` in the same terminal |
| Tool calls fail | The model lacks tool-call support | Switch to a model that supports tool calling |
| Request timeout | Network, proxy or upstream issue | Check DNS, proxy and firewall, or retry with another model |

## Advanced: Anthropic and Azure

If your gateway exposes the Anthropic Messages endpoint, set the provider type to `anthropic`. Note that Anthropic provider mode uses a different Base URL convention: enter the domain only here, while OpenAI mode still uses the `/v1` value shown above.

```bash
export COPILOT_PROVIDER_TYPE="anthropic"
export COPILOT_PROVIDER_BASE_URL="https://kuncode.120403.xyz"
export COPILOT_PROVIDER_API_KEY="sk-xxxxxxxx"
export COPILOT_MODEL="claude-sonnet-4-5"
```

For Azure OpenAI use `COPILOT_PROVIDER_TYPE=azure` and follow the official requirements for `COPILOT_PROVIDER_AZURE_API_VERSION`, `COPILOT_PROVIDER_MODEL_ID` and `COPILOT_PROVIDER_WIRE_MODEL`. Run `copilot help providers` for the full variable list.
