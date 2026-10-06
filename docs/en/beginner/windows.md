# Windows: Read This First

This page is for Windows users who are setting up command-line tools for the first time. Many examples on this site use `bash` code blocks for brevity. On Windows, do not copy their path syntax, line-continuation characters, or environment-variable syntax unchanged. Spend a few minutes here first and the later steps will be much easier.

::: tip Use one terminal
The instructions below use **PowerShell**. If you already know CMD, you can use CMD throughout instead, but do not switch back and forth during one setup.
:::

## 1. Use PowerShell, Not a Mix of PowerShell and CMD

To open PowerShell:

1. Press the `Win` key.
2. Type `PowerShell`.
3. Click **Windows PowerShell** or **Terminal (PowerShell)**.
4. When the command window opens, type this line and press Enter:

```powershell
Get-Location
```

If it returns a path such as `C:\Users\your-name`, PowerShell is ready to use.

When the documentation marks a block as `bash`, it usually just means "run this in a terminal." On Windows, prefer PowerShell. When you see Bash-only syntax such as `export`, `~`, or a backslash line continuation, replace it using the notes below.

## 2. How to Write Paths

Windows has several path formats that look similar but only work in their own context:

| Purpose | CMD | PowerShell | File Explorer address bar |
| --- | --- | --- | --- |
| Current user's home folder | `%USERPROFILE%` | `$env:USERPROFILE` | `%USERPROFILE%` |
| Codex config folder | `%USERPROFILE%\.codex` | `$env:USERPROFILE\.codex` | `%USERPROFILE%\.codex` |
| Example file | `%USERPROFILE%\.codex\config.toml` | `$env:USERPROFILE\.codex\config.toml` | `%USERPROFILE%\.codex\config.toml` |

Key points:

- `%USERPROFILE%` expands automatically in CMD and the File Explorer address bar, but usually not in PowerShell. Use `$env:USERPROFILE` in PowerShell.
- Some Windows programs and input fields do not recognize `~` and treat it as a literal character. When the documentation shows `~/.something`, Windows users should use the full path instead.
- Pay attention to quotes. If a path contains spaces, write it in PowerShell as `"$env:USERPROFILE\Some Folder"`.

## 3. `curl` Is an Alias in PowerShell

In Windows PowerShell, typing `curl` normally calls the `Invoke-WebRequest` alias, whose arguments may behave differently from the curl examples in the documentation. Use `curl.exe` to call the real curl explicitly.

Here is a Windows-ready one-line example:

```powershell
curl.exe "https://your-gateway.example.com/v1/models" -H "Authorization: Bearer sk-xxxxxxxx"
```

Replace the example URL and `sk-xxxxxxxx` with your own service address and API key. Never post a full key in a public group.

Bash uses a backslash `\` for line continuation, but that usually does not work in PowerShell. Either keep the command on one line or use a backtick `` ` `` to continue it:

```powershell
curl.exe "https://your-gateway.example.com/v1/models" `
  -H "Authorization: Bearer sk-xxxxxxxx"
```

If the command returns JSON (for example, data containing `data` or `object`), the address and key are at least reachable. If it says the command is not found, first make sure you typed `curl.exe`, then check whether curl is installed on the system.

## 4. Environment Variables Last Only for the Current Window

The following form works only in the current PowerShell window. The variable disappears when the window closes:

```powershell
$env:KUNCODE_API_KEY = "sk-xxxxxxxx"
```

To keep the variable available when you open a new terminal later, set a permanent user variable. The simplest command-line option is:

```powershell
setx KUNCODE_API_KEY "sk-xxxxxxxx"
```

After `setx` runs, it does not take effect in the current window; open a new PowerShell window. You can also use the graphical interface:

1. Press the `Win` key and search for "environment variables."
2. Open **Edit environment variables for your account**.
3. Under **User variables**, click **New**.
4. Enter `KUNCODE_API_KEY` as the variable name and your key as the variable value.
5. Click OK, then reopen PowerShell.

::: warning Security note
The `setx` command may remain in your command history, and a permanent variable may be stored in plain text in the Windows registry. Do not use this on a shared computer. Prefer your tool's own credential storage, and never put a key in a project file or commit it to Git.
:::

## 5. Know the Success Criterion for Every Step

Do not continue just because the command did not turn red. Confirm the expected result before moving on:

| Action | Success criterion | What to check first if it fails |
| --- | --- | --- |
| Open PowerShell | You can type commands and see a prompt | Reopen it from the Start menu, not from a browser address bar |
| Run a tool's version command | It returns a version such as `1.x.x` | "Command not found" usually means the tool is missing or PATH is not active |
| Query the model list | It returns a JSON model list | Check the key for 401, the address and `/v1` for 404, and the network or proxy for timeouts |
| Start the tool and send a message | You receive a model reply | Copy the last 20 lines of the error for the AI; do not just say "it does not work" |

If something fails, leave the window open, copy the last 20 lines of the error, and give them to the AI helping you configure the tool.

## Next

- [Let AI install and configure a tool](./first-run)
- [Back to Getting Started from Zero](./index)
- [Errors & Troubleshooting](/en/guide/errors)