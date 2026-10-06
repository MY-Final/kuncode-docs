# Goose

::: info 适用版本
最后验证：2026-10-06 · Goose 1.53.0
:::

开源本地 AI Agent，支持桌面端、CLI 和 API。它可以通过 OpenAI Compatible、Anthropic Compatible、Ollama 或自定义 provider 接入兼容网关。

本文以 KunCode 为例演示，把示例中的地址、Key 和模型名替换成你自己的服务即可。占位符与替换规则见[通用占位符说明](/guide/index#占位符约定)。

## 1. 安装

Goose 官方支持 Windows 原生安装，也支持 WSL。Windows 推荐使用官方 PowerShell 脚本：

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/aaif-goose/goose/main/download_cli.ps1" -OutFile "download_cli.ps1"
.\download_cli.ps1
```

也可以在 Git Bash / MSYS2 中运行：

```bash
curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash
```

如果安装后提示找不到 `goose`，把 `%USERPROFILE%\.local\bin` 加入 PATH，然后重新打开终端。

验证安装：

```bash
goose --version
```

## 2. 准备 API Key

见 [准备 API Key](/guide/api-key)。记下两样东西：

- **API Key**：例如 `sk-xxxxxxxx`
- **服务根地址**：例如 `https://kuncode.120403.xyz`

OpenAI 兼容网关通常把服务根地址填进 `OPENAI_HOST`，把接口路径填进 `OPENAI_BASE_PATH`。两者怎么拆分，以 Goose 当前界面和官方文档为准。

## 3. 找到配置文件

Goose 的主配置文件是 `config.yaml`：

| 系统 | 路径 |
| --- | --- |
| macOS / Linux | `~/.config/goose/config.yaml` |
| Windows | `%APPDATA%\Block\goose\config\config.yaml` |

也可以先运行交互式配置：

```bash
goose configure
```

它会引导你选择 provider、填写凭据和模型。界面文字以当前 Goose 版本为准。

::: warning API Key 不要写进 config.yaml
Goose 不会从 `config.yaml` 读取 provider API Key。优先用 `goose configure` 存入系统凭据存储，或通过环境变量提供。
:::

## 4. 填写配置

使用 OpenAI 兼容 provider 时，常用环境变量是：

| 变量 | 说明 |
| --- | --- |
| `OPENAI_HOST` | 服务地址，例如 `https://kuncode.120403.xyz` |
| `OPENAI_BASE_PATH` | API 路径，例如 `v1/chat/completions` |
| `OPENAI_API_KEY` | 你的 API Key |
| `GOOSE_PROVIDER` | 设为 `openai` |
| `GOOSE_MODEL` | 要使用的模型 ID |

在 PowerShell 中设置：

```powershell
$env:OPENAI_HOST = "https://kuncode.120403.xyz"
$env:OPENAI_BASE_PATH = "v1/chat/completions"
$env:OPENAI_API_KEY = "sk-xxxxxxxx"
$env:GOOSE_PROVIDER = "openai"
$env:GOOSE_MODEL = "deepseek-flash"
```

在 Bash / Git Bash / WSL 中设置：

```bash
export OPENAI_HOST="https://kuncode.120403.xyz"
export OPENAI_BASE_PATH="v1/chat/completions"
export OPENAI_API_KEY="sk-xxxxxxxx"
export GOOSE_PROVIDER="openai"
export GOOSE_MODEL="deepseek-flash"
```

如果使用自定义 provider，Goose 也支持在 `goose configure` 中配置 OpenAI Compatible、Anthropic Compatible 等类型。具体入口和字段以当前 Goose 界面及官方文档为准。

::: tip 404 优先检查 OPENAI_BASE_PATH
Goose 的 404 常见原因不是 Key，而是 `OPENAI_BASE_PATH` 配错。确认它和服务商要求的最终请求路径一致，不要重复或漏掉 `/v1`。
:::

## 5. 添加凭据

推荐让 `goose configure` 把 Key 存入系统凭据存储。Windows 如果遇到 keyring 错误，可以改用环境变量：

```powershell
$env:OPENAI_API_KEY = "sk-xxxxxxxx"
goose configure
```

Goose 检测到环境变量后，会把它作为凭据来源。需要长期生效时，可以把变量写入系统环境变量或 PowerShell 配置文件。

::: warning 不要把密钥提交到 Git
环境变量和 `config.yaml` 都可能被同步或截图。不要把 Key 写进项目仓库，截图时也要打码。
:::

## 6. 验证

启动一个会话：

```bash
goose session
```

然后输入：

```text
print hello
```

能正常回复就说明 provider、模型和凭据都已生效。也可以先用 `goose info -v` 查看当前配置和 provider 信息。

## 7. 常用配置

### 查看当前配置

```bash
goose info -v
```

### 重新配置 provider

```bash
goose configure
```

选择 Configure Providers，按提示重新填写 provider、凭据和模型。菜单名称以当前 Goose 版本为准。

### 切换模型

在交互式会话中可以使用 `/model` 查看或切换当前模型：

```text
/model
```

也可以直接设置 `GOOSE_MODEL` 环境变量后重新启动会话。

### 调整输出上限

```bash
export GOOSE_MAX_TOKENS=8192
```

具体默认值和可设置范围以 Goose 官方文档为准。

## 8. 排障

按状态码系统排查见[错误码与排障](/guide/errors)。

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | API Key 缺失、填错或没有传给 Goose | 检查 `OPENAI_API_KEY`，再运行 `goose configure` 或 `goose info -v` |
| `404 Not Found` | `OPENAI_BASE_PATH` 写错 | 最常见原因；确认路径与服务商要求的最终请求路径完全一致 |
| 模型不存在 | 模型 ID 写错，或服务端没有这个模型 | 用 `/v1/models` 核对 `id`，再更新 `GOOSE_MODEL` |
| 请求超时 | 网络不可达、代理未配置，或请求过长 | 检查 DNS、代理和防火墙；缩小请求后重试 |
| 工具调用失败 | 当前模型不支持 tool call | 换一个支持工具调用的模型，并确认网关没有过滤工具调用参数 |

官方资源：

- 仓库：https://github.com/aaif-goose/goose
- 文档：https://goose-docs.ai/

---

::: tip 发现错误或有内容过期？
文档会随工具版本更新。欢迎[提交 Issue](https://github.com/MY-Final/kuncode-docs/issues/new) 反馈问题，或直接点击页脚的「在 GitHub 上编辑此页」提交修改。
:::
