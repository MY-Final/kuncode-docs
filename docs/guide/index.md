# 概览

这份文档帮助你把这些 AI 编程工具接入官方 API、自建兼容网关或第三方兼容服务：

- Codex
- Claude Code
- OpenCode
- GitHub Copilot CLI

这是一份 **provider-agnostic 接入指南**：通用配置和排障思路不绑定某个服务。文中的 KunCode 示例仅用于展示格式，不是前置条件。

核心思路只有一句：**先确定服务来源并取得 Key 和服务地址，再把工具指向该服务。**

## 先确认服务来源

| 服务来源 | 你要准备什么 | 从哪里获取 |
| --- | --- | --- |
| 官方 API | 官方 Key、服务地址、模型名和协议 | 按 OpenAI、Anthropic 等官方平台文档操作 |
| 自建兼容网关 | 网关地址、Key 和可用模型 | 按你的网关部署文档或管理员说明操作 |
| 第三方兼容服务 | 服务商 Key、API 节点和可用模型 | 登录该服务商控制台，按其文档操作 |

如果你使用官方 API 或自建网关，可能没有“登录服务商控制台”这一步；请以对应平台的文档为准。本指南只讲工具侧配置与排障，不提供开户、发 Key、充值或平台客服。

## 三步接入

1. **准备 API Key 和服务地址**：按服务来源从控制台、管理员或服务商文档获取。
2. **选择协议入口**：确认工具使用 OpenAI Chat Completions、OpenAI Responses 还是 Anthropic Messages。
3. **填写配置并验证**：把工具需要的 Base URL 和 Key 写入配置，用一条命令确认能跑通。

不熟悉 API Key、分组、渠道、倍率这些概念？先看[概念说明](/guide/concepts)。

想直接照着跑一遍？看[15 分钟最小接入](/beginner/quickstart)，它用同一组固定占位值把这三步串成一条可复制的命令线。

## 你需要准备什么

| 项目 | 说明 |
| --- | --- |
| API Key | 服务商或网关提供的密钥；格式不一定是 `sk-` 开头 |
| 服务地址 | 官方 API、自建网关或第三方服务提供的地址 |
| 模型名 | 服务实际提供的模型 ID，例如 `gpt-5`、`claude-sonnet-4` |
| 工具本体 | 已安装好的 Codex / Claude Code / OpenCode / GitHub Copilot CLI |

::: tip 关于服务地址
文中出现的 `https://your-gateway.example.com` 是通用占位地址，请替换成你自己的服务地址。

部分页面使用 KunCode 作为示例，那只是其中一个可选项。工具最终应填写根路径还是带 `/v1`，以对应工具页和[选择接入方式](/guide/endpoints)的 Base URL 对照说明为准。
:::

## 接下来

- [准备 API Key](/guide/api-key)
- [选择接入方式](/guide/endpoints)
- [概念说明](/guide/concepts)
- [模型与能力](/guide/models)
- [工具列表](/tools/)
