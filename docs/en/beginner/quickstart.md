# 15-Minute Minimal Setup: From API Key to Tool Calls

::: tip Shortest path
This page is the shortest path to getting a compatible gateway working in OpenCode. To understand API keys, Base URLs, and protocol endpoints first, start with [Core concepts](/en/guide/). To use a free model, see [Free and trial models](/en/beginner/free-models).
:::

This page uses the same placeholder values throughout. Do not rename them halfway through:

| Item | Fixed value used on this page |
| --- | --- |
| API node | `https://gateway.example.com` |
| API key | `sk-your-key` |
| Model ID | `deepseek-flash` |
| Demo tool | OpenCode |

::: warning These are not real credentials
`sk-your-key` and `gateway.example.com` are placeholders. Replace the API node, key, and model ID with the values from your provider before you run anything. Never commit a real key to Git or paste it into a chat.
:::

## Prepare three things

You need a service address, an API key, and a model ID. If you do not have a key or do not know the model ID, start with [Prepare an API key](/en/guide/api-key). The model ID must exactly match the `id` returned by `/v1/models`.

**Success looks like:** You can write down the three real values and map them to `https://gateway.example.com`, `sk-your-key`, and `deepseek-flash` on this page.

## Step 1: Confirm the key and address work

```bash
curl https://gateway.example.com/v1/models -H "Authorization: Bearer sk-your-key"
```

On Windows PowerShell, if `curl` is not recognized, use `curl.exe` instead. For paths, PowerShell, and CMD differences, see [Windows: read this first](/en/beginner/windows).

**Success looks like:** The response is a JSON model list, and the `data` array contains `deepseek-flash`:

```json
{
  "object": "list",
  "data": [
    {
      "id": "deepseek-flash",
      "object": "model"
    }
  ]
}
```

If you get `401`, check the key first. If you get `404`, check the API node and whether `/v1` is correct. See [Errors and troubleshooting](/en/guide/errors) for more.

## Step 2: Send a minimal request

This page starts with Chat Completions because it is the most widely supported compatibility endpoint:

```bash
curl https://gateway.example.com/v1/chat/completions -H "Authorization: Bearer sk-your-key" -H "Content-Type: application/json" -d '{"model":"deepseek-flash","messages":[{"role":"user","content":"Reply with exactly: OK"}],"max_tokens":16}'
```

If your service only supports Responses, do not force this command. Use the Responses example in [Choose an endpoint](/en/guide/endpoints) instead.

**Success looks like:** The JSON response has `"model": "deepseek-flash"` and `choices[0].message.content` contains `OK`:

```json
{
  "id": "chatcmpl-example",
  "object": "chat.completion",
  "model": "deepseek-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "OK"
      },
      "finish_reason": "stop"
    }
  ]
}
```

This step only proves that the key, address, model, and Chat Completions endpoint work. It does not prove that tool calls work.

## Step 3: Install OpenCode

```bash
npm install -g opencode-ai
```

After installation, confirm that the command is available:

```bash
opencode --version
```

**Success looks like:** You see a version number such as `1.18.34`. If `npm` is missing, install Node.js LTS first. If `opencode` is not found, close and reopen your terminal and try again.

## Step 4: Write the config

OpenCode's global configuration file lives here:

| OS | Path |
| --- | --- |
| macOS / Linux | `~/.config/opencode/opencode.json` |
| Windows | `%USERPROFILE%\.config\opencode\opencode.json` |

If you are on Windows and want to open or create this file in PowerShell, read [Windows: read this first](/en/beginner/windows) first. Open `opencode.json` in an editor and write the complete configuration:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "gateway": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Example Gateway",
      "options": {
        "baseURL": "https://gateway.example.com/v1"
      },
      "models": {
        "deepseek-flash": {
          "name": "DeepSeek Flash"
        }
      }
    }
  }
}
```

**Success looks like:** The file saves without JSON syntax errors; `baseURL` ends with `/v1`, and the key under `models` is `deepseek-flash`.

::: tip Why openai-compatible?
`@ai-sdk/openai-compatible` uses `/v1/chat/completions`, which has the broadest compatibility. If you know your service supports Responses, you can switch to `@ai-sdk/openai`, but keep the Base URL as `https://gateway.example.com/v1`. See [Choose an endpoint](/en/guide/endpoints).
:::

## Step 5: Add the key

Do not put the key in the configuration file. Start OpenCode:

```bash
opencode
```

In the interface, type:

```text
/connect
```

Select `Example Gateway`, then paste `sk-your-key`.

**Success looks like:** After the connection completes, the interface returns to the chat input. If you run `/connect` again, this provider is already connected and does not ask you to select it and enter the key again.

## Step 6: Verify tool calls

Create a real file first, then ask OpenCode to read it:

```bash
node -e "require('fs').writeFileSync('quickstart-check.txt','The quickstart tool-call check passed.')"
opencode run "Read quickstart-check.txt. Quote its exact contents, then summarize it in one sentence. Do not modify any files."
```

**Success looks like:** OpenCode's reply includes the exact file content `The quickstart tool-call check passed.` and a one-sentence summary based on it. If it only says "I read it" without quoting the content, the check has not passed. You can delete the temporary file after verification.

## You are done when...

All six steps below pass:

- [ ] Step 1: `/v1/models` returns `deepseek-flash`
- [ ] Step 2: Chat Completions returns `OK`
- [ ] Step 3: `opencode --version` prints a version number
- [ ] Step 4: `opencode.json` uses `@ai-sdk/openai-compatible` and `https://gateway.example.com/v1`
- [ ] Step 5: `/connect` saves `sk-your-key`
- [ ] Step 6: OpenCode quotes the real contents of `quickstart-check.txt`

If any step fails, do not change several things at once. Follow [Get help when setup fails](/en/beginner/help) to copy the error in the recommended order, decide who to ask, and continue troubleshooting.

## Next

- [First use: chat, read files, edit code, run tests](/en/guide/usage)
- [Full OpenCode setup and troubleshooting](/en/tools/opencode)
- [Get help when setup fails](/en/beginner/help)
