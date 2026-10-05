# OpenCode

Open-source terminal coding assistant with custom OpenAI-compatible providers.

## 1. Install

::: code-group

```bash [npm]
npm install -g opencode-ai
```

```bash [Homebrew]
brew install sst/tap/opencode
```

:::

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key).

## 3. Configure

Edit `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "custom": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Custom Gateway",
      "options": {
        "baseURL": "https://your-gateway.example.com/v1",
        "apiKey": "sk-xxxxxxxx"
      },
      "models": {
        "gpt-5": { "name": "GPT-5" }
      }
    }
  }
}
```

On Windows the file lives at `%USERPROFILE%\\.config\\opencode\\opencode.json`.

## 4. Verify

```bash
opencode run "print hello"
```

## 5. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Provider missing | Wrong config path | Check file name and directory |
| `404` | baseURL missing `/v1` | Add `/v1` |
