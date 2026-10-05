# Tools

| Tool | Form | Supported protocols | Main config | Credentials | Windows install |
| --- | --- | --- | --- | --- | --- |
| [Codex](./codex) | Terminal | Responses | `~/.codex/config.toml` | Config file or environment variable | npm |
| [Claude Code](./claude-code) | Terminal | Anthropic Messages | `~/.claude/settings.json` | Config file or environment variable | npm |
| [OpenCode](./opencode) | Terminal | Responses / Chat Completions | `opencode.json` | `auth.json` | npm |
| [GitHub Copilot CLI](./copilot) | Terminal | Chat Completions / Responses / Anthropic | Environment variables (advanced: `providers.json`) | Environment variables or provider config | WinGet |
| [Crush](./crush) | Terminal | OpenAI Compatible / Anthropic Compatible | `crushrc` | Environment variable | winget / scoop / npm |
| [Goose](./goose) | Terminal + desktop | OpenAI Compatible / Anthropic Compatible / Ollama | `config.yaml` | System credential store or environment variable | Official PowerShell script |
| [Qwen Code](./qwen-code) | Terminal | OpenAI / Anthropic / Gemini | `~/.qwen/settings.json` | Environment variable or `.env` | PowerShell script / npm |
| [Cline](./cline) | VS Code / desktop | OpenAI Compatible | Extension settings | Extension credential store | VS Code extension |
| [Kilo Code](./kilo-code) | VS Code / JetBrains | OpenAI Compatible / Responses / Anthropic | Extension settings | Extension credential store | Editor extension |
| [Gemini CLI](./gemini-cli) | Terminal | Gemini native protocol | `~/.gemini/settings.json` | `.env` / environment variable | npm |
| [VS Code + Copilot BYOK](./vscode-copilot) | VS Code | Chat Completions / Responses / Messages | VS Code model management | VS Code / system credentials | VS Code |
| [Trae](./trae) | IDE | OpenAI Chat Completions / Anthropic Messages | Client model settings | Client credential store | Windows client |
| [CodeBuddy](./codebuddy) | IDE / extension | OpenAI Chat Completions | `models.json` | `models.json` or client credentials | Windows client |

> Paths and installation methods can change by version; check the tool page and official docs.

## Common steps

1. Install the tool
2. Prepare an API key
3. Fill in Base URL and key (see [Models and capabilities](/en/guide/models) for choosing a model)
4. Run the verification command
5. Check the troubleshooting section if something fails

## Not listed here?

Any tool that supports a custom Base URL and uses one of the protocols above can be configured the same way.
Start from the closest page and adapt it.

## About the examples

Addresses, keys and model names on these pages are placeholders. Swap in any compatible service.
