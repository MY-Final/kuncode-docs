# Codex

OpenAI 官方 CLI。通过自定义 provider，可以把 Codex 指向任何兼容网关。

本文以 KunCode 为例演示，换成你自己的服务地址同样适用。

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

能打印版本号即可，例如 `codex-cli 0.144.6`。

## 2. 准备 API Key

见 [准备 API Key](/guide/api-key)。记下两样东西：

- **API Key**：`sk-` 开头
- **API 节点**：你的服务地址，例如 `https://kuncode.120403.xyz`

## 3. 找到配置文件

Codex 的配置文件位于用户目录下的 `.codex/config.toml`：

| 系统 | 路径 |
| --- | --- |
| macOS / Linux | `~/.codex/config.toml` |
| Windows | `%USERPROFILE%\.codex\config.toml` |

Windows 上可以直接在资源管理器地址栏输入 `%USERPROFILE%\.codex` 打开目录：

![Codex 配置文件位置](/images/codex/config-file.png)

如果文件不存在，新建一个 `config.toml` 即可。

## 4. 填写配置

用编辑器打开 `config.toml`，写入以下内容：

```toml
model_provider = "custom"
model = "deepseek-flash"
model_reasoning_effort = "xhigh"

[model_providers.custom]
name = "KunCode"
base_url = "https://kuncode.120403.xyz/v1"
wire_api = "responses"
requires_openai_auth = true
experimental_bearer_token = "sk-xxxxxxxx"
```

![填好的 Codex 配置](/images/codex/config-content.png)

需要改的只有这几处：

| 字段 | 说明 |
| --- | --- |
| `model` | 你要用的模型名，必须是服务支持的模型 |
| `base_url` | 你的 API 节点 + `/v1` |
| `experimental_bearer_token` | 替换成你自己的 API Key |
| `name` | provider 的显示名，随意填，不影响功能 |

::: tip base_url 必须带 /v1
`base_url` 要写成 `https://kuncode.120403.xyz/v1`。

Codex 会在它后面自动拼接 `/responses`，所以不要写成 `/v1/responses`。
:::

::: warning 密钥写在配置文件里
这种方式密钥是明文存在 `config.toml` 里的，注意：

- 不要把 `config.toml` 提交到 Git
- 共享屏幕或截图时记得打码

如果你更希望用环境变量管理密钥，可以改用 `env_key` 字段（见下方「进阶」）。
:::

::: info 截图里多出来的两行
截图中的 `disable_response_storage` 和 `model_catalog_json` 是 CC Switch 导入时附加的字段，手动配置可以不加。
:::

## 5. 验证

在任意目录执行：

```bash
codex exec "print hello"
```

![Codex 验证成功](/images/codex/verify-success.png)

看到 `codex` 正常回复内容就说明配置成功了。上面的输出里也会回显当前使用的 model、provider 和 reasoning effort，可以用来确认配置是否生效。

## 6. 常用配置

### 切换模型

改 `model` 字段即可：

```toml
model = "gpt-5"
```

可用的模型名可以通过接口查询：

```bash
curl https://kuncode.120403.xyz/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxx"
```

### 调整思考强度

`model_reasoning_effort` 控制推理强度，可选值：

| 值 | 说明 |
| --- | --- |
| `minimal` | 最少思考，最快 |
| `low` | 低强度 |
| `medium` | 中等 |
| `high` | 高强度 |
| `xhigh` | 最高强度 |

```toml
model_reasoning_effort = "xhigh"
```

::: tip 不是所有模型都支持
只有推理模型才认这个字段。普通模型会忽略它。
:::

## 7. 排障

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `401 Unauthorized` | Key 错误或未生效 | 确认 `experimental_bearer_token` 填的是完整密钥 |
| `404 Not Found` | `base_url` 写错 | 确认以 `/v1` 结尾，且服务支持 Responses 入口 |
| 模型不存在 | 模型名未开放 | 换成 `/v1/models` 返回列表中的模型 |
| 连接超时 | 网络或代理问题 | 检查 DNS、代理、防火墙 |
| 配置不生效 | 文件路径错误 | 确认是 `~/.codex/config.toml`，不是 `codex.toml` |

## 进阶：用环境变量管理密钥

不想把密钥写进配置文件，可以改成从环境变量读取：

```toml
[model_providers.custom]
name = "KunCode"
base_url = "https://kuncode.120403.xyz/v1"
wire_api = "responses"
env_key = "KUNCODE_API_KEY"
```

然后设置环境变量：

::: code-group

```bash [macOS / Linux]
export KUNCODE_API_KEY="sk-xxxxxxxx"
```

```powershell [Windows PowerShell]
$env:KUNCODE_API_KEY = "sk-xxxxxxxx"
```

:::

需要持久化的话，macOS / Linux 写进 `~/.zshrc` 或 `~/.bashrc`，Windows 用系统环境变量设置。

## 进阶：用 CC Switch 一键导入

如果你已经在用 [CC Switch](https://github.com/farion1231/cc-switch) 管理多个服务商，可以跳过手写配置：

1. 在服务的 **API 密钥** 页面，找到目标令牌
2. 点击「导入到 CC Switch」
3. 选择应用 **Codex**，填写模型名
4. 点击「打开 CC Switch」，配置会自动写入 `config.toml`

导入后配置内容和上面手动写的一致，只是省去了手写步骤。
