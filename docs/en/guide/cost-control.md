# Cost control: keeping usage from running away

This page is about **keeping AI coding tools from overspending**, not about accounting or finance. It covers limits before you run, constraints while running, and checks afterwards. The exact quota, price, log and billing fields depend on your provider console.

Related pages:

- Account balance, key quota, ratios and pre-charges: [Concepts](/en/guide/concepts)
- Limits you can set when creating a key: [Prepare an API key](/en/guide/api-key)
- Narrowing key permissions and handling a leak: [API key security and rotation](/en/guide/security)
- Common symptoms such as quota errors and cost mismatches: [FAQ](/en/faq)

::: info Provider differences
Balance, key quota, model limits, IP allowlists, expiry, logs and billing fields differ by provider. The steps below are general; **the provider console is authoritative**.
:::

## Three concepts to separate first

Runaway cost usually has more than one cause. Separate the three levels of control:

| Level | What it is | Who it affects | Typical controls |
| --- | --- | --- | --- |
| **Account balance** | The whole account's budget | Every key and tool under the account | Top-up amount, account-level cap, alerts |
| **Key quota** | A single key's spending cap | The tool or environment using that key | Turn off unlimited quota and set a cap |
| **Per-request usage** | The tokens and cost of one call | That request alone | Context, output limit, retries and concurrency |

One request is subject to all three. Insufficient account balance or key quota fails the request; an oversized request can raise cost directly or hit a context limit.

::: tip Unlimited quota is not an unlimited budget
"Unlimited quota" usually removes only the key-level cap. The account balance is still charged. As long as the account has balance, a script can keep spending. To control cost, set an account-level budget, a key-level quota, or both.
:::

## Before you run

The goal is to cap the loss even if a tool misbehaves, a script runs away or a key leaks.

### One key per tool

Create a separate key for Codex, Claude Code, OpenCode, Copilot CLI and each IDE tool. This lets you:

- See which tool spent the money
- Revoke only the affected key when one tool fails
- Give higher-risk tools a lower quota

See [Prepare an API key](/en/guide/api-key).

### Set a key quota cap

When the provider supports it, turn off unlimited quota and set a clear cap per key. The unit may be money or tokens; the console is authoritative.

Recommended:

- Start with a very small cap to prove the flow works
- Raise it gradually once usage matches expectations
- Give high-risk cases (automation, CI, batch jobs) their own key with a lower cap
- Do not set every tool to unlimited quota

### Set an expiry

Set a reasonable expiry, especially for temporary tests, CI and shared environments:

- CI and temporary jobs: use a short lifetime
- Personal local use: still set a date that forces periodic review
- A long-lived key is easier to keep abusing after a leak

An expired key stops working automatically, which limits long-term risk. Timezone and allowed ranges depend on the provider.

### Limit the model range

Use model limits to narrow a key to the models it really needs:

- Everyday chat and simple tasks: limit to a cheap, sufficient model
- Complex coding: create a separate key and allow only the expensive models you need
- Avoid one general key that can call every expensive model in the account

Model names must exactly match the IDs returned by `/v1/models`. Field names and availability depend on the provider console.

### Use an IP allowlist

When supported, restrict a key to your office, home or CI egress IPs. An IP allowlist is not the only security control, but it reduces the chance that a leaked key is used from elsewhere.

A proxy, CDN, VPN or corporate network can change the egress IP seen by the gateway. After configuring the allowlist, confirm that the actual egress IP still matches. See [Corporate networks, proxies and custom CAs](/en/guide/network).

### Prefer cheaper models

When the task allows it, prefer cheaper or free models:

- Simple questions, formatting and summaries: prefer a small model
- Everyday coding: start with a mid-priced model and upgrade only if needed
- Complex refactors and long-context work: use the expensive model then
- For batch jobs, confirm model capability first so failed tool calls do not cause repeated retries

Do not look at unit price alone. Check whether the model supports tool calls, long context and the protocol you use. A cheap model that fails often and forces retries can cost more overall.

## While it runs

The goal is to notice and stop growing cost while the work is in progress.

### Control context length

Longer context means more input tokens and higher cost. Common practices:

- Do not carry unrelated history into every turn
- Summarize long documents first, then work from the summary
- Start a new session periodically so history does not grow forever
- Give the model only the necessary file fragments, not the whole repository at once
- Watch the tool's context-compression or history-trimming settings

### Limit maximum output

Output tokens are usually more expensive than input. Set a reasonable output limit for long tasks:

- Use a smaller output limit for simple tasks
- Raise it only when long content is genuinely needed
- Do not use an oversized default output for batch jobs
- Field names differ by tool, for example `max_tokens`, `max_output_tokens` or a UI field for maximum output length

### Avoid infinite retries

A retry can create a second upstream request and be billed twice. To control this:

- 4xx usually should not be retried automatically; fix the request first
- For 429, follow `Retry-After` or exponential backoff and cap the number of attempts
- 5xx may be retried a limited number of times, but never in an infinite loop
- After a streaming response has emitted output, do not retry blindly
- Set maximum retries and timeouts in the tool; do not rely on defaults

See [Errors and troubleshooting](/en/guide/errors) for the error handling details.

### Stop streaming requests promptly

A streaming request keeps producing tokens while it outputs. When it goes off track, stop it instead of waiting for it to finish:

- Stop immediately when output is clearly wrong, repetitive or fabricated
- Set an overall timeout for batch jobs
- Do not let unattended scripts wait forever
- After stopping, check the logs to see whether it was billed and whether a retry is safe

Whether an interrupted request refunds the pre-charge and whether emitted content is billed depends on the provider. **Use the bill and request log as the source of truth.**

### Pilot batch jobs on a small sample

Before a large batch:

1. Run 1 to 5 samples end to end.
2. Check output quality, token usage and failure rate.
3. Confirm the cost is acceptable before scaling up.
4. Set a maximum count, concurrency and total budget for the batch.
5. If many requests fail, pause first instead of letting it retry forever.
## After it runs

The goal is to confirm what was actually spent, spot anomalies and stop the bleeding when necessary.

### Read the logs

In the provider's log or request records, filter by time range and check:

- Request time, model ID, endpoint and request ID
- Input tokens, output tokens and cached tokens
- Pre-charged amount and final settled amount
- Request status, error code and retry count

If the log supports filtering by key, start with the key for the affected tool. That usually identifies which tool spent the money.

### Reconcile pre-charge and settlement

Streaming and long requests may pre-charge first and settle by actual usage afterwards. Seeing one deduction does not necessarily mean it is the final cost:

- A pre-charge holds part of the quota; settlement refunds or charges the difference
- Whether failures, interruptions, timeouts and retries are billed depends on the provider
- Concurrent requests may hold several pre-charges at once
- If available balance drops suddenly, check whether several pre-charges have not settled yet

### Filter by time range

When cost looks wrong, narrow the time range first:

- Compare usage in the same period before and after the anomaly
- See whether it concentrates on one model, key or tool
- Check for requests outside working hours
- Check for unusually large single-request token usage or concurrency

### Revoke the key immediately on an anomaly

If a key leaked, a script ran away or the key is being abused:

1. Revoke or disable the affected key in the provider console to stop further spending.
2. Check logs and billing; record the abnormal time, model, source and usage.
3. Create a new key with least privilege and a lower quota and stricter model limits.
4. Update every tool, environment variable and CI secret.
5. Clean up the leak source as described in [API key security and rotation](/en/guide/security).

Do not only delete a local config file. Deleting a file does not invalidate the key on the server.

## Copyable prompt for an AI

If the AI tool can read your local configuration, give it the prompt below and let it inspect without changing anything. Do not paste the full key; provide only variable names, config paths and redacted information.

```text
Inspect my current AI coding tool configuration and find settings that could cause runaway cost. Only inspect and list the problems first; do not modify any files.

Check especially:
1. Any key with unlimited quota, or with no quota cap
2. Any key with no expiry
3. Any key that can call every model in the account, with no model limit
4. Any key shared by multiple tools, making cost attribution impossible
5. An oversized context window, maximum output or retained history
6. Unlimited retries, an excessively long timeout or very high concurrency
7. Any batch job, scheduled task or CI job using a high-quota key
8. Plaintext keys in config files that could be committed to Git

List the result as: risk level / file or setting / current value / suggested value / whether my confirmation is needed. Do not print the full key and do not modify the configuration.
```

If the AI cannot access local files, it can only give you a checklist and commands; it cannot confirm your actual configuration.

## Common misconceptions

| Misconception | Reality | Correct approach |
| --- | --- | --- |
| "Unlimited quota" means unlimited free usage | It removes only the key-level cap; the account balance is still charged | Set an account-level budget or key-level quota and monitor usage |
| A cache hit is free | Caching is usually a discount; whether and how much is charged depends on the provider | Use the bill and the model's billing documentation |
| Failed requests are always free | Upstream tokens, streaming interruptions and timeouts may still be billed | Check request logs and settlement rules; do not probe by retrying |
| Retries never double-charge | A retry can create a second upstream request and be billed again | Cap retries; after partial streaming output, do not retry blindly |
| Deleting a key locally makes it safe | The key is still valid on the server and can still be used by others | Revoke it in the console first, then clean local and CI configs |
| A cheaper model always costs less | Frequent failures and retries can make it more expensive | Evaluate success rate, tool-call support and actual usage together |

## Quick checklist

**At configuration time:**

- [ ] Each tool uses its own key
- [ ] Unlimited quota is off, or an explicit key quota is set
- [ ] A reasonable expiry is set
- [ ] The key is limited to the necessary models
- [ ] An IP allowlist is configured when supported
- [ ] Batch jobs use a separate low-quota key

**While using it:**

- [ ] Control context length and start new sessions periodically
- [ ] Set a reasonable maximum output
- [ ] Cap retries instead of retrying forever
- [ ] Stop a streaming request promptly when it goes off track
- [ ] Pilot batch jobs on a small sample

**At review time:**

- [ ] Check logs and billing by time range and key
- [ ] Reconcile pre-charges with final settlement
- [ ] Revoke the key immediately on an anomaly
- [ ] Create a replacement with least privilege and update every config

## Next

- [Concepts: API keys, groups and billing](/en/guide/concepts)
- [Prepare an API key](/en/guide/api-key)
- [API key security and rotation](/en/guide/security)
- [FAQ](/en/faq)