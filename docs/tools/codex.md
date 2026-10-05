# Codex

OpenAI 官方 CLI，通过自定义 provider 指向任何兼容网关。

## 1. 安装

::: code-group

```bash [npm]
npm install -g @openai/codex
```

```bash [Homebrew]
brew install codex
```

:::

验证安装：

```bash
codex --version
```

## 2. 准备 API Key

见 [准备 API Key](/guide/api-key)。

## 3. 配置

编辑 `~/.codex/config.toml`：

```toml
model = "gpt-5"
model_provider = "custom"

[model_providers.custom]
name = "custom"
base_url = "https://your-gateway.example.com/v1"
env_key = "CUSTOM_API_KEY"
wire_api = "responses"
```

然后设置环境变量：

::: code-group

```bash [macOS / Linux]
export CUSTOM_API_KEY="sk-xxxxxxxx"
```

```powershell [Windows PowerShell]
$env:CUSTOM_API_KEY = "sk-xxxxxxxx"
```

:::

::: tip base_url 结尾不要加斜杠
`base_url` 填到 `/v1` 为止，Codex 会自己拼接 `/responses`。
:::

## 4. 验证

```bash
codex exec "print hello"
```

能返回模型输出即为成功。

## 5. 排障

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | Key 错误或未生效 | 确认环境变量已导出，且与配置里的 `env_key` 同名 |
| `404 Not Found` | base_url 写错 | 确认以 `/v1` 结尾，且服务支持 Responses 入口 |
| 模型不存在 | 模型名未开放 | 换成 `/v1/models` 返回列表中的模型 |
| 连接超时 | 网络或代理问题 | 检查 DNS、代理、防火墙 |
