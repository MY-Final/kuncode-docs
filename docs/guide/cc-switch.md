# CC Switch：多服务商配置管理

::: info 适用版本
最后验证：2026-10-07 · CC Switch 3.20.4（当前稳定版）
:::

[CC Switch](https://github.com/farion1231/cc-switch) 是一款开源的跨平台桌面应用，用来统一管理 AI 编程工具的供应商配置。它把「手动改配置文件」变成「在界面里点一下」，并提供本地路由、协议转换和自动故障转移。

本页只讲它在**本站已覆盖的工具**上怎么用：Codex、Claude Code、OpenCode、Gemini CLI、Pi。它实际支持的客户端更多（还包括 Claude Desktop、Grok Build、OpenClaw、Hermes Agent、MiniMax Code），用法同理。

::: warning CC Switch 不替代工具本身
它是配置管理器，不是 AI 编程工具。你仍然需要先安装好 Codex、Claude Code 等工具本体；CC Switch 负责的是「这些工具该连哪个服务」。
:::

## 它解决什么问题

| 痛点 | CC Switch 的做法 |
| --- | --- |
| 在多个服务商之间切换，每次都要手改配置 | 供应商卡片一键切换，托盘也能切 |
| 每个工具的配置格式不同（JSON / TOML / YAML / `.env`） | 统一界面，按工具自动写对应格式 |
| 服务不稳定，一个挂了就中断 | 本地路由 + 自动故障转移，失败自动换备用 |
| 工具的协议和服务的协议对不上 | 本地路由做协议转换 |
| 想知道花了多少 | 用量统计与余额查询 |

如果你只有一个服务商、一个工具，并且不打算经常切换，那直接按各[工具页](/tools/)手动配置就够了，不一定需要它。

## 1. 安装

只从官方渠道获取：**[ccswitch.io](https://ccswitch.io)** 或 **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**。官网明确说明：任何要求付费、充值或索取登录凭据的「CC Switch」站点都不是官方渠道。

系统要求：Windows 10+ / macOS 12+ / Linux（glibc 2.35+、WebKitGTK 4.1，如 Ubuntu 22.04+、Debian 12+）。

::: code-group

```powershell [Windows]
# 从下载页获取 CC-Switch-v{版本号}-Windows.msi 后双击安装
# 免安装版解压后直接运行 CC-Switch.exe
```

```bash [macOS]
brew install --cask cc-switch
```

```bash [Debian / Ubuntu]
sudo dpkg -i CC-Switch-v{版本号}-Linux-*.deb
```

```bash [ArchLinux]
paru -S cc-switch-bin
```

:::

安装后启动，窗口正常显示、系统托盘出现图标即成功。

::: tip 安装被系统拦截
Windows 上如果双击安装程序没有反应，右键文件 → 属性 → 勾选「解除锁定」再运行。macOS 版本已通过 Apple 签名和公证，可直接打开。
:::

## 2. 添加第一个供应商

点击主界面右上角的 **+**：

1. 在「预设」里选服务商，名称和端点会自动填好；
2. 填入你的 **API Key**；
3. 点击「添加」。

如果服务商不在预设列表里，选「自定义」，手动填写端点地址和 Key。

::: tip 端点地址的写法
这里填的端点要和工具的协议要求一致，规则见[选择接入方式](/guide/endpoints)。CC Switch 会按你选的工具把它写进对应配置字段，不要重复写接口路径。
:::

添加后可以用「获取模型」按钮从 `/v1/models` 拉取模型列表，免去手抄模型 ID。这一步和本站[模型与能力](/guide/models)讲的是同一个接口。

## 3. 切换供应商

在供应商列表里点目标卡片的「启用」即可。切换后各工具的生效方式不同：

| 工具 | 生效方式 |
| --- | --- |
| Claude Code | 即时生效，无需重启 |
| Codex | 关闭并重新打开终端 |
| Gemini CLI | 重启 Gemini CLI |
| OpenCode | 关闭并重新打开终端 |
| Pi | 写入配置后，在工具里选择要用的模型 |

::: tip 共存式应用
OpenCode、Pi 这类工具支持**多个供应商同时存在**，在工具内部选择用哪个。卡片上的按钮文案不完全一样：OpenCode 是「添加」，Pi 是「启用」。而 Codex、Claude Code、Gemini CLI 同一时间只启用一个供应商。
:::

## 4. 本地路由：协议转换与热切换

本地路由会在本机启动一个 HTTP 服务（默认 `http://127.0.0.1:15721`）。开启后，工具的请求先发到它，再由它转发给当前供应商。

它能做三件本站其他页面反复提到的事：

- **协议转换**：让 Claude Code 用 OpenAI / Gemini 格式的供应商，或让 Codex 用 Chat Completions 格式的供应商；
- **热切换**：切换供应商立即作用于后续请求，无需重启工具；
- **用量记录**：逐条记录经过路由的请求。

支持本地路由的是 Claude Code、Codex、Gemini CLI、Grok Build。

::: warning 不是所有服务都需要开路由
如果服务商本身就提供工具所需的原生协议（例如 Codex 直连 Responses 端点），直连即可，不必开路由。路由主要用在「工具要求的协议」和「服务提供的协议」不一致时。
:::

开启方式：**设置 → 路由 → 本地路由**，打开总开关，再勾选要路由的应用。开启后工具配置文件里的地址会被改成本地地址，Key 会替换为占位符 `PROXY_MANAGED`，真实 Key 由路由在转发时注入。

关闭路由时，CC Switch 会把配置写回开启前的直连供应商。

## 5. 故障转移（进阶）

前提是先开启本地路由。在**设置 → 路由 → 自动故障转移**里：

1. 选择应用；
2. 把备用供应商加入队列并调整顺序；
3. 打开「自动故障转移」。

之后主供应商请求失败时，会按队列顺序自动尝试下一个，并用熔断器避免反复重试已经失败的供应商。

## 6. 它改哪些配置、不改哪些

理解这一点，才能放心让它接管配置。

**只改关键字段**：请求地址、Key、模型名、接口协议，以及少数跟着供应商走的兼容项。你在配置里写的插件、Hook、权限、MCP、注释和排版都会原样保留。

**第一次改写前会自动备份**：每个配置文件被 CC Switch 第一次改写前，原始文件会备份到 `~/.cc-switch/backups/live-first-write/`。

**改坏的文件不会被覆盖**：如果配置文件的 JSON / TOML 有语法错误，切换时会报错并保持原样，不会强行写入。

各工具被改动的具体文件：

| 工具 | 配置文件 |
| --- | --- |
| Claude Code | `~/.claude/settings.json` |
| Codex | `~/.codex/config.toml` |
| Gemini CLI | `~/.gemini/.env`、`~/.gemini/settings.json` |
| OpenCode | `~/.config/opencode/opencode.json` |
| Pi | `~/.pi/agent/models.json` |

::: tip Codex 用户的注意点
CC Switch 切换第三方供应商时，会把 Key 写进 `config.toml` 的 `experimental_bearer_token`，**不会**写进 `~/.codex/auth.json`——后者只用于 OpenAI 官方的 ChatGPT 登录。切到第三方供应商时官方登录默认会被暂存到 `~/.cc-switch/codex-login-stash.json`，切回官方时自动还原，无需重新登录。
:::

## 7. 排障

### 切换后不生效

先确认是否按上表重启了工具。配置文件在切换时已更新，但运行中的程序不会自动重载。

### 环境变量把配置覆盖了

如果系统里设了 `ANTHROPIC_API_KEY`、`OPENAI_API_KEY` 等环境变量，它们的优先级通常高于配置文件，可能导致 CC Switch 写的配置被覆盖。CC Switch 会检测这类冲突并在顶部显示警告，可查看详情后删除（删除前自动备份到 `~/.cc-switch/backups/`）。

### 想恢复官方登录

各工具的供应商列表里都自带一个官方项（如 OpenAI Official、Claude Official、Google Official），切回去并重启工具，再按工具自身的登录流程操作即可。

### 其他问题

- 手动改了配置又不生效：见[配置后怎么用](/guide/usage)和[错误码与排障](/guide/errors)。
- CC Switch 自身的问题：带上 `~/.cc-switch/logs/cc-switch.log` 到它的 [Issues](https://github.com/farion1231/cc-switch/issues) 反馈。

## 8. 卸载

::: code-group

```powershell [Windows]
# 设置 → 应用 → 卸载 CC Switch
```

```bash [macOS]
brew uninstall --cask cc-switch
# 加 --zap 会同时删除配置数据
```

```bash [Debian / Ubuntu]
sudo apt remove cc-switch
```

:::

配置数据默认在 `~/.cc-switch/`，卸载后如需彻底清理可手动删除。

## 和手动配置的关系

CC Switch 和你按本站工具页手动配置**并不冲突**，它做的就是那些步骤的自动化：

- 手动配置讲的是「这个字段该填什么」，CC Switch 负责把这些字段写进去；
- 协议该怎么选、Base URL 要不要带 `/v1`，仍然以[选择接入方式](/guide/endpoints)为准；
- 它不改变服务本身，只是换了个更省事的管理方式。

## 接下来

- [选择接入方式](/guide/endpoints)：确认工具的协议和 Base URL
- [准备 API Key](/guide/api-key)：创建和管理密钥
- [工具列表](/tools/)：各工具的完整配置步骤
- [成本控制](/guide/cost-control)：多供应商场景下的用量管理