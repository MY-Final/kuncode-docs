# Start from Zero: Let AI Configure It

This section is not about teaching you the tools first. It gives you **prompts you can paste into an AI agent**, so the agent can inspect your machine, install the tool, write the configuration and verify the connection.

::: warning First, know the difference between a chat AI and an AI that can operate your computer
Regular web versions of ChatGPT, Claude, and similar tools usually only give advice. They cannot run commands on your computer, install software, or edit configuration files for you. The flow below requires a desktop app or agent that can operate your computer.
:::

## Step 1: Open an AI that can operate your computer

Choose in this order:

1. **If you already have Codex**: open Codex directly.
2. **If you do not have Codex yet**: install and open the **ChatGPT desktop app**, then sign in.
3. **If you use another tool**: open Claude Code, OpenCode, or another agent that explicitly supports running commands or operating your computer.

Once it is open:

1. Start a new conversation.
2. Copy the full prompt from [“Easiest starting point”](#easiest-starting-point) below.
3. Paste it and send it.
4. Answer its questions honestly. If you are not sure, say, “I don't know. Please check for me first.”
5. When an API key is needed, enter it yourself through the secure path the AI gives you. Do not paste the full key into chat.

::: tip Windows users, start here
If you use Windows, read [Windows essentials](./windows) first to understand the differences between PowerShell, CMD, and file paths before continuing.
:::

## What do I have? What should I do next?

| Your situation | Next step | Where to go |
| --- | --- | --- |
| I do not have an account or an API key | Choose a free or trial model, then follow the page to sign up and get a key | [Free and trial models](./free-models) |
| I have an account, but no API key yet | Sign in to your provider's console and create and save an API key | [Create and save an API key](/en/guide/api-key) |
| I have an API key, but no tool installed yet | Have the AI inspect your environment, install the tool, and write the configuration | [Let AI install and configure a tool](./first-run) |
| The tool is installed, but it does not work or shows an error | Check common errors first; if that does not help, check the FAQ | [Common errors](/en/guide/errors) · [FAQ](/en/faq) |

::: tip Not sure which situation applies to you?
Send the AI what you know (operating system, provider name, whether you already have a key, and the exact error). Ask it to identify your situation first, then take you to the right page.
:::

## Easiest starting point

If you do not know which tool to choose, replace `<Windows/macOS/Linux>` in the prompt below with your operating system, for example `Windows 11`. If you are not sure, write “I don't know. Please check for me first.” Then send the whole prompt to the AI:

```text
I want to use an AI coding tool on a <Windows/macOS/Linux> machine, but I know nothing about the command line.
First inspect my system, then recommend the easiest tool to install, preferring OpenCode.
Install and configure it for me directly, and explain each step as you go.
When an API key is needed, ask me to paste it myself; never ask me to send the full key in chat.
After configuration, actually run the verification command and show me the result.
```

## What this section solves

- Not knowing which tool to install
- Not knowing the command line
- Not knowing where the config file is
- Not knowing how to set the Base URL and key
- Not knowing whether setup succeeded
- Not knowing how to get an AI to troubleshoot a failure

## Next

We recommend continuing in this order:

1. [Let AI install and configure a tool](./first-run)
2. [Configuration prompt library](./prompts)
3. Read [Free and trial models](./free-models) if you need free credit