# 企业网络、代理与自定义 CA

这一页面向公司网络、校园网、需要代理，或存在 HTTPS 拦截的环境。目标不是替代网络管理员，而是帮你判断问题是在网络层，还是在 API、密钥、模型或工具配置层。

相关页面：

- 按状态码排查：[错误码与排障](/guide/errors)
- 代理与证书的短问答：[常见问题](/faq)
- 各工具的 Base URL 和协议入口：[选择接入方式](/guide/endpoints)

::: info 平台与工具差异
不同工具读取代理变量的方式不同，有些只读系统代理，有些只读环境变量，有些需要工具自己的代理设置。公司网络的域名、证书和放行策略也各不相同。本文未明确的部分，**以你的网络管理员和工具官方文档为准**。
:::

## 先判断是不是网络问题

先看错误发生在哪一层：

| 现象 | 常见原因 | 是否属于网络问题 |
| --- | --- | --- |
| 域名无法解析 | DNS 配置、VPN、公司 DNS 策略 | 是 |
| 连接超时、连接被拒绝 | 防火墙、代理未配置、端口被拦截 | 是 |
| TLS / 证书错误 | 企业 HTTPS 拦截、自签证书、根证书未安装 | 是 |
| 能收到 `401`、`403`、`404`、`429` | 密钥、权限、Base URL、限流 | 通常不是纯网络问题 |
| 能收到 `500`、`502`、`503`、`504`、`529` | 网关或上游异常；代理也可能导致 `502` / `504` | 可能是网络，也可能是服务端 |
| 只有某个工具失败，`curl` 正常 | 工具自身的代理、证书或配置 | 先按工具配置排查 |

判断顺序：

1. **在同一个终端里测试**。不要在一个终端设置代理，却在另一个终端运行工具。
2. **先直接请求 API 节点**。用 `curl -v` 访问你的服务地址或 `/v1/models`，看请求停在哪一步。
3. **如果没有 HTTP 响应**，优先查 DNS、TCP 443、TLS 和代理。
4. **如果已经返回 HTTP 状态码**，转到[错误码与排障](/guide/errors)，按 `status`、`code` / `type`、`message` 判断。
5. **如果 `curl` 正常、只有工具失败**，检查工具的代理读取方式、证书配置、Base URL 和认证变量。

可以用 `curl -v` 观察完整过程：

```bash
curl -v https://your-gateway.example.com/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

输出中重点看：

- `Could not resolve host`：DNS 问题
- `Connection timed out` 或 `Connection refused`：网络、防火墙或端口问题
- `SSL certificate problem`、`unable to verify`：证书问题
- 出现 `HTTP/1.1` 或 `HTTP/2` 状态行：请求已经到达某个服务端

不要把完整 Key 写进截图、工单或聊天记录。

## 代理配置

常见的代理环境变量有三组，大小写都可能在工具或底层库里被读取：

| 变量 | 作用 | 示例 |
| --- | --- | --- |
| `HTTP_PROXY` / `http_proxy` | HTTP 请求使用的代理 | `http://proxy.example.com:8080` |
| `HTTPS_PROXY` / `https_proxy` | HTTPS 请求使用的代理 | `http://proxy.example.com:8080` |
| `NO_PROXY` / `no_proxy` | 不走代理的地址列表，通常用逗号分隔 | `localhost,127.0.0.1,.internal.example.com` |

有些工具只读大写，有些只读小写，有些完全不读环境变量。为了避免歧义，可以在当前终端里同时设置大写和小写变量，再确认工具实际是否使用代理。

PowerShell 示例：

```powershell
$env:HTTP_PROXY = "http://proxy.example.com:8080"
$env:HTTPS_PROXY = "http://proxy.example.com:8080"
$env:NO_PROXY = "localhost,127.0.0.1,.internal.example.com"

$env:http_proxy = $env:HTTP_PROXY
$env:https_proxy = $env:HTTPS_PROXY
$env:no_proxy = $env:NO_PROXY
```

Bash / Git Bash 示例：

```bash
export HTTP_PROXY="http://proxy.example.com:8080"
export HTTPS_PROXY="http://proxy.example.com:8080"
export NO_PROXY="localhost,127.0.0.1,.internal.example.com"

export http_proxy="$HTTP_PROXY"
export https_proxy="$HTTPS_PROXY"
export no_proxy="$NO_PROXY"
```

`NO_PROXY` 至少要覆盖本机地址和你明确不需要走代理的内网域名；具体匹配规则和是否支持通配符，以工具或底层 HTTP 库的文档为准。

### Windows 系统代理

Windows 的“设置 → 网络和 Internet → 代理”只影响读取系统代理的应用，**不保证** Node.js、Python、Go 或各 CLI 工具都会使用它。

可以先查看当前系统代理配置：

```powershell
netsh winhttp show proxy
```

如果工具没有使用系统代理，按该工具的官方文档设置代理，或在启动工具的终端里设置上面的环境变量。需要持久化时，使用系统“环境变量”设置或工具自己的配置文件；不要只把变量写在一次性的终端会话里，然后期待新窗口也生效。

### 工具自身代理设置

不同工具对代理的支持不同：

- 有的直接读取 `HTTP_PROXY` / `HTTPS_PROXY`
- 有的只使用系统代理或工具自己的配置项
- 有的会在启动子进程后丢失当前终端的环境变量
- 有的需要给 Node、Git、npm、包管理器分别配置代理

先查工具的 `--help`、诊断命令和官方文档。不要因为 `curl` 能走代理，就默认所有工具都会自动走同一个代理。

::: warning 代理地址也可能包含敏感信息
代理 URL 里可能带有用户名和密码。不要把带明文代理凭据的命令写进公开脚本、仓库或截图；使用公司认可的凭据管理方式。
:::

## 自定义 CA / 自签名证书

企业网络常用 HTTPS 拦截：公司代理会用自己的根证书重新签发目标站点证书。对工具来说，这看起来像“证书不受信任”，常见错误包括：

- `SELF_SIGNED_CERT_IN_CHAIN`
- `UNABLE_TO_VERIFY_LEAF_SIGNATURE`
- `certificate verify failed`
- `unable to get local issuer certificate`

正确做法是把公司根证书加入信任链，而不是关闭证书校验。

### Node.js 工具：NODE_EXTRA_CA_CERTS

很多 AI 编程 CLI 基于 Node.js。Node.js 支持通过 `NODE_EXTRA_CA_CERTS` 追加一个 PEM 格式的 CA 证书文件：

```powershell
$env:NODE_EXTRA_CA_CERTS = "C:\certs\corp-root-ca.pem"
codex --version
```

```bash
export NODE_EXTRA_CA_CERTS=/path/to/corp-root-ca.pem
codex --version
```

设置后重新启动终端和工具，再测试 API 请求。文件要求：

- 使用 PEM 格式，通常以 `-----BEGIN CERTIFICATE-----` 开头
- 文件路径必须存在且当前用户可读
- 如果公司使用多级证书，可能需要包含完整的 CA 链，具体以网络管理员提供的内容为准
- 某些工具会启动自己的子进程，环境变量必须在启动工具的父进程里设置

### 不要关闭 TLS 校验

不要使用下面这类做法“绕过”证书错误：

- `NODE_TLS_REJECT_UNAUTHORIZED=0`
- `npm config set strict-ssl false`
- `curl --insecure` / `curl -k`
- 在工具里关闭全部证书校验

这些做法会让所有 HTTPS 连接都无法确认对端身份，攻击者或错误代理可以窃取 API Key 和请求内容。它们只能作为隔离环境里的临时诊断手段，不能作为长期配置。

如果加入根证书后仍然失败，检查：

1. 证书是否是公司实际使用的根证书或中间证书
2. 文件是否是 PEM 格式，路径是否写对
3. 工具是否真的读取了 `NODE_EXTRA_CA_CERTS`
4. 代理是否改写了证书，导致实际证书链和拿到的根证书不匹配
5. 是否需要同时配置系统信任库、Git、npm 或工具自己的 CA 设置

## DNS 与防火墙

至少要确认：

| 项目 | 需要确认什么 |
| --- | --- |
| API 节点域名 | 你的服务地址能否被 DNS 正确解析 |
| 端口 | 通常需要放行 `443`；明文 HTTP 端口只在服务明确要求时使用 |
| 认证与更新域名 | 如果工具或服务商要求访问官方登录、下载、更新或遥测域名，也要按官方文档放行 |
| 代理出口 | 代理、CDN、VPN 可能改变网关看到的来源 IP，可能影响 IP 白名单 |
| DNS 分流 | 公司 DNS、VPN DNS 和公共 DNS 可能返回不同地址 |

常用测试命令：

```powershell
Resolve-DnsName your-gateway.example.com
Test-NetConnection your-gateway.example.com -Port 443
```

```bash
nslookup your-gateway.example.com
curl -v https://your-gateway.example.com/v1/models
```

常见表现：

- **DNS 解析失败**：`Could not resolve host`、`Name or service not known`
- **TCP 连接失败**：`Connection timed out`、`Connection refused`
- **TLS 握手失败**：证书错误、`SSL_ERROR`、握手超时
- **代理认证失败**：代理返回 `407 Proxy Authentication Required`
- **代理或网关超时**：返回 `502`、`504`，或长时间无响应

不要为了让请求“先通”而关闭防火墙或忽略证书错误。把域名、端口和错误信息交给网络管理员确认。

## 排查顺序

按这个顺序做，通常能定位到具体一层：

1. 确认 API 节点域名、端口和当前使用的网络/VPN。
2. 在同一个终端里运行 `curl -v`，记录请求停在哪一步。
3. 分别验证 DNS 解析和 TCP 443 连接。
4. 检查 `HTTP_PROXY`、`HTTPS_PROXY`、`NO_PROXY`，以及大小写版本是否都被设置。
5. 检查 Windows 系统代理和工具自己的代理配置是否一致。
6. 如果出现证书错误，按工具文档配置自定义 CA，而不是关闭 TLS 校验。
7. 如果已经返回 HTTP 状态码，转到[错误码与排障](/guide/errors)按状态码和 `code` 判断。
8. 如果 `curl` 正常但工具失败，检查工具是否读取代理、是否继承环境变量、是否需要单独配置 CA。
9. 如果所有方式都无法访问，把域名、端口、错误信息和测试结果交给网络管理员。

## 报障时提供什么

给工具维护者、服务方或网络管理员报障时，提供这些信息：

- 工具名称、版本、操作系统和终端类型
- 使用的 API 节点域名或主机名（不要提供完整 Key）
- 请求时间，包含时区
- HTTP 状态码、`code` / `type`、`message` 和 request ID（如果有）
- `curl -v` 的关键输出，尤其是 DNS、连接、TLS 和 HTTP 状态行
- `Resolve-DnsName` / `nslookup` 和端口测试结果
- 是否使用 VPN、代理、公司网络或自定义 CA
- 代理环境变量的名称和是否设置（不要提供代理密码）
- 证书错误的完整文本

不要提供未脱敏的 API Key、代理凭据或完整请求头。需要排查认证问题时，只提供脱敏后的前缀和变量名。

## 接下来

- [错误码与排障](/guide/errors)
- [常见问题](/faq)
- [API Key 安全与轮换](/guide/security)