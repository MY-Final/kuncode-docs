# 让 AI 安装并配置工具

这一页的提示词不是给小白执行的，是**给 AI 执行的**。你只要复制、粘贴、回答它的问题。

## 通用配置提示词

适用于 Codex、Claude Code、OpenCode、GitHub Copilot CLI 或其他支持自定义 Base URL 的工具。

```text
你现在负责帮我在这台电脑上安装并配置一个 AI 编程工具。

我的系统是：<Windows / macOS / Linux>
我想用的工具是：<不知道 / OpenCode / Codex / Claude Code / GitHub Copilot CLI>
我有的服务是：<还没有 / 有 API Key / 有免费额度 / 不确定>

请你：
1. 先检查我的系统环境，确认缺少哪些前置条件。
2. 如果需要安装 Node.js、包管理器或其他依赖，先告诉我你将安装什么。
3. 直接执行安装命令，不要只给我命令让我自己跑。
4. 找到正确的配置文件位置，写入配置。
5. API Key 让我自己粘贴，不要让我把完整密钥发到聊天里。
6. 配置完成后运行验证命令，确认模型真的能调用。
7. 最后告诉我：装了什么、配置改在哪里、怎么卸载或恢复。
```

## 推荐：让 AI 配置 OpenCode

OpenCode 对新手比较友好，也适合用免费模型先跑通。

```text
请帮我在本机安装并配置 OpenCode，目标是先用免费模型跑通。

要求：
1. 先检查 Node.js 和 npm 是否满足要求。
2. 如果不满足，直接帮我安装或升级。
3. 安装 OpenCode。
4. 打开并检查当前有哪些模型可用。
5. 如果有免费模型，直接帮我选好并验证。
6. 如果没有免费模型，告诉我最低成本的可用方案，再继续配置。
7. 验证方式：让 OpenCode 读取当前目录的一个文件并总结。
8. 每一步都实际执行，不要只给教程链接。
```

## 让 AI 配置 Codex

```text
请帮我在本机安装并配置 Codex，接入我自己的兼容服务。

要求：
1. 检查系统环境和 Node.js 版本。
2. 安装 Codex CLI。
3. 找到 ~/.codex/config.toml（Windows 是 %USERPROFILE%\.codex\config.toml）。
4. 根据我的服务地址配置 model_provider、base_url、wire_api 和认证方式。
5. API Key 让我自己填，不要让我把完整密钥发给你。
6. 运行 codex exec "print hello" 验证。
7. 如果失败，读取完整报错并继续排查，直到确认原因。
```

## 让 AI 配置 Claude Code

```text
请帮我在本机安装并配置 Claude Code，接入兼容的 Anthropic Messages 入口。

要求：
1. 检查 Node.js 版本和系统兼容性。
2. 安装 Claude Code。
3. 找到 ~/.claude/settings.json（Windows 是 %USERPROFILE%\.claude\settings.json）。
4. 配置 ANTHROPIC_BASE_URL 和认证变量。
5. ANTHROPIC_BASE_URL 只写域名，不要带 /v1。
6. API Key 让我自己填。
7. 运行 claude --version 和一次最小请求验证。
8. 如果出现模型识别警告，按官方支持的方式处理，不要乱改配置。
```

## 让 AI 配置 GitHub Copilot CLI

```text
请帮我在本机安装并配置 GitHub Copilot CLI，使用 BYOK 接入兼容网关。

要求：
1. 检查 PowerShell 版本和 Node.js 环境。
2. 安装 Copilot CLI。
3. 配置 COPILOT_PROVIDER_BASE_URL、COPILOT_PROVIDER_TYPE、COPILOT_PROVIDER_API_KEY 和 COPILOT_MODEL。
4. OpenAI 兼容模式的 Base URL 需要带 /v1。
5. API Key 让我自己填。
6. 运行一次非交互验证，确认能调用模型。
7. 如果权限参数有安全风险，先解释再执行。
```

## 让 AI 自己排查失败

```text
我刚才按你的步骤配置了 <工具名>，但是失败了。
这是完整报错：
<粘贴完整报错>

请你：
1. 先判断是环境、安装、配置、认证、协议还是额度问题。
2. 读取当前实际配置文件，不要凭猜测。
3. 一次只改一个变量，改完立刻验证。
4. 如果涉及 API Key，不要打印完整密钥。
5. 最后告诉我根因是什么，以及下次怎么避免。
```

## 让 AI 回滚配置

```text
请把我刚才配置的 <工具名> 恢复到官方默认状态。
要求：
1. 先备份当前配置。
2. 删除或注释掉自定义 provider 配置。
3. 清除本地保存的旧凭据，但不要打印密钥。
4. 告诉我如何在控制台吊销旧 Key。
5. 验证工具是否还能正常启动。
```

## 接下来

- [配置提示词库](./prompts)
- [免费与试用模型](./free-models)