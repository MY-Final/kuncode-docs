# Claude Code

Anthropic 官方 CLI，通过环境变量把请求指向任何兼容网关。

## 1. 安装

```bash
npm install -g @anthropic-ai/claude-code
```

验证安装：

```bash
claude --version
```

## 2. 准备 API Key

见 [准备 API Key](/guide/api-key)。

## 3. 配置

通过环境变量覆盖官方地址：

::: code-group

```bash [macOS / Linux]
export ANTHROPIC_BASE_URL="https://your-gateway.example.com"
export ANTHROPIC_AUTH_TOKEN="sk-xxxxxxxx"
```

```powershell [Windows PowerShell]
$env:ANTHROPIC_BASE_URL = "https://your-gateway.example.com"
$env:ANTHROPIC_AUTH_TOKEN = "sk-xxxxxxxx"
```

:::

如需持久化，写入 shell 配置文件（`~/.zshrc`、`~/.bashrc`）或系统环境变量。

::: tip 关于认证变量
部分版本使用 `ANTHROPIC_API_KEY`，部分使用 `ANTHROPIC_AUTH_TOKEN`。若一个不生效，换另一个试。
:::

## 4. 验证

```bash
claude -p "print hello"
```

## 5. 排障

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401` | Key 未传入 | 确认变量名正确，重启终端 |
| `404` | Base URL 带路径 | 只填域名，不要带 `/v1` |
| 报模型不支持 | 模型名不匹配 | 改用服务支持的 Claude 模型名 |
