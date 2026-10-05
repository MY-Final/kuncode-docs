# Corporate networks, proxies and custom CAs

This page is for corporate networks, campus networks, environments that require a proxy, and networks that perform HTTPS interception. Its goal is not to replace your network administrator. It helps you decide whether the failure is in the network layer or in the API, key, model or tool configuration.

Related pages:

- Troubleshoot by status code: [Errors and troubleshooting](/en/guide/errors)
- Short answers about proxies and certificates: [FAQ](/en/faq)
- Base URLs and protocol endpoints for each tool: [Choose an endpoint](/en/guide/endpoints)

::: info Platform and tool differences
Tools read proxy settings in different ways. Some use system proxy settings, some use environment variables, and some require a tool-specific proxy option. Corporate domains, certificates and firewall policies also differ. Where this page is not explicit, **follow your network administrator and the tool's official documentation**.
:::

## First decide whether it is a network problem

Look at which layer produced the error:

| Symptom | Common cause | Is it a network problem? |
| --- | --- | --- |
| The hostname cannot be resolved | DNS configuration, VPN, corporate DNS policy | Yes |
| Connection timeout or connection refused | Firewall, missing proxy, blocked port | Yes |
| TLS or certificate error | Corporate HTTPS interception, self-signed certificate, missing root CA | Yes |
| You receive `401`, `403`, `404` or `429` | Key, permission, Base URL or rate limiting | Usually not a pure network problem |
| You receive `500`, `502`, `503`, `504` or `529` | Gateway or upstream failure; a proxy can also cause `502` or `504` | It may be network or server-side |
| Only one tool fails while `curl` works | The tool's proxy, certificate or configuration | Start with the tool configuration |

Check in this order:

1. **Test from the same terminal**. Do not set a proxy in one terminal and run the tool from another.
2. **Request the API node directly first**. Use `curl -v` against your service address or `/v1/models` and see where the request stops.
3. **If there is no HTTP response**, check DNS, TCP 443, TLS and the proxy first.
4. **If you already receive an HTTP status**, continue with [Errors and troubleshooting](/en/guide/errors) and read `status`, `code` / `type` and `message`.
5. **If `curl` works but the tool fails**, check how the tool reads proxy settings, its certificate configuration, Base URL and credential variable.

Use `curl -v` to see the full sequence:

```bash
curl -v https://your-gateway.example.com/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

In the output, look for:

- `Could not resolve host`: DNS problem
- `Connection timed out` or `Connection refused`: network, firewall or port problem
- `SSL certificate problem` or `unable to verify`: certificate problem
- An `HTTP/1.1` or `HTTP/2` status line: the request reached a server

Do not put a full key in screenshots, tickets or chat messages.
## Proxy configuration

There are three common proxy variables. Tools and their underlying HTTP libraries may read either uppercase or lowercase names:

| Variable | Purpose | Example |
| --- | --- | --- |
| `HTTP_PROXY` / `http_proxy` | Proxy for HTTP requests | `http://proxy.example.com:8080` |
| `HTTPS_PROXY` / `https_proxy` | Proxy for HTTPS requests | `http://proxy.example.com:8080` |
| `NO_PROXY` / `no_proxy` | Hosts that must bypass the proxy, usually comma-separated | `localhost,127.0.0.1,.internal.example.com` |

Some tools read only uppercase, some only lowercase, and some ignore these variables entirely. To remove ambiguity, set both forms in the current terminal, then confirm that the tool actually uses the proxy.

PowerShell example:

```powershell
$env:HTTP_PROXY = "http://proxy.example.com:8080"
$env:HTTPS_PROXY = "http://proxy.example.com:8080"
$env:NO_PROXY = "localhost,127.0.0.1,.internal.example.com"

$env:http_proxy = $env:HTTP_PROXY
$env:https_proxy = $env:HTTPS_PROXY
$env:no_proxy = $env:NO_PROXY
```

Bash / Git Bash example:

```bash
export HTTP_PROXY="http://proxy.example.com:8080"
export HTTPS_PROXY="http://proxy.example.com:8080"
export NO_PROXY="localhost,127.0.0.1,.internal.example.com"

export http_proxy="$HTTP_PROXY"
export https_proxy="$HTTPS_PROXY"
export no_proxy="$NO_PROXY"
```

`NO_PROXY` should at least cover localhost and the internal domains that must not use the proxy. The exact matching rules and wildcard support depend on the tool or HTTP library; follow its documentation.

### Windows system proxy

Windows Settings > Network & Internet > Proxy affects applications that read the system proxy. It does **not guarantee** that Node.js, Python, Go or every CLI tool will use it.

You can inspect the current WinHTTP proxy configuration:

```powershell
netsh winhttp show proxy
```

If the tool does not use the system proxy, configure the proxy as described in that tool's official documentation, or set the environment variables above in the terminal that launches the tool. To persist the setting, use Windows environment-variable settings or the tool's own configuration file. Setting a variable in one terminal session does not make it available in a new window.

### Tool-specific proxy settings

Proxy support differs by tool:

- Some read `HTTP_PROXY` / `HTTPS_PROXY` directly
- Some use only the system proxy or a tool-specific configuration option
- Some start child processes that do not inherit the current terminal environment
- Some require separate proxy configuration for Node, Git, npm or another package manager

Check the tool's `--help`, diagnostic command and official documentation. Do not assume that every tool will use the same proxy merely because `curl` works.

::: warning Proxy URLs can contain secrets
A proxy URL may contain a username and password. Do not put commands with plaintext proxy credentials into public scripts, repositories or screenshots. Use your organization's approved credential-management method.
:::
## Custom CA / self-signed certificates

Corporate networks commonly perform HTTPS interception: the corporate proxy re-signs the destination certificate with its own root CA. From the tool's perspective this looks like an untrusted certificate. Common errors include:

- `SELF_SIGNED_CERT_IN_CHAIN`
- `UNABLE_TO_VERIFY_LEAF_SIGNATURE`
- `certificate verify failed`
- `unable to get local issuer certificate`

The correct fix is to add the corporate root certificate to the trust chain, not to disable certificate verification.

### Node.js tools: NODE_EXTRA_CA_CERTS

Many AI coding CLIs are built on Node.js. Node.js can append a PEM-format CA certificate file with `NODE_EXTRA_CA_CERTS`:

```powershell
$env:NODE_EXTRA_CA_CERTS = "C:\certs\corp-root-ca.pem"
codex --version
```

```bash
export NODE_EXTRA_CA_CERTS=/path/to/corp-root-ca.pem
codex --version
```

After setting it, restart the terminal and the tool, then test the API request again. The file must be:

- In PEM format, usually starting with `-----BEGIN CERTIFICATE-----`
- At a path that exists and is readable by the current user
- Sufficient to cover the certificate chain; if the organization uses intermediate CAs, the exact bundle to use is determined by your network administrator
- Set in the parent process that launches the tool, because some tools start their own child processes

### Do not disable TLS verification

Do not use the following to "work around" certificate errors:

- `NODE_TLS_REJECT_UNAUTHORIZED=0`
- `npm config set strict-ssl false`
- `curl --insecure` / `curl -k`
- Disabling all certificate checks in the tool

These settings prevent HTTPS from verifying the peer's identity. An attacker or a misconfigured proxy could then steal the API key and request contents. They are acceptable only as temporary diagnostics in an isolated environment, never as a permanent configuration.

If it still fails after adding the root certificate, check:

1. Whether the certificate is the actual root or intermediate CA used by your organization
2. Whether the file is PEM format and the path is correct
3. Whether the tool really read `NODE_EXTRA_CA_CERTS`
4. Whether the proxy rewrites the certificate so the presented chain does not match the supplied root
5. Whether you also need to configure the system trust store, Git, npm or a tool-specific CA setting
## DNS and firewall

Confirm at least the following:

| Item | What to confirm |
| --- | --- |
| API node hostname | Whether DNS resolves your service address correctly |
| Port | Port `443` is usually required; use a plain HTTP port only when the service explicitly requires it |
| Authentication and update hosts | If the tool or provider requires login, download, update or telemetry hosts, allow them as documented by the provider |
| Proxy egress | A proxy, CDN or VPN can change the source IP seen by the gateway and affect IP allowlists |
| DNS split | Corporate DNS, VPN DNS and public DNS may return different addresses |

Useful test commands:

```powershell
Resolve-DnsName your-gateway.example.com
Test-NetConnection your-gateway.example.com -Port 443
```

```bash
nslookup your-gateway.example.com
curl -v https://your-gateway.example.com/v1/models
```

Common signs:

- **DNS resolution failure**: `Could not resolve host`, `Name or service not known`
- **TCP connection failure**: `Connection timed out`, `Connection refused`
- **TLS handshake failure**: certificate error, `SSL_ERROR`, handshake timeout
- **Proxy authentication failure**: the proxy returns `407 Proxy Authentication Required`
- **Proxy or gateway timeout**: `502`, `504`, or a long period without a response

Do not disable the firewall or ignore certificate errors just to make the request pass. Give the hostname, port and error text to your network administrator.

## Troubleshooting order

Work through this order; it usually identifies the failing layer:

1. Confirm the API node hostname, port and the current network or VPN.
2. Run `curl -v` in the same terminal and note where the request stops.
3. Test DNS resolution and the TCP connection to port 443 separately.
4. Check `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY`, including the uppercase and lowercase forms.
5. Check whether Windows system proxy settings and the tool's own proxy settings agree.
6. If a certificate error appears, configure a custom CA as documented by the tool instead of disabling TLS verification.
7. If an HTTP status is returned, continue with [Errors and troubleshooting](/en/guide/errors) and read the status and `code`.
8. If `curl` works but the tool fails, check whether the tool reads the proxy, inherits the environment variables and needs its own CA setting.
9. If no method can reach the service, give the hostname, port, error text and test results to your network administrator.

## What to include in a report

When reporting to the tool maintainer, the service provider or your network administrator, include:

- Tool name and version, operating system and terminal type
- The API node hostname (never the full key)
- Request time, including timezone
- HTTP status, `code` / `type`, `message` and request ID if available
- The relevant `curl -v` output, especially DNS, connection, TLS and HTTP status lines
- Results from `Resolve-DnsName` / `nslookup` and the port test
- Whether you use a VPN, proxy, corporate network or custom CA
- The proxy variable names and whether they are set (never the proxy password)
- The complete certificate error text

Do not include an unredacted API key, proxy credentials or complete request headers. If authentication must be investigated, provide only a redacted prefix and the variable name.

## Next

- [Errors and troubleshooting](/en/guide/errors)
- [FAQ](/en/faq)
- [API key security and rotation](/en/guide/security)