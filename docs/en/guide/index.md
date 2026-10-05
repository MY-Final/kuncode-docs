# Overview

This guide helps you connect AI coding tools (Codex, Claude Code, OpenCode, and others) to any compatible gateway.

Self-hosted services, third-party gateways and official APIs all follow the same pattern: **point the tool at your service and provide a key**.

## Three steps

1. **Prepare an API key** from whichever service you use, usually an `sk-` string.
2. **Pick an endpoint** based on the protocol your tool supports: OpenAI Chat Completions, OpenAI Responses, or Anthropic Messages.
3. **Configure and verify** by putting the Base URL and key into the tool config file, then run a single command.

## What you need

| Item | Description |
| --- | --- |
| API key | A key from your provider, shaped like `sk-xxxx` |
| Base URL | Your service address, self-hosted or official |
| Model name | The model you want, e.g. `gpt-5`, `claude-sonnet-4` |
| The tool | Codex / Claude Code / OpenCode already installed |

::: tip About example addresses
`https://your-gateway.example.com` is a generic placeholder. Replace it with your own service address.
Some pages use KunCode as a demo, which is just one option among many.
:::

## Next

- [Prepare an API key](./api-key)
- [Choose an endpoint](./endpoints)
- [Concepts](./concepts)
- [Tools](/en/tools/)
