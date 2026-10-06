# Windows 用户必读

这一页专门给第一次在 Windows 上配置命令行工具的读者。本站很多示例为了简洁，会写成 `bash` 代码块；在 Windows 上不要照抄其中的路径写法、续行符号和环境变量语法。先花几分钟看完这一页，后面的步骤会顺很多。

::: tip 建议只用一个终端
下面统一使用 **PowerShell**。如果你已经熟悉 CMD，也可以一直用 CMD，但不要在同一次配置中来回混用。
:::

## 1. 用 PowerShell，不要混用 CMD

打开 PowerShell：

1. 按 `Win` 键。
2. 直接输入 `PowerShell`。
3. 点击 **Windows PowerShell** 或 **终端（PowerShell）**。
4. 看到可以输入命令的窗口后，先输入下面这行并按回车：

```powershell
Get-Location
```

如果它返回一个类似 `C:\Users\你的用户名` 的路径，说明 PowerShell 已经可以正常使用。

文档里标为 `bash` 的代码块，通常只是表示“在终端里执行”。在 Windows 上，优先把命令放进 PowerShell 执行；遇到 `export`、`~`、反斜杠续行等 Bash 写法时，按本页说明替换。

## 2. 路径怎么写

Windows 有几种看起来很像、但只在自己场景里生效的路径写法：

| 用途 | CMD | PowerShell | 资源管理器地址栏 |
| --- | --- | --- | --- |
| 当前用户主目录 | `%USERPROFILE%` | `$env:USERPROFILE` | `%USERPROFILE%` |
| Codex 配置目录 | `%USERPROFILE%\.codex` | `$env:USERPROFILE\.codex` | `%USERPROFILE%\.codex` |
| 文件示例 | `%USERPROFILE%\.codex\config.toml` | `$env:USERPROFILE\.codex\config.toml` | `%USERPROFILE%\.codex\config.toml` |

要点：

- `%USERPROFILE%` 在 CMD 和资源管理器地址栏里会自动展开，但在 PowerShell 里通常不会；PowerShell 要写成 `$env:USERPROFILE`。
- `~` 在部分 Windows 程序和输入框里可能被当成普通字符，不是所有地方都认识。文档给出 `~/.xxx` 时，Windows 用户优先换成完整路径。
- 复制路径时注意引号。路径里有空格时，在 PowerShell 中应写成 `"$env:USERPROFILE\Some Folder"`。

## 3. `curl` 在 PowerShell 里不是同一个 `curl`

在 Windows PowerShell 中直接输入 `curl`，通常调用的是 `Invoke-WebRequest` 的别名，参数行为可能和文档里的 curl 示例不同。要明确调用真正的 curl，请使用 `curl.exe`。

Windows 可直接复制的一行示例：

```powershell
curl.exe "https://your-gateway.example.com/v1/models" -H "Authorization: Bearer sk-xxxxxxxx"
```

把示例地址和 `sk-xxxxxxxx` 换成你自己的服务地址和 API Key，不要把完整 Key 发到公开群里。

Bash 使用反斜杠 `\` 续行，这在 PowerShell 里通常不成立。PowerShell 要么写成一行，要么使用反引号 `` ` `` 续行：

```powershell
curl.exe "https://your-gateway.example.com/v1/models" `
  -H "Authorization: Bearer sk-xxxxxxxx"
```

如果命令返回 JSON（例如包含 `data` 或 `object`），说明地址和 Key 至少已经能连通；如果提示命令不存在，先检查是否写成了 `curl.exe`，再检查系统里是否安装了 curl。

## 4. 环境变量只在当前窗口有效

下面这种写法只在当前 PowerShell 窗口里有效。窗口一关，变量就消失：

```powershell
$env:KUNCODE_API_KEY = "sk-xxxxxxxx"
```

如果你希望以后打开新终端时仍然能读取这个变量，可以设置永久用户变量。最简单的命令行方式是：

```powershell
setx KUNCODE_API_KEY "sk-xxxxxxxx"
```

`setx` 设置后，当前窗口不会立刻生效，需要打开一个新的 PowerShell 窗口。也可以使用图形界面：

1. 按 `Win` 键，搜索“环境变量”。
2. 打开 **编辑账户的环境变量**。
3. 在“用户变量”区域点击 **新建**。
4. 变量名填写 `KUNCODE_API_KEY`，变量值填写你的 Key。
5. 确定后重新打开 PowerShell。

::: warning 安全提醒
`setx` 命令可能进入命令历史，永久变量也可能以明文保存在 Windows 注册表中。不要在公共或共享电脑上使用；优先使用工具自己的凭据保存方式，不要为了省事把 Key 写进项目文件或提交到 Git。
:::

## 5. 每一步都要看到预期输出

不要只看“命令有没有报红字”。每一步都先确认输出符合预期，再继续下一步：

| 操作 | 成功标准 | 失败时先检查 |
| --- | --- | --- |
| 打开 PowerShell | 能输入命令并看到提示符 | 重新从开始菜单打开，不要用浏览器地址栏 |
| 运行工具版本命令 | 返回版本号，例如 `1.x.x` | 命令找不到通常表示工具没装好或 PATH 未生效 |
| 查询模型列表 | 返回 JSON 模型列表 | 401 检查 Key，404 检查地址和 `/v1`，超时检查网络或代理 |
| 启动工具并发一条消息 | 能收到模型回复 | 把最后 20 行报错复制给 AI，不要只发“打不开” |

遇到错误时不要关闭窗口，先复制最后 20 行报错，再交给帮你配置的 AI 排查。

## 接下来

- [让 AI 安装并配置工具](./first-run)
- [回到零基础上手](./index)
- [错误码与排障](/guide/errors)