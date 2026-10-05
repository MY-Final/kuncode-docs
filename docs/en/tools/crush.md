# Crush

::: info Tested with
Last verified: 2026-10-06 · Crush 0.97.1
:::

An open-source terminal coding assistant from Charm that can connect to custom gateways through OpenAI-compatible or Anthropic-compatible providers.

This page uses KunCode as the example. Swap in your own service address and it works the same.

## 1. Install

Crush supports Windows, macOS, and Linux. On Windows you can install it with winget, scoop, or npm, or download a binary from GitHub Releases.

::: code-group

```powershell [winget]
winget install charmbracelet.crush
```

```powershell [scoop]
scoop bucket add charm https://github.com/charmbracelet/scoop-bucket.git
scoop install crush
```

```bash [npm]
npm install -g @charmland/crush
```

```text [binary]
Download the archive for your platform from https://github.com/charmbracelet/crush/releases, extract it, and put the executable in your PATH.
```

:::

Check the install:

```bash
crush --version
```

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key). Note two things:

- **API key** - for example `sk-xxxxxxxx`
- **Service root address** - for example `https://kuncode.120403.xyz`

For a third-party compatible gateway, the Crush provider URL is usually the root address plus `/v1`, for example `https://kuncode.120403.xyz/v1`.

## 3. Find the config file

Crush now primarily uses a Bash-style `crushrc`. The older `crush.json` format is still supported, but it is legacy and new features go into `crushrc`.

| Scope | OS | Path |
| --- | --- | --- |
| Global | macOS / Linux | `~/.config/crush/crushrc` |
| Global | Windows | `%USERPROFILE%\.config\crush\crushrc` |
| Project | All | `.crushrc` or `crushrc` in the project root |

Project config takes precedence over global config. Create the directory or file if it does not exist.

::: warning crushrc is a trusted config file
`crushrc` runs when Crush starts, so it is effectively a local script. Do not download or run configs you have not reviewed.
:::

## 4. Fill in the config

You can run Crush provider commands directly, or put the same settings into `crushrc`. The commands below include the `crush` prefix; when writing them into `crushrc`, remove that prefix.

```bash
crush provider add kuncode --name "KunCode" --type openai-compat --base-url "https://kuncode.120403.xyz/v1" --discover-models true
```

Key parameters:

| Parameter | Meaning |
| --- | --- |
| `kuncode` | Provider ID; any string works |
| `--type openai-compat` | Third-party OpenAI-compatible gateway, such as KunCode |
| `--type openai` | Official OpenAI API; do not use this type for a third-party compatible gateway |
| `--base-url` | Compatible gateway URL, usually ending in `/v1` |
| `--discover-models true` | Try to discover the model list automatically |

Crush also supports provider types such as `anthropic` and `ollama`. For the current type list and flags, use `crush --help`, `crush provider add --help`, and the official config docs.

If discovery fails, register a model manually:

```bash
crush model add kuncode/<model-id> --name "<display name>"
```

`<model-id>` must exactly match the `id` returned by `/v1/models`. The equivalent `crushrc` form is:

```bash
provider add kuncode \
  --name "KunCode" \
  --type openai-compat \
  --base-url "https://kuncode.120403.xyz/v1" \
  --discover-models true

model add kuncode/deepseek-flash --name "DeepSeek Flash"
```

## 5. Add the API key

`crush provider add` supports `--api-key`. Prefer keeping the key in an environment variable and letting Crush read it, so you do not commit a plaintext secret to Git.

::: code-group

```powershell [PowerShell]
$env:KUNCODE_API_KEY = "sk-xxxxxxxx"
crush provider add kuncode --name "KunCode" --type openai-compat --base-url "https://kuncode.120403.xyz/v1" --api-key $env:KUNCODE_API_KEY --discover-models true
```

```bash [Bash / Git Bash]
export KUNCODE_API_KEY="sk-xxxxxxxx"
crush provider add kuncode --name "KunCode" --type openai-compat --base-url "https://kuncode.120403.xyz/v1" --api-key "$KUNCODE_API_KEY" --discover-models true
```

:::

If you put the provider into `crushrc`, you can read the key from the environment:

```bash
provider add kuncode \
  --type openai-compat \
  --base-url "https://kuncode.120403.xyz/v1" \
  --api-key "${KUNCODE_API_KEY:?set KUNCODE_API_KEY}" \
  --discover-models true
```

::: warning Never commit the key
`crushrc`, project config, and logs may all contain sensitive information. Do not commit the key to Git, and mask it in screenshots.
:::

## 6. Verify

Start Crush:

```bash
crush
```

Select `KunCode` and your model in the interface, then type:

```text
print hello
```

A normal reply means the setup works. Menu names and shortcuts depend on the current Crush version.

If startup or a request fails, check the logs first:

```bash
crush logs
```

## 7. Common settings

### Auto-discover models

Enable model discovery for an `openai-compat` provider:

```bash
provider add kuncode \
  --type openai-compat \
  --base-url "https://kuncode.120403.xyz/v1" \
  --discover-models true
```

### Add model metadata manually

If discovery cannot find a model, or you need to set its context window, register it manually:

```bash
model add kuncode/deepseek-flash \
  --name "DeepSeek Flash" \
  --context-window 128000
```

### Adjust the request timeout

The default request timeout is 60 seconds. Raise it when starting Crush for long requests:

```bash
crush --timeout 300
```

`--timeout` is in seconds. For streaming requests, it is measured as idle time between new chunks.

### View logs

```bash
crush logs
crush logs --tail 500
crush logs --follow
```

## 8. Troubleshooting

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Missing, wrong, or expired API key | Recheck the environment variable and `--api-key`, and make sure the key is still valid |
| `404 Not Found` | Wrong provider type or `--base-url` | Use `--type openai-compat` for a third-party gateway, and make sure the URL ends with `/v1` |
| Model not found | Wrong model ID, or discovery did not find it | Check the ID from `/v1/models`, then rerun with `--discover-models true` or use `crush model add` |
| Request timeout | Default timeout is too short, or the network is unreachable | Raise `option request-timeout` and check DNS, proxy, and firewall settings |
| Tool calls fail | The model does not support tool calls | Switch to a model that supports tool calls, and make sure the gateway does not strip tool-call parameters |

Official resources:

- Repository: https://github.com/charmbracelet/crush
- Website: https://charm.sh/crush
