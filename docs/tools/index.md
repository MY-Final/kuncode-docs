# 工具列表

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

> 表中的路径和安装方式可能随版本变化，以对应工具页和官方文档为准。

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