# API key security and rotation

This page covers API key security management: how to store keys safely, keep permissions to the minimum, and what to do in what order after a leak.

For creating keys and understanding fields, see [Prepare an API key](/en/guide/api-key). For tokens, quotas and billing concepts, see [Concepts](/en/guide/concepts). For common symptoms, see [FAQ](/en/faq).

::: info Provider differences
Model limits, IP allowlists, quota caps, expiry, request logs and revocation are provided by the provider console. Names and availability vary. The steps below are general; the provider console is authoritative.
:::

## Store keys safely

Goal: keep the key only in trusted credential storage and the runtime environments that need it. It should not appear where it can be copied, synced, committed, screenshotted or forwarded.

### Recommended

- **Password manager**: store the full key, service address, purpose, creation date and last rotation date. Record which tool and environment it belongs to.
- **System credential store**: when the tool supports it, prefer the OS credential store, such as Windows Credential Manager, macOS Keychain, or Linux Secret Service/GNOME Keyring/KWallet.
- **Environment variable or dedicated credential file**: better than hard-coding into a project config, but environment variables can still be captured by other processes, diagnostics or logs. Do not keep them on shared machines.
- **CI/CD secret**: store the key in the CI platform's encrypted secret store, and make sure build logs do not print it.
- **Inject on demand**: read the key only in the process or tool that calls the API. Do not put it in a global shell profile, shared config or default startup script.

### Do not

- Do not commit it to Git: this includes `.env`, `settings.json`, `config.toml`, `opencode.json`, CI config and any file synced to a public repository.
- Do not put it in screenshots, recordings, group chats, public issues or chat windows.
- Do not put it in shared configuration, shared shell history or shared CI logs.
- Do not keep it in folders that sync to cloud storage, backups or public directories.
- Do not send the full key to an AI. When asking an AI to help, provide only the variable name, purpose or a redacted prefix.

## Minimize permissions

One key should serve one tool, environment or purpose. Restrict every field you can so a leak has a limited blast radius.

| Control | Recommendation | Purpose |
| --- | --- | --- |
| One key per tool/environment | `codex-local`, `claude-code-ci`, `opencode-laptop` | Independent revocation, accounting and troubleshooting |
| Model limits | Allow only the models this key really needs | Limit what a leaked key can call |
| IP allowlist | Allow only home, office or CI egress IPs / CIDR ranges when supported | Block use from other sources |
| Quota cap | Turn off unlimited quota or set a clear money/token cap | Prevent runaway scripts or theft |
| Expiry | Short-lived for CI; a reasonable expiry for personal use too | Let old keys expire automatically |
| Recognizable name | Include the tool and environment in the name | Easier to identify in logs and bills |

After creating or editing a key, check:

- [ ] This key is used by only one tool or environment
- [ ] It is limited to the necessary models
- [ ] It has a quota cap
- [ ] It has an expiry
- [ ] An IP allowlist is configured when the service supports it
- [ ] The full key is not written into project files or shared config

::: tip Unlimited quota is not unlimited safety
"Unlimited quota" usually removes only the key-level quota. Account balance, concurrent pre-charges and provider risk controls still apply. Do not treat it as a security control.
:::

## What to do after a leak

If a key leaks or you suspect it leaked, stop the exposure first, then investigate. Do not start by deleting local files, and do not only edit configs - deleting a file does not invalidate the key.

### 1. Revoke immediately

Delete, disable or revoke the leaked key in the provider console. The action may be called Delete, Disable, Revoke or something similar. **The provider console is authoritative.**

If the console cannot revoke it right away, follow the provider's security incident process and disable related services if necessary.

### 2. Create a replacement

Create a new key and apply least privilege again: model limits, quota, expiry and IP allowlist. Do not reuse the old key, and do not leave it anywhere.

### 3. Update local config and environment variables

Replace the key everywhere it is used:

- The tool's own credential file or system credential store
- Local environment variables and shell profiles
- CI/CD secrets, deployment environment variables and container secrets
- Servers, NAS, scheduled jobs and other automation

After replacing it, verify the new key with `/v1/models` or the provider's validation method. Do not print the full key in command output, logs or chats.

### 4. Check request logs and billing

Review provider usage, request logs and billing. Look for:

- Requests after the leak time
- Models, source IPs or times you did not use
- Unusual concurrency, token volume or cost

Preserve redacted evidence before contacting the provider. Do not keep using the old key while investigating.

### 5. Clean the leak sources

Work through likely locations:

- **Git**: remove the plaintext key from the working tree, index and history. Revoke first; rewriting history does not invalidate a key by itself.
- **Logs**: application logs, gateway logs, CI logs, terminal output and error reports.
- **Shell history**: Bash/Zsh history, PowerShell PSReadLine history and temporary scripts.
- **CI secrets**: update the secret value and check whether any build step prints it.
- **Screenshots and chats**: delete screenshots, chats, issues, PR comments and ticket attachments that contain the key.
- **Temporary files and backups**: downloads, temp files, editor backups, clipboard history and cloud-storage versions.

### Copyable prompt for an AI

If the AI tool can access local files, give it the prompt below to locate first and modify later. Do not paste the full key; provide only the variable name, purpose or a redacted prefix.

```text
I rotated an API key on this machine. Help me find every place that may still store the old key, but do not print the full key.

The old key's variable name or redacted prefix is: <for example OPENAI_API_KEY, ANTHROPIC_AUTH_TOKEN, sk-abc...>

Please check:
1. The current project, home directory and common tool config directories
2. .env, *.json, *.yaml, *.toml, *.ini, *.config, scripts, Docker and CI config
3. Git tracked files, the index, history and files not covered by .gitignore
4. Shell history, application logs, temporary files and backups
5. CI/CD secrets, system environment variables and system credential stores
6. Credential files for Codex, Claude Code, OpenCode, Copilot and other tools

First list only the matches, including file path, line number, variable name and redacted context. Do not print the full key and do not modify files. Wait for my confirmation before proposing replacement and cleanup steps.
```

If the AI has no local file access, it can only give you search commands; it cannot confirm what remains on your machine.

## Rotate regularly

The full rotation flow is: **new key works → switch configs → observe → revoke old key**.

### Suggested cadence

- **Leak or suspected leak**: rotate immediately, do not wait for the schedule.
- **Teams and CI**: commonly every 30-90 days, or according to company security policy.
- **Personal local use**: every 90 days or according to the provider's recommendation.
- **Lost device, personnel change, tool uninstall, provider security incident**: rotate immediately.
- The exact cadence depends on provider capabilities and your security requirements.

### Safe rotation steps

1. Create a new key with the same or narrower permissions.
2. Verify the new key with `/v1/models` or the provider's validation method.
3. Update every config, environment variable and CI secret, then make a real request.
4. For planned rotation, you may keep the old key briefly as a rollback window (for example 24-72 hours) and watch the logs for anything you missed.
5. Revoke the old key when the rollback window ends.
6. Record the rotation date and the old key's revocation in your password manager.

::: warning No rollback window after a leak
If a key has leaked, revoke it immediately. Do not keep it for a convenient rollback; roll back only with the new key.
:::

If the provider limits how many keys can exist at once, you may not be able to create the new key before deleting the old one. Plan a short outage according to the provider documentation, but do not keep a known-leaked key for long.

## Common mistakes

| Mistake | Why it is dangerous | Correct approach |
| --- | --- | --- |
| Putting a key in a committed file | One commit can leave it in Git history forever | Use environment variables, credential files or secrets; review the diff before committing |
| Sharing one key across tools | One leak forces every tool to be reconfigured, and billing is ambiguous | Create a separate key per tool and environment |
| Treating "unlimited quota" as unlimited safety | It removes only the key-level cap; account balance can still be drained | Set account and key budgets, and monitor usage |
| Deleting a file without revoking the key | The file is gone, but the key is still valid on the server | Revoke first, then clean local and remote copies |
| Sending a key to chat, an issue or a screenshot | It can be indexed, forwarded, cached and backed up | Share only redacted fragments; use a secure secret-sharing method when needed |
| Never rotating or setting an expiry | A leak may remain unnoticed for a long time | Set an expiry and rotate on a schedule |

## Quick checklist

**When creating a key:**

- [ ] One key maps to one tool or environment
- [ ] Model limits, quota cap and expiry are set
- [ ] An IP allowlist is configured when supported
- [ ] The key is stored in a password manager or system credential store

**When a key leaks:**

- [ ] The old key was revoked immediately
- [ ] A new key was created and verified
- [ ] Every local config, environment variable and CI secret was updated
- [ ] Logs and billing were checked
- [ ] Git, logs, shell history, CI secrets and screenshots were cleaned
- [ ] The rotation date and incident were recorded

## Next

- [Prepare an API key](/en/guide/api-key)
- [Concepts: API keys, groups and billing](/en/guide/concepts)
- [FAQ](/en/faq)