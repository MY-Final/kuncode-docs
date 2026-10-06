# Kilo Code

::: info Tested with
Last verified: 2026-10-06 · Current stable extension · official docs https://kilocode.ai/docs/

No specific version is pinned; the steps follow the official docs and may differ across releases.
:::

An open-source AI coding assistant used as a VS Code / JetBrains extension. It supports OpenAI Compatible, OpenAI Responses, and Anthropic Messages APIs, and reaches any compatible gateway.

This page uses KunCode as an example. Replace the addresses, keys and model names with your own service's values. See [placeholder conventions](/en/guide/#placeholder-conventions). Kilo Code is a graphical tool: everything is configured in the extension's settings panel, with no config file to edit.

- Docs: <https://kilocode.ai/docs/>
- Repository: <https://github.com/Kilo-Org/kilocode>

## 1. Install

Kilo Code is an editor extension. Install it from the editor's marketplace rather than the command line:

1. Open VS Code or a JetBrains IDE
2. Open the extension / plugin marketplace
3. Search for `Kilo Code`
4. Click Install

After installing, a Kilo Code icon appears in the editor sidebar. Click it to open the panel.

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key). Note two things:

- **API key** - usually looks like `sk-...`; use whatever format your provider issues
- **Base URL** - your service address, e.g. `https://kuncode.120403.xyz/v1`

## 3. Configure the provider

Open the Kilo Code panel, go to settings, choose an API Provider, and fill in three fields:

| Field | Value |
| --- | --- |
| Base URL | Your service address, e.g. `https://kuncode.120403.xyz/v1` |
| API Key | Your key, e.g. `sk-xxxxxxxx` |
| Model | The model to use, e.g. `deepseek-flash` |

Kilo Code supports three APIs. Pick the one that matches your service or model:

| API type | When to use |
| --- | --- |
| OpenAI Compatible | The service only supports Chat Completions (`/v1/chat/completions`) |
| OpenAI Responses | The service supports Responses (`/v1/responses`) |
| Anthropic Messages | The service speaks Anthropic Messages (`/v1/messages`) |

::: tip It reads the model list automatically
Kilo Code can fetch `/v1/models` from the Base URL automatically. Once the Base URL and key are set, the model list is pulled in, so you can pick a model instead of typing a model ID.
:::

::: tip Use the full Base URL
If your service requires `/v1`, include it, e.g. `https://kuncode.120403.xyz/v1`. If automatic model discovery fails, check this address first.
:::

Field names and locations can change between versions; refer to the current extension UI.

## 4. Verify

Once saved, type a simple message in the Kilo Code panel, for example:

```
print hello
```

A normal reply means the setup works. Then ask it to read a file or run a command to confirm tool calls work too.

## 5. Common settings

### Switch models

The model list is fetched automatically; switch models directly in the list. You do not need to change the Base URL or key.

### Enter a model manually

If you would rather not use the fetched list, you can type a model ID manually. It must match the ID returned by `/v1/models`.

### Adjust context and output

Kilo Code lets you set a context window and maximum output length per model. If you hit context limits or truncated output, adjust these values; refer to the current extension UI.

## 6. Troubleshooting

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Wrong or expired API key | Paste the full key again; make sure there is no extra whitespace |
| `404 Not Found` | Wrong Base URL or wrong API type | Use the full address; make sure the API type matches the service |
| Model not found / list will not load | Bad Base URL or key, so `/v1/models` fails | Confirm `/v1/models` returns data with curl first |
| Request timeout | Request too large or service slow | Reduce the request, raise the timeout, or retry later |
| Tool calls fail | Model lacks tool-call support, or API type mismatch | Switch to a model that supports tool calls, or use the matching API type |

## Advanced: choose the right API type

One service may support several APIs. If one fails, try another:

- A Chat Completions-only service: choose **OpenAI Compatible**
- A service that prefers Responses: choose **OpenAI Responses**
- Anthropic-family models or services: choose **Anthropic Messages**

::: warning Never commit your key
If you export or share your Kilo Code configuration, strip the API key first. Mask it in screenshots too.
:::

---

::: tip Found an error or outdated content?
These docs track tool releases. Please [open an issue](https://github.com/MY-Final/kuncode-docs/issues/new), or use "Edit this page on GitHub" in the footer to submit a fix.
:::
