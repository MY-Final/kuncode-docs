# Crush

::: info 适用版本
最后验证：2026-10-06 · Crush 0.97.1
:::

Charm 出品的开源终端编程助手，可通过 OpenAI 兼容或 Anthropic 兼容 provider 接入自定义网关。

本文以 KunCode 为例演示，把示例中的地址、Key 和模型名替换成你自己的服务即可。占位符与替换规则见[通用占位符说明](/guide/index#占位符约定)。

## 1. 安装

Crush 支持 Windows、macOS 和 Linux。Windows 可以用 winget、scoop 或 npm 安装，也可以从 GitHub Releases 下载二进制。

::: code-group

```powershell [winget]
winget install charmbracelet.crush
```

```powershell [scoop]
scoop bucket add charm https://github.com/charmbracelet/scoop-bucket.git
scoop install crush
```

```bash [npm]
npm install -g @charmland/crush
```

```text [二进制]
从 https://github.com/charmbracelet/crush/releases 下载对应平台的压缩包，解压后把可执行文件放进 PATH。
```

:::

验证安装：

```bash
crush --version
```

## 2. 准备 API Key

见 [准备 API Key](/guide/api-key)。记下两样东西：

- **API Key**：例如 `sk-xxxxxxxx`
- **服务根地址**：例如 `https://kuncode.120403.xyz`

配置 Crush 时，第三方兼容网关通常要写成根地址加 `/v1`，例如 `https://kuncode.120403.xyz/v1`。

## 3. 找到配置文件

Crush 现在主要使用 Bash 风格的 `crushrc`。旧的 `crush.json` 仍然兼容，但已经是旧格式，新功能优先进入 `crushrc`。

| 范围 | 系统 | 路径 |
| --- | --- | --- |
| 全局 | macOS / Linux | `~/.config/crush/crushrc` |
| 全局 | Windows | `%USERPROFILE%\.config\crush\crushrc` |
| 项目 | 所有系统 | 项目根目录的 `.crushrc` 或 `crushrc` |

项目配置优先于全局配置。目录或文件不存在时手动创建即可。

::: warning crushrc 是受信任的配置文件
`crushrc` 会在 Crush 启动时执行，等同于一段本地脚本。不要下载或运行来路不明的配置。
:::

## 4. 填写配置

可以直接运行 Crush 的 provider 命令，也可以把同样的配置写进 `crushrc`。下面命令使用 `crush` 前缀；写进 `crushrc` 时，去掉开头的 `crush`。

```bash
crush provider add kuncode --name "KunCode" --type openai-compat --base-url "https://kuncode.120403.xyz/v1" --discover-models true
```

关键参数：

| 参数 | 说明 |
| --- | --- |
| `kuncode` | provider ID，可以改成任意字符串 |
| `--type openai-compat` | 第三方 OpenAI 兼容网关，例如 KunCode |
| `--type openai` | OpenAI 官方 API；不要用这个类型接第三方兼容网关 |
| `--base-url` | 兼容网关地址，通常以 `/v1` 结尾 |
| `--discover-models true` | 尝试自动发现模型列表 |

Crush 也支持 `anthropic`、`ollama` 等 provider 类型。类型和参数以 `crush --help`、`crush provider add --help` 及官方配置文档为准。

如果自动发现失败，可以手动登记模型：

```bash
crush model add kuncode/<model-id> --name "<显示名称>"
```

`<model-id>` 必须和 `/v1/models` 返回的 `id` 完全一致。写入 `crushrc` 的等价写法如下：

```bash
provider add kuncode \
  --name "KunCode" \
  --type openai-compat \
  --base-url "https://kuncode.120403.xyz/v1" \
  --discover-models true

model add kuncode/deepseek-flash --name "DeepSeek Flash"
```

## 5. 添加凭据

`crush provider add` 支持 `--api-key`。推荐先把 Key 放进环境变量，再让 Crush 读取，避免把明文密钥提交进 Git。

::: code-group

```powershell [PowerShell]
$env:KUNCODE_API_KEY = "sk-xxxxxxxx"
crush provider add kuncode --name "KunCode" --type openai-compat --base-url "https://kuncode.120403.xyz/v1" --api-key $env:KUNCODE_API_KEY --discover-models true
```

```bash [Bash / Git Bash]
export KUNCODE_API_KEY="sk-xxxxxxxx"
crush provider add kuncode --name "KunCode" --type openai-compat --base-url "https://kuncode.120403.xyz/v1" --api-key "$KUNCODE_API_KEY" --discover-models true
```

:::

如果写进 `crushrc`，可以让配置从环境变量读取密钥：

```bash
provider add kuncode \
  --type openai-compat \
  --base-url "https://kuncode.120403.xyz/v1" \
  --api-key "${KUNCODE_API_KEY:?set KUNCODE_API_KEY}" \
  --discover-models true
```

::: warning 不要提交密钥
`crushrc`、项目配置和日志都可能包含敏感信息。不要把 Key 提交到 Git，截图时也要打码。
:::

## 6. 验证

启动 Crush：

```bash
crush
```

在界面中选择 `KunCode` 和你的模型，然后输入：

```text
print hello
```

能正常回复就说明配置成功。菜单名称和快捷键以当前 Crush 版本为准。

如果启动或请求失败，可以先查看日志：

```bash
crush logs
```

## 7. 常用配置

### 自动发现模型

对 `openai-compat` provider 开启模型发现：

```bash
provider add kuncode \
  --type openai-compat \
  --base-url "https://kuncode.120403.xyz/v1" \
  --discover-models true
```

### 手动补充模型信息

自动发现不到模型，或需要补充上下文窗口时，可以手动登记：

```bash
model add kuncode/deepseek-flash \
  --name "DeepSeek Flash" \
  --context-window 128000
```

### 调整请求超时

默认请求超时是 60 秒，长请求可以调大：

```bash
option request-timeout 300
```

`request-timeout` 单位是秒。流式请求按“空闲多久没有新数据”计算超时。

### 查看日志

```bash
crush logs
crush logs --tail 500
crush logs --follow
```

## 8. 排障

按状态码系统排查见[错误码与排障](/guide/errors)。

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | API Key 缺失、填错或已失效 | 重新检查环境变量和 `--api-key`，确认 Key 未过期 |
| `404 Not Found` | provider 类型或 `--base-url` 写错 | 第三方兼容网关用 `--type openai-compat`，并确认地址以 `/v1` 结尾 |
| 模型不存在 | 模型 ID 写错，或没有发现模型 | 用 `/v1/models` 核对 ID，重新执行 `--discover-models true` 或 `crush model add` |
| 请求超时 | 默认超时太短，或网络不可达 | 调大 `option request-timeout`，并检查 DNS、代理和防火墙 |
| 工具调用失败 | 当前模型不支持 tool call | 换一个支持工具调用的模型，并确认网关没有过滤工具调用参数 |

官方资源：

- 仓库：https://github.com/charmbracelet/crush
- 官网：https://charm.sh/crush

---

::: tip 发现错误或有内容过期？
文档会随工具版本更新。欢迎[提交 Issue](https://github.com/MY-Final/kuncode-docs/issues/new) 反馈问题，或直接点击页脚的「在 GitHub 上编辑此页」提交修改。
:::
