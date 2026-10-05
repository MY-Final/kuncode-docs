# Codex

OpenAI's official CLI, pointed at any compatible gateway through a custom provider.

## 1. Install

::: code-group

```bash [npm]
npm install -g @openai/codex
```

```bash [Homebrew]
brew install codex
```

:::

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key).

## 3. Configure

Edit `~/.codex/config.toml`:

```toml
model = "gpt-5"
model_provider = "custom"

[model_providers.custom]
name = "custom"
base_url = "https://your-gateway.example.com/v1"
env_key = "CUSTOM_API_KEY"
wire_api = "responses"
```

::: code-group

```bash [macOS / Linux]
export CUSTOM_API_KEY="sk-xxxxxxxx"
```

```powershell [Windows PowerShell]
$env:CUSTOM_API_KEY = "sk-xxxxxxxx"
```

:::

## 4. Verify

```bash
codex exec "print hello"
```

## 5. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401` | Key missing or wrong | Check the env var name matches `env_key` |
| `404` | Wrong base_url | Must end with `/v1` and support Responses |
| Unknown model | Model not available | Use a model from `/v1/models` |
