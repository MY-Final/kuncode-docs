# Prepare an API Key

AI coding tools call model APIs with a key. The key can come from any provider you trust, including a self-hosted gateway.

## Get a key

The exact flow depends on the provider, usually under "Tokens", "API Keys" or "Keys" in the console:

1. Create a key and give it a name.
2. Optionally set quota, expiry, allowed models or groups.
3. Save, then copy the `sk-xxxxxxxx` value.

::: warning The key is shown once
Most services do not show the full key again. Store it in a password manager immediately.
:::

## Verify the key

Replace the address and key with your own:

```bash
curl https://your-gateway.example.com/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

A model list means the key works. A `401` means see the [FAQ](/en/faq).
