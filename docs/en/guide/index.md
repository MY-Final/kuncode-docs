# Overview

This guide helps you connect these AI coding tools to an official API, a self-hosted compatible gateway or a third-party compatible service:

- Codex
- Claude Code
- OpenCode
- GitHub Copilot CLI

It is a **provider-agnostic setup guide**: the portable configuration and troubleshooting advice is not tied to one service. KunCode examples show the format only; they are not a prerequisite.

The core workflow is simple: **identify your service source, obtain a key and service address, then point the tool at that service.**

## Placeholder conventions

This site deliberately uses two kinds of example addresses: the beginner quickstart uses the generic placeholder `https://gateway.example.com`, while tool pages use the KunCode example `https://kuncode.120403.xyz`. Both are placeholders only; replace them with your own service address when you configure a tool.

Keys are shown as `sk-your-key` or `sk-xxxxxxxx`, which are also placeholders. A real key's format is decided by the provider and may not start with `sk-`.

Model names such as `deepseek-flash` and `gpt-5` are examples as well. Call `/v1/models` and replace them with a model ID actually returned by your service.

| Placeholder | Replace it with |
| --- | --- |
| `https://gateway.example.com` or `https://kuncode.120403.xyz` | Your own service address |
| `sk-your-key` or `sk-xxxxxxxx` | The API key issued by your provider |
| `deepseek-flash` or `gpt-5` | A model ID actually returned by `/v1/models` |

## Identify your service source

| Service source | What you need | Where to get it |
| --- | --- | --- |
| Official API | Official key, service address, model names and protocol | Follow the OpenAI, Anthropic or other official platform documentation |
| Self-hosted compatible gateway | Gateway address, key and available models | Follow your deployment documentation or administrator instructions |
| Third-party compatible service | Provider key, API endpoint and available models | Sign in to the provider console and follow its documentation |

If you use an official API or self-hosted gateway, there may be no sign-in-to-provider-console step. Follow the documentation for that platform. This guide covers client configuration and troubleshooting only; it does not provide account signup, key issuance, top-ups or provider support.

## Three steps

1. **Prepare an API key and service address** from the console, administrator or provider documentation for your service source.
2. **Pick an endpoint**: OpenAI Chat Completions, OpenAI Responses or Anthropic Messages.
3. **Configure and verify** by writing the Base URL and key the tool expects into its config file, then run a command to confirm it works.

New to API keys, groups, channels and ratios? Start with [Concepts](/en/guide/concepts).

Want to just follow along once? See [15-minute minimal setup](/en/beginner/quickstart), which strings these three steps into one copy-pasteable command line using a single fixed set of placeholders.

## What you need

| Item | Description |
| --- | --- |
| API key | A credential from your provider or gateway; it does not have to start with `sk-` |
| Service address | The address supplied by the official API, self-hosted gateway or third-party service |
| Model name | The model ID actually served, e.g. `gpt-5` or `claude-sonnet-4` |
| The tool | Codex / Claude Code / OpenCode / GitHub Copilot CLI already installed |

::: tip About service addresses
`https://your-gateway.example.com` is a generic placeholder. Replace it with your own service address.

Some pages use KunCode as a demo, which is just one option among many. For whether a tool expects the root path or a path ending in `/v1`, use that tool setup page and the Base URL guidance in [Choose an endpoint](/en/guide/endpoints).
:::

## Next

- [Prepare an API key](/en/guide/api-key)
- [Choose an endpoint](/en/guide/endpoints)
- [Concepts](/en/guide/concepts)
- [Models and capabilities](/en/guide/models)
- [Managing multiple providers with CC Switch](/en/guide/cc-switch)
- [Tools](/en/tools/)
