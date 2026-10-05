# Free and Trial Models

::: warning Free policies change quickly
This page explains how to get an AI agent to find and judge free options. It does not promise that any service will remain free. Quotas, models, rate limits and card requirements are governed by the provider's own page. Last reviewed: 2026-10.
:::

## Let the AI choose for you

Send this to the AI:

```text
I want to try AI coding tools with free credit first, without paying immediately.
Check which legitimate free options may be available in my region, and compare quota, models, tool-call support and rate limits.
Prefer the option with the simplest setup.
Do not recommend shared keys, unknown resellers or grey-market gateways.
Once you choose an option, configure it on this machine and verify that it can actually call a model.
```

## The main free routes

### 1. Models included with the tool

Some tools include a free model or free credit and work immediately without a custom Base URL.

Ask the AI to check for a free path, for example `/models` in OpenCode.

Pros: least setup. Cons: limited models, limits and availability.

### 2. Cloud provider free tiers

Many platforms offer new-user credit or permanently free models. Common entry points include:

| Platform | Common free form | Watch out for |
| --- | --- | --- |
| Google AI Studio / Gemini | Free tier plus daily quota | Regional and rate limits |
| Groq | Free tier with fast inference | Fewer model choices |
| OpenRouter | Some models marked `:free` | Heavy rate limiting and queues |
| GitHub Models | Trial quota for developers | Requires a GitHub account |

Ask the AI to verify current terms; do not rely on an old tutorial.

### 3. Local models

Run the model on your own machine with no API spend.

- **Ollama**: command-line install, then pull a model.
- **LM Studio**: graphical interface, easier if you avoid the terminal.

The trade-off is RAM or VRAM, and speed depends on your hardware.

## Ask the AI to judge whether "free" is usable

Send this:

```text
Check the free option I plan to use and answer each item:
1. Does it require a credit card?
2. Is the quota daily or one-time?
3. Which models are included?
4. Does it support tool calls?
5. Which protocol does it expose?
6. Are there rate or concurrency limits?
7. Will my data be used for training?

If any item would prevent an AI coding tool from working, tell me directly and switch to another option.
```

## Safety

- Do not use unknown, shared or grey-market free keys.
- Never commit a key to Git, post it in chat or expose it in a screenshot.
- Free tiers can be throttled or withdrawn. Use a paid service for important work.

## Next

- [Let AI install and configure a tool](./first-run)
- [Configuration prompt library](./prompts)