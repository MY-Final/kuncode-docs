# Goose

::: info Tested with
Last verified: 2026-10-06 · Goose 1.53.0
:::

An open-source local AI agent with a desktop app, CLI, and API. It can connect to compatible gateways through OpenAI Compatible, Anthropic Compatible, Ollama, or custom providers.

This page uses KunCode as an example. Replace the addresses, keys and model names with your own service's values. See [placeholder conventions](/en/guide/#placeholder-conventions).

## 1. Install

Goose officially supports native Windows installation and WSL. On Windows, the official PowerShell script is recommended:

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/aaif-goose/goose/main/download_cli.ps1" -OutFile "download_cli.ps1"
.\download_cli.ps1
```

You can also use Git Bash / MSYS2:

```bash
curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash
```

If `goose` is not found after installation, add `%USERPROFILE%\.local\bin` to PATH and reopen the terminal.

Check the install:

```bash
goose --version
```

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key). Note two things:

- **API key** - for example `sk-xxxxxxxx`
- **Service root address** - for example `https://kuncode.120403.xyz`

For an OpenAI-compatible gateway, the service root usually goes into `OPENAI_HOST`, and the API path goes into `OPENAI_BASE_PATH`. How to split them depends on the current Goose interface and official docs.

## 3. Find the config file

Goose's main config file is `config.yaml`:

| OS | Path |
| --- | --- |
| macOS / Linux | `~/.config/goose/config.yaml` |
| Windows | `%APPDATA%\Block\goose\config\config.yaml` |

You can also start with interactive configuration:

```bash
goose configure
```

It guides you through choosing a provider, entering credentials, and selecting a model. Menu labels depend on the current Goose version.

::: warning Do not put the API key in config.yaml
Goose does not read provider API keys from `config.yaml`. Prefer `goose configure` so the key goes into the system credential store, or provide it through an environment variable.
:::

## 4. Fill in the config

For an OpenAI-compatible provider, the common environment variables are:

| Variable | Meaning |
| --- | --- |
| `OPENAI_HOST` | Service address, for example `https://kuncode.120403.xyz` |
| `OPENAI_BASE_PATH` | API path, for example `v1/chat/completions` |
| `OPENAI_API_KEY` | Your API key |
| `GOOSE_PROVIDER` | Set to `openai` |
| `GOOSE_MODEL` | The model ID to use |

In PowerShell:

```powershell
$env:OPENAI_HOST = "https://kuncode.120403.xyz"
$env:OPENAI_BASE_PATH = "v1/chat/completions"
$env:OPENAI_API_KEY = "sk-xxxxxxxx"
$env:GOOSE_PROVIDER = "openai"
$env:GOOSE_MODEL = "deepseek-flash"
```

In Bash / Git Bash / WSL:

```bash
export OPENAI_HOST="https://kuncode.120403.xyz"
export OPENAI_BASE_PATH="v1/chat/completions"
export OPENAI_API_KEY="sk-xxxxxxxx"
export GOOSE_PROVIDER="openai"
export GOOSE_MODEL="deepseek-flash"
```

For a custom provider, Goose also supports configuring OpenAI Compatible, Anthropic Compatible, and other types in `goose configure`. Use the current Goose interface and official docs for the exact entries and fields.

::: tip Check OPENAI_BASE_PATH first for 404s
A 404 in Goose is commonly caused by a wrong `OPENAI_BASE_PATH`, not by the key. Make sure it matches the final request path your provider expects, with no duplicated or missing `/v1`.
:::

## 5. Add the API key

Prefer `goose configure` so the key is stored in the system credential store. On Windows, if you hit a keyring error, use an environment variable instead:

```powershell
$env:OPENAI_API_KEY = "sk-xxxxxxxx"
goose configure
```

When Goose detects the environment variable, it uses it as the credential source. To persist it, add the variable to your system environment or PowerShell profile.

::: warning Never commit the key
Environment variables and `config.yaml` may be synced or screenshotted. Do not put the key in a project repository, and mask it in screenshots.
:::

## 6. Verify

Start a session:

```bash
goose session
```

Then type:

```text
print hello
```

A normal reply means the provider, model, and credentials are working. You can also inspect the current configuration first with `goose info -v`.

## 7. Common settings

### View the current config

```bash
goose info -v
```

### Reconfigure the provider

```bash
goose configure
```

Choose Configure Providers and follow the prompts to update the provider, credentials, and model. Menu labels depend on the current Goose version.

### Switch models

Inside an interactive session, use `/model` to view or switch the current model:

```text
/model
```

You can also set `GOOSE_MODEL` and restart the session.

### Adjust the output limit

```bash
export GOOSE_MAX_TOKENS=8192
```

For the default and supported range, see the official Goose docs.

## 8. Troubleshooting

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Missing, wrong, or unset API key | Check `OPENAI_API_KEY`, then run `goose configure` or `goose info -v` |
| `404 Not Found` | Wrong `OPENAI_BASE_PATH` | Most common cause; make sure it exactly matches the final request path your provider expects |
| Model not found | Wrong model ID, or the server does not expose it | Check the `id` from `/v1/models`, then update `GOOSE_MODEL` |
| Request timeout | Unreachable network, missing proxy, or an oversized request | Check DNS, proxy, and firewall settings, then retry with a smaller request |
| Tool calls fail | The model does not support tool calls | Switch to a model that supports tool calls, and make sure the gateway does not strip tool-call parameters |

Official resources:

- Repository: https://github.com/aaif-goose/goose
- Docs: https://goose-docs.ai/

---

::: tip Found an error or outdated content?
These docs track tool releases. Please [open an issue](https://github.com/MY-Final/kuncode-docs/issues/new), or use "Edit this page on GitHub" in the footer to submit a fix.
:::
