# CodeBuddy（腾讯云代码助手）

腾讯云推出的 AI 编程助手，支持通过用户级或项目级 `models.json` 接入自定义模型。

本文以 KunCode 为例，换成你自己的服务地址同样适用。CodeBuddy 的界面和配置字段可能随版本变化，具体以当前客户端和官方文档为准。

- 官网：<https://codebuddy.cn/>
- 产品介绍：<https://codebuddy.cn/docs/ide/Introduction>
- 自定义模型文档：<https://codebuddy.cn/docs/ide/Features/models>

## 1. 安装

1. 打开 [CodeBuddy 官网](https://codebuddy.cn/)
2. 下载并安装 IDE 或对应编辑器插件
3. 启动 CodeBuddy 并登录

CodeBuddy 支持 Windows 10 及以上，不支持 Windows 7、Windows 8 和 Windows 8.1。其他平台和 IDE 的支持情况以官网为准。

## 2. 准备 API Key

见[准备 API Key](/guide/api-key)。记下两样东西：

- **API Key**：你的服务密钥，例如 `sk-xxxxxxxx`
- **完整请求 URL**：自定义模型配置中的 `url` 必须填写完整请求路径，一般以 `/chat/completions` 结尾，例如 `https://kuncode.120403.xyz/v1/chat/completions`

::: warning `url` 不是 Base URL
CodeBuddy 的 `models.json` 要求 `url` 字段填写完整请求路径。不要只写 `https://kuncode.120403.xyz`，也不要只写 `https://kuncode.120403.xyz/v1`；一般需要写到 `/chat/completions`，例如：

```text
https://kuncode.120403.xyz/v1/chat/completions
```

具体路径以你的服务端实际接口和当前官方文档为准。
:::

## 3. 找到配置文件

CodeBuddy 支持两个层级的 `models.json`：

| 层级 | 路径 | 适用范围 |
| --- | --- | --- |
| 用户级 | `~/.codebuddy/models.json` | 当前用户的所有项目 |
| 项目级 | `.codebuddy/models.json` | 当前项目 |

项目级配置通常优先于用户级配置。具体合并规则以当前客户端和官方文档为准。

## 4. 填写配置

在 `models.json` 中按官方字段格式添加自定义模型。常见字段如下：

| 字段 | 说明 |
| --- | --- |
| `id` | 模型 ID，必须和服务端返回的真实模型 ID 一致 |
| `apiKey` | API Key，例如 `sk-xxxxxxxx` |
| `url` | 完整请求路径，一般以 `/chat/completions` 结尾 |
| `maxInputTokens` | 最大输入 token 数，按模型实际能力填写 |
| `maxOutputTokens` | 最大输出 token 数，按模型实际能力填写 |
| `supportsToolCall` | 模型是否支持工具调用，按实际能力填写 |

示例结构：

```json
{
  "models": [
    {
      "id": "deepseek-flash",
      "apiKey": "sk-xxxxxxxx",
      "url": "https://kuncode.120403.xyz/v1/chat/completions",
      "maxInputTokens": 128000,
      "maxOutputTokens": 8192,
      "supportsToolCall": true
    }
  ]
}
```

::: tip 字段名和结构以官方文档为准
上面的字段来自 CodeBuddy 自定义模型文档中常见的配置项。不同版本可能使用不同的顶层结构或额外字段，请以当前客户端和[官方文档](https://codebuddy.cn/docs/ide/Features/models)为准。
:::

## 5. 验证

保存配置后重启或重新加载 CodeBuddy，然后：

1. 在模型列表里选择刚配置的模型
2. 新建对话，输入一句简单的话，例如 `print hello`
3. 能正常回复后，再让它读取一个文件或执行一次需要工具调用的操作

对话和工具调用都能完成，才说明接入可用。

## 6. 常用配置

### 更换模型

在 `models.json` 中修改或新增模型条目，然后重新加载客户端。

### 区分用户级和项目级

如果只想让当前项目使用某个模型，写项目级 `.codebuddy/models.json`；如果希望所有项目都能用，写用户级 `~/.codebuddy/models.json`。

### 调整上下文与输出

`maxInputTokens` 和 `maxOutputTokens` 要按模型实际能力填写。填得过大可能导致请求失败，填得过小可能导致上下文被截断或输出受限。

### 工具调用

如果模型不支持工具调用，将 `supportsToolCall` 设为 `false`，或换用支持工具调用的模型。CodeBuddy 的编码能力依赖工具调用，模型不支持时部分功能会不可用。

## 7. 排障

按状态码系统排查见[错误码与排障](/guide/errors)。

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | API Key 填错或已失效 | 重新粘贴完整密钥，确认没有多余空格 |
| `404 Not Found` | `url` 写错，例如只写了 Base URL，或路径缺少 `/chat/completions` | 检查 `url` 是否为完整请求路径，并和服务端实际接口完全一致 |
| 模型不存在 / 模型不可用 | `id` 写错，或该模型不在你的服务里 | 用 `/v1/models` 查到的 ID 重新填写 |
| 请求超时 | 请求太大、服务较慢或网络不稳定 | 减小请求、调大超时，或稍后重试 |
| 工具调用失败 | 模型不支持 tool call，或 `supportsToolCall` 配置错误 | 换一个支持工具调用的模型，并把 `supportsToolCall` 设为 `true` |

## 进阶：配置多个模型

在 `models.json` 的模型数组中添加多个条目即可。每个条目使用自己的 `id`、`apiKey` 和完整 `url`。如果服务端模型 ID 或请求路径不同，不要复用同一个配置。

::: warning 不要提交密钥
如果项目级 `.codebuddy/models.json` 包含 API Key，请把它加入 `.gitignore`，不要提交到 Git。截图和分享配置时也要先打码。
:::
