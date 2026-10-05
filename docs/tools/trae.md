# Trae

::: info 适用版本
最后验证：2026-10-06 · 当前稳定版客户端 · 官方文档 https://docs.trae.ai/ide/models；Trae CN 国内版未核实
:::

AI 编程 IDE / 编辑器，支持通过自定义模型接入兼容网关。

本文以 KunCode 为例，换成你自己的服务地址同样适用。Trae 的界面会随版本变化，具体菜单名称和字段位置以当前客户端为准。

- 官网：<https://www.trae.ai/>
- 自定义模型文档：<https://docs.trae.ai/ide/models>
- 下载：<https://www.trae.ai/download>

::: tip Trae CN 与国际版
Trae CN 国内版是否与国际版功能一致尚未核实。如果你使用国内版，请以当前客户端和官方说明为准，不要默认两者的配置方式完全相同。
:::

## 1. 安装

1. 打开 [Trae 下载页](https://www.trae.ai/download)
2. 下载并安装 Windows 版本。官方当前支持 Windows 10/11
3. 启动 Trae 并登录

macOS 等其他平台的安装方式以官网下载页为准。

## 2. 准备 API Key

见[准备 API Key](/guide/api-key)。记下两样东西：

- **API Key**：你的服务密钥，例如 `sk-xxxxxxxx`
- **服务地址**：可能是 Base URL，也可能是完整请求 URL，例如 `https://kuncode.120403.xyz/v1`

## 3. 添加自定义模型

在 Trae 的模型管理相关设置中找到添加自定义模型的入口（具体名称以当前客户端为准），然后按你的服务端能力选择 API 格式：

- **OpenAI Chat Completions**：适合大多数 OpenAI 兼容网关
- **Anthropic Messages**：适合提供 Anthropic Messages 接口的服务

需要填写的内容通常包括：

| 配置项 | 填写内容 |
| --- | --- |
| API 格式 | `OpenAI Chat Completions` 或 `Anthropic Messages` |
| URL / Base URL | 完整请求 URL 或 Base URL，取决于界面字段提示 |
| API Key | 你的密钥，例如 `sk-xxxxxxxx` |
| Model ID | 服务端真实模型 ID，例如 `deepseek-flash` |

常见地址示例：

- OpenAI Chat Completions 完整 URL：`https://kuncode.120403.xyz/v1/chat/completions`
- Anthropic Messages 完整 URL：`https://kuncode.120403.xyz/v1/messages`
- 如果界面只要求 Base URL，按界面提示填写服务地址，常见形式为 `https://kuncode.120403.xyz/v1`

::: warning URL 格式以字段提示为准
Trae 可能要求完整 URL，也可能只要求 Base URL。不要把两种格式混着填：界面要完整 URL，就填写完整请求路径；界面要 Base URL，就填写服务根地址。拿不准时先查看官方文档或当前客户端提示。
:::

::: tip Model ID 必须是真实模型 ID
Model ID 要和接口返回的模型 ID 完全一致。可以用下面这条命令查看可用模型：

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

如果你的服务使用 Anthropic 认证方式，请按服务端要求改用 `x-api-key`。
:::

具体字段名称、协议选项和保存位置可能随版本变化，以当前客户端为准。

## 4. 验证

保存配置后：

1. 在模型列表里选择刚添加的模型
2. 新建对话，输入一句简单的话，例如 `print hello`
3. 能正常回复后，再让它读取一个文件或执行一次需要工具调用的操作

对话和工具调用都能完成，才说明接入可用。

## 5. 常用配置

### 更换模型

在模型列表里切换到另一个已添加的模型即可，不需要重新填写 API Key。

### 调整上下文与输出

如果 Trae 的自定义模型界面提供上下文窗口或最大输出长度，请按模型实际能力填写。不确定时先使用官方模型说明中的值，或保留默认值。

### 添加多个自定义模型

可以按相同流程添加多个模型或服务。每个模型使用自己的 Model ID；如果服务地址或 Key 不同，也要分别填写。

### 选择 Chat Completions 还是 Messages

优先使用你的服务端明确支持的协议。不要假设同一个模型同时支持 Chat Completions 和 Anthropic Messages；具体能力以服务端返回和[接入协议](/guide/endpoints)说明为准。

## 6. 排障

按状态码系统排查见[错误码与排障](/guide/errors)。

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | API Key 填错、已失效，或认证头格式不对 | 重新粘贴完整密钥；Anthropic 接口确认是否要改用 `x-api-key` |
| `404 Not Found` | URL 路径错误，例如缺少 `/v1`、路径多了一层，或完整 URL 与 Base URL 混用 | 对照官方文档检查完整请求路径；Chat Completions 与 Messages 的路径不同 |
| 模型不存在 / 模型不可用 | Model ID 写错，或该模型不在你的服务里 | 用 `/v1/models` 查到的 ID 重新填写 |
| 请求超时 | 请求太大、服务较慢或网络不稳定 | 减小请求、调大超时，或稍后重试 |
| 工具调用失败 | 模型不支持 tool call，或所选 API 格式不匹配 | 换一个支持工具调用的模型，并确认服务端协议 |

## 进阶：完整 URL 与 Base URL 的选择

如果你的服务同时支持多种入口，建议先看[接入协议](/guide/endpoints)和[模型与能力](/guide/models)，确认模型实际支持哪一种接口。Trae 的字段名称和 URL 拼接方式可能随版本变化，最终以当前客户端和官方文档为准。

::: warning 不要提交密钥
不要把 API Key 写进会提交到 Git 的文件、截图或分享配置中。截图时先打码。
:::
