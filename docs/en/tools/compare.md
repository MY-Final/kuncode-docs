# Tool Capability Comparison

Use this page to narrow down tools by requirement. For detailed setup, open the individual tool page.

## Main comparison

| Tool | Form | Supported protocols | Tool calls | Streaming | Image input | Windows | Free / low-cost option | Setup difficulty | Best for |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Codex](/en/tools/codex) | Terminal | Responses | Required for coding (model-dependent) | Client supports it (model/provider-dependent) | Model/provider-dependent | Yes | Bring your own API key; cost depends on the provider | Medium | OpenAI official CLI users and Responses-based setups |
| [Claude Code](/en/tools/claude-code) | Terminal | Anthropic Messages | Required for coding (model-dependent) | Client supports it (model/provider-dependent) | Model/provider-dependent | Yes | Bring your own API key; cost depends on the provider | Medium | Anthropic official CLI users and Messages-based setups |
| [OpenCode](/en/tools/opencode) | Terminal | Responses / Chat Completions | Required for coding (model-dependent) | Client supports it (model/provider-dependent) | Model/provider-dependent | Yes | Open source; can use free or low-cost models | Medium | Terminal users who want a custom provider |
| [GitHub Copilot CLI](/en/tools/copilot) | Terminal | Chat Completions / Responses / Anthropic Messages | Required for coding (model-dependent) | Client supports it (model/provider-dependent) | Model/provider-dependent | Yes, PowerShell 6+ required | BYOK; cost depends on the provider | Medium | GitHub ecosystem and terminal users |
| [Crush](/en/tools/crush) | Terminal | OpenAI Compatible / Anthropic Compatible | Required for coding (model-dependent) | Client supports it (model/provider-dependent) | Model/provider-dependent | Yes | Open source; can use free or low-cost models | Low | Beginners who want a quick terminal setup |
| [Goose](/en/tools/goose) | Terminal + desktop | OpenAI Compatible / Anthropic Compatible / Ollama | Required for coding (model-dependent) | Client supports it (model/provider-dependent) | Model/provider-dependent | Yes | Open source; can use local or low-cost models | Medium | Users who want a desktop app or local agent |
| [Qwen Code](/en/tools/qwen-code) | Terminal | OpenAI / Anthropic / Gemini | Required for coding (model-dependent) | Client supports it (model/provider-dependent) | Model/provider-dependent | Yes | Open source; use a third-party compatible service. The Qwen OAuth free tier is gone | Medium | Users in China who need multiple protocols |
| [Cline](/en/tools/cline) | VS Code / desktop | OpenAI Compatible (other API types depend on the extension) | Required for coding (model-dependent) | Client supports it (model/provider-dependent) | Model/provider-dependent | Yes | Open source; can use free or low-cost models | Low | VS Code users who prefer a graphical UI |
| [Kilo Code](/en/tools/kilo-code) | VS Code / JetBrains | OpenAI Compatible / Responses / Anthropic Messages | Required for coding (model-dependent) | Client supports it (model/provider-dependent) | Model/provider-dependent | Yes | Open source; can use free or low-cost models | Low | VS Code or JetBrains users |
| [Gemini CLI](/en/tools/gemini-cli) | Terminal | Gemini native protocol | Required for coding (model-dependent) | Client supports it (model/provider-dependent) | Model/provider-dependent | Yes, Windows 11 24H2+ required | Google account login includes a free tier; quotas are subject to official terms | Medium | Users who only need official Gemini models |
| [VS Code + Copilot BYOK](/en/tools/vscode-copilot) | VS Code | Chat Completions / Responses / Messages | Required for coding (model-dependent) | Client supports it (model/provider-dependent) | Model/provider-dependent | Yes | VS Code is free; model usage is billed by the provider | Medium | VS Code users who need a Custom endpoint |
| [Trae](/en/tools/trae) | IDE | OpenAI Chat Completions / Anthropic Messages | Required for coding (model-dependent) | Client supports it (model/provider-dependent) | Model/provider-dependent | Windows 10/11 supported | The client has a free tier; quotas are subject to official terms. Custom model usage is billed by the provider | Low | Users in China who prefer a Chinese IDE |
| [CodeBuddy](/en/tools/codebuddy) | IDE / extension | OpenAI Chat Completions | Required for coding (model-dependent) | Client supports it (model/provider-dependent) | Model/provider-dependent | Windows 10+ supported | Free and enterprise plans exist; check the official site for details | Medium | Users in China who configure models with `models.json` |

> Tool calls, streaming, and image input depend on the **client, protocol entry point, model and provider** together. No tool can guarantee them on its own. For a coding tool to read and write files or run commands, the model must support tool calls; otherwise it can only chat. Check the official tool, model and provider documentation before relying on these features.

## Recommendations by requirement

| Your requirement | Recommended | Why |
| --- | --- | --- |
| Complete beginner | [Crush](/en/tools/crush) or [Cline](/en/tools/cline) | Short config or a graphical UI makes the first chat and tool call easier to verify |
| Free / low-cost | [OpenCode](/en/tools/opencode), [Crush](/en/tools/crush), or [Gemini CLI](/en/tools/gemini-cli) | Open-source tools can use low-cost models; Gemini CLI has an official free tier, subject to official terms |
| China network | [Qwen Code](/en/tools/qwen-code), [Trae](/en/tools/trae), or [CodeBuddy](/en/tools/codebuddy) | Better fit for users in China, with Chinese UI or documentation |
| VS Code | [Cline](/en/tools/cline), [Kilo Code](/en/tools/kilo-code), or [VS Code + Copilot BYOK](/en/tools/vscode-copilot) | Configure and use the model directly inside the editor |
| JetBrains | [Kilo Code](/en/tools/kilo-code) | The tool page explicitly supports the JetBrains extension |
| Desktop app | [Goose](/en/tools/goose) or [Cline](/en/tools/cline) | The tool page explicitly lists a desktop form factor |
| Simplest setup | [Crush](/en/tools/crush) | One `crush provider add` command is enough to get started |
| Official Gemini models only | [Gemini CLI](/en/tools/gemini-cli) | Uses the Gemini native protocol and supports Google account login and Gemini API keys |

## How to verify that a tool meets your needs

The comparison table only narrows the list. Verify the final choice in three steps:

1. **Confirm the protocol entry point**: Does your service provide Chat Completions, Responses, Anthropic Messages, or the Gemini native protocol? The tool's protocol list must include that entry point.
2. **Confirm the model ID**: Copy the exact ID returned by `/v1/models` into the tool. Do not guess the name or mix model names from another protocol.
3. **Verify tool calls last**: After configuration, ask the tool to read a file or run a command that requires a tool call. A normal chat reply does not prove that coding features work; only a successful tool call makes a coding tool truly usable.

Streaming, image input, and similar capabilities may depend on the tool, protocol entry point, model, and what the provider forwards. Before relying on them, check the official tool docs, model docs, and provider documentation.
