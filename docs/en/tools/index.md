# Tools

## Not sure which to pick?

Match your situation:

| Your situation | Recommended | Why |
| --- | --- | --- |
| Complete beginner, want free credit first | [OpenCode](./opencode) or [Crush](./crush) | Easy install, short config, works with free or low-cost models |
| China network, want a Chinese UI | [Qwen Code](./qwen-code), [Trae](./trae) or [CodeBuddy](./codebuddy) | Stable access in China, Chinese docs and UI |
| You use VS Code | [Cline](./cline), [Kilo Code](./kilo-code) or [VS Code + Copilot BYOK](./vscode-copilot) | Works inside the editor with a graphical setup |
| You use JetBrains | [Kilo Code](./kilo-code) or [Junie](https://www.jetbrains.com/junie/) | JetBrains plugin, officially supported |
| You want a desktop app | [Goose](./goose) or [Cline](./cline) | Standalone desktop client, no terminal needed |
| You want the simplest setup | [Crush](./crush) | One `crush provider add` command |
| You want a minimal terminal tool you can extend | [Pi](./piagent) | Lean core, extended on demand with TypeScript extensions, skills and themes |
| You use an OpenAI account | [Codex](./codex) | OpenAI's official CLI |
| You use an Anthropic account | [Claude Code](./claude-code) | Anthropic's official CLI |
| You use a GitHub account | [GitHub Copilot CLI](./copilot) or [VS Code + Copilot BYOK](./vscode-copilot) | GitHub's official ecosystem |
| You only use Gemini models | [Google Gemini CLI](./gemini-cli) | Gemini native protocol with a free tier |

::: tip Pick one
Do not install several tools at once. Get one working first.
:::
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
| [Pi](./piagent) | Terminal | Chat Completions / Responses / Anthropic Messages | `~/.pi/agent/models.json` | `models.json`, `auth.json`, or environment variable | npm |

> Paths and installation methods can change by version; check the tool page and official docs. For the full capability, protocol and platform comparison, see [Tool Comparison](./compare).

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
