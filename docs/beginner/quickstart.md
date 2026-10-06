# 15 分钟最小接入：从 Key 到 tool call

::: tip 最短路径
本页是让一个兼容网关在 OpenCode 里真正跑通的最短路径。想先理解 API Key、Base URL、协议入口等概念，先看[基础概念](/guide/)；想先用免费模型，看[免费与试用模型](/beginner/free-models)。
:::

本页全程使用同一组占位值，后面每一步都不要再换名字：

| 项目 | 本页固定值 |
| --- | --- |
| API 节点 | `https://gateway.example.com` |
| API Key | `sk-your-key` |
| 模型 ID | `deepseek-flash` |
| 演示工具 | OpenCode |

::: warning 这些不是可直接使用的真实凭据
`sk-your-key` 和 `gateway.example.com` 只是占位符。真正执行时，把 API 节点、Key、模型 ID 替换成你的服务商提供的值；不要把真实 Key 提交到 Git 或发到聊天里。
:::

## 准备三样东西

你需要：服务地址、API Key、模型 ID。没有 Key 或不知道模型 ID 时，先看[准备 API Key](/guide/api-key)。模型 ID 必须和 `/v1/models` 返回的 `id` 完全一致。

**成功长这样：** 你能写下三项真实值，并知道它们分别对应本页的 `https://gateway.example.com`、`sk-your-key`、`deepseek-flash`。

## 第一步：确认 Key 和地址可用

```bash
curl https://gateway.example.com/v1/models -H "Authorization: Bearer sk-your-key"
```

Windows PowerShell 如果提示 `curl` 不是可识别的命令，把开头的 `curl` 改成 `curl.exe`；路径、PowerShell 和 CMD 的区别见 [Windows 用户必读](/beginner/windows)。

**成功长这样：** 返回 JSON 模型列表，并且 `data` 数组里能看到 `deepseek-flash`：

```json
{
  "object": "list",
  "data": [
    {
      "id": "deepseek-flash",
      "object": "model"
    }
  ]
}
```

看到 `401` 先检查 Key；看到 `404` 先检查 API 节点和 `/v1` 是否写对。更多错误见[错误码与排障](/guide/errors)。

## 第二步：发一条最小请求

本页先用 Chat Completions，因为它是最常见的兼容入口：

```bash
curl https://gateway.example.com/v1/chat/completions -H "Authorization: Bearer sk-your-key" -H "Content-Type: application/json" -d '{"model":"deepseek-flash","messages":[{"role":"user","content":"Reply with exactly: OK"}],"max_tokens":16}'
```

如果你的服务只支持 Responses，不要硬套这条命令，改看[选择接入方式](/guide/endpoints)里的 Responses 示例。

**成功长这样：** 返回 JSON 里 `model` 是 `deepseek-flash`，并且 `choices[0].message.content` 包含 `OK`：

```json
{
  "id": "chatcmpl-example",
  "object": "chat.completion",
  "model": "deepseek-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "OK"
      },
      "finish_reason": "stop"
    }
  ]
}
```

这一步只证明 Key、地址、模型和 Chat Completions 入口能通；还不能证明工具调用正常。

## 第三步：安装 OpenCode

```bash
npm install -g opencode-ai
```

安装完成后确认命令可用：

```bash
opencode --version
```

**成功长这样：** 输出一个版本号，例如 `1.18.34`。如果提示 `npm` 不存在，先安装 Node.js LTS；如果提示 `opencode` 找不到，关闭并重新打开终端再试。

## 第四步：写配置

OpenCode 的全局配置文件位置：

| 系统 | 路径 |
| --- | --- |
| macOS / Linux | `~/.config/opencode/opencode.json` |
| Windows | `%USERPROFILE%\.config\opencode\opencode.json` |

Windows 用户如果要在 PowerShell 里打开或创建这个文件，路径写法先看 [Windows 用户必读](/beginner/windows)。用编辑器新建或打开 `opencode.json`，完整写入：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "gateway": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Example Gateway",
      "options": {
        "baseURL": "https://gateway.example.com/v1"
      },
      "models": {
        "deepseek-flash": {
          "name": "DeepSeek Flash"
        }
      }
    }
  }
}
```

**成功长这样：** 文件保存后，JSON 没有语法错误；`baseURL` 以 `/v1` 结尾，`models` 的键就是 `deepseek-flash`。

::: tip 为什么这里用 openai-compatible
`@ai-sdk/openai-compatible` 走 `/v1/chat/completions`，兼容面最广。如果你确认服务支持 Responses，可以改成 `@ai-sdk/openai`，但 Base URL 仍保持 `https://gateway.example.com/v1`。详见[选择接入方式](/guide/endpoints)。
:::

## 第五步：写入 Key

配置文件里不要写 Key。启动 OpenCode：

```bash
opencode
```

在界面里输入：

```text
/connect
```

选择 `Example Gateway`，然后粘贴 `sk-your-key`。

**成功长这样：** 连接完成后界面回到对话输入框；再次执行 `/connect` 时，这个 provider 已经处于已连接状态，不会要求你重新选择并输入 Key。

## 第六步：验证 tool call

先创建一个真实文件，再让 OpenCode 读取它：

```bash
node -e "require('fs').writeFileSync('quickstart-check.txt','The quickstart tool-call check passed.')"
opencode run "Read quickstart-check.txt. Quote its exact contents, then summarize it in one sentence. Do not modify any files."
```

**成功长这样：** OpenCode 的回复里出现文件原文 `The quickstart tool-call check passed.`，并且有一句基于原文的总结。只要它只回答“已读取”却没有引用原文，就不算通过。验证完可以删除这个临时文件。

## 到这里就算通了

对照下面 6 步，全部通过才算完成：

- [ ] 第 1 步：`/v1/models` 返回 `deepseek-flash`
- [ ] 第 2 步：Chat Completions 返回 `OK`
- [ ] 第 3 步：`opencode --version` 输出版本号
- [ ] 第 4 步：`opencode.json` 使用 `@ai-sdk/openai-compatible` 和 `https://gateway.example.com/v1`
- [ ] 第 5 步：`/connect` 成功写入 `sk-your-key`
- [ ] 第 6 步：OpenCode 引用出 `quickstart-check.txt` 的真实内容

如果任何一步失败，先不要同时改多个地方；按[失败求助](/beginner/help)的顺序复制报错、判断该找谁，再继续排查。

## 接下来

- [第一次怎么用：对话、读文件、改代码、跑测试](/guide/usage)
- [OpenCode 完整配置与排障](/tools/opencode)
- [失败求助](/beginner/help)
