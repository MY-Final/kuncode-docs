# Cline

An open-source AI coding assistant used as a VS Code extension and a desktop app. It reaches any compatible gateway through an OpenAI Compatible provider.

This page uses KunCode as the example. Swap in your own service address and it works the same. Cline is a graphical tool: everything is configured in the extension's settings panel, with no config file to edit.

- Website: <https://cline.bot/>
- Docs: <https://docs.cline.bot/>
- Repository: <https://github.com/cline/cline>

## 1. Install

Cline is an editor extension. Install it from the VS Code Marketplace rather than the command line:

1. Open VS Code
2. Open the Extensions panel
3. Search for `Cline`
4. Click Install

Cline also offers a standalone desktop app, downloadable from the website.

::: tip Other editors
Cline primarily targets VS Code. Check the website for support in other editors.
:::

After installing, a Cline icon appears in the VS Code sidebar. Click it to open the panel.

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key). Note two things:

- **API key** - starts with `sk-`
- **Base URL** - your service address, e.g. `https://kuncode.120403.xyz/v1`

## 3. Configure the provider

Open the Cline panel, go to Settings, and choose **OpenAI Compatible** as the API Provider.

Then fill in three fields:

| Field | Value |
| --- | --- |
| Base URL | Your service address, e.g. `https://kuncode.120403.xyz/v1` |
| API Key | Your key, e.g. `sk-xxxxxxxx` |
| Model ID | The model ID to use, e.g. `deepseek-flash` |

::: tip Use the full Base URL
The OpenAI Compatible provider expects a full Base URL that can be requested directly. If your service requires `/v1`, include it, e.g. `https://kuncode.120403.xyz/v1`.
:::

::: tip The Model ID must be a real model ID
The Model ID must exactly match the ID the API returns. List them with:

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```
:::

Field names and locations can change between versions; refer to the current extension UI.

## 4. Verify

Once saved, type a simple message in the Cline panel, for example:

```
print hello
```

A normal reply means the setup works. Then ask it to read a file or run a command to confirm tool calls work too.

## 5. Common settings

### Switch models

Change the Model ID in settings to another available model. You do not need to reconfigure the Base URL or key.

### Adjust context and output

Cline lets you set a context window and maximum output length per model. If you hit context limits or truncated output, adjust these two values; refer to the current extension UI.

### Multiple providers

Cline can store several provider profiles and switch between them from the top of the panel. For team setups, never put the key in a file that gets committed.

## 6. Troubleshooting

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Wrong or expired API key | Paste the full key again; make sure there is no extra whitespace |
| `404 Not Found` | Wrong Base URL | Use the full address; include `/v1` if your service needs it |
| Model not found / unavailable | Wrong Model ID, or the model is not on your service | Re-enter the ID from `/v1/models` |
| Request timeout | Request too large or service slow | Reduce the request, raise the timeout, or retry later |
| Tool calls fail | Model lacks tool-call support | Switch to a model that supports tool calls |

## Advanced: use the Anthropic or Responses API

Cline's OpenAI Compatible provider uses the Chat Completions API. If your service or model works better with another API, choose the matching provider type under API Provider. The list of providers Cline supports changes between versions; refer to the current extension UI.

::: warning Never commit your key
If you export or share your Cline configuration, strip the API key first. Mask it in screenshots too.
:::
