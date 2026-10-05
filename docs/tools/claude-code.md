# Claude Code

Anthropic 官方 CLI，通过自定义网关把请求指向任何兼容服务。

本文以 KunCode 为例演示，换成你自己的服务地址同样适用。

## 1. 安装

::: code-group

```bash [npm]
npm install -g @anthropic-ai/claude-code
```

```bash [Homebrew]
brew install --cask claude-code
```

:::

验证安装：

```bash
claude --version
```

## 2. 准备 API Key

见 [准备 API Key](/guide/api-key)。记下两样东西：

- **API Key**：`sk-` 开头
- **API 节点**：你的服务地址，例如 `https://kuncode.120403.xyz`

## 3. 找到配置文件

Claude Code 的用户级配置文件位于：

| 系统 | 路径 |
| --- | --- |
| macOS / Linux | `~/.claude/settings.json` |
| Windows | `%USERPROFILE%\.claude\settings.json` |

如果文件或目录不存在，手动创建即可。

::: tip 为什么推荐写在配置文件里
除了直接设环境变量，Claude Code 也支持把网关地址和密钥写进 `settings.json` 的 `env` 块。

写在配置文件里的好处是后台 agent 也能读到，不用依赖启动 Claude Code 的那个终端。
:::

## 4. 填写配置

用编辑器打开 `settings.json`，写入以下内容：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://kuncode.120403.xyz",
    "ANTHROPIC_AUTH_TOKEN": "sk-xxxxxxxx",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-flash",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-flash",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-flash"
  }
}
```

字段说明：

| 字段 | 说明 |
| --- | --- |
| `ANTHROPIC_BASE_URL` | 你的 API 节点，只填域名，不要带 `/v1` |
| `ANTHROPIC_AUTH_TOKEN` | 替换成你自己的 API Key |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | `sonnet` 别名实际调用的模型 ID |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | `opus` 别名实际调用的模型 ID |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | `haiku` 别名实际调用的模型 ID，也用于标题生成等后台任务 |

::: tip base URL 不带 /v1
Claude Code 会在 `ANTHROPIC_BASE_URL` 后面自动拼接 `/v1/messages`，所以只写到域名即可，例如 `https://kuncode.120403.xyz`。
:::

::: tip 为什么要映射三个模型别名
Claude Code 默认会按 `sonnet` / `opus` / `haiku` 三个别名发请求，主会话和后台任务用的别名还不一样。

如果你的网关只提供 `deepseek-flash` 这类非 Claude 模型，就把三个别名都指到同一个模型 ID，避免某些请求找不到模型。

模型 ID 必须和 `/v1/models` 返回的完全一致：

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```
:::

::: tip 认证变量用哪个
- `ANTHROPIC_AUTH_TOKEN`：以 `Authorization: Bearer <token>` 发送
- `ANTHROPIC_API_KEY`：以 `x-api-key: <key>` 发送

如果网关只认其中一种，用对应的变量。拿不准就先试 `ANTHROPIC_AUTH_TOKEN`，`401` 再换 `ANTHROPIC_API_KEY`。
:::

## 5. 验证

启动 Claude Code：

```bash
claude
```

进入界面后输入：

```
/status
```

确认两行信息：

- `Anthropic base URL` 显示你的网关地址
- `Auth token` 或 `API key` 显示你配置的凭据

然后随便发一句话，能正常回复就说明配置成功。

也可以用一条命令验证：

```bash
claude -p "print hello"
```

## 6. 常用配置

### 只用一个模型

如果只想固定一个模型，可以直接设 `ANTHROPIC_MODEL`，省去别名映射：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://kuncode.120403.xyz",
    "ANTHROPIC_AUTH_TOKEN": "sk-xxxxxxxx",
    "ANTHROPIC_MODEL": "deepseek-flash"
  }
}
```

### 给模型起一个显示名

别名映射后，`/model` 里默认显示模型 ID。可以用 `_NAME` 换成更好认的名字：

```json
{
  "env": {
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-flash",
    "ANTHROPIC_DEFAULT_SONNET_MODEL_NAME": "DeepSeek Flash"
  }
}
```

`OPUS`、`HAIKU` 也有同样的 `_NAME`、`_DESCRIPTION` 后缀。

### 调整推理强度

Claude Code 支持用 effort 控制思考强度，可选 `low`、`medium`、`high`、`xhigh`、`max`：

```json
{
  "env": {
    "CLAUDE_CODE_EFFORT_LEVEL": "high"
  }
}
```

也可以在会话里用 `/effort` 临时切换。

### 关闭模型识别警告

如果启动时出现 `[claude-code:unrecognized_model]`，可以用 `modelOverrides` 把网关模型 ID 映射到它自己：

```json
{
  "modelOverrides": {
    "deepseek-flash": "deepseek-flash"
  }
}
```

### 修正上下文窗口

网关模型的上下文窗口和 Claude Code 内置值不一致时，可以手动指定：

```json
{
  "env": {
    "CLAUDE_CODE_MAX_CONTEXT_TOKENS": "200000"
  }
}
```

数值按你的模型实际窗口填写。

## 7. 排障

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | Key 没生效或认证变量用错 | 用 `/status` 确认；`ANTHROPIC_AUTH_TOKEN` 和 `ANTHROPIC_API_KEY` 互换再试 |
| `404 Not Found` | `ANTHROPIC_BASE_URL` 带了路径 | 只填域名，不要带 `/v1` 或 `/v1/messages` |
| 模型不存在 | 别名映射到了网关没有的模型 | 把 `ANTHROPIC_DEFAULT_*_MODEL` 指向 `/v1/models` 返回的 ID |
| 反复弹出登录界面 | 凭据没被读取 | 确认变量名和 `settings.json` 路径，重启终端 |
| 请求超时 | 网络或代理问题 | 检查 DNS、代理和防火墙 |
| `/model` 里看不到模型 | 模型不在内置列表 | 用 `ANTHROPIC_CUSTOM_MODEL_OPTION` 或 `modelOverrides` 补充 |

## 进阶：用环境变量配置

如果不想写 `settings.json`，也可以只在当前终端设置：

::: code-group

```bash [macOS / Linux]
export ANTHROPIC_BASE_URL="https://kuncode.120403.xyz"
export ANTHROPIC_AUTH_TOKEN="sk-xxxxxxxx"
export ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-flash"
```

```powershell [Windows PowerShell]
$env:ANTHROPIC_BASE_URL = "https://kuncode.120403.xyz"
$env:ANTHROPIC_AUTH_TOKEN = "sk-xxxxxxxx"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "deepseek-flash"
```

:::

要持久化，就把这些行写进 shell 配置文件（`~/.zshrc`、`~/.bashrc`）或 PowerShell 的 `$PROFILE`。

::: warning 密钥是明文存储
无论写在 `settings.json` 还是环境变量里，密钥都是明文。注意：

- 不要把带密钥的文件提交到 Git
- 截图时打码
:::