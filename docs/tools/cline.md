# Cline

::: info 适用版本
最后验证：2026-10-06 · 当前稳定版扩展 · 官方文档 https://docs.cline.bot/

本文未固定具体版本号，配置步骤以官方文档和当前界面为准。
:::

开源 AI 编程助手，以 VS Code 扩展和桌面端的形式使用，通过 OpenAI Compatible provider 接入任何兼容网关。

本文以 KunCode 为例演示，把示例中的地址、Key 和模型名替换成你自己的服务即可。占位符与替换规则见[通用占位符说明](/guide/index#占位符约定)。Cline 是图形界面工具，配置都在扩展的设置面板里完成，不需要编辑配置文件。

- 官网：<https://cline.bot/>
- 文档：<https://docs.cline.bot/>
- 仓库：<https://github.com/cline/cline>

## 1. 安装

Cline 是编辑器扩展，直接在 VS Code 的扩展市场里安装，不要用命令行安装：

1. 打开 VS Code
2. 进入扩展面板（Extensions）
3. 搜索 `Cline`
4. 点击 Install

Cline 也提供独立的桌面端应用，可以从官网下载。

::: tip 其他编辑器
Cline 主要面向 VS Code。其他编辑器的支持情况以官网为准。
:::

安装完成后，VS Code 侧边栏会出现 Cline 图标，点击即可打开。

## 2. 准备 API Key

见 [准备 API Key](/guide/api-key)。记下两样东西：

- **API Key**：常见形如 `sk-...`，以你的服务商为准
- **Base URL**：你的服务地址，例如 `https://kuncode.120403.xyz/v1`

## 3. 配置 provider

打开 Cline 面板，进入设置（Settings），在 API Provider 里选择 **OpenAI Compatible**。

然后填写三项：

| 配置项 | 填写内容 |
| --- | --- |
| Base URL | 你的服务地址，例如 `https://kuncode.120403.xyz/v1` |
| API Key | 你的密钥，例如 `sk-xxxxxxxx` |
| Model ID | 要使用的模型 ID，例如 `deepseek-flash` |

::: tip Base URL 填完整地址
OpenAI Compatible provider 需要填能直接发起请求的完整 Base URL。如果你的服务要求带 `/v1`，就一并写上，例如 `https://kuncode.120403.xyz/v1`。
:::

::: tip Model ID 必须是真实模型 ID
Model ID 要和接口返回的模型 ID 完全一致。用下面这条命令查看可用模型：

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```
:::

具体字段名称和位置可能随版本变化，以当前扩展界面为准。

## 4. 验证

配置保存后，在 Cline 面板里输入一句简单的话，例如：

```
print hello
```

能正常回复就说明配置成功。再让它读一个文件或执行一次命令，确认工具调用也能正常工作。

## 5. 常用配置

### 更换模型

在设置里把 Model ID 换成另一个可用模型即可，不需要重新配置 Base URL 和 Key。

### 调整上下文与输出

Cline 允许为模型设置上下文窗口和最大输出长度。如果你遇到上下文超限或输出被截断，可以在模型设置里调整这两个值，具体以当前扩展界面为准。

### 多个 provider

Cline 可以同时保存多个 provider 配置，使用时在面板顶部切换。团队协作时不要把 Key 写进会被提交的文件。

## 6. 排障

按状态码系统排查见[错误码与排障](/guide/errors)。

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | API Key 填错或已失效 | 重新粘贴完整密钥，确认没有多余空格 |
| `404 Not Found` | Base URL 写错 | 确认填的是完整地址，需要带 `/v1` 就带上 |
| 模型不存在 / 模型不可用 | Model ID 写错，或该模型不在你的服务里 | 用 `/v1/models` 查到的 ID 重新填写 |
| 请求超时 | 请求太大或服务较慢 | 减小请求、调大超时，或稍后重试 |
| 工具调用失败 | 模型不支持 tool call | 换一个支持工具调用的模型 |

## 进阶：使用 Anthropic 或 Responses 接口

Cline 的 OpenAI Compatible provider 走 Chat Completions 接口。如果你的服务或模型更适合其他接口，可以在 API Provider 里选择对应的 provider 类型。Cline 支持的 provider 列表会随版本更新，以当前扩展界面为准。

::: warning 不要提交密钥
如果你把 Cline 配置导出或分享，注意先去掉 API Key。截图时也要打码。
:::
