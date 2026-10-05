# Prepare an API Key

Whatever tool you use - Codex, Claude Code or OpenCode - the first step is the same: **create an API key and note your service address**.

You only do this once. The per-tool guides all link back here.

## 1. Open the API keys page

Sign in to your service console, open the **API Keys** page and click **Create API Key** in the top right.

## 2. Fill in the form

![Create API key form](/images/api-key/create-token.png)

The form has several fields, but most can stay at their defaults. These are the ones that matter:

| Field | Meaning | Recommendation |
| --- | --- | --- |
| **Name** | A label only you see | Name it by purpose, e.g. `codex-local` |
| **Group** | Chooses the upstream channel and rate | Use the default if unsure |
| **Expiry** | The key stops working after this time | Pick "never" or set as needed |
| **Count** | How many keys to create at once | Usually `1` |
| **Unlimited quota** | Whether to cap this key spend | On follows your balance; off lets you set a cap |

::: tip Create one key per tool
Give Codex and Claude Code separate keys. Billing, debugging and revocation all get easier.
Sharing one key is possible, but you cannot tell who used it.
:::

Click **Save changes** at the bottom right when done.

## 3. Copy the key and note the service address

![Copy the key and read the API endpoint from the list](/images/api-key/copy-key.png)

Back on the list there are two things to record.

**1. Copy the key**

In the **API Key** column, click the copy button next to the key.

::: warning The key is shown once
Most services do not show the full key again. Copy it **immediately** into a password manager.

If you lose it, delete the token and create a new one.
:::

**2. Note the API endpoint**

The **API endpoint** shown above the list is your service address, for example `https://kuncode.120403.xyz`.

This address is used throughout the setup guides and is referred to as the **Base URL**.

::: tip No trailing slash
Record it as `https://kuncode.120403.xyz`, not `https://kuncode.120403.xyz/`.
:::

## 4. Verify the key works

Before configuring any tool, confirm the key itself works:

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

Replace the address and key with your own. A model list means the key is fine. See [Models and capabilities](./models) for choosing a model.

| Response | Meaning | Next step |
| --- | --- | --- |
| Model list | Key works | Continue to [Choose an endpoint](./endpoints) |
| `401 Unauthorized` | Wrong, expired or disabled key | Check the copy and the expiry |
| Out of quota | Account balance too low | Top up or raise the key quota |

## Next

To understand API keys, groups and ratios first, read [Concepts](./concepts).

Once the key and address are ready, continue with your tool:

- [Codex setup](/en/tools/codex)
- [Claude Code setup](/en/tools/claude-code)
- [OpenCode setup](/en/tools/opencode)

## Optional: narrow the permissions

If security matters, expand **Advanced settings** when creating the token:

- **Model limits** - restrict this key to specific models
- **IP allowlist** - restrict this key to specific IPs or CIDR ranges

Both are optional. Skip them for personal local use; enable them for teams or CI.
