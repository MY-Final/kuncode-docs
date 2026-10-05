# OpenCode

开源终端编程助手，支持自定义 OpenAI 兼容 provider。

## 1. 安装

::: code-group

```bash [npm]
npm install -g opencode-ai
```

```bash [Homebrew]
brew install sst/tap/opencode
```

:::

## 2. 准备 API Key

见 [准备 API Key](/guide/api-key)。

## 3. 配置

编辑 `~/.config/opencode/opencode.json`：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "custom": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Custom Gateway",
      "options": {
        "baseURL": "https://your-gateway.example.com/v1",
        "apiKey": "sk-xxxxxxxx"
      },
      "models": {
        "gpt-5": { "name": "GPT-5" }
      }
    }
  }
}
```

Windows 上配置文件位于 `%USERPROFILE%\.config\opencode\opencode.json`。

## 4. 验证

```bash
opencode run "print hello"
```

## 5. 排障

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| provider 未出现 | 配置路径错误 | 确认文件名与目录 |
| `404` | baseURL 缺 `/v1` | 补上 `/v1` |
| JSON 解析失败 | 配置文件语法错误 | 用 JSON 校验工具检查 |
