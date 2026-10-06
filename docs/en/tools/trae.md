# Trae

::: info Tested with
Last verified: 2026-10-06 · Current stable client · official docs https://docs.trae.ai/ide/models; Trae CN not verified

No specific version is pinned; the steps follow the official docs and may differ across releases.
:::

An AI coding IDE / editor that can connect to a compatible gateway through a custom model.

This page uses KunCode as an example. Replace the addresses, keys and model names with your own service's values. See [placeholder conventions](/en/guide/#placeholder-conventions). The Trae UI changes between versions; use the current client for the exact menu names and field locations.

- Website: <https://www.trae.ai/>
- Custom models docs: <https://docs.trae.ai/ide/models>
- Download: <https://www.trae.ai/download>

::: tip Trae CN vs. the international edition
Whether Trae CN has the same features as the international edition has not been verified. If you use the CN client, follow the current client and official documentation rather than assuming the two are configured identically.
:::

## 1. Install

1. Open the [Trae download page](https://www.trae.ai/download)
2. Download and install the Windows version. The official site currently lists Windows 10/11 support
3. Launch Trae and sign in

For macOS and other platforms, follow the download page.

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key). Note two things:

- **API key** - your service key, e.g. `sk-xxxxxxxx`
- **Service address** - either a Base URL or a full request URL, e.g. `https://kuncode.120403.xyz/v1`

## 3. Add a custom model

Open the model-management settings in Trae and find the entry for adding a custom model (the exact label depends on the current client). Then choose the API format supported by your service:

- **OpenAI Chat Completions** - suitable for most OpenAI-compatible gateways
- **Anthropic Messages** - suitable for services that expose the Anthropic Messages API

The fields usually include:

| Field | Value |
| --- | --- |
| API format | `OpenAI Chat Completions` or `Anthropic Messages` |
| URL / Base URL | A full request URL or a Base URL, depending on the field prompt |
| API key | Your key, e.g. `sk-xxxxxxxx` |
| Model ID | The real model ID on the service, e.g. `deepseek-flash` |

Common address examples:

- OpenAI Chat Completions full URL: `https://kuncode.120403.xyz/v1/chat/completions`
- Anthropic Messages full URL: `https://kuncode.120403.xyz/v1/messages`
- If the UI only asks for a Base URL, follow its prompt and enter the service address, commonly `https://kuncode.120403.xyz/v1`

::: warning Follow the field prompt for the URL format
Trae may ask for a full URL or only a Base URL. Do not mix the two: if it asks for a full URL, enter the complete request path; if it asks for a Base URL, enter the service root address. When in doubt, check the official docs or the current client.
:::

::: tip The Model ID must be a real model ID
The Model ID must exactly match the ID returned by the API. List available models with:

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

If your service uses Anthropic-style authentication, use `x-api-key` as required by the service.
:::

Field names, protocol options and save locations can change between versions; refer to the current client.

## 4. Verify

After saving:

1. Select the newly added model in the model list
2. Start a new conversation and send a simple message such as `print hello`
3. Once it replies, ask it to read a file or perform an operation that requires a tool call

Both chat and tool calls need to work before the setup is considered complete.

## 5. Common settings

### Switch models

Switch to another saved model in the model list. You do not need to re-enter the API key.

### Adjust context and output

If the custom-model UI provides context-window or maximum-output fields, enter values that match the real model capabilities. If unsure, use the values from the official model documentation or keep the defaults.

### Add multiple custom models

Repeat the same flow for additional models or services. Each model uses its own Model ID; if the service address or key differs, configure those separately.

### Choose Chat Completions or Messages

Use the protocol your service explicitly supports. Do not assume the same model supports both Chat Completions and Anthropic Messages; check the service response and [API endpoints](/en/guide/endpoints).

## 6. Troubleshooting

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Wrong or expired API key, or the wrong authentication header | Paste the full key again; for Anthropic APIs, check whether `x-api-key` is required |
| `404 Not Found` | Wrong URL path, such as a missing `/v1`, an extra path segment, or mixing a full URL with a Base URL | Compare the complete request path with the official docs; Chat Completions and Messages use different paths |
| Model not found / unavailable | Wrong Model ID, or the model is not on your service | Re-enter the ID returned by `/v1/models` |
| Request timeout | Request too large, service slow, or unstable network | Reduce the request, raise the timeout, or retry later |
| Tool calls fail | The model lacks tool-call support, or the API format does not match | Switch to a model that supports tool calls and confirm the service protocol |

## Advanced: full URL vs. Base URL

If your service supports multiple endpoints, first check [API endpoints](/en/guide/endpoints) and [Models and capabilities](/en/guide/models) to confirm which API the model actually supports. Trae field names and URL joining behavior can change between versions; the current client and official docs are authoritative.

::: warning Never commit your key
Do not put the API key in files that get committed to Git, screenshots, or shared configurations. Mask it in screenshots.
:::

---

::: tip Found an error or outdated content?
These docs track tool releases. Please [open an issue](https://github.com/MY-Final/kuncode-docs/issues/new), or use "Edit this page on GitHub" in the footer to submit a fix.
:::
