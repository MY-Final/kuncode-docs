# GitHub Copilot CLI

GitHub 官方终端编程助手。开启 BYOK（Bring Your Own Key）后，可以把模型请求指向任何兼容网关。

本文以 KunCode 为例演示，换成你自己的服务地址同样适用。这一页不需要截图，所有配置都在终端里完成。

## 1. 安装

::: code-group

```bash [npm]
npm install -g @github/copilot
```

```powershell [WinGet]
winget install GitHub.Copilot
```

```bash [Homebrew]
brew install --cask copilot-cli
```

:::

验证安装：

```bash
copilot --version
```

能打印版本号即可，例如 `GitHub Copilot CLI 1.0.91.`。

::: tip Windows 需要 PowerShell 6+
Copilot CLI 在 Windows 上要求 PowerShell 6 或更高版本。先运行 `$PSVersionTable.PSVersion` 确认。
:::

## 2. 准备 API Key

见 [准备 API Key](/guide/api-key)。记下两样东西：

- **API Key**：`sk-` 开头
- **API 节点**：你的服务地址，例如 `https://kuncode.120403.xyz`

## 3. 配置 BYOK

Copilot CLI 没有单独的 `config.toml`，而是通过环境变量读取自定义 provider。**在启动 `copilot` 之前**设置这些变量：

::: code-group

```bash [macOS / Linux]
export COPILOT_PROVIDER_BASE_URL="https://kuncode.120403.xyz/v1"
export COPILOT_PROVIDER_TYPE="openai"
export COPILOT_PROVIDER_API_KEY="sk-xxxxxxxx"
export COPILOT_MODEL="deepseek-flash"
```

```powershell [Windows PowerShell]
$env:COPILOT_PROVIDER_BASE_URL = "https://kuncode.120403.xyz/v1"
$env:COPILOT_PROVIDER_TYPE = "openai"
$env:COPILOT_PROVIDER_API_KEY = "sk-xxxxxxxx"
$env:COPILOT_MODEL = "deepseek-flash"
```

:::

字段说明：

| 变量 | 说明 |
| --- | --- |
| `COPILOT_PROVIDER_BASE_URL` | 你的 API 节点 + `/v1`，也是开启 BYOK 的开关 |
| `COPILOT_PROVIDER_TYPE` | `openai` 表示任意 OpenAI 兼容接口；Azure、Anthropic 见下方 |
| `COPILOT_PROVIDER_API_KEY` | 替换成你自己的 API Key |
| `COPILOT_MODEL` | 要调用的模型 ID，必须和 `/v1/models` 返回的一致 |
| `COPILOT_PROVIDER_WIRE_API` | 可选，`completions`（默认）或 `responses` |

::: tip base URL 必须带 /v1
`COPILOT_PROVIDER_BASE_URL` 要写成 `https://kuncode.120403.xyz/v1`。

Copilot CLI 会在它后面自动拼接 `/chat/completions` 或 `/responses`，所以不要写到具体接口。
:::

::: tip wire API 决定走哪个入口
- `completions` → `/v1/chat/completions`（默认）
- `responses` → `/v1/responses`

如果你的网关和模型更适合 Responses 接口（例如 GPT-5 系列），额外设置：

```bash
export COPILOT_PROVIDER_WIRE_API="responses"
```

```powershell
$env:COPILOT_PROVIDER_WIRE_API = "responses"
```
:::

::: tip 认证方式
`COPILOT_PROVIDER_TYPE=openai` 时，Copilot CLI 把 `COPILOT_PROVIDER_API_KEY` 放在 `Authorization: Bearer` 请求头里，和大多数兼容网关一致。

BYOK 模式下不需要登录 GitHub；但 GitHub MCP、Issue、PR 等 GitHub 集成功能仍然需要 GitHub 登录。
:::

::: warning 密钥是明文环境变量
这种方式密钥明文保存在环境变量或 shell 配置文件里，注意：

- 不要把带密钥的文件提交到 Git
- 共享屏幕或截图时记得打码
:::

## 4. 验证

在任意目录执行：

```bash
copilot -p "print hello"
```

能正常回复就说明配置成功了。

也可以进入交互界面：

```bash
copilot
```

然后随便问一句。首次运行如果提示登录，说明 BYOK 变量没有在当前终端生效，检查变量名和启动 `copilot` 的终端是否是同一个。

::: tip 需要工具调用时
`-p` 非交互模式下，如果任务需要读写文件或执行命令，要显式放行工具，例如：

```bash
copilot -p "列出当前目录" --allow-all-tools
```

只想简单对话时不需要加这个参数。
:::

## 5. 常用配置

### 切换模型

改 `COPILOT_MODEL` 即可：

```bash
export COPILOT_MODEL="gpt-5"
```

```powershell
$env:COPILOT_MODEL = "gpt-5"
```

可用模型通过接口查询：

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

### 模型 ID 与实际上游模型名不一致

有些网关的内部模型 ID 和转发给上游的模型名不同。这时分别设置：

```bash
export COPILOT_MODEL="gpt-5"
export COPILOT_PROVIDER_MODEL_ID="gpt-5"
export COPILOT_PROVIDER_WIRE_MODEL="gpt-5-2025-08-07"
```

`COPILOT_PROVIDER_MODEL_ID` 用来匹配 Copilot CLI 内置的能力和 token 上限，`COPILOT_PROVIDER_WIRE_MODEL` 才是真正发给上游的模型名。一般网关两者一致，不需要设置。

### 持久化环境变量

只在当前终端设置，关掉窗口就失效。要长期生效，写进 shell 配置文件：

- macOS / Linux：写入 `~/.zshrc` 或 `~/.bashrc`
- Windows：写入 PowerShell 的 `$PROFILE`

查看 `$PROFILE` 路径：

```powershell
$PROFILE
```

### 多个 provider

如果需要同时管理多个 provider，Copilot CLI 支持用户级注册表 `~/.copilot/providers.json`，也可以用 `COPILOT_PROVIDERS_CONFIG` 指定其他位置。

当该文件声明了 provider 或 model 时，它的优先级高于 `COPILOT_PROVIDER_*` 环境变量。具体格式运行下面命令查看官方示例：

```bash
copilot help providers
```

## 6. 排障

按状态码系统排查见[错误码与排障](/guide/errors)。

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | Key 错误，或变量没生效 | 确认 `COPILOT_PROVIDER_API_KEY` 完整，并在同一个终端里启动 `copilot` |
| `404 Not Found` | `BASE_URL` 写错，或 wire API 和网关不匹配 | 确认以 `/v1` 结尾；`responses` 对应 `/v1/responses`，`completions` 对应 `/v1/chat/completions` |
| 模型不存在 | `COPILOT_MODEL` 不是网关支持的模型 | 换成 `/v1/models` 返回列表中的 ID |
| 一直提示登录 | BYOK 变量没有在当前终端设置 | 重新设置变量，或在同一个终端里启动 `copilot` |
| 工具调用失败 | 模型不支持 tool call | 换一个支持工具调用的模型 |
| 请求超时 | 网络、代理或上游问题 | 检查 DNS、代理和防火墙，或换模型重试 |

## 进阶：Anthropic 与 Azure

如果网关提供的是 Anthropic Messages 入口，把 provider 类型改成 `anthropic`：

```bash
export COPILOT_PROVIDER_TYPE="anthropic"
export COPILOT_PROVIDER_BASE_URL="https://kuncode.120403.xyz"
export COPILOT_PROVIDER_API_KEY="sk-xxxxxxxx"
export COPILOT_MODEL="claude-sonnet-4-5"
```

Azure OpenAI 使用 `COPILOT_PROVIDER_TYPE=azure`，并按官方要求设置 `COPILOT_PROVIDER_AZURE_API_VERSION`、`COPILOT_PROVIDER_MODEL_ID` 和 `COPILOT_PROVIDER_WIRE_MODEL`。完整变量列表见 `copilot help providers`。
