# 关于本文档

## 文档定位

这是一份 **provider-agnostic 的 AI 编程工具接入指南**，说明 Codex、Claude Code、OpenCode、GitHub Copilot CLI 等工具如何连接官方 API、自建兼容网关或第三方兼容服务。

这里整理的是通用协议、配置格式和排障方法。页面中的地址、密钥和模型名都是可替换的占位值；具体开户、发 Key、计费和支持政策以你的服务商为准。

## 适用服务来源

| 服务来源 | 如何准备 Key 和地址 |
| --- | --- |
| 官方 API | 按 OpenAI、Anthropic 等官方平台文档创建凭据，并确认模型名和接口协议 |
| 自建兼容网关 | 按网关部署文档创建或配置 Key，使用你的网关域名作为服务地址 |
| 第三方兼容服务 | 登录该服务商控制台创建 Key，并从控制台获取 API 节点和可用模型 |

没有控制台或找不到对应入口时，以服务商提供的文档为准。本指南只讲工具配置与排障，不替代服务商文档。

## KunCode 示例的边界

部分示例使用 KunCode 作为参考服务，目的是让配置片段更容易对照实际操作。

KunCode 只是一个**可选示例**，不是前置条件，也不是唯一支持的服务。换成其他兼容服务后，通用配置思路不变。工具最终应填写的 Base URL 以对应工具页和[选择接入方式](/guide/endpoints)的对照说明为准。

## 本站负责什么

- 解释常见协议入口、配置字段和错误信息
- 提供可替换的配置示例与排障步骤
- 帮助你在工具侧定位 Key、地址、模型或网络问题

本站不提供开户、发放 Key、充值、退款或平台客服；这些事项请以你的服务商控制台和文档为准。本文档的责任边界和风险提示见[免责声明](/disclaimer)。

## 开源与共享

我们相信接入文档不应该被绑定在某一个平台上。

只要这份文档能帮你少踩一个坑，用不用 KunCode 都没关系。欢迎参考、转载和改写。

## 反馈

发现错误、想补充工具或希望增加常见问题，欢迎通过 GitHub 反馈：

- [报告文档错误](https://github.com/MY-Final/kuncode-docs/issues/new?template=doc-bug.yml)
- [请求新增工具](https://github.com/MY-Final/kuncode-docs/issues/new?template=tool-request.yml)
- [查看全部 issue](https://github.com/MY-Final/kuncode-docs/issues)

也可以直接点击任意页面底部的「编辑此页」提交 PR。

反馈时请勿粘贴真实 API Key、完整服务地址或账号信息；需要提供报错时请先脱敏。
