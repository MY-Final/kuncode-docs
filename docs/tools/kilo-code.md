# Kilo Code

::: info 适用版本
最后验证：2026-10-06 · 当前稳定版扩展 · 官方文档 https://kilocode.ai/docs/
:::

开源 AI 编程助手，以 VS Code / JetBrains 扩展的形式使用，支持 OpenAI Compatible、OpenAI Responses、Anthropic Messages 三种接口，可接入任何兼容网关。

本文以 KunCode 为例，换成你自己的服务地址同样适用。Kilo Code 是图形界面工具，配置都在扩展的设置面板里完成，不需要编辑配置文件。

- 文档：<https://kilocode.ai/docs/>
- 仓库：<https://github.com/Kilo-Org/kilocode>

## 1. 安装

Kilo Code 是编辑器扩展，直接在编辑器的扩展市场里安装，不要用命令行安装：

1. 打开 VS Code 或 JetBrains IDE
2. 进入扩展 / 插件市场
3. 搜索 `Kilo Code`
4. 点击安装

安装完成后，编辑器侧边栏会出现 Kilo Code 图标，点击即可打开。

## 2. 准备 API Key

见 [准备 API Key](/guide/api-key)。记下两样东西：

- **API Key**：`sk-` 开头
- **Base URL**：你的服务地址，例如 `https://kuncode.120403.xyz/v1`

## 3. 配置 provider

打开 Kilo Code 面板，进入设置，选择 API Provider，然后填写三项：

| 配置项 | 填写内容 |
| --- | --- |
| Base URL | 你的服务地址，例如 `https://kuncode.120403.xyz/v1` |
| API Key | 你的密钥，例如 `sk-xxxxxxxx` |
| Model | 要使用的模型，例如 `deepseek-flash` |

Kilo Code 支持三种接口，按你的服务或模型选择：

| 接口类型 | 适用场景 |
| --- | --- |
| OpenAI Compatible | 服务只支持 Chat Completions（`/v1/chat/completions`） |
| OpenAI Responses | 服务支持 Responses（`/v1/responses`） |
| Anthropic Messages | 服务走 Anthropic Messages（`/v1/messages`） |

::: tip 会自动读取模型列表
Kilo Code 支持从 Base URL 自动读取 `/v1/models`。填好 Base URL 和 Key 后，模型列表会自动拉取，直接选择即可，不用手动输入模型 ID。
:::

::: tip Base URL 填完整地址
如果服务要求带 `/v1`，就一并写上，例如 `https://kuncode.120403.xyz/v1`。如果自动读取模型失败，先检查这个地址。
:::

具体字段名称和位置可能随版本变化，以当前扩展界面为准。

## 4. 验证

配置保存后，在 Kilo Code 面板里输入一句简单的话，例如：

```
print hello
```

能正常回复就说明配置成功。再让它读一个文件或执行一次命令，确认工具调用也能正常工作。

## 5. 常用配置

### 更换模型

模型列表会自动拉取，直接在列表里切换即可，不需要改 Base URL 和 Key。

### 手动填写模型

如果不想用自动拉取的列表，也可以手动填写模型 ID。ID 必须和 `/v1/models` 返回的一致。

### 调整上下文与输出

Kilo Code 允许为模型设置上下文窗口和最大输出长度。如果遇到上下文超限或输出被截断，可以在模型设置里调整，具体以当前扩展界面为准。

## 6. 排障

按状态码系统排查见[错误码与排障](/guide/errors)。

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | API Key 填错或已失效 | 重新粘贴完整密钥，确认没有多余空格 |
| `404 Not Found` | Base URL 写错或接口类型选错 | 确认地址完整；确认接口类型和服务匹配 |
| 模型不存在 / 模型列表拉不到 | Base URL 或 Key 有误，导致 `/v1/models` 读取失败 | 先用 curl 确认 `/v1/models` 能返回数据 |
| 请求超时 | 请求太大或服务较慢 | 减小请求、调大超时，或稍后重试 |
| 工具调用失败 | 模型不支持 tool call，或接口类型不匹配 | 换一个支持工具调用的模型，或换用匹配的接口类型 |

## 进阶：选择正确的接口类型

同一服务可能同时支持多种接口。如果某个接口报错，可以先切换到另一种接口再试：

- 只支持 Chat Completions 的服务，选 **OpenAI Compatible**
- 推荐 Responses 的服务，选 **OpenAI Responses**
- Anthropic 系模型或服务，选 **Anthropic Messages**

::: warning 不要提交密钥
如果你把 Kilo Code 配置导出或分享，注意先去掉 API Key。截图时也要打码。
:::
