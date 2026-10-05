---
layout: home

hero:
  name: AI 编程工具接入指南
  text: 把 Codex、Claude Code、OpenCode 等工具接上你自己的模型服务
  tagline: 通用配置参考 · 示例可替换 · 不绑定任何服务
  image:
    src: /hero.svg
    alt: AI 编程工具连接兼容网关示意图
  actions:
    - theme: brand
      text: 新手从这里开始
      link: /beginner/
    - theme: alt
      text: 浏览工具列表
      link: /tools/
    - theme: alt
      text: 遇到问题
      link: /faq

features:
  - icon: 🚀
    title: 零基础上手
    details: 不知道装什么、不会命令行也没关系，让 AI 帮你安装和配置。
    link: /beginner/
    linkText: 开始上手
  - icon: 🧰
    title: 按工具找教程
    details: 14 个 AI 编程工具的接入步骤、配置字段和排障方法。
    link: /tools/
    linkText: 查看工具
  - icon: 🔌
    title: 接入自己的服务
    details: 官方 API、自建兼容网关、第三方兼容服务都能按同一套思路接入。
    link: /guide/endpoints
    linkText: 选择协议
  - icon: 🔐
    title: Key 安全与成本
    details: 如何安全保存和轮换密钥，以及怎么避免额度跑飞。
    link: /guide/security
    linkText: 查看安全指南
  - icon: 🛠️
    title: 排障指引
    details: 401、404、429、超时、模型不存在等常见问题，按状态码定位。
    link: /guide/errors
    linkText: 开始排障
  - icon: 🆓
    title: 免费与试用
    details: 先用免费额度跑通，再决定要不要付费。
    link: /beginner/free-models
    linkText: 查看免费方案
---

::: info 文档定位
这是一份 **provider-agnostic 接入指南**：协议、配置和排障思路适用于官方 API、自建兼容网关和第三方兼容服务。

KunCode 仅作为可选示例，不是前置条件，也不代表唯一支持的服务。本站不提供开户、发放 Key、充值或平台客服；这些事项以你的服务商文档和控制台为准。
:::