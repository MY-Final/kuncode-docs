# Claude Code

Anthropic's official CLI, pointed at any compatible service through a custom gateway.

This page uses KunCode as the example. Swap in your own service address and it works the same.

## 1. Install

::: code-group

```bash [npm]
npm install -g @anthropic-ai/claude-code
```

```bash [Homebrew]
brew install --cask claude-code
```

:::

Check the install:

```bash
claude --version
```

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key). Note two things:

- **API key** - starts with `sk-`
- **API endpoint** - your service address, e.g. `https://kuncode.120403.xyz`

## 3. Find the config file

Claude Code reads its user-level settings from:

| OS | Path |
| --- | --- |
| macOS / Linux | `~/.claude/settings.json` |
| Windows | `%USERPROFILE%\.claude\settings.json` |

Create the directory or file if it does not exist.

::: tip Why prefer the settings file
Besides plain environment variables, Claude Code accepts the gateway address and key in the `env` block of `settings.json`.

The advantage is that background agents pick it up too, instead of depending on the terminal that launched Claude Code.
:::

## 4. Fill in the config

Open `settings.json` and write:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://kuncode.120403.xyz",
    "ANTHROPIC_AUTH_TOKEN": "sk-xxxxxxxx",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-flash",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-flash",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-flash"
  }
}
```

Field reference:

| Field | Meaning |
| --- | --- |
| `ANTHROPIC_BASE_URL` | Your API endpoint; the domain only, no `/v1` |
| `ANTHROPIC_AUTH_TOKEN` | Replace with your own API key |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Model ID the `sonnet` alias actually calls |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Model ID the `opus` alias actually calls |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Model ID the `haiku` alias actually calls, also used for titles and other background tasks |

::: tip base URL must not include /v1
Claude Code appends `/v1/messages` itself, so write the domain only, e.g. `https://kuncode.120403.xyz`.
:::

::: tip Why map all three aliases
Claude Code sends requests under the `sonnet` / `opus` / `haiku` aliases, and the main session and background tasks do not use the same one.

If your gateway only serves non-Claude models such as `deepseek-flash`, point all three aliases at the same model ID so no request asks for a missing model.

The model ID must exactly match what `/v1/models` returns:

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```
:::

::: tip Which credential variable
- `ANTHROPIC_AUTH_TOKEN` - sent as `Authorization: Bearer <token>`
- `ANTHROPIC_API_KEY` - sent as `x-api-key: <key>`

Use whichever your gateway reads. If unsure, try `ANTHROPIC_AUTH_TOKEN` first and switch on `401`.
:::

## 5. Verify

Start Claude Code:

```bash
claude
```

Then type:

```
/status
```

Check two lines:

- `Anthropic base URL` shows your gateway address
- `Auth token` or `API key` shows the credential you configured

Send any prompt afterwards; a normal reply means the setup works.

You can also verify with a single command:

```bash
claude -p "print hello"
```

## 6. Common settings

### Pin a single model

If one model is enough, set `ANTHROPIC_MODEL` directly instead of mapping the aliases:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://kuncode.120403.xyz",
    "ANTHROPIC_AUTH_TOKEN": "sk-xxxxxxxx",
    "ANTHROPIC_MODEL": "deepseek-flash"
  }
}
```

### Give the model a display name

After alias mapping, `/model` shows the model ID by default. Use `_NAME` for a friendlier label:

```json
{
  "env": {
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-flash",
    "ANTHROPIC_DEFAULT_SONNET_MODEL_NAME": "DeepSeek Flash"
  }
}
```

`OPUS` and `HAIKU` accept the same `_NAME` and `_DESCRIPTION` suffixes.

### Adjust reasoning effort

Claude Code controls thinking depth through effort, with `low`, `medium`, `high`, `xhigh` and `max`:

```json
{
  "env": {
    "CLAUDE_CODE_EFFORT_LEVEL": "high"
  }
}
```

You can also switch it for the current session with `/effort`.

### Silence the unrecognized-model warning

If startup prints `[claude-code:unrecognized_model]`, map the gateway model ID to itself with `modelOverrides`:

```json
{
  "modelOverrides": {
    "deepseek-flash": "deepseek-flash"
  }
}
```

### Correct the context window

When a gateway model's context window differs from the built-in value for its name, set it explicitly:

```json
{
  "env": {
    "CLAUDE_CODE_MAX_CONTEXT_TOKENS": "200000"
  }
}
```

Use your model's real window.

## 7. Troubleshooting

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Key not applied, or wrong credential variable | Check `/status`; try `ANTHROPIC_AUTH_TOKEN` and `ANTHROPIC_API_KEY` the other way round |
| `404 Not Found` | `ANTHROPIC_BASE_URL` includes a path | Use the domain only, without `/v1` or `/v1/messages` |
| Unknown model | An alias maps to a model the gateway does not serve | Point `ANTHROPIC_DEFAULT_*_MODEL` at an ID from `/v1/models` |
| Login screen keeps appearing | Credentials not read | Check the variable names and the `settings.json` path, then restart the terminal |
| Request timeout | Network or proxy | Check DNS, proxy and firewall |
| Model missing from `/model` | Not in the built-in list | Add it with `ANTHROPIC_CUSTOM_MODEL_OPTION` or `modelOverrides` |

## Advanced: configure with environment variables

If you would rather not write `settings.json`, set the values in the current terminal only:

::: code-group

```bash [macOS / Linux]
export ANTHROPIC_BASE_URL="https://kuncode.120403.xyz"
export ANTHROPIC_AUTH_TOKEN="sk-xxxxxxxx"
export ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-flash"
```

```powershell [Windows PowerShell]
$env:ANTHROPIC_BASE_URL = "https://kuncode.120403.xyz"
$env:ANTHROPIC_AUTH_TOKEN = "sk-xxxxxxxx"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "deepseek-flash"
```

:::

To persist them, add the lines to your shell profile (`~/.zshrc`, `~/.bashrc`) or your PowerShell `$PROFILE`.

::: warning The key is stored in plain text
Whether it lives in `settings.json` or an environment variable, the key is plain text. So:

- Never commit a file containing the key to Git
- Mask the key in screenshots
:::