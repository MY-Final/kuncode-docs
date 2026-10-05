# Tools

| Tool | Supported protocols | Recommended | Main config | Credentials | Windows install |
| --- | --- | --- | --- | --- | --- |
| [Codex](./codex) | Responses | Responses | `~/.codex/config.toml` | Config file or environment variable | npm |
| [Claude Code](./claude-code) | Anthropic Messages | Anthropic Messages | `~/.claude/settings.json` | Config file or environment variable | npm |
| [OpenCode](./opencode) | Responses / Chat Completions | Responses | `opencode.json` | `auth.json` | npm |
| [GitHub Copilot CLI](./copilot) | Chat Completions / Responses / Anthropic | Chat Completions | Environment variables (advanced: `providers.json`) | Environment variables or provider config | WinGet |

> Paths above are each tool's default locations. They can differ by version; check the tool page.

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
