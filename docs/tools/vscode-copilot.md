# VS Code + GitHub Copilot BYOK

::: info 适用版本
最后验证：2026-10-06 · 当前稳定版 VS Code · 官方文档 https://code.visualstudio.com/docs/copilot/customization/language-models

本文未固定具体版本号，配置步骤以官方文档和当前界面为准。
:::

在 VS Code 中使用 GitHub Copilot Chat，并通过 BYOK（Bring Your Own Key）或 **Custom endpoint** 接入自定义模型服务。VS Code 本身免费，模型费用由你选择的 provider 收取；部分 Copilot 功能仍需要 GitHub 账号或订阅，具体以官方文档为准。

本文以 KunCode 为例演示，把示例中的地址、Key 和模型名替换成你自己的服务即可。占位符与替换规则见[通用占位符说明](/guide/index#占位符约定)。配置界面可能随 VS Code 版本变化，实际字段和入口以 VS Code 当前版本及官方文档为准。

- 官方文档：<https://code.visualstudio.com/docs/copilot/customization/language-models>
- 组织版 BYOK 文档：<https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/use-your-own-api-keys>

## 1. 前置条件

开始前确认：

- 已安装并使用当前版本的 VS Code
- 已安装 GitHub Copilot 扩展，并能使用 Copilot Chat
- 已有一个可用的 API Key
- 已取得服务商提供的 Endpoint URL，例如 `https://kuncode.120403.xyz/v1`
- 已确认要使用的模型 ID，以及该模型是否支持工具调用

VS Code BYOK 支持内置 provider，也支持 **Custom endpoint**。Custom endpoint 可接 Chat Completions、Responses 或 Messages API，填写 API key 和 endpoint URL 即可。不同 API 类型对应的 endpoint 路径可能不同，以服务商和 VS Code 实际要求为准。

::: warning 组织版 BYOK 当前为 public preview
组织级 BYOK 目前处于 public preview，功能和可用范围可能变化。组织管理员应按 GitHub 官方文档配置；普通用户界面中是否出现相关选项，以当前账号和 VS Code 版本为准。
:::

## 2. 安装与登录

1. 打开 VS Code
2. 在扩展面板中搜索并安装 GitHub Copilot 扩展
3. 按 VS Code 提示使用 GitHub 账号登录
4. 确认 Copilot Chat 可以正常打开

如果你只需要使用 BYOK 模型，仍可能需要 GitHub 账号来启用 Copilot Chat；GitHub 相关功能是否可用，取决于你的账号和订阅。具体登录与权限要求以 VS Code 和 GitHub 官方文档为准。

## 3. 准备 API Key

见 [准备 API Key](/guide/api-key)。记下两样东西：

- **API Key**：你的服务商提供的密钥，例如 `sk-xxxxxxxx`
- **Endpoint URL / Base URL**：你的服务地址，例如 `https://kuncode.120403.xyz/v1`

Endpoint URL 可以替换成你自己的服务地址。若 VS Code 要求填写完整接口地址，请根据 API 类型补上对应路径。

## 4. 配置 BYOK / Custom endpoint

按 VS Code 官方文档中的语言模型管理步骤，打开模型管理入口，选择 BYOK 或 **Custom endpoint**。实际按钮名称和菜单位置可能随版本变化，以当前界面为准。

常见配置项如下：

| 配置项 | 填写内容 |
| --- | --- |
| API 类型 | Chat Completions、Responses 或 Messages |
| Endpoint URL / Base URL | 例如 `https://kuncode.120403.xyz/v1`，可替换为你自己的地址 |
| API Key | 你的服务商密钥，例如 `sk-xxxxxxxx` |
| Model ID | 要使用的模型 ID，必须与服务端返回的模型 ID 一致 |
| Provider 名称 | 可选；用于在 VS Code 中区分多个自定义服务，以当前界面为准 |

不同 API 类型对应的完整请求路径通常如下，但最终以服务商和 VS Code 实际要求为准：

| API 类型 | 常见完整路径 |
| --- | --- |
| Chat Completions | `https://kuncode.120403.xyz/v1/chat/completions` |
| Responses | `https://kuncode.120403.xyz/v1/responses` |
| Messages | `https://kuncode.120403.xyz/v1/messages` |

::: tip Endpoint URL 与 Base URL
如果界面字段接受 Base URL，通常填写到 `/v1`；如果要求填写完整 Endpoint URL，则填写到具体接口路径。不要把两种写法混用，以界面提示和官方文档为准。
:::

::: warning 不要提交密钥
API Key 可能以明文形式保存在 VS Code 或系统凭据中。不要把含密钥的文件提交到 Git，截图和共享配置前也要先打码。
:::

## 5. 选择模型

配置完成后，在 VS Code 的模型选择入口中选择刚刚添加的模型。

- 如果 VS Code 能自动读取模型列表，直接从列表中选择
- 如果只能手动填写，Model ID 必须与服务端返回的一致
- 需要文件读写、命令执行等能力时，选择支持工具调用的模型

可用模型可通过接口查询：

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

若接口需要 Anthropic Messages 认证方式，请按服务商文档调整请求头和路径。模型列表与协议差异见 [模型与能力](/guide/models) 和 [选择接入方式](/guide/endpoints)。

## 6. 验证

在 Copilot Chat 中先发送一句简单对话，例如：

```text
print hello
```

能正常回复，说明 Custom endpoint 和 API Key 已经生效。

再按 VS Code 当前版本支持的方式发起一次需要工具调用的任务，例如让它读取一个文件或执行一条命令，确认模型可用于编码场景。不同 VS Code 版本中工具调用的入口和权限提示可能不同，以当前界面为准。

## 7. 常用配置

### 切换模型

在模型选择入口中切换到另一个已配置模型，或修改 Custom endpoint 中的 Model ID。切换后重新发送一条消息确认生效。

### 调整 API 类型

如果服务同时支持多种接口，优先按官方文档选择匹配的 API 类型：

- Chat Completions：常见 OpenAI 兼容接口
- Responses：支持 Responses API 的服务或模型
- Messages：Anthropic Messages 兼容接口

接口类型与路径不匹配时，通常会出现 `404` 或请求格式错误。

### 多个自定义服务

如果界面支持保存多个 provider，可以分别添加不同的 Endpoint URL 和 API Key，再通过模型选择入口切换。不要在不同服务之间复用错误的 Key。

### 安全建议

- 不要把 API Key 写进项目文件或提交到 Git
- 定期在服务商控制台轮换 Key
- 发现泄漏后立即吊销旧 Key，并更新 VS Code 中的配置

## 8. 排障

按状态码系统排查见 [错误码与排障](/guide/errors)。

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | API Key 错误、已失效，或认证头不符合服务要求 | 重新填写完整 Key；确认 API 类型和认证方式与服务商一致 |
| `404 Not Found` | Endpoint URL 或 API 类型错误 | 确认 Base URL / 完整路径写法正确，并确认接口类型与服务匹配 |
| 模型不存在 | Model ID 错误，或模型不在当前服务中 | 用 `/v1/models` 返回的 ID 重新填写 |
| 请求超时 | 网络、代理、服务较慢或请求过大 | 检查 DNS、代理和防火墙；减小请求或稍后重试 |
| 工具调用失败 | 模型不支持 tool call，或模型能力未正确识别 | 换用支持工具调用的模型，并检查 VS Code 中的模型配置 |
| BYOK 未生效 | 未选择自定义模型、配置未保存，或当前账号/版本不支持该入口 | 确认在 Copilot Chat 中选中了自定义模型；重新打开模型管理入口检查配置，必要时升级 VS Code |
