# 工具列表

| 工具 | 推荐入口 | 配置方式 | 说明 |
| --- | --- | --- | --- |
| [Codex](./codex) | Responses | `~/.codex/config.toml` | OpenAI 官方 CLI，支持自定义 provider |
| [Claude Code](./claude-code) | Anthropic Messages | 环境变量 | Anthropic 官方 CLI |
| [OpenCode](./opencode) | Responses | `opencode.json` | 开源终端编程助手 |

## 通用步骤

每个工具的接入流程都是一样的：

1. 安装工具本体
2. 准备 API Key
3. 填入 Base URL 与 Key
4. 运行验证命令
5. 遇到问题查对应页面的排障小节

## 还没有覆盖你的工具？

只要该工具支持自定义 Base URL，并且使用上表中的任一协议，就能按相同思路接入。
参考最接近的一个页面改写配置即可。

## 关于示例

页面中的地址、密钥、模型名都是演示占位值，可替换为任意兼容服务。
