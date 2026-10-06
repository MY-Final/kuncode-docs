# Codex

::: info Tested with
Last verified: 2026-10-07 · Codex CLI 0.160.0
:::

OpenAI's official CLI. With a custom provider you can point Codex at any compatible gateway.

This page uses KunCode as an example. Replace the addresses, keys and model names with your own service's values. See [placeholder conventions](/en/guide/#placeholder-conventions).

## 1. Install

::: code-group

```bash [npm]
npm install -g @openai/codex
```

```bash [Homebrew]
brew install codex
```

:::

Check the install:

```bash
codex --version
```

Any version string works, e.g. `codex-cli 0.144.6`.

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key). Note two things:

- **API key** - usually looks like `sk-...`; use whatever format your provider issues
- **API endpoint** - your service address, e.g. `https://kuncode.120403.xyz`

## 3. Find the config file

Codex reads its config from `.codex/config.toml` in your home directory:

| OS | Path |
| --- | --- |
| macOS / Linux | `~/.codex/config.toml` |
| Windows | `%USERPROFILE%\.codex\config.toml` |

On Windows you can paste `%USERPROFILE%\.codex` into the File Explorer address bar:

![Codex config file location](/images/codex/config-file.png)

Create a `config.toml` if it does not exist yet.

## 4. Fill in the config

Open `config.toml` in an editor and write:

```toml
model_provider = "custom"
model = "deepseek-flash"
model_reasoning_effort = "xhigh"

[model_providers.custom]
name = "KunCode"
base_url = "https://kuncode.120403.xyz/v1"
wire_api = "responses"
requires_openai_auth = true
experimental_bearer_token = "sk-xxxxxxxx"
```

![Filled Codex config](/images/codex/config-content.png)

Only a few values need changing:

| Field | Meaning |
| --- | --- |
| `model` | The model to use; must exist on the service |
| `base_url` | Your API endpoint plus `/v1` |
| `experimental_bearer_token` | Replace with your own API key |
| `name` | Display name for the provider; anything you like |

::: tip base_url must end with /v1
Write `base_url` as `https://kuncode.120403.xyz/v1`.

Codex appends `/responses` itself, so do not write `/v1/responses`.
:::

::: warning The key is stored in plain text
This approach keeps the key in `config.toml` as plain text. So:

- Never commit `config.toml` to Git
- Mask the key before sharing a screenshot

Prefer environment variables? Use the `env_key` field instead (see Advanced below).
:::

::: info The extra lines in the screenshot
`disable_response_storage` and `model_catalog_json` in the screenshot are added by the CC Switch import. You do not need them for a manual setup.
:::

## 5. Verify

From any directory:

```bash
codex exec "print hello"
```

![Codex verification succeeded](/images/codex/verify-success.png)

A normal reply means the setup works. The output also echoes the active model, provider and reasoning effort, which is handy for confirming the config took effect.

## 6. Common settings

### Switch models

Change the `model` field:

```toml
model = "gpt-5"
```

List the available models with:

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

### Adjust reasoning effort

`model_reasoning_effort` controls how hard the model thinks:

| Value | Meaning |
| --- | --- |
| `minimal` | Least thinking, fastest |
| `low` | Low |
| `medium` | Medium |
| `high` | High |
| `xhigh` | Highest |

```toml
model_reasoning_effort = "xhigh"
```

::: tip Not every model supports it
Only reasoning models honour this field. Others ignore it.
:::

## 7. Troubleshooting

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Key missing or wrong | Check `experimental_bearer_token` holds the full key |
| `404 Not Found` | Wrong `base_url` | Must end with `/v1` and support the Responses API |
| Unknown model | Model not available | Use a model from `/v1/models` |
| Connection timeout | Network or proxy | Check DNS, proxy and firewall |
| Config ignored | Wrong file path | Must be `~/.codex/config.toml`, not `codex.toml` |

## Advanced: keep the key in an environment variable

To avoid storing the key in the config file:

```toml
[model_providers.custom]
name = "KunCode"
base_url = "https://kuncode.120403.xyz/v1"
wire_api = "responses"
env_key = "KUNCODE_API_KEY"
```

Then set the variable:

::: code-group

```bash [macOS / Linux]
export KUNCODE_API_KEY="sk-xxxxxxxx"
```

```powershell [Windows PowerShell]
$env:KUNCODE_API_KEY = "sk-xxxxxxxx"
```

:::

To persist it, add the export to `~/.zshrc` or `~/.bashrc`, or set a system environment variable on Windows.

## Advanced: import with CC Switch

If you already use [CC Switch](/en/guide/cc-switch) to manage providers, skip the manual config:

1. Open the service's **API Keys** page and find your token
2. Click **Import to CC Switch**
3. Choose the **Codex** app and pick a model
4. Click **Open CC Switch**; the config is written for you

The result is the same as the manual setup above, just without the typing.

## Advanced: Codex++ desktop enhancements (third party)

::: warning Unofficial tool - audit the source first
Codex++ is not an OpenAI product and is not a standalone AI coding client. It targets Codex Desktop by modifying or injecting into the desktop app, running local scripts and installing update watchers to extend the UI, accounts and provider configuration. Install only from a repository with auditable source; avoid builds with no source or an unknown publisher.
:::

The official OpenAI documentation does not document a supported injection API for Codex Desktop. For KunCode, prefer the Codex CLI `config.toml` setup above. Consider Codex++ only if you specifically need a translated desktop UI, account switching or graphical provider management.

Projects to investigate:

| Project | Platform / status | Notes |
| --- | --- | --- |
| [xianyu110/CodexPlusPlus](https://github.com/xianyu110/CodexPlusPlus) | Windows / macOS, active | Uses an external launcher and CDP injection; claims not to modify `app.asar`. Its relay-injection mode writes a custom provider into `~/.codex/config.toml`. |
| [b-nnett/codex-plusplus](https://github.com/b-nnett/codex-plusplus) | Original project, archived | Early tweak system that patches `app.asar`; last code update was 2026-06-08. Not recommended for new installs. |

::: danger Avoid untrusted release packages
Do not use untrusted packages that advertise "skip official login" or "unlock the plugin marketplace." Those features may violate terms, expose account credentials or break Codex updates. Never commit an API key to Git, paste it into an issue, or hand it to an unaudited third-party script.
:::

---

::: tip Found an error or outdated content?
These docs track tool releases. Please [open an issue](https://github.com/MY-Final/kuncode-docs/issues/new), or use "Edit this page on GitHub" in the footer to submit a fix.
:::
