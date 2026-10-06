# CC Switch: Managing Multiple Providers

::: info Tested with
Last verified: 2026-10-07 · CC Switch 3.20.4 (current stable)
:::

[CC Switch](https://github.com/farion1231/cc-switch) is an open-source, cross-platform desktop app for managing provider configuration across AI coding tools. It turns "hand-editing config files" into "clicking a button", and adds local routing, protocol conversion and automatic failover.

This page covers only the tools this site already documents: Codex, Claude Code, OpenCode, Gemini CLI and Pi. CC Switch supports more clients (including Claude Desktop, Grok Build, OpenClaw, Hermes Agent and MiniMax Code) and the same approach applies.

::: warning CC Switch does not replace the tools
It is a configuration manager, not an AI coding tool. You still need Codex, Claude Code and the rest installed. CC Switch decides *which service those tools talk to*.
:::

## What it solves

| Pain point | What CC Switch does |
| --- | --- |
| Switching providers means hand-editing config every time | One-click provider switching, also from the tray |
| Every tool uses a different format (JSON / TOML / YAML / `.env`) | One UI that writes the right format per tool |
| One flaky provider breaks your workflow | Local routing plus automatic failover to a backup |
| The tool's protocol and the provider's protocol do not match | Local routing converts between protocols |
| You do not know what you are spending | Usage statistics and balance queries |

If you have a single provider and a single tool and never switch, configuring it by hand from the [tool pages](/en/tools/) is enough. You may not need this.

## 1. Install

Get it only from the official channels: **[ccswitch.io](https://ccswitch.io)** or **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**. The project warns that any "CC Switch" site asking for payment, top-ups or login credentials is not official.

Requirements: Windows 10+ / macOS 12+ / Linux (glibc 2.35+ and WebKitGTK 4.1, e.g. Ubuntu 22.04+, Debian 12+).

::: code-group

```powershell [Windows]
# Download CC-Switch-v{version}-Windows.msi and run it
# The portable build runs CC-Switch.exe directly after extraction
```

```bash [macOS]
brew install --cask cc-switch
```

```bash [Debian / Ubuntu]
sudo dpkg -i CC-Switch-v{version}-Linux-*.deb
```

```bash [ArchLinux]
paru -S cc-switch-bin
```

:::

Start it after installing. If the window opens and the tray icon appears, it worked.

::: tip Blocked by the system
On Windows, if double-clicking the installer does nothing, right-click the file, open Properties and tick "Unblock". The macOS build is signed and notarized by Apple and opens directly.
:::

## 2. Add your first provider

Click **+** in the top right:

1. Pick your provider under "Presets" — name and endpoint fill in automatically;
2. Enter your **API key**;
3. Click "Add".

If your provider is not in the preset list, choose "Custom" and fill in the endpoint and key yourself.

::: tip Endpoint format
The endpoint you enter here has to match what the tool's protocol expects. See [Choose an endpoint](/en/guide/endpoints). CC Switch writes it into the right config field for the selected tool, so do not repeat the API path.
:::

After adding, the "Get models" button pulls the list from `/v1/models`, saving you from copying model IDs by hand. That is the same endpoint described in [Models and capabilities](/en/guide/models).

## 3. Switch providers

Click "Enable" on the provider card you want. How each tool picks up the change differs:

| Tool | How it takes effect |
| --- | --- |
| Claude Code | Immediate, no restart |
| Codex | Close and reopen the terminal |
| Gemini CLI | Restart Gemini CLI |
| OpenCode | Close and reopen the terminal |
| Pi | Written to config; pick the model inside the tool |

::: tip Coexisting apps
Tools like OpenCode and Pi support **several providers at once** and you choose inside the tool. The button label differs: OpenCode reads "Add" while Pi reads "Enable". Codex, Claude Code and Gemini CLI enable only one provider at a time.
:::

## 4. Local routing: protocol conversion and hot switching

Local routing starts an HTTP service on your machine (default `http://127.0.0.1:15721`). Requests from the tool go to it first, and it forwards them to the active provider.

It does three things this site mentions elsewhere:

- **Protocol conversion**: let Claude Code use an OpenAI / Gemini provider, or Codex use a Chat Completions provider;
- **Hot switching**: a provider switch applies to later requests without restarting the tool;
- **Usage logging**: records each request that passes through.

Local routing supports Claude Code, Codex, Gemini CLI and Grok Build.

::: warning Not every provider needs it
If the provider already speaks the protocol the tool needs (for example Codex talking straight to a Responses endpoint), connect directly. Routing is mainly for when the tool's protocol and the provider's protocol differ.
:::

To enable it: **Settings → Routing → Local routing**, turn on the master switch, then tick the apps to route. Once enabled, the tool's config address becomes the local address and the key is replaced with the placeholder `PROXY_MANAGED`; the real key is injected by the router when forwarding.

When you turn routing off, CC Switch writes the config back to the direct provider that was active before.

## 5. Failover (advanced)

Requires local routing first. Under **Settings → Routing → Automatic failover**:

1. Select the app;
2. Add backup providers to the queue and order them;
3. Turn on "Automatic failover".

After that, a failed request on the primary provider tries the next in the queue, with a circuit breaker so a repeatedly failing provider is skipped.

## 6. What it changes, and what it leaves alone

Understanding this is what makes it safe to let CC Switch manage your config.

**Only key fields change**: request address, key, model name, API protocol and a few provider-specific compatibility options. Your plugins, hooks, permissions, MCP servers, comments and formatting are left as they are.

**It backs up before the first write**: before CC Switch rewrites a config file for the first time, the original is copied to `~/.cc-switch/backups/live-first-write/`.

**A broken file is never overwritten**: if a config file has a JSON / TOML syntax error, switching reports it and leaves everything untouched rather than writing over it.

Files it touches, per tool:

| Tool | Config file |
| --- | --- |
| Claude Code | `~/.claude/settings.json` |
| Codex | `~/.codex/config.toml` |
| Gemini CLI | `~/.gemini/.env`, `~/.gemini/settings.json` |
| OpenCode | `~/.config/opencode/opencode.json` |
| Pi | `~/.pi/agent/models.json` |

::: tip Note for Codex users
When switching to a third-party provider, CC Switch writes the key into `experimental_bearer_token` in `config.toml`, **not** into `~/.codex/auth.json` — the latter is only for OpenAI's official ChatGPT login. The official login is stashed to `~/.cc-switch/codex-login-stash.json` and restored when you switch back, so you do not have to log in again.
:::

## 7. Troubleshooting

### The switch did not take effect

Check whether you restarted the tool as the table above requires. The config file was updated, but a running process does not reload it.

### An environment variable overrides the config

If `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` and similar variables are set, they usually take priority over config files and can override what CC Switch wrote. CC Switch detects these conflicts, shows a warning banner, and can delete them (with an automatic backup to `~/.cc-switch/backups/`).

### Restoring the official login

Each tool's provider list includes an official entry (OpenAI Official, Claude Official, Google Official, and so on). Switch back to it, restart the tool, and follow the tool's own login flow.

### Other problems

- Hand-edited config not taking effect: see [After setup](/en/guide/usage) and [Errors and troubleshooting](/en/guide/errors).
- Problems with CC Switch itself: report them with `~/.cc-switch/logs/cc-switch.log` on its [issue tracker](https://github.com/farion1231/cc-switch/issues).

## 8. Uninstall

::: code-group

```powershell [Windows]
# Settings → Apps → uninstall CC Switch
```

```bash [macOS]
brew uninstall --cask cc-switch
# add --zap to remove the configuration data too
```

```bash [Debian / Ubuntu]
sudo apt remove cc-switch
```

:::

Configuration data lives in `~/.cc-switch/` by default; delete it manually if you want a full cleanup.

## Relationship to manual setup

CC Switch does not conflict with configuring tools by hand from this site; it automates those steps:

- The manual pages explain *what to put in each field*; CC Switch writes those fields for you;
- How to choose a protocol and whether the Base URL needs `/v1` still follows [Choose an endpoint](/en/guide/endpoints);
- It does not change the service itself, only how you manage it.

## Next

- [Choose an endpoint](/en/guide/endpoints): confirm the tool's protocol and Base URL
- [Prepare an API key](/en/guide/api-key): create and manage keys
- [Tools](/en/tools/): full setup steps per tool
- [Cost control](/en/guide/cost-control): usage management across providers