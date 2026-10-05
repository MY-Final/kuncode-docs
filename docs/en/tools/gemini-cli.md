# Google Gemini CLI

::: info Tested with
Last verified: 2026-10-06 · Gemini CLI 0.62.0
:::

Google's open-source terminal AI assistant, with support for Google account login, Gemini API keys, and Vertex AI.

::: warning Scope
Gemini CLI primarily uses Google's Gemini protocol. It is **not** a general OpenAI / Anthropic-compatible gateway client. This page shows a general Gemini CLI configuration, but whether it works depends on whether your service provides a native Gemini protocol endpoint.

If your service only provides OpenAI Chat Completions, Responses, or Anthropic Messages, use the corresponding tool page instead. Do not treat Gemini CLI as a client for any compatible gateway.
:::

This page uses `https://kuncode.120403.xyz` as an example address. Swap in your own service address. Before configuring it, confirm with your provider that it offers a Gemini API-compatible endpoint, and check the exact model IDs and authentication method it supports.

Official resources:

- Repository: https://github.com/google-gemini/gemini-cli
- Website: https://www.geminicli.com/
- Installation: https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/installation.mdx
- Configuration reference: https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md

## 1. Install

Gemini CLI officially requires:

| Item | Requirement |
| --- | --- |
| Windows | Windows 11 24H2 or later |
| Node.js | 20.0.0 or later |
| Shell | Bash, Zsh, or PowerShell |
| Network | Access to the Gemini API or your compatible service |

Install it globally with npm:

```bash
npm install -g @google/gemini-cli
```

Official alternatives include Homebrew, MacPorts, Anaconda, npx, and containers. Use the [installation guide](https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/installation.mdx) for the current commands.

Check the install:

```bash
gemini --version
```

## 2. Prepare an API key

Gemini CLI supports several authentication methods:

- **Google account login** - best for local interactive use. Google offers a free tier; quotas and rate limits are subject to the official terms.
- **Gemini API key** - for a Google AI Studio key, or a Gemini API-compatible key from your provider.
- **Vertex AI** - for Google Cloud users; it requires additional project and service-account configuration.

If you use a third-party compatible service, confirm that it provides a **native Gemini protocol endpoint**, not only an OpenAI- or Anthropic-compatible endpoint. A service that only provides the latter cannot be used directly with Gemini CLI through this setup.

Note two things:

- **API key** - the key from your provider.
- **Gemini API root address** - only needed for a third-party Gemini API-compatible service, for example `https://kuncode.120403.xyz`.

You can get an official Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey). When using the official service, you do not need to set a custom base URL.

## 3. Find the config file

Gemini CLI uses JSON settings files. Common locations:

| Scope | OS | Path |
| --- | --- | --- |
| User | macOS / Linux | `~/.gemini/settings.json` |
| User | Windows | `%USERPROFILE%\.gemini\settings.json` |
| Project | All | `.gemini/settings.json` in the project root |

Project settings take precedence over user settings. Create the directory or file if it does not exist.

Put credentials and endpoint overrides in environment variables or a `.env` file:

| Scope | Path |
| --- | --- |
| User | `~/.gemini/.env` or `%USERPROFILE%\.gemini\.env` |
| Project | `.gemini/.env` in the project root |

Gemini CLI searches upward from the current directory for `.env`, then falls back to `.gemini/.env` in your home directory. Environment variables and command-line arguments take precedence over `settings.json`.

::: warning Never commit secrets
`.env` files, project config, and logs may contain sensitive information. Do not commit API keys to a repository, and mask them in screenshots.
:::
## 4. Fill in the config

Open `settings.json` and set the default model:

```json
{
  "model": {
    "name": "YOUR_GEMINI_MODEL_ID"
  }
}
```

Replace `YOUR_GEMINI_MODEL_ID` with the Gemini model ID or alias your provider actually exposes. Do not put an OpenAI or Anthropic model name here.

Field reference:

| Field | Meaning |
| --- | --- |
| `model.name` | Default Gemini model used by Gemini CLI |
| `model.maxSessionTurns` | Maximum number of turns retained in a session; `-1` means unlimited |

If your provider requires a specific Gemini API version, set `GOOGLE_GENAI_API_VERSION` as described in the official configuration reference. Check your provider's documentation for whether it is required and which value to use.

::: tip The model name must match the authentication mode
With a Google AI Studio key, use a model name that follows the Gemini API naming convention. With a third-party service, use a model ID from the provider's Gemini-compatible model list.
:::

## 5. Add credentials

### Use a Gemini API key

Set the environment variables before starting Gemini CLI.

::: code-group

```powershell [PowerShell]
$env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
$env:GOOGLE_GEMINI_BASE_URL = "https://kuncode.120403.xyz"
gemini
```

```bash [Bash / Git Bash]
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
export GOOGLE_GEMINI_BASE_URL="https://kuncode.120403.xyz"
gemini
```

:::

Then select **Use Gemini API key** in the authentication UI. Exact UI wording depends on the current Gemini CLI version.

- With the official Gemini API, do not set `GOOGLE_GEMINI_BASE_URL`.
- With a third-party Gemini API-compatible service, set `GOOGLE_GEMINI_BASE_URL` to the Gemini API root address provided by the service.
- `GOOGLE_GEMINI_BASE_URL` only applies to `gemini-api-key` authentication. Except for `localhost`, `127.0.0.1`, and `[::1]`, Google requires it to use HTTPS.
- If the provider's address includes a version path such as `/v1beta`, enter it exactly as documented. Whether it is needed depends on the actual service.

### Persist it in `.env`

To avoid setting the variables every time, put them in `.gemini/.env`:

```dotenv
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GOOGLE_GEMINI_BASE_URL=https://kuncode.120403.xyz
```

When using the official Gemini API, remove the `GOOGLE_GEMINI_BASE_URL` line.

### Use Vertex AI

Vertex AI uses a different set of variables, such as `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, `GOOGLE_APPLICATION_CREDENTIALS`, and `GOOGLE_VERTEX_BASE_URL`. Do not mix these with the Gemini API key configuration. Follow the official authentication guide for the exact steps.

## 6. Verify

First check the version:

```bash
gemini --version
```

Start the interactive interface:

```bash
gemini
```

When prompted, select **Use Gemini API key**, then enter:

```text
print hello
```

A normal reply means authentication and the basic request path work.

Then verify a tool call by asking it to read a file in the current project:

```text
Read README.md and summarize it in one sentence.
```

If the CLI asks for permission to read the file or run a tool, confirm it. Reading the file and returning a result means the tool-call path also works. For non-interactive use, you can run `gemini -p "..."`, but authentication must already be configured through environment variables.
## 7. Common settings

### Switch models temporarily

Specify a model at startup:

```bash
gemini --model YOUR_GEMINI_MODEL_ID
```

The short form works too:

```bash
gemini -m YOUR_GEMINI_MODEL_ID
```

Available aliases and models depend on the current Gemini CLI version and your provider's supported models.
### Change the default model

Edit `settings.json`:

```json
{
  "model": {
    "name": "YOUR_GEMINI_MODEL_ID"
  }
}
```

Use the user-level file for personal defaults, or the project-level `.gemini/settings.json` for settings that apply only to one project.

### Limit session turns

To limit how many context turns a session keeps:

```json
{
  "model": {
    "maxSessionTurns": 50
  }
}
```

`-1` means unlimited. The actual context length is still limited by the model's context window.
### Gemini API vs. Vertex AI

| Mode | Main variables | Notes |
| --- | --- | --- |
| Gemini API key | `GEMINI_API_KEY`, `GOOGLE_GEMINI_BASE_URL` | For a Google AI Studio key or a Gemini API-compatible service |
| Vertex AI | `GOOGLE_CLOUD_PROJECT`, `GOOGLE_VERTEX_BASE_URL`, and others | For Google Cloud / Vertex AI; configuration is different |

::: warning Do not treat it as a general compatible gateway
Gemini CLI only works with the native Gemini protocol or Vertex AI. To connect through OpenAI Chat Completions, Responses, or Anthropic Messages, use a tool such as OpenCode, Crush, or Goose that supports the relevant protocol.
:::

## 8. Troubleshooting

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Missing, wrong, or expired API key, or the current shell did not load the environment variable | Confirm `GEMINI_API_KEY` is set; restart the terminal or reload `.env`; select **Use Gemini API key** in the auth UI |
| `404 Not Found` | Wrong `GOOGLE_GEMINI_BASE_URL`, or the provider has no native Gemini endpoint | Confirm the provider offers a Gemini API-compatible endpoint; check the root address and API version path; remove the variable when using the official service |
| Model not found | Wrong model ID, or the provider does not expose that model | Use a Gemini-compatible model ID from the provider; confirm the current authentication mode can access it |
| Request timeout | Network, proxy, or firewall blocking access, or a slow service | Check proxy, DNS, and firewall settings; retry with a smaller request; check the provider status page and official docs |
| Tool calls fail | The model does not support tool calls, or the compatible service does not forward tool-related fields | Switch to a Gemini model that supports tool calls; confirm the provider supports native Gemini tool calling |
| Region or quota restriction | The current region is unsupported, or the free quota or rate limit is exhausted | Check Gemini Code Assist supported locations, Gemini API quotas, and provider limits; use official billing or another service if needed |

Official resources:

- Installation: https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/installation.mdx
- Authentication: https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/authentication.mdx
- Configuration reference: https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md
- Quotas and pricing: https://github.com/google-gemini/gemini-cli/blob/main/docs/resources/quota-and-pricing.md
