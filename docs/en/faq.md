# FAQ

These issues are provider-agnostic and apply to any compatible gateway.

## 401 Unauthorized

1. Make sure the key is complete with no whitespace.
2. Make sure the header is `Authorization: Bearer sk-xxx`.
3. Make sure the key is not expired, disabled, or out of quota.
4. Verify with `curl` to rule out tool-specific issues.

## 404 Not Found

- Base URL is wrong or has extra path segments.
- The service does not expose that protocol endpoint.
- The tool appended a duplicate `/v1`.

## Unknown model

Call `/v1/models` and use one of the returned names.

## Timeouts

- Check local network and proxy settings.
- Retry with another model or channel.
- For long requests only, raise the tool's timeout.

## Cost or usage mismatch

Filter by time range in your provider's log or billing page and compare per-request input, output, cache and cost.
This documentation does not assume any specific platform; check your provider's own docs for entry points.
