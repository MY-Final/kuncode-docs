# Claude Code

Anthropic's official CLI, pointed at any compatible gateway through environment variables.

## 1. Install

```bash
npm install -g @anthropic-ai/claude-code
```

## 2. Prepare an API key

See [Prepare an API key](/en/guide/api-key).

## 3. Configure

::: code-group

```bash [macOS / Linux]
export ANTHROPIC_BASE_URL="https://your-gateway.example.com"
export ANTHROPIC_AUTH_TOKEN="sk-xxxxxxxx"
```

```powershell [Windows PowerShell]
$env:ANTHROPIC_BASE_URL = "https://your-gateway.example.com"
$env:ANTHROPIC_AUTH_TOKEN = "sk-xxxxxxxx"
```

:::

::: tip Auth variable
Some versions read `ANTHROPIC_API_KEY` instead. If one does not work, try the other.
:::

## 4. Verify

```bash
claude -p "print hello"
```

## 5. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401` | Key not passed | Check the variable name, restart the shell |
| `404` | Base URL includes a path | Use the domain only |
