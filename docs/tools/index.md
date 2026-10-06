# 工具列表

## 不知道选哪个？

按你的情况对号入座：

| 你的情况 | 推荐工具 | 为什么 |
| --- | --- | --- |
| 完全新手，想先用免费额度跑通 | [OpenCode](./opencode) 或 [Crush](./crush) | 安装简单，配置短，支持免费或低成本模型 |
| 国内网络，想要中文界面 | [Qwen Code](./qwen-code)、[Trae](./trae) 或 [CodeBuddy](./codebuddy) | 国内访问稳定，中文文档和界面 |
| 用 VS Code | [Cline](./cline)、[Kilo Code](./kilo-code) 或 [VS Code + Copilot BYOK](./vscode-copilot) | 直接在编辑器里用，图形界面配置 |
| 用 JetBrains | [Kilo Code](./kilo-code) 或 [Junie](https://www.jetbrains.com/junie/) | JetBrains 插件形态，官方支持 |
| 想要桌面端应用 | [Goose](./goose) 或 [Cline](./cline) | 有独立桌面客户端，不依赖终端 |
| 想要最简配置 | [Crush](./crush) | 一条 `crush provider add` 命令即可接入 |
| 想要极简、可用扩展定制的终端工具 | [Pi](./piagent) | 核心精简，用 TypeScript 扩展、技能和主题按需扩展 |
| 用 OpenAI 官方账号 | [Codex](./codex) | OpenAI 官方 CLI |
| 用 Anthropic 官方账号 | [Claude Code](./claude-code) | Anthropic 官方 CLI |
| 用 GitHub 账号 | [GitHub Copilot CLI](./copilot) 或 [VS Code + Copilot BYOK](./vscode-copilot) | GitHub 官方生态 |
| 只想用 Gemini 官方模型 | [Google Gemini CLI](./gemini-cli) | Gemini 原生协议，有免费层 |

::: tip 选一个就够了
第一次不要同时装多个工具。选一个跑通，再考虑其他。
:::

| 工具 | 形态 | 支持协议 | 主配置位置 | 凭据位置 | Windows 安装 |
| --- | --- | --- | --- | --- | --- |
| [Codex](./codex) | 终端 | Responses | `~/.codex/config.toml` | 配置文件或环境变量 | npm |
| [Claude Code](./claude-code) | 终端 | Anthropic Messages | `~/.claude/settings.json` | 配置文件或环境变量 | npm |
| [OpenCode](./opencode) | 终端 | Responses / Chat Completions | `opencode.json` | `auth.json` | npm |
| [GitHub Copilot CLI](./copilot) | 终端 | Chat Completions / Responses / Anthropic | 环境变量（进阶支持 `providers.json`） | 环境变量或 providers 配置 | WinGet |
| [Crush](./crush) | 终端 | OpenAI Compatible / Anthropic Compatible | `crushrc` | 环境变量 | winget / scoop / npm |
| [Goose](./goose) | 终端 + 桌面 | OpenAI Compatible / Anthropic Compatible / Ollama | `config.yaml` | 系统凭据存储或环境变量 | 官方 PowerShell 脚本 |
| [Qwen Code](./qwen-code) | 终端 | OpenAI / Anthropic / Gemini | `~/.qwen/settings.json` | 环境变量或 `.env` | PowerShell 脚本 / npm |
| [Cline](./cline) | VS Code / 桌面 | OpenAI Compatible | 扩展设置面板 | 扩展凭据存储 | VS Code 扩展 |
| [Kilo Code](./kilo-code) | VS Code / JetBrains | OpenAI Compatible / Responses / Anthropic | 扩展设置面板 | 扩展凭据存储 | 编辑器扩展 |
| [Gemini CLI](./gemini-cli) | 终端 | Gemini 原生协议 | `~/.gemini/settings.json` | `.env` / 环境变量 | npm |
| [VS Code + Copilot BYOK](./vscode-copilot) | VS Code | Chat Completions / Responses / Messages | VS Code 模型管理 | VS Code / 系统凭据 | VS Code |
| [Trae](./trae) | IDE | OpenAI Chat Completions / Anthropic Messages | 客户端模型设置 | 客户端凭据存储 | Windows 客户端 |
| [CodeBuddy](./codebuddy) | IDE / 插件 | OpenAI Chat Completions | `models.json` | `models.json` 或客户端凭据 | Windows 客户端 |
| [Pi](./piagent) | 终端 | Chat Completions / Responses / Anthropic Messages | `~/.pi/agent/models.json` | `models.json`、`auth.json` 或环境变量 | npm |

> 表中的路径和安装方式可能随版本变化，以对应工具页和官方文档为准。完整的能力、协议和平台对比见[工具能力对比](./compare)。

## 通用步骤

每个工具的接入流程都是一样的：

1. 安装工具本体
2. 准备 API Key
3. 填入 Base URL 与 Key（模型怎么挑见[模型与能力](/guide/models)）
4. 运行验证命令
5. 遇到问题查对应页面的排障小节

## 还没有覆盖你的工具？

只要该工具支持自定义 Base URL，并且使用上表中的任一协议，就能按相同思路接入。
参考最接近的一个页面改写配置即可。

## 关于示例

页面中的地址、密钥、模型名都是演示占位值，可替换为任意兼容服务。
