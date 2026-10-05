# FAQ

These issues are provider-agnostic and apply to any compatible gateway.

For a systematic walkthrough by status code, see [Errors and troubleshooting](/en/guide/errors).

## 401 Unauthorized

See [Errors · 401](/en/guide/errors#_401-unauthorized).

1. Make sure the key is complete with no whitespace.
2. Make sure the header is `Authorization: Bearer sk-xxx`.
3. Make sure the key is not expired, disabled, or out of quota.
4. Verify with `curl` to rule out tool-specific issues.

## 404 Not Found

See [Errors · 404](/en/guide/errors#_404-not-found).

- Base URL is wrong or has extra path segments.
- The service does not expose that protocol endpoint.
- The tool appended a duplicate `/v1`.

## Unknown model

Call `/v1/models` and use one of the returned names. Note a missing model usually returns 503, not 404.

See [Models and capabilities](/en/guide/models) and [Errors · 503](/en/guide/errors#_503-service-unavailable).

## Timeouts

See [Errors · 504](/en/guide/errors#_504-gateway-timeout).

- Check local network and proxy settings.
- Retry with another model or channel.
- For long requests only, raise the tool's timeout.

## Cost or usage mismatch

Filter by time range in your provider's log or billing page and compare per-request input, output, cache and cost.
This documentation does not assume any specific platform; check your provider's own docs for entry points.
