# When Setup Fails

Setup failures are normal, and most of them can be fixed. This page assumes you are not technical. It only asks you to do three things in order: **copy the error, ask the AI that helped you set things up, then contact the right person for your type of problem.**

::: tip Do not panic
An error does not mean you did something wrong. A single wrong character in a command, a config file, an API key, or a network proxy is enough to cause one. Below, find which of the four situations matches you, then keep reading.
:::

## First, find which situation you are in

| Your situation | What it usually looks like | What to do next |
| --- | --- | --- |
| Not installed yet | "Command not found" or "not recognized as an internal or external command", or the installer itself fails | See "Step 3" below and go back to the matching tool page to reinstall |
| Installed, but cannot connect | 401, 403, 404, 429, connection timeouts, or a message that the key or address is invalid | Read "Step 2" first, then contact your API provider |
| Can chat, but cannot read files or edit code | Chat works, but asking it to read a file, edit code, or run a command does nothing or errors out | This is a tool-call problem; start with "Step 2" |
| Worked before, now it fails | It used to work, then suddenly rate limits, times out, or says the balance is too low | Start with "Step 2"; most likely you need your provider |

> Note: a **tool call** is what lets the AI actually read your files, edit code, and run commands. Free or limited models may not support it. Without it, the AI can only chat, not work on your project.

## Step 1: Do not close the window. Copy the error first.

**This is the most important step.** Most problems cannot be fixed because the report is only "it does not open", which gives nobody anything to work with.

1. **Do not close the window with the error.** Once it is closed, the error may be gone for good.
2. In the terminal or tool, find the **last 20 lines**, select them from the bottom up, and copy.
3. If the error is in a graphical window, take a **screenshot**, or copy the error text shown there.
4. If the tool mentions a **log file path**, open that file and copy the last 20 lines.

When you copy, keep as much of this as you can. It helps others locate the problem quickly:

- The full error text (do not just write "it failed")
- The HTTP status code (for example 401, 404, 429)
- The tool and model you were using at the time
- Roughly when the error happened

::: warning Do not just send "it does not open"
Reports like "it does not open", "it does not work", or "there is an error" cannot be diagnosed. Include at least the last 20 lines of the error, plus which tool and which model you were using.
:::

## Step 2: Ask the AI that helped you set things up

If an AI installed and configured the tool for you, **ask it first**. It has seen your machine and can usually find the problem faster than anyone else. Copy the whole prompt below to it, and paste the real error at the end:

```text
I followed your earlier steps to set up an AI coding tool, and now it fails. Please help me troubleshoot.

The error I see is (redacted):
<paste the last 20 lines of the error here>

Please follow these rules:
1. First decide which category this is: installation / authentication / address / quota / network / tool call.
2. Read my actual config files before giving advice. Do not guess.
3. Change only one variable at a time, and let me verify before changing the next one.
4. Do not ask me to print the full API key in chat. If you need to check it, look only at its format and first and last few characters.
5. At the end, tell me the root cause and how to avoid it in the future.
```

If the AI tries a few fixes and still cannot solve it, or it tells you this is a provider or account issue, keep going.

## Step 3: Contact the right person for your type of problem

Different problems need different places. Contacting the wrong one only wastes time:

| Type of problem | Who to ask | How |
| --- | --- | --- |
| Installation, command not found, wrong path | The matching tool page on this site, or this site's GitHub Issues | Go back to the matching tool page under [Tool setup](/en/tools/); if the documentation itself is wrong, report it in [this site's Issues](https://github.com/MY-Final/kuncode-docs/issues) |
| Key, balance, rate limits, account, group | **Your API provider** | Sign in to your provider's console, or contact their support. This site cannot handle it for you |
| The tool's own behavior, interface, or version | **That tool's authors or community** | Ask on the tool's website, GitHub repository, or user community |
| You cannot read the error, or do not know which category it is | Ask the AI that helped you set things up first | See "Step 2" above |

::: warning What this site can and cannot do
This site only provides setup guides and troubleshooting ideas. **We cannot top up your key, add credit, issue refunds, or look up your bill**, and we cannot act as your provider's support. For anything about your account or your money, contact your API provider.
:::

## Before you send anything: redact it

Before you post an error anywhere public (a group chat, an issue, a screenshot), remove these:

- **The full API key** (the most important one; never send it)
- Account email or phone number
- Billing, balance, or order details
- Internal network addresses or company proxy addresses

**How to mask a key:** keep only the first 3 characters and the last 2, and replace the middle with `...`. For example, `sk-abc...xy`.

::: danger Never post a full key in a public group, issue, or screenshot
Once a full key leaks, someone else can spend your quota with it. If you posted one by accident, revoke that key in your provider's console immediately and create a new one.
:::

## Templates you can copy

### To send to your API provider

```text
Hello, I am setting up <tool name> and I hit <status code>. The error is <redacted error>.
The model I am using is <model name>, at <time>.
Please help me check whether my key, balance, quota, or group is the problem.
I will not send the full key. If you need to check it, I can share a redacted snippet.
```

### To send to this site's GitHub Issues

```text
System: <Windows 11 / macOS / Linux>
Tool: <Codex / Claude Code / OpenCode / ...>
Service type: <official API / self-hosted gateway / third-party compatible service>
Steps to reproduce:
1. ...
2. ...
Redacted error:
<paste the last 20 lines, with keys, accounts, and proxy addresses removed>
```

This site's Issues: <https://github.com/MY-Final/kuncode-docs/issues>

## Next

- [Errors and troubleshooting](/en/guide/errors): a systematic walkthrough by status code
- [FAQ](/en/faq): quick answers to common questions
- [15-minute minimal setup](/en/beginner/quickstart): run through the minimal setup again from the start
- [Windows: read this first](/en/beginner/windows): paths, terminals, and command differences on Windows