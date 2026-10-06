# Concepts: API keys, groups and billing

This page explains the terms you keep meeting in the console: **API key, group, channel, model, ratio and quota**.

Once these are clear, you know what every field means when configuring Codex, Claude Code, OpenCode or GitHub Copilot CLI.

## What happens on one request

```
Your tool
  │  sends the API key
  ▼
API key (identifies you)
  │  chooses a group
  ▼
Group (picks a channel + sets the ratio)
  │  selects an available channel
  ▼
Channel (the real connection to an upstream provider)
  │
  ▼
Upstream model (gpt-5, claude-sonnet-4, deepseek-flash...)
  │
  ▼
Metered by usage, deducted from account balance and key quota
```

In one line: **the API key proves who you are, the group decides the route and the price, the channel does the forwarding, and the model does the work.**

## What an API key is

An API key (also called a token) is the credential you use to call the API.

- Often looks like `sk-xxxxxxxx`, but the format is set by the provider and does not always start with `sk-`
- Belongs to a user, and can carry its own quota, expiry and restrictions
- The server stores only what it needs to verify; **the full key is usually shown once**

Send it in the request header:

```
Authorization: Bearer sk-xxxxxxxx
```

::: warning The key is shown once
Most services never show the full key again. Copy it **immediately** into a password manager.

If you lose it, delete the token and create a new one. Anyone holding the key can spend your quota.
:::

### Why one key per tool

Give Codex, Claude Code, OpenCode and GitHub Copilot CLI separate keys:

- **Accounting** - you can see which tool spent what
- **Debugging** - one tool breaking does not affect the others
- **Revocation** - a leaked key can be deleted alone

## Fields when creating a key

### Name

A label for your own reference only.

Name it by purpose, e.g. `codex-local`, `claude-code-ci`.

### Group

Decides which group's channels this key uses, and at what ratio.

Empty means "follow my user group". If you set one, it must be a group you are allowed to use, otherwise requests are rejected (`403`).

Groups are covered in detail below.

### Expiration time

- **Never expires** - valid until deleted
- A specific time - the key stops working after it, returning `401`

Optional for personal local use; recommended for teams and CI.

### Quantity

How many keys to create at once. `N` creates N keys with random suffixes.

Usually `1`.

### Unlimited quota

- **On** - this key has no separate limit; it spends the account balance
- **Off** - the key gets its own quota and stops working when it runs out

::: tip Both levels are checked
A request checks **account balance** and **key quota**; failing either one fails the request.

**Unlimited quota only removes the key-level limit and remains subject to the account balance.** If the account balance is too low, the request is rejected even when the key has unlimited quota.
:::

### Quota

Shown when unlimited quota is off. The amount this key may spend.

The unit depends on your deployment: it may be money or tokens.

### Advanced: model limits

Allow this key to call only the selected models. Empty means all models. See [Models and capabilities](./models) for the list.

Useful to isolate tools, e.g. a key limited to `deepseek-flash`.

### Advanced: IP allowlist

Allow the key only from the listed IPs or CIDR ranges, one per line. Empty means no restriction.

::: warning Do not over-trust the IP allowlist
An IP allowlist depends on the gateway seeing the real source IP. A proxy, CDN, or corporate egress point can change the source IP, and misconfigured `X-Forwarded-For` handling or a shared egress IP can also cause problems. Make sure the gateway receives the real client IP, and do not treat the allowlist as your only protection.
:::

## What a group is

**A group is a set of channels plus a set of ratio rules.**

A group can hold several channels, and the same model may be reachable through more than one channel in that group. When a request arrives, the system picks an available channel inside the group.

A group decides two things:

1. **Which channels are used** - what upstreams the group contains
2. **What it costs** - the same model can be priced differently per group

### User group vs key group

The same group name plays two roles:

| Role | Meaning |
| --- | --- |
| **User group** | The group your account belongs to; decides which groups you may use by default |
| **Key group** | The group set on this key; overrides the user default |

Empty group on the key → use your user group.
Group set on the key → use that one, if you are allowed.

For example, a `default` user whose key sets `vip`: if `default` users may access `vip`, the key is routed and billed as `vip`.

### Common groups

| Group | Meaning |
| --- | --- |
| `default` | Default group; where most users start |
| `vip` / `svip` | Usually cheaper or higher-quality channels |
| Custom | Administrators split channels by cost or purpose |

### Auto group

Some deployments offer `auto`: try several groups in order and move to the next when the current one has no usable channel.

Two related settings:

- **Auto group order** - which groups to try, in what order
- **Cross-group retry** - after all channels in a group fail, continue with the next group

Useful when you want high availability without switching manually.

::: tip More groups is not better
More groups make billing and debugging harder. For personal use pick one group; use the default if unsure.
:::

## What a channel is

A channel is the real line to an upstream provider. It holds:

- The upstream address
- The upstream credential
- The models it supports
- The group it belongs to

One model can have several channels; the system picks one by group and availability.

Users normally do not touch channels directly, only through groups. Administrators configure them.

## What a ratio is

A ratio is a billing multiplier. What a request finally costs is decided by several ratios together.

| Concept | Meaning |
| --- | --- |
| **Model ratio** | The price coefficient of the model itself |
| **Group ratio** | The price coefficient of the group |
| **User-group ratio** | An override for a specific user group; outranks the group ratio |
| **Completion ratio** | The coefficient of output tokens relative to input tokens |
| **Cache ratio** | The discount coefficient for cached tokens |

Roughly:

```
cost ≈ usage × model ratio × group ratio
```

Output tokens are further multiplied by the completion ratio, and cached tokens by the cache ratio.

To turn a ratio into money, you first need the **base unit price used by that service**. Base prices, units, rounding and treatment of cache/reasoning tokens differ between services. This documentation does not embed any provider's price list. The following is a worked example with hypothetical numbers only:

Assume:

- Base input price: `$0.000002 / token`
- Model ratio: `1.5`
- Group ratio: `0.8`
- Completion ratio for output tokens: `4`
- This request: `10,000` input tokens and `2,000` output tokens, with `1,000` input tokens served from cache
- Cache ratio: `0.25`, and cached tokens are still charged at the input base price

Estimate:

```
uncached input = 9,000 × 0.000002 × 1.5 × 0.8 = 0.0216
cached input   = 1,000 × 0.000002 × 1.5 × 0.8 × 0.25 = 0.0006
output         = 2,000 × 0.000002 × 1.5 × 0.8 × 4 = 0.0192

estimated total ≈ 0.0414 (the service's bill is authoritative)
```

The real amount also depends on the service's billing rules, rounding and final settlement.

::: tip Why the same model costs different amounts
The model ratio is the same, but the group ratio differs, so the final price differs.

A lower group ratio means the same usage is charged less.
:::

## What quota is

Quota is your budget. There are two levels:

| Level | Meaning |
| --- | --- |
| **Account balance** | The whole account's budget, shared by all keys |
| **Key quota** | A single key's cap; can be disabled with unlimited quota |

Both are checked on every request:

- Not enough account balance → request rejected
- Not enough key quota → request rejected
- Key has unlimited quota → only the account balance is checked

### Pre-charge and settlement

Streaming or long requests usually **pre-charge** part of the quota, then **settle** by actual usage when the request finishes, refunding or charging the difference.

So a log may show the pre-charged amount first and the final amount later. That is normal.

Whether the following cases are billed, and how much, differs between services. **Treat the service as authoritative:**

- A request fails after the upstream has already produced tokens
- A streaming request is interrupted after partial output
- The client times out or cancels the request
- An automatic retry succeeds only on one attempt
- Concurrent requests occupy several pre-charge holds

When reconciling a bill, keep the request time, model ID, request ID and the pre-charge/settlement log entries, then compare them with the service bill.

### When quota runs out

| Case | Result |
| --- | --- |
| Key quota exhausted | The key usually becomes temporarily unusable, commonly `401`; recovery depends on the service |
| Account balance too low | Request rejected, commonly `401`, `402` or another status |
| Key expired | The key stops working, `401` |
| Key disabled | The key stops working, `401` |

::: warning Recovering from exhausted quota
Whether an exhausted key quota can be restored by raising the quota, topping up or editing the key **depends on the service**.

If the service allows raising the key quota, you usually do not need to recreate the key. If it treats exhaustion as permanent or does not allow editing the key, delete and recreate it, then update every client configuration.

Whether recovery is immediate or requires a client restart also depends on the service. Do not diagnose it by retrying repeatedly; check the console and logs first.
:::

## Security and best practices

- **Never put a key in a file that gets committed to Git**, e.g. a project `settings.json`
- Prefer a tool's own credential file or environment variables, e.g. OpenCode's `/connect`
- Create one key per tool and per purpose
- Rotate keys regularly
- Narrow permissions with **model limits** and the **IP allowlist**
- On a leak, delete and recreate the key; do not just edit the config

## Common questions

### 401 Unauthorized

The key was not sent, is wrong, expired, disabled, or out of quota. Check that it is complete and still valid.

### 403 Forbidden

Usually a permission problem: the key's group is not one you may use, or the IP is not on the allowlist.

### 404 Not Found

Wrong base URL, or an extra path. See [Choose an endpoint](./endpoints).

### Unknown model

The model is not in the current group's available list. Query `/v1/models` for the real names, then check whether the group serves that model. See [Models and capabilities](./models).

### Balance left, but the request is rejected

Possible causes: key quota exhausted, key expired, no permission for the group, model restricted, IP not allowlisted.

Check in this order: confirm the active credential → key quota → group permission → model limits → IP allowlist.

::: tip `/status` is not a universal HTTP endpoint
`/status` is a slash command in clients such as Claude Code. It shows the configuration and credential that client has loaded. It is not a universal HTTP endpoint provided by every compatible gateway, and it is not an endpoint defined by this documentation. For other tools, use that tool's diagnostics or the console.
:::

## Cheat sheet

| Concept | In one line |
| --- | --- |
| API key | Your credential; often looks like `sk-xxxxxxxx`, but does not always start with `sk-` |
| Group | A set of channels plus ratio rules |
| Channel | The real line to an upstream provider |
| Model | The model that finally handles the request |
| Ratio | A billing multiplier |
| Quota | Your spendable budget |

## Next

- [Prepare an API key](./api-key)
- [Choose an endpoint](./endpoints)
- [Tools](/en/tools/)