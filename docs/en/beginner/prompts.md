# Configuration Prompt Library

These prompts are **for an AI agent**, not for a person to execute. A beginner only copies, pastes and answers questions.

Principles:

- Ask the AI to do one thing at a time.
- Make it inspect first, execute second and verify last.
- Paste API keys yourself; never send the full key in chat.
- Require a backup before configuration changes.

## 1. Environment check

```text
Check whether this computer is ready to install an AI coding tool.

Check:
1. OS and version
2. Whether Node.js and npm are installed, and their versions
3. Available package managers (winget / brew / apt, and so on)
4. Whether the network can reach common services
5. Whether a proxy or corporate network restriction exists

Inspect only; do not install or change anything.
Finish with a table showing what is present, what is missing and what should be installed first.
```

## 2. Recommend a tool

```text
I know nothing about the command line and want to use an AI coding tool.

My situation:
- OS: <Windows/macOS/Linux>
- Budget: <free only / small paid budget>
- Purpose: <write code / read code / learn>

Recommend one tool, preferring:
1. Easiest installation
2. Free or low-cost option
3. Active community and clear documentation

Recommend only one and explain why. Do not give me a long list.
```

## 3. Install and configure

```text
Install and configure <tool> on this machine.

Requirements:
1. Check prerequisites first and install anything missing.
2. Run the installation commands instead of only showing them to me.
3. Find the correct configuration file.
4. Back up the original file before writing the configuration.
5. Ask me to paste the API key myself; never ask me to send the full key.
6. Run a verification command to confirm that a model can be called.
7. Finish by telling me what was installed, which files changed and how to uninstall.
```

## 4. Connect a custom service

```text
Configure <tool> to use my custom service.

My service information:
- API node: <address>
- Protocol: <not sure / Chat Completions / Responses / Anthropic Messages>
- Model ID: <not sure / exact model name>

Requirements:
1. First determine from the tool's documentation whether the Base URL needs /v1.
2. Back up the configuration file.
3. Change only the necessary fields; do not rewrite the whole file.
4. Verify with one minimal request.
5. If it fails, read the full error and determine whether it is an address, authentication, protocol or model problem.
```

## 5. Configure a free model

```text
I want to get an AI coding tool working with free credit first, without paying immediately.

Please:
1. List legitimate free options that are currently available.
2. Compare quota, models, tool-call support and rate limits.
3. Prefer the simplest setup.
4. Configure the chosen option directly.
5. Actually verify that it can call a model.
6. Explain the free-tier limits and when I would need to switch to paid.

Do not recommend shared keys, unknown resellers or anything that violates a provider's terms.
```

## 6. Verify the configuration

```text
Verify that <tool> is actually working.

Test in order:
1. Can the tool start, and what version is it?
2. Which configuration file is it reading?
3. Which Base URL and model are active?
4. Can it list available models?
5. Can it complete one minimal conversation?
6. Can it read a local file?

Run each step instead of only inspecting the configuration file.
Finish by telling me which steps passed, which failed and why.
```

## 7. Troubleshoot a failed setup

```text
I followed your setup steps for <tool>, but it failed.

Full error:
<paste error>

Please:
1. Classify the problem as environment, installation, configuration, authentication, protocol, model or quota.
2. Read the actual configuration file; do not guess.
3. Change one variable at a time and verify immediately.
4. Do not print the full API key.
5. If the cause is unclear, tell me what to confirm with the provider.
6. Finish with the root cause and how to avoid it.
```

## 8. Switch models

```text
Switch <tool> from <old model> to <new model>.

Requirements:
1. Confirm that the new model exists on the service.
2. Confirm that it supports the current protocol and tool calls.
3. Back up the configuration before changing it.
4. Make one real call to verify.
5. If the new model is unusable, roll back to the old model and explain why.
```

## 9. Fix tool-call failures

```text
My AI coding tool can chat, but it cannot read files or run commands; it reports a tool-call failure.

Please:
1. Check whether the current model supports tool calls.
2. Check whether the protocol endpoint supports tool calls.
3. Check whether a proxy or gateway is dropping tool-call fields.
4. Verify with a minimal request.
5. Give me a fix; if the model does not support it, recommend one that does.
```

## 10. Rotate a leaked key

```text
I think my API key may have leaked.

Please:
1. Tell me how to revoke and recreate it in the provider console.
2. Find every place on this machine that stores the old key.
3. Update configuration files and environment variables without printing the full key.
4. Verify that the new key works.
5. Tell me how to inspect logs for suspicious calls.
6. Remind me to clean leaked copies from Git, logs, shell history and screenshots.
```

## 11. Roll back to official settings

```text
Restore <tool> to its official default state.

Requirements:
1. Back up the current configuration first.
2. Remove the custom Base URL and provider.
3. Clear locally stored old credentials without printing them.
4. Restore the official login method.
5. Verify that the tool starts normally.
6. Tell me how to revoke unused keys in the provider console.
```

## 12. Migrate to a new computer

```text
I am migrating my AI coding tools to a new computer.

Please:
1. List the tools, configuration files and dependencies to migrate.
2. Do not export plaintext API keys.
3. Install the tools and dependencies on the new computer.
4. Recreate or enter the keys on the new computer.
5. Verify each configuration.
6. Tell me what to clean up on the old computer.
```

## Writing your own prompt

Use this structure:

```text
Context: my OS, tool, service and current state
Goal: what I want to achieve
Constraints: what not to do, plus safety requirements
Verification: how to confirm success
```

For a beginner, the most useful line is:

```text
Execute the steps for me directly; do not only give me commands and tutorials.
```

## Next

- [Let AI install and configure a tool](./first-run)
- [Free and trial models](./free-models)