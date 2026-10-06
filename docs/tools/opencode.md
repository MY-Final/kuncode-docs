# OpenCode

::: info 适用版本
最后验证：2026-10-06 · OpenCode 1.18.34
:::

开源终端编程助手，通过自定义 provider 接入任何兼容网关。

本文以 KunCode 为例演示，换成你自己的服务地址同样适用。下面这套配置是在 Windows 上实际跑通的。

## 1. 安装

::: code-group

```bash [npm]
npm install -g opencode-ai
```

```bash [Homebrew]
brew install sst/tap/opencode
```

:::

验证安装：

```bash
opencode --version
```

## 2. 准备 API Key

见 [准备 API Key](/guide/api-key)。记下两样东西：

- **API Key**：`sk-` 开头
- **API 节点**：你的服务地址，例如 `https://kuncode.120403.xyz`

## 3. 找到配置文件

OpenCode 的全局配置文件位于：

| 系统 | 路径 |
| --- | --- |
| macOS / Linux | `~/.config/opencode/opencode.json` |
| Windows | `%USERPROFILE%\.config\opencode\opencode.json` |

如果目录或文件不存在，手动创建即可。

::: tip 也可以放在项目里
除了全局配置，OpenCode 也支持在项目根目录放一个 `opencode.json`，只对该项目生效。

团队协作时适合放项目里，个人通用配置放全局。
:::

## 4. 填写配置

用编辑器打开 `opencode.json`，在 `provider` 里加入你的服务：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "kuncode": {
      "npm": "@ai-sdk/openai",
      "name": "KunCode",
      "options": {
        "baseURL": "https://kuncode.120403.xyz/v1"
      },
      "models": {
        "deepseek-flash": {
          "name": "DeepSeek Flash",
          "attachment": true,
          "reasoning": true,
          "variants": {
            "low": { "reasoningEffort": "low" },
            "high": { "reasoningEffort": "high" },
            "max": { "reasoningEffort": "max" }
          }
        }
      }
    }
  }
}
```

![填好的 OpenCode 配置](/images/opencode/config-content.png)

字段说明：

| 字段 | 说明 |
| --- | --- |
| `kuncode` | 自定义 provider 的 ID，可以改成任意字符串 |
| `npm` | 使用的 AI SDK 包，见下方说明 |
| `name` | 在 OpenCode 界面里显示的名字 |
| `options.baseURL` | 你的 API 节点 + `/v1` |
| `models` | 可用的模型列表，键是模型 ID |

::: tip npm 决定走哪个接口
- `@ai-sdk/openai` → 走 Responses 接口（`/v1/responses`）
- `@ai-sdk/openai-compatible` → 走 Chat Completions 接口（`/v1/chat/completions`）

两者都能用。上面的示例用 `@ai-sdk/openai`（Responses），因为 KunCode 已验证支持它。

**不确定你的服务支持哪个接口时**，先按下面顺序试：

1. 先在服务商控制台或文档里确认是否提供 `/v1/responses`。
2. 如果确认支持 Responses，或者一时无法确认，先用上面的默认示例（Responses）试一次。
3. 如果请求报 `404` / `503`，说明服务很可能只有 Chat Completions，把 `npm` 改成 `@ai-sdk/openai-compatible` 再试。
4. 两种都失败时，先回头核对 Base URL 是否以 `/v1` 结尾，再按[选择接入方式](/guide/endpoints)排查。
:::

::: tip models 里的键必须是真实模型 ID
`models` 对象的键（例如 `deepseek-flash`）必须和接口返回的模型 ID 完全一致。

用下面这条命令查看可用模型：

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```
:::

## 5. 添加 API Key

配置里**不写密钥**，而是用 `/connect` 命令写入 OpenCode 自己的凭据文件。

启动 OpenCode：

```bash
opencode
```

在界面里输入：

```
/connect
```

选择你的 provider（`KunCode`），粘贴 API Key 即可。

密钥会保存在：

| 系统 | 路径 |
| --- | --- |
| macOS / Linux | `~/.local/share/opencode/auth.json` |
| Windows | `%USERPROFILE%\.local\share\opencode\auth.json` |

::: tip 为什么不写进 opencode.json
`opencode.json` 通常会被提交到 Git 或分享给同事。把密钥放进独立的 `auth.json` 更安全，也避免误传。
:::

## 6. 验证

在界面里输入：

```
/models
```

应该能看到刚才配置的 provider 和模型：

![OpenCode 模型列表](/images/opencode/models-list.png)

选中模型后随便问一句，能正常回复就说明配置成功。

也可以直接跑一条命令验证：

```bash
opencode run "print hello"
```

## 7. 常用配置

### 添加多个模型

在 `models` 里继续追加即可：

```json
"models": {
  "deepseek-flash": { "name": "DeepSeek Flash", "reasoning": true },
  "gpt-5": { "name": "GPT-5", "reasoning": true },
  "claude-sonnet-4": { "name": "Claude Sonnet 4" }
}
```

### 配置推理强度档位

`variants` 可以给同一个模型定义多个推理强度，切换时不用改配置文件：

```json
"deepseek-flash": {
  "name": "DeepSeek Flash",
  "reasoning": true,
  "variants": {
    "low": { "reasoningEffort": "low" },
    "high": { "reasoningEffort": "high" },
    "max": { "reasoningEffort": "max" }
  }
}
```

定义后，在模型选择器里就能直接切到对应的档位。

::: tip 模型需要支持推理
`reasoning: true` 表示这个模型支持推理。不支持推理的模型，`variants` 不会生效。
:::

### 隐藏不想看到的模型

如果 provider 返回了很多模型，可以用 `whitelist` 只保留需要的，或用 `blacklist` 排除：

```json
"kuncode": {
  "npm": "@ai-sdk/openai",
  "name": "KunCode",
  "whitelist": ["deepseek-flash", "gpt-5"],
  "options": {
    "baseURL": "https://kuncode.120403.xyz/v1"
  }
}
```

### 调整超时

长请求容易超时，可以单独为这个 provider 放宽：

```json
"options": {
  "baseURL": "https://kuncode.120403.xyz/v1",
  "timeout": 600000
}
```

`timeout` 单位是毫秒，上面表示 10 分钟。设为 `false` 表示不限制。

## 8. 排障

按状态码系统排查见[错误码与排障](/guide/errors)。

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `/models` 里看不到 provider | 配置文件路径或 JSON 语法错误 | 确认文件名是 `opencode.json`，并用 JSON 校验工具检查 |
| `401 Unauthorized` | 还没执行 `/connect`，或 Key 填错 | 重新执行 `/connect` 并粘贴完整密钥 |
| `404 Not Found` | `baseURL` 写错 | 确认以 `/v1` 结尾 |
| 模型不出现在列表 | `models` 的键写错 | 键必须和 `/v1/models` 返回的 ID 完全一致 |
| 请求超时 | 默认超时太短 | 调大 `options.timeout` |
| 工具调用异常 | 模型不支持 tool call | 换一个支持工具调用的模型 |

## 进阶：把密钥写进配置文件

如果你不想用 `/connect`，也可以直接在配置里写死密钥：

```json
"options": {
  "baseURL": "https://kuncode.120403.xyz/v1",
  "apiKey": "sk-xxxxxxxx"
}
```

::: warning 这样会明文存储密钥
用这种方式时，务必：

- 不要把 `opencode.json` 提交到 Git
- 截图时打码

更推荐用上面 `/connect` 的方式，或者用 `{file:...}` 引用外部文件：

```json
"apiKey": "{file:~/.secrets/kuncode-key}"
```
:::
