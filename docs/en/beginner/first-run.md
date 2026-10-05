# Let AI Install and Configure a Tool

The prompts on this page are **for the AI agent**, not for you to execute. You copy, paste and answer questions.

## General setup prompt

Use this with Codex, Claude Code, OpenCode, GitHub Copilot CLI, or any tool that supports a custom Base URL.

```text
You are responsible for installing and configuring an AI coding tool on this computer.

My system is: <Windows / macOS / Linux>
The tool I want is: <not sure / OpenCode / Codex / Claude Code / GitHub Copilot CLI>
My service is: <none yet / I have an API key / I have free credit / not sure>

Please:
1. Inspect my system and identify missing prerequisites.
2. If Node.js, a package manager or another dependency is needed, tell me what you will install.
3. Run the install commands directly instead of giving them to me to run.
4. Find the correct configuration file and write the configuration.
5. Ask me to paste the API key myself; never ask me to send the full key in chat.
6. Run a verification command after configuration and confirm that the model can be called.
7. Finish by telling me what was installed, which files changed, and how to uninstall or roll back.
```

## Recommended: let AI configure OpenCode

OpenCode is beginner-friendly and works well for getting started with a free model.

```text
Install and configure OpenCode on this machine, with the goal of getting a free model working first.

Requirements:
1. Check whether Node.js and npm meet the requirements.
2. If not, install or upgrade them directly.
3. Install OpenCode.
4. Open it and check which models are available.
5. If a free model is available, select it and verify it.
6. If no free model is available, tell me the lowest-cost legitimate option, then continue.
7. Verification: have OpenCode read a file in the current directory and summarize it.
8. Actually perform every step instead of only linking to tutorials.
```

## Let AI configure Codex

```text
Install and configure Codex on this machine for my compatible service.

Requirements:
1. Check the OS environment and Node.js version.
2. Install the Codex CLI.
3. Find ~/.codex/config.toml (on Windows: %USERPROFILE%\.codex\config.toml).
4. Configure model_provider, base_url, wire_api and authentication for my service.
5. Ask me to fill in the API key; never ask me to send the full key.
6. Run codex exec "print hello" to verify.
7. If it fails, read the full error and keep diagnosing until the cause is confirmed.
```

## Let AI configure Claude Code

```text
Install and configure Claude Code on this machine for a compatible Anthropic Messages endpoint.

Requirements:
1. Check the Node.js version and OS compatibility.
2. Install Claude Code.
3. Find ~/.claude/settings.json (on Windows: %USERPROFILE%\.claude\settings.json).
4. Configure ANTHROPIC_BASE_URL and the authentication variable.
5. ANTHROPIC_BASE_URL must be the domain only, with no /v1.
6. Ask me to fill in the API key.
7. Run claude --version and one minimal request to verify.
8. If a model-recognition warning appears, handle it the officially supported way instead of guessing.
```

## Let AI configure GitHub Copilot CLI

```text
Install and configure GitHub Copilot CLI on this machine, using BYOK with a compatible gateway.

Requirements:
1. Check the PowerShell version and Node.js environment.
2. Install Copilot CLI.
3. Configure COPILOT_PROVIDER_BASE_URL, COPILOT_PROVIDER_TYPE, COPILOT_PROVIDER_API_KEY and COPILOT_MODEL.
4. In OpenAI-compatible mode, the Base URL must include /v1.
5. Ask me to fill in the API key.
6. Run a non-interactive verification to confirm that a model can be called.
7. If a permission flag has security risks, explain it before running it.
```

## Let AI troubleshoot a failure

```text
I followed your configuration steps for <tool>, but it failed.
Here is the full error:
<paste the complete error>

Please:
1. Determine whether this is an environment, install, configuration, authentication, protocol or quota problem.
2. Read the actual configuration file; do not guess.
3. Change one variable at a time and verify after each change.
4. Do not print the full API key.
5. Finish by explaining the root cause and how to avoid it next time.
```

## Let AI roll back

```text
Restore <tool> to its official default state.

Requirements:
1. Back up the current configuration first.
2. Remove or comment out the custom provider configuration.
3. Clear locally stored old credentials without printing them.
4. Tell me how to revoke the old key in the provider console.
5. Verify that the tool still starts normally.
```

## Next

- [Configuration prompt library](./prompts)
- [Free and trial models](./free-models)