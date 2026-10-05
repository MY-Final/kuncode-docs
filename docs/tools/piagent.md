# Pi

::: info 适用版本
最后验证：2026-10-06 · Pi 0.74.2
:::

极简终端编程助手（`@earendil-works/pi-coding-agent`），通过 `models.json` 接入任何兼容网关。

本文以 KunCode 为例演示，换成你自己的服务地址同样适用。

- 官网：<https://pi.dev>
- GitHub：<https://github.com/earendil-works/pi-mono>

## 1. 安装

::: code-group

```bash [npm]
npm install -g @earendil-works/pi-coding-agent
```

```bash [安装脚本]
curl -fsSL https://pi.dev/install.sh | sh
```

:::

验证安装：

```bash
pi --version
```

能打印版本号即可，例如 `0.74.2`。

::: tip Windows 需要 bash
Pi 在 Windows 上依赖 bash，会按顺序查找：`settings.json` 里的自定义路径、Git Bash（`C:\Program Files\Git\bin\bash.exe`）、PATH 上的 `bash.exe`（Cygwin / MSYS2 / WSL）。

大多数用户安装 [Git for Windows](https://git-scm.com/download/win) 即可。需要指定其他 shell 时，在 `~/.pi/agent/settings.json` 里设置：

```json
{
  "shellPath": "C:\\cygwin64\\bin\\bash.exe"
}
```
:::

## 2. 准备 API Key

见 [准备 API Key](/guide/api-key)。记下两样东西：

- **API Key**：`sk-` 开头
- **API 节点**：你的服务地址，例如 `https://kuncode.120403.xyz`

## 3. 找到配置文件

Pi 的自定义模型配置位于：

| 系统 | 路径 |
| --- | --- |
| macOS / Linux | `~/.pi/agent/models.json` |
| Windows | `%USERPROFILE%\.pi\agent\models.json` |

如果目录或文件不存在，手动创建即可。

::: tip 配置目录下还有别的文件
`~/.pi/agent/` 里还有 `settings.json`（默认模型、主题、shell 等）和 `auth.json`（凭据）。本页只改 `models.json`，默认模型在第 5 步设置。
:::

## 4. 填写配置

用编辑器打开 `models.json`，在 `providers` 里加入你的服务：

```json
{
  "providers": {
    "kuncode": {
      "baseUrl": "https://kuncode.120403.xyz/v1",
      "api": "openai-completions",
      "apiKey": "sk-xxxxxxxx",
      "models": [
        {
          "id": "deepseek-flash",
          "name": "DeepSeek Flash",
          "contextWindow": 128000,
          "maxTokens": 8192
        }
      ]
    }
  }
}
```

字段说明：

| 字段 | 说明 |
| --- | --- |
| `kuncode` | 自定义 provider 的 ID，可以改成任意字符串 |
| `baseUrl` | 你的 API 节点 + `/v1` |
| `api` | 使用的接口类型，见下方说明 |
| `apiKey` | 替换成你自己的 API Key |
| `models` | 可用模型列表，每个条目的 `id` 是模型 ID |

::: tip api 决定走哪个接口
- `openai-completions` → `/v1/chat/completions`（最通用，优先用这个）
- `openai-responses` → `/v1/responses`
- `anthropic-messages` → Anthropic Messages 入口
- `google-generative-ai` → Google Generative AI 入口

大多数 OpenAI 兼容网关用 `openai-completions` 即可。
:::

::: tip baseUrl 必须带 /v1
`openai-completions` 和 `openai-responses` 模式下，`baseUrl` 要写成 `https://kuncode.120403.xyz/v1`。

Pi 会在它后面自动拼接 `/chat/completions` 或 `/responses`，所以不要写到具体接口。
:::

::: tip models 里的 id 必须是真实模型 ID
`models[].id` 必须和接口返回的模型 ID 完全一致。用下面这条命令查看可用模型：

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```
:::

每个模型条目还支持这些可选字段：

| 字段 | 默认 | 说明 |
| --- | --- | --- |
| `name` | 同 `id` | 界面显示名，也用于 `--model` 匹配 |
| `reasoning` | `false` | 是否支持扩展思考 |
| `input` | `["text"]` | 输入类型；支持图片时写 `["text", "image"]` |
| `contextWindow` | `128000` | 上下文窗口大小（token） |
| `maxTokens` | `16384` | 最大输出 token |

## 5. 设为默认模型（可选）

`models.json` 只负责注册 provider 和模型。要让它成为启动时的默认项，在 `~/.pi/agent/settings.json` 里指定：

```json
{
  "defaultProvider": "kuncode",
  "defaultModel": "deepseek-flash"
}
```

`defaultProvider` 填 `models.json` 里的 provider ID（上面的例子是 `kuncode`），`defaultModel` 填模型 ID。

不设置也可以，启动后用 `/model` 或 Ctrl+L 手动选择。

## 6. 验证

先确认模型已被识别：

```bash
pi --list-models
```

输出里应该能看到你的 provider 和模型。再跑一条命令：

```bash
pi -p "print hello"
```

能正常回复就说明配置成功。

也可以进入交互界面：

```bash
pi
```

用 `/model` 选中模型，随便问一句。

::: tip models.json 改动无需重启
`models.json` 每次打开 `/model` 都会重新读取，改完直接在界面里切换即可。
:::

## 7. 常用配置

### 切换模型

界面里用 `/model` 或 Ctrl+L；命令行用 `--model`：

```bash
pi --model deepseek-flash "帮我重构这个函数"
```

也可以用 `provider/id` 形式，省去单独指定 provider：

```bash
pi --model kuncode/deepseek-flash "帮我重构这个函数"
```

### 添加多个模型

在 `models` 数组里继续追加即可：

```json
"models": [
  { "id": "deepseek-flash", "name": "DeepSeek Flash" },
  { "id": "gpt-5", "name": "GPT-5" },
  { "id": "claude-sonnet-4-5", "name": "Claude Sonnet 4.5" }
]
```

### 模型 ID 与显示名不同

`id` 是发给接口的模型名，`name` 只影响界面显示和 `--model` 匹配，两者可以不同：

```json
{
  "id": "deepseek-flash",
  "name": "DeepSeek Flash (KunCode)"
}
```

### 密钥用环境变量

不想把密钥写进 `models.json`，可以让 `apiKey` 引用环境变量名：

```json
"apiKey": "KUNCODE_API_KEY"
```

然后在终端里设置这个变量：

```bash
export KUNCODE_API_KEY="sk-xxxxxxxx"
```

```powershell
$env:KUNCODE_API_KEY = "sk-xxxxxxxx"
```

Pi 也支持 `"!命令"` 形式，执行 shell 命令并把标准输出当作密钥（例如从密码管理器读取）。

### 配置推理强度档位

支持扩展思考的模型，用 `thinkingLevelMap` 描述可用的思考档位：

```json
{
  "id": "deepseek-v4-pro",
  "reasoning": true,
  "thinkingLevelMap": {
    "minimal": null,
    "low": null,
    "medium": null,
    "high": "high",
    "xhigh": "max"
  }
}
```

值为 `null` 表示该档位不支持，会在界面里隐藏；写成字符串则把该值发给上游。启动时用 `--thinking` 指定，界面里用 Shift+Tab 循环切换。

## 8. 排障

按状态码系统排查见[错误码与排障](/guide/errors)。

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | Key 错误，或 `apiKey` 没生效 | 确认 `apiKey` 完整；用环境变量形式时确认变量已在同一个终端设置 |
| `404 Not Found` | `baseUrl` 写错 | 确认以 `/v1` 结尾，且没有把接口路径重复写进去 |
| 模型不存在 | `models[].id` 不是网关支持的模型 | 换成 `/v1/models` 返回列表中的 ID |
| `/model` 里看不到 provider | `models.json` 路径或 JSON 语法错误 | 确认文件在 `~/.pi/agent/models.json`，并用 JSON 校验工具检查 |
| Windows 上启动报错 | 找不到 bash | 安装 [Git for Windows](https://git-scm.com/download/win)，或在 `settings.json` 里设置 `shellPath` |
| 工具调用失败 | 模型不支持 tool call | 换一个支持工具调用的模型 |
| 请求超时 | 网络、代理或上游问题 | 检查 DNS、代理和防火墙，或换模型重试 |

## 进阶：Anthropic Messages 与多 provider

如果网关提供的是 Anthropic Messages 入口，把 `api` 改成 `anthropic-messages`。注意这种模式下 `baseUrl` 只写域名：

```json
{
  "providers": {
    "kuncode-anthropic": {
      "baseUrl": "https://kuncode.120403.xyz",
      "api": "anthropic-messages",
      "apiKey": "sk-xxxxxxxx",
      "models": [
        {
          "id": "claude-sonnet-4-5",
          "reasoning": true,
          "input": ["text", "image"]
        }
      ]
    }
  }
}
```

`providers` 里可以并列多个 provider，各自用自己的 `baseUrl` 和 `api`：

```json
{
  "providers": {
    "kuncode": {
      "baseUrl": "https://kuncode.120403.xyz/v1",
      "api": "openai-completions",
      "apiKey": "sk-xxxxxxxx",
      "models": [{ "id": "deepseek-flash" }]
    },
    "kuncode-anthropic": {
      "baseUrl": "https://kuncode.120403.xyz",
      "api": "anthropic-messages",
      "apiKey": "sk-xxxxxxxx",
      "models": [{ "id": "claude-sonnet-4-5" }]
    }
  }
}
```

::: warning 密钥是明文
`models.json` 里的密钥以明文保存。不要把带密钥的文件提交到 Git，共享屏幕或截图时记得打码。更推荐用上面「密钥用环境变量」的方式。
:::
