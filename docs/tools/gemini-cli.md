# Google Gemini CLI

Google 官方开源终端 AI 助手，支持 Google 账号登录、Gemini API Key 和 Vertex AI。

::: warning 适用范围
Gemini CLI 主要使用 Gemini 官方协议，不是通用的 OpenAI / Anthropic 兼容网关客户端。本文以通用 Gemini CLI 配置为例，是否可用取决于你的服务是否提供 Gemini 原生协议入口。

如果你的服务只提供 OpenAI Chat Completions、Responses 或 Anthropic Messages，请改用对应的工具页，不要把 Gemini CLI 当作任意兼容网关客户端。
:::

本文使用 `https://kuncode.120403.xyz` 作为示例地址，换成你自己的服务地址同样适用。配置前先向服务商确认它是否提供 Gemini API 兼容入口，以及对应的模型 ID 和认证方式。

官方资源：

- 仓库：https://github.com/google-gemini/gemini-cli
- 官网：https://www.geminicli.com/
- 安装文档：https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/installation.mdx
- 配置参考：https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md

## 1. 安装

Gemini CLI 官方要求：

| 项目 | 要求 |
| --- | --- |
| Windows | Windows 11 24H2 或更高版本 |
| Node.js | 20.0.0 或更高版本 |
| Shell | Bash、Zsh 或 PowerShell |
| 网络 | 需要能够访问 Gemini API 或你的兼容服务 |

推荐使用 npm 全局安装：

```bash
npm install -g @google/gemini-cli
```

官方也提供 Homebrew、MacPorts、Anaconda、npx 和容器等安装方式，具体命令以[安装文档](https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/installation.mdx)为准。

验证安装：

```bash
gemini --version
```

## 2. 准备 API Key

Gemini CLI 支持多种认证方式：

- **Google 账号登录**：适合本机交互使用，官方提供免费层，额度和速率限制以官方为准。
- **Gemini API Key**：适合使用 Google AI Studio Key，或服务商提供的 Gemini API 兼容 Key。
- **Vertex AI**：适合 Google Cloud 用户，需要额外配置项目和服务账号等。

如果你使用的是第三方兼容服务，请确认它提供的是 **Gemini 原生协议入口**，而不是只提供 OpenAI 或 Anthropic 兼容入口。只提供后两者的服务不能直接通过本文的方式接入 Gemini CLI。

记下两样东西：

- **API Key**：服务商提供的密钥。
- **Gemini API 根地址**：只有第三方 Gemini API 兼容服务才需要，例如 `https://kuncode.120403.xyz`。

官方 Gemini API Key 可以在 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取。使用官方服务时，不需要设置自定义 Base URL。

## 3. 找到配置文件

Gemini CLI 使用 JSON 配置文件。常见位置如下：

| 范围 | 系统 | 路径 |
| --- | --- | --- |
| 用户级 | macOS / Linux | `~/.gemini/settings.json` |
| 用户级 | Windows | `%USERPROFILE%\.gemini\settings.json` |
| 项目级 | 所有系统 | 项目根目录的 `.gemini/settings.json` |

项目级配置优先于用户级配置。目录或文件不存在时手动创建即可。

认证相关的密钥和地址推荐放在环境变量或 `.env` 文件中：

| 范围 | 路径 |
| --- | --- |
| 用户级 | `~/.gemini/.env` 或 `%USERPROFILE%\.gemini\.env` |
| 项目级 | 项目根目录的 `.gemini/.env` |

Gemini CLI 会从当前目录向上查找 `.env`，再到用户主目录下的 `.gemini/.env`。环境变量和命令行参数的优先级高于 `settings.json`。

::: warning 不要把密钥提交到 Git
`.env`、项目配置和日志都可能包含敏感信息。不要把 API Key 提交到仓库，截图时也要打码。
:::

## 4. 填写配置

打开 `settings.json`，设置默认模型：

```json
{
  "model": {
    "name": "YOUR_GEMINI_MODEL_ID"
  }
}
```

把 `YOUR_GEMINI_MODEL_ID` 换成服务商实际提供的 Gemini 模型 ID 或别名。不要填写 OpenAI、Anthropic 等其他协议的模型名。

字段说明：

| 字段 | 说明 |
| --- | --- |
| `model.name` | Gemini CLI 默认使用的 Gemini 模型 |
| `model.maxSessionTurns` | 会话保留的最大轮数，`-1` 表示不限制 |

如果服务商要求指定 Gemini API 版本，可以按官方配置参考设置 `GOOGLE_GENAI_API_VERSION`。是否需要设置、应该填什么值，以服务商文档为准。

::: tip 模型名要和认证方式匹配
使用 Google AI Studio Key 时，模型名应符合 Gemini API 的命名方式；使用第三方服务时，模型名以服务商提供的 Gemini 兼容模型列表为准。
:::

## 5. 添加凭据

### 使用 Gemini API Key

在启动 Gemini CLI 前设置环境变量。

::: code-group

```powershell [PowerShell]
$env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
$env:GOOGLE_GEMINI_BASE_URL = "https://kuncode.120403.xyz"
gemini
```

```bash [Bash / Git Bash]
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
export GOOGLE_GEMINI_BASE_URL="https://kuncode.120403.xyz"
gemini
```

:::

然后在认证界面选择 **Use Gemini API key**。具体界面名称以 Gemini CLI 当前版本为准。

- 使用官方 Gemini API 时，不要设置 `GOOGLE_GEMINI_BASE_URL`。
- 使用第三方 Gemini API 兼容服务时，把 `GOOGLE_GEMINI_BASE_URL` 设置为服务商提供的 Gemini API 根地址。
- `GOOGLE_GEMINI_BASE_URL` 只在 `gemini-api-key` 认证模式下生效。除 `localhost`、`127.0.0.1`、`[::1]` 外，官方要求它使用 HTTPS。
- 如果服务商提供的地址包含 `/v1beta` 等版本路径，按服务商文档原样填写；是否需要该路径以实际服务为准。

### 持久化到 `.env`

如果不想每次手动设置，可以把变量写入 `.gemini/.env`：

```dotenv
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GOOGLE_GEMINI_BASE_URL=https://kuncode.120403.xyz
```

使用官方 Gemini API 时删除 `GOOGLE_GEMINI_BASE_URL` 这一行。

### 使用 Vertex AI

Vertex AI 模式使用另一组变量，例如 `GOOGLE_CLOUD_PROJECT`、`GOOGLE_CLOUD_LOCATION`、`GOOGLE_APPLICATION_CREDENTIALS` 和 `GOOGLE_VERTEX_BASE_URL`。这些变量不能和 Gemini API Key 的配置混用，具体步骤以官方认证文档为准。

## 6. 验证

先确认版本：

```bash
gemini --version
```

启动交互界面：

```bash
gemini
```

看到认证选择时选择 **Use Gemini API key**，然后输入：

```text
print hello
```

能正常回复就说明认证和基础请求已经打通。

再验证一次工具调用，例如让它读取当前项目里的文件：

```text
读取 README.md，并用一句话总结。
```

如果 CLI 询问是否允许读取文件或执行工具，按提示确认。能读取文件并返回结果，说明工具调用链路也正常。无交互场景可以用 `gemini -p "..."`，但必须已经通过环境变量配置好认证。

## 7. 常用配置

### 临时切换模型

启动时指定模型：

```bash
gemini --model YOUR_GEMINI_MODEL_ID
```

也可以使用 `-m` 简写：

```bash
gemini -m YOUR_GEMINI_MODEL_ID
```

模型别名和可用模型以当前 Gemini CLI 版本及服务商支持范围为准。

### 修改默认模型

在 `settings.json` 中修改：

```json
{
  "model": {
    "name": "YOUR_GEMINI_MODEL_ID"
  }
}
```

用户级配置适合个人默认值，项目级 `.gemini/settings.json` 适合只对某个项目生效的配置。

### 调整会话轮数

如果希望限制一个会话保留的上下文轮数，可以设置：

```json
{
  "model": {
    "maxSessionTurns": 50
  }
}
```

`-1` 表示不限制。实际上下文长度还受模型本身的上下文窗口限制。

### 区分 Gemini API 与 Vertex AI

| 模式 | 主要变量 | 说明 |
| --- | --- | --- |
| Gemini API Key | `GEMINI_API_KEY`、`GOOGLE_GEMINI_BASE_URL` | 适合 Google AI Studio Key 或 Gemini API 兼容服务 |
| Vertex AI | `GOOGLE_CLOUD_PROJECT`、`GOOGLE_VERTEX_BASE_URL` 等 | 适合 Google Cloud / Vertex AI，配置方式不同 |

::: warning 不要把它当成通用兼容网关
Gemini CLI 只适用于 Gemini 原生协议或 Vertex AI。需要接入 OpenAI Chat Completions、Responses 或 Anthropic Messages 时，请使用 OpenCode、Crush、Goose 等支持相应协议的工具。
:::

## 8. 排障

按状态码系统排查见[错误码与排障](/guide/errors)。

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | API Key 缺失、填错、已失效，或当前 shell 没有加载环境变量 | 确认 `GEMINI_API_KEY` 已设置；重启终端或重新加载 `.env`；在认证界面选择 **Use Gemini API key** |
| `404 Not Found` | `GOOGLE_GEMINI_BASE_URL` 写错，或服务商没有 Gemini 原生协议入口 | 确认服务商提供 Gemini API 兼容入口；核对根地址和 API 版本路径；使用官方服务时删除该变量 |
| 模型不存在 | 模型 ID 写错，或服务商没有开放该模型 | 使用服务商提供的 Gemini 兼容模型 ID；确认当前认证方式能访问该模型 |
| 请求超时 | 网络、代理或防火墙阻止访问，或服务响应过慢 | 检查代理、DNS 和防火墙；缩短请求后重试；以服务商状态页和官方文档为准 |
| 工具调用失败 | 模型不支持工具调用，或兼容服务没有转发工具相关字段 | 换用支持工具调用的 Gemini 模型；确认服务商支持 Gemini 原生工具调用 |
| 地区或配额限制 | 当前地区不支持，免费额度或速率限制已用尽 | 查看 Google Gemini Code Assist 支持地区、Gemini API 配额和服务商限制；必要时改用官方计费或其他服务 |

官方资源：

- 安装文档：https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/installation.mdx
- 认证文档：https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/authentication.mdx
- 配置参考：https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md
- 配额与价格：https://github.com/google-gemini/gemini-cli/blob/main/docs/resources/quota-and-pricing.md