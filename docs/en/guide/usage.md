# After Setup: How to Use It for the First Time

This page is about **what to do after setup has succeeded**. It does not repeat installation, and it does not repeat how to configure the Base URL or API key.

If you have not finished setting up yet, start here:

- [Let AI install and configure a tool](/en/beginner/first-run)
- [Prepare an API key](/en/guide/api-key)
- [Choose an endpoint](/en/guide/endpoints)

## Set the right expectation first

Being able to chat does not mean the model can write code.

A tool that is usable for coding must be able to do at least three things: **make tool calls, read files and run commands**. A model that only answers questions can act as a chat assistant, but it will struggle to actually change your code.

So for your first session, follow this order: chat first, then read files, then change code, then run tests. Confirm each step works before moving on.

## Your first conversation

Start with the simplest possible question to confirm the model can answer:

```text
Hello. Introduce yourself in one sentence, and tell me which model you are.
```

A normal reply means authentication, the protocol endpoint and the model name are all fine. This step only proves it can "talk"; it does not yet prove it is good for coding.

## Have it read a file

Have the AI read first, not edit. Paste this:

```text
Do not modify any code yet.

Please read README.md in the project root, then summarize it in five sentences:
1. What this project does
2. What language and stack it uses
3. How to install dependencies
4. How to run it
5. How to run tests

Only read and summarize; do not change any files.
```

If it actually reads the file contents instead of making things up, its file-reading ability works.

::: warning Read before you edit
The most common beginner mistake is to immediately ask the AI to "fix the project". Without understanding the code first, it may make sweeping changes.

Have it read and explain first. Once you are sure it understands your real project, let it make changes.
:::

## Have it change code

For the first code change, let it change **one file with one minimal edit**:

```text
Please modify only the file <path> and make this one minimal change:
<describe what you want changed in one or two sentences>

Requirements:
1. Before making changes, tell me what you plan to change and wait for my confirmation.
2. Change only this one file. Do not refactor, reformat or touch anything else.
3. When done, show the full diff and explain every change.
```

::: tip Always review the diff
Do not just accept "done". Review the diff and check:

- Whether it changed only what you asked for
- Whether it touched other files
- Whether it renamed, refactored or upgraded dependencies along the way

If it changed too much, tell it to revert and start over.
:::

## Have it run tests

Ask the AI to run the tests and show you the full output:

```text
Please run this project's tests and paste the full output.

If anything fails:
1. First tell me which test failed and what the likely cause is.
2. Do not change code yet; propose a fix and wait for my confirmation.
3. After I confirm, make the change and re-run the same test.
```

::: warning Do not blindly accept "tests passed"
Some AI agents skip tests, run only a subset, or describe a failure as a success. Ask for the **full output** and check it yourself for failed, error or skipped entries.
:::

## Three steps after every change

No matter how small the change, follow these three steps:

1. **Review the diff**: confirm the scope matches what you asked for, with no extra changes.
2. **Run tests**: at minimum run the affected tests; run the full suite when you can.
3. **Commit in small steps**: one commit should contain one thing, with a message explaining what changed and why.

These three steps keep the AI's changes controllable and easy to roll back.

## How to tell whether a model is usable for coding

To confirm a model or tool is really suitable for coding, verify these three things in order:

| Check | How to test | Pass criteria |
| --- | --- | --- |
| Tool calls | Ask it to read a file | It calls the tool instead of answering from memory |
| File reading | Ask it to summarize a real file | The summary matches the file and is not fabricated |
| Command execution | Ask it to run a read-only command, such as checking a version | It actually runs the command and shows the output |

Only when all three pass is the combination usable for coding. If only "chat" passes, it can only chat.

## Common failure signals

| Symptom | Usually means | Next step |
| --- | --- | --- |
| Can chat, but cannot read files | The model or protocol endpoint does not support tool calls | Switch to a model that supports tool calls; check the protocol endpoint |
| Can read files, but cannot edit them | The tool is in read-only or plan mode, or lacks write permission | Check the tool's permission/mode settings |
| Can edit files, but cannot run commands | Command execution is disabled, or a sandbox blocks it | Check the tool's sandbox and permission settings |
| Tool calls fail immediately | The gateway is dropping tool-call fields, or the protocol is incompatible | Compare against the protocol endpoint and the error message |

For specific error codes and troubleshooting steps, see [Errors and troubleshooting](/en/guide/errors). Authentication, address and quota problems are covered there too.

## Next

- [Errors and troubleshooting](/en/guide/errors)
- [Models and capabilities](/en/guide/models)
- [Configuration prompt library](/en/beginner/prompts)
