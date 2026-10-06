# VS Code + GitHub Copilot BYOK

::: info Tested with
Last verified: 2026-10-06 · Current stable VS Code · official docs https://code.visualstudio.com/docs/copilot/customization/language-models

No specific version is pinned; the steps follow the official docs and may differ across releases.
:::

Use GitHub Copilot Chat in VS Code with a custom model service through BYOK (Bring Your Own Key) or a **Custom endpoint**. VS Code itself is free; model usage is billed by the provider you choose. Some Copilot features still require a GitHub account or subscription; refer to the official documentation for details.

This page uses KunCode as an example. Replace the addresses, keys and model names with your own service's values. See [placeholder conventions](/en/guide/#placeholder-conventions). The configuration UI can change between VS Code releases; use the current VS Code version and the official documentation as the source of truth.

- Official docs: <https://code.visualstudio.com/docs/copilot/customization/language-models>
- Organization BYOK docs: <https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/use-your-own-api-keys>

## 1. Prerequisites

Before you start, make sure you have:

- A current version of VS Code installed
- The GitHub Copilot extension installed and Copilot Chat available
- A working API key
- An endpoint URL from your provider, e.g. `https://kuncode.120403.xyz/v1`
- The model ID you want to use, and confirmation that the model supports tool calling if you need it

VS Code BYOK supports built-in providers and a **Custom endpoint**. A custom endpoint can use the Chat Completions, Responses or Messages API, configured with an API key and an endpoint URL. The exact endpoint path depends on the API type and on what your provider and VS Code require.

::: warning Organization BYOK is currently in public preview
Organization-level BYOK is currently in public preview, so features and availability can change. Organization administrators should follow GitHub's official documentation. Whether the option appears for you depends on your account and VS Code version.
:::

## 2. Install and sign in

1. Open VS Code
2. Search for and install the GitHub Copilot extension from the Extensions view
3. Sign in with your GitHub account when VS Code prompts you
4. Confirm that Copilot Chat opens correctly

Even if you only plan to use a BYOK model, a GitHub account may still be required to enable Copilot Chat. Availability of GitHub-related features depends on your account and subscription. For the exact sign-in and permission requirements, refer to the VS Code and GitHub documentation.

## 3. Prepare an API key

See [Prepare an API key](/en/guide/api-key). Note two things:

- **API key** - the key from your provider, e.g. `sk-xxxxxxxx`
- **Endpoint URL / Base URL** - your service address, e.g. `https://kuncode.120403.xyz/v1`

Replace the endpoint URL with your own service address. If VS Code asks for a full endpoint URL, add the path that matches your API type.

## 4. Configure BYOK / Custom endpoint

Follow the language model management steps in the official VS Code documentation, open the model management entry, and choose BYOK or **Custom endpoint**. The exact button names and menu locations can change between versions; refer to the current UI.

Common fields:

| Field | Value |
| --- | --- |
| API type | Chat Completions, Responses or Messages |
| Endpoint URL / Base URL | e.g. `https://kuncode.120403.xyz/v1`; replace with your own address |
| API key | Your provider key, e.g. `sk-xxxxxxxx` |
| Model ID | The model ID to use; it must match the ID returned by the service |
| Provider name | Optional; used to distinguish multiple custom services in VS Code, subject to the current UI |

The common full request paths for each API type are below, but your provider and VS Code ultimately decide what is required:

| API type | Common full path |
| --- | --- |
| Chat Completions | `https://kuncode.120403.xyz/v1/chat/completions` |
| Responses | `https://kuncode.120403.xyz/v1/responses` |
| Messages | `https://kuncode.120403.xyz/v1/messages` |

::: tip Endpoint URL vs Base URL
If the field accepts a Base URL, it usually goes up to `/v1`. If it requires a full Endpoint URL, include the concrete API path. Do not mix the two; follow the field hint and the official documentation.
:::

::: warning Never commit your key
The API key may be stored in plain text in VS Code or in system credentials. Never commit a file that contains the key, and mask it before sharing screenshots or configuration.
:::

## 5. Select a model

After configuration, choose the model you just added from the VS Code model picker.

- If VS Code can load the model list automatically, select from the list
- If you must enter it manually, the Model ID must match what the service returns
- For file access, command execution or similar tasks, choose a model that supports tool calling

List the available models with:

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

If the service requires Anthropic Messages authentication, adjust the headers and path according to the provider documentation. For model and protocol differences, see [Models and capabilities](/en/guide/models) and [Choose an endpoint](/en/guide/endpoints).

## 6. Verify

In Copilot Chat, first send a simple message, for example:

```text
print hello
```

A normal reply means the custom endpoint and API key are working.

Then start a task that needs tool calling, using whatever method the current VS Code version supports, such as asking it to read a file or run a command. This confirms the model works for coding scenarios. Tool-call entry points and permission prompts can differ between VS Code versions; refer to the current UI.

## 7. Common settings

### Switch models

Use the model picker to switch to another configured model, or change the Model ID in the custom endpoint. Send another message after switching to confirm it works.

### Adjust the API type

If the service supports several APIs, choose the matching type according to the official documentation:

- Chat Completions: the common OpenAI-compatible API
- Responses: for services or models that support the Responses API
- Messages: for Anthropic Messages-compatible endpoints

A mismatch between the API type and path usually causes a `404` or a request-format error.

### Multiple custom services

If the UI supports multiple providers, add each service with its own endpoint URL and API key, then switch from the model picker. Do not reuse the wrong key across services.

### Security

- Never put the API key in project files or commit it to Git
- Rotate keys regularly in the provider console
- If a key leaks, revoke it immediately and update the VS Code configuration

## 8. Troubleshooting

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Wrong or expired API key, or authentication does not match the service | Re-enter the full key; confirm the API type and authentication method match the provider |
| `404 Not Found` | Wrong endpoint URL or API type | Check the Base URL / full path convention and confirm the API type matches the service |
| Model not found | Wrong Model ID, or the model is not available on this service | Re-enter the ID returned by `/v1/models` |
| Request timeout | Network, proxy, slow service or a large request | Check DNS, proxy and firewall; reduce the request or retry later |
| Tool calls fail | The model does not support tool calling, or its capabilities were not recognized correctly | Switch to a model that supports tool calling and check the model configuration in VS Code |
| BYOK not taking effect | The custom model is not selected, the configuration was not saved, or your account/version does not support the entry point | Confirm the custom model is selected in Copilot Chat; reopen model management to check the configuration, and upgrade VS Code if needed |
