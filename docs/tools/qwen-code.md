# Qwen Code

::: info 适用版本
最后验证：2026-10-06 · Qwen Code 0.25.0
:::

开源终端编程助手，支持 OpenAI、Anthropic、Gemini 等多种协议，可以通过自定义 provider 接入任何兼容网关。

本文以 KunCode 为例演示，把示例中的地址、Key 和模型名替换成你自己的服务即可。占位符与替换规则见[通用占位符说明](/guide/index#占位符约定)。

::: warning Qwen OAuth 免费层已停止
Qwen OAuth 免费层已于 **2026-04-15** 停止，`/auth` 里不再提供该入口。现在请使用阿里云 ModelStudio Coding Plan，或第三方兼容服务的 API Key。
:::

## 1. 安装

需要 **Node.js 22 或更高版本**。官方也提供免 Node 的 PowerShell 一键安装脚本。

::: code-group

```powershell [Windows 一键安装]
irm https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen-standalone.ps1 | iex
```

```bash [npm]
npm install -g @qwen-code/qwen-code@latest
```

```bash [Homebrew]
brew install qwen-code
```

:::

安装后建议重开一个终端，再验证：

```bash
qwen --version
```

## 2. 准备 API Key

见 [准备 API Key](/guide/api-key)。记下两样东西：

- **API Key**：常见形如 `sk-...`，以你的服务商为准
- **API 节点**：你的服务地址，例如 `https://kuncode.120403.xyz`

## 3. 找到配置文件

Qwen Code 的用户级配置文件位于：

| 系统 | 路径 |
| --- | --- |
| macOS / Linux | `~/.qwen/settings.json` |
| Windows | `%USERPROFILE%\.qwen\settings.json` |

如果目录或文件不存在，手动创建即可。

::: tip 也可以放在项目里
除了用户级配置，Qwen Code 也支持在项目根目录放一个 `.qwen/settings.json`，只对该项目生效。

官方建议把 `modelProviders` 定义在用户级 `~/.qwen/settings.json`，避免项目级与用户级配置合并时产生冲突。
:::

## 4. 填写配置

用编辑器打开 `settings.json`，通过 `modelProviders` 加入你的服务：

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "deepseek-flash",
        "name": "DeepSeek Flash",
        "baseUrl": "https://kuncode.120403.xyz/v1",
        "envKey": "KUNCODE_API_KEY",
        "wireApi": "chat-completions"
      }
    ]
  },
  "security": {
    "auth": {
      "selectedType": "openai"
    }
  },
  "model": {
    "name": "deepseek-flash"
  }
}
```

字段说明：

| 字段 | 说明 |
| --- | --- |
| `modelProviders` | 按协议声明可用模型，键 `openai` / `anthropic` / `gemini` / `vertex-ai` 代表协议 |
| `id` | 模型 ID，必须和接口返回的模型名完全一致 |
| `name` | 在 `/model` 选择器里显示的名字，可省略，默认等于 `id` |
| `baseUrl` | 你的 API 节点，按协议要求拼接路径 |
| `envKey` | 存放密钥的环境变量名，省略时使用该协议的默认变量（如 `OPENAI_API_KEY`） |
| `wireApi` | OpenAI 兼容协议的请求格式：`chat-completions` 或 `responses` |
| `security.auth.selectedType` | 启动时默认使用的协议，填 `openai` / `anthropic` / `gemini` |
| `model.name` | 启动时默认激活的模型，必须匹配某个 `id` |

::: tip 不确定用哪种协议
先选 `openai` + `chat-completions`，兼容性最好。如果服务更推荐 Responses，把 `wireApi` 改成 `responses`。

Anthropic 或 Gemini 协议写法以 qwen-code 当前版本 / 官方文档为准。
:::

::: tip 也可以走交互式 `/auth`
如果不手写配置，启动 `qwen` 后执行 `/auth`，选择 **Custom Provider**，按提示填写协议（OpenAI / Anthropic / Gemini 等）、`baseUrl`、模型 ID 和 API Key 即可。交互式流程会把结果写进 `settings.json`，字段含义与上面一致。

具体菜单项和字段以 qwen-code 当前版本 / 官方文档为准。
:::

::: tip id 必须是真实模型 ID
`id` 必须和接口返回的模型 ID 完全一致。用下面这条命令查看可用模型：

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```
:::

## 5. 添加凭据

Qwen Code 不会把密钥写进配置里，而是从环境变量读取，变量名由 `envKey` 指定。

**方式一：环境变量（推荐）**

::: code-group

```powershell [Windows PowerShell]
$env:KUNCODE_API_KEY = "sk-xxxxxxxx"
```

```bash [macOS / Linux]
export KUNCODE_API_KEY="sk-xxxxxxxx"
```

:::

**方式二：写进 `settings.json` 的 `env` 字段（优先级最低）**

```json
{
  "env": {
    "KUNCODE_API_KEY": "sk-xxxxxxxx"
  }
}
```

密钥读取优先级从高到低：命令行参数 → 系统环境变量 → `.env` 文件 → `settings.json` 的 `env` 字段。

::: warning 不要提交密钥
把密钥写进 `settings.json` 或 `.env` 时，注意不要提交到 Git，截图时打码。项目级密钥更推荐放在 `.qwen/.env` 并加入 `.gitignore`。
:::

## 6. 验证

启动 Qwen Code：

```bash
qwen
```

在界面里输入：

```
/doctor
```

确认当前认证方式和模型符合预期，再用 `/model` 选中刚才配置的模型，随便问一句，能正常回复就说明配置成功。

也可以直接跑一条无界面命令验证：

```bash
qwen -p "print hello"
```

## 7. 常用配置

### 添加多个模型

在对应协议的数组里继续追加即可：

```json
"openai": [
  {
    "id": "deepseek-flash",
    "name": "DeepSeek Flash",
    "baseUrl": "https://kuncode.120403.xyz/v1",
    "envKey": "KUNCODE_API_KEY",
    "wireApi": "chat-completions"
  },
  {
    "id": "gpt-5",
    "name": "GPT-5",
    "baseUrl": "https://kuncode.120403.xyz/v1",
    "envKey": "KUNCODE_API_KEY",
    "wireApi": "responses"
  }
]
```

之后用 `/model` 就能在多个模型之间切换，选择会跨会话保留。

### 同时使用多种协议

`modelProviders` 可以同时声明多个协议，例如 `openai`、`anthropic`、`gemini` 并存，运行时用 `/model` 切换。不同协议的认证变量和请求格式不同，具体以 qwen-code 当前版本 / 官方文档为准。

### 调整超时和重试

`generationConfig` 可以单独为某个模型设置超时、重试次数等参数：

```json
{
  "id": "deepseek-flash",
  "name": "DeepSeek Flash",
  "baseUrl": "https://kuncode.120403.xyz/v1",
  "envKey": "KUNCODE_API_KEY",
  "wireApi": "chat-completions",
  "generationConfig": {
    "timeout": 600000,
    "maxRetries": 2
  }
}
```

字段名和默认值可能随版本变化，以 qwen-code 当前版本 / 官方文档为准。

## 8. 排障

按状态码系统排查见[错误码与排障](/guide/errors)。先用 `/doctor` 确认当前认证方式和模型。

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | 环境变量没生效，或 Key 填错 | 用 `/doctor` 检查凭据；确认 `envKey` 指向的变量名和实际设置的一致 |
| `404 Not Found` | `baseUrl` 写错 | 确认协议、路径拼接和末尾斜杠符合你的服务要求 |
| 模型不存在 | `id` 和接口返回的模型名不一致 | 用 `/v1/models` 核对真实模型 ID，`id` 必须完全一致 |
| 请求超时 | 默认超时太短 | 在 `generationConfig.timeout` 里调大超时 |
| 工具调用失败 | 模型不支持 tool call | 换一个支持工具调用的模型 |

## 进阶：用 `.env` 管理密钥

如果不想把密钥写进 `settings.json`，可以在项目里放一个 `.qwen/.env`：

```bash
KUNCODE_API_KEY=sk-xxxxxxxx
```

Qwen Code 会自动加载，且 `.qwen/.env` 比 `.env` 更不容易和其他工具冲突。记得把它加入 `.gitignore`。

更多配置项见 [Qwen Code 官方文档](https://qwenlm.github.io/qwen-code-docs/)。
