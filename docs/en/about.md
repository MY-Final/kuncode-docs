# About These Docs

## What this guide is

This is a **provider-agnostic setup guide** for connecting Codex, Claude Code, OpenCode, GitHub Copilot CLI and similar tools to official APIs, self-hosted compatible gateways or third-party compatible services.

It covers portable protocols, configuration patterns and troubleshooting. Addresses, keys and model names are swappable placeholders. Account signup, key issuance, billing and support are handled by your service provider.

## Supported service sources

| Service source | How to prepare the key and address |
| --- | --- |
| Official API | Create credentials in the OpenAI, Anthropic or other official platform console, then confirm the model names and API protocol |
| Self-hosted compatible gateway | Create or configure a key according to the gateway's deployment docs, and use your gateway domain as the service address |
| Third-party compatible service | Sign in to that provider's console, create a key, and copy the API endpoint and available model names from the console |

If you cannot find a console or key-creation page, follow your provider's documentation. This guide covers client configuration and troubleshooting only; it does not replace provider documentation.

## Where KunCode fits

Some examples use KunCode as a reference service so the configuration snippets are easier to follow.

KunCode is only an **optional example**. It is not required and it is not the only compatible service. The same configuration patterns apply after you replace it with another compatible service. For the value each tool expects, use that tool's setup page and the Base URL guidance in [Choose an endpoint](/en/guide/endpoints).

## What this site covers

- Explaining common protocol endpoints, configuration fields and error messages
- Providing replaceable configuration examples and troubleshooting steps
- Helping you isolate key, address, model and network issues on the client side

This site does not provide account signup, key issuance, top-ups, refunds or provider support. Those are handled by your service provider's console and documentation. For the scope and limits of responsibility, see the [Disclaimer](/en/disclaimer).

## Open and shareable

We believe setup documentation should not be tied to one platform.

If this saves you even one debugging session, it does not matter whether you use KunCode. You are welcome to reference, repost or adapt it.

## Feedback

Spotted an error, want to add a tool, or have a common question to suggest? Use GitHub:

- [Report a documentation bug](https://github.com/MY-Final/kuncode-docs/issues/new?template=doc-bug.yml)
- [Request a new tool](https://github.com/MY-Final/kuncode-docs/issues/new?template=tool-request.yml)
- [Browse all issues](https://github.com/MY-Final/kuncode-docs/issues)

You can also use the "Edit this page" link at the bottom of any page to open a pull request.

Never paste a real API key, a full service address or account details into an issue; redact error output first.
