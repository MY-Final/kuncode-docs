# 工具列表

| 工具 | 支持协议 | 推荐入口 | 主配置位置 | 凭据位置 | Windows 安装 |
| --- | --- | --- | --- | --- | --- |
| [Codex](./codex) | Responses | Responses | `~/.codex/config.toml` | 配置文件或环境变量 | npm |
| [Claude Code](./claude-code) | Anthropic Messages | Anthropic Messages | `~/.claude/settings.json` | 配置文件或环境变量 | npm |
| [OpenCode](./opencode) | Responses / Chat Completions | Responses | `opencode.json` | `auth.json` | npm |
| [GitHub Copilot CLI](./copilot) | Chat Completions / Responses / Anthropic | Chat Completions | 环境变量（进阶支持 `providers.json`） | 环境变量或 providers 配置 | WinGet |

> 表中的路径是各工具的默认位置。具体版本可能不同，以对应工具页为准。

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
