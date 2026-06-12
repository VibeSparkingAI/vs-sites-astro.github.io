---
date: 2026-06-12
slug: zh-cn/blog/engineering/2026-06-12-openclaw-2026-6-6-beta-1-changelog
title: "OpenClaw 2026.6.6-beta.1 Changelog：安全边界收紧、通道修复与工具链可靠性提升"
tags:
  - OpenClaw
  - Changelog
  - Security
  - Gateway
  - MCP
  - Release
description: "OpenClaw 2026.6.6-beta.1 重点收紧安全边界、修复通道投递，并提升工具链与启动稳定性。"
image: ./assets/2026-06-12-openclaw-2026-6-6-beta-1-changelog-cover.png
source_url: https://www.vibesparking.com/zh-cn/blog/engineering/2026-06-12-openclaw-2026-6-6-beta-1-changelog/
author: AI 灵感闪现
cover:
  alt: "OpenClaw 2026.6.6-beta.1 Changelog：安全边界收紧、通道修复与工具链可靠性提升"
  image: ./assets/2026-06-12-openclaw-2026-6-6-beta-1-changelog-cover.png
---

# OpenClaw 2026.6.6-beta.1 Changelog：安全边界收紧、通道修复与工具链可靠性提升

OpenClaw 在 2026-06-10 19:33:39 UTC 发布了 `2026.6.6-beta.1`，换算到北京时间是 2026-06-11 03:33:39。和前几个 2026.6.5 系列版本相比，这一版更像一次明确的安全收口：默认边界继续收紧，消息通道继续补洞，MCP 和浏览器连接更稳，启动与首响也更轻了。

如果你维护的是多实例 OpenClaw 集群，这一版不该只看成“又一个 beta”。它更接近一次需要认真回归的安全型升级，尤其适合检查授权边界、消息路由、工具调用和 cron 自动化链路。

## 版本概览

- 版本：`2026.6.6-beta.1`
- 发布时间：2026-06-10 19:33:39 UTC
- 类型：prerelease / beta
- 关键词：安全边界、通道投递、MCP、浏览器连接、启动性能、会话恢复

## 这版最值得看的 5 个方向

### 1. 安全边界大幅收紧

这版最核心的信号很明确：很多以前默认“能过”的边界，现在开始默认“先拦再说”。

- transcripts、sandbox binds、host environment inheritance、MCP stdio、Codex HTTP、native search policy、elevated sender checks、deleted-agent ACP bypass、loopback tools、Discord moderation、Teams group actions 都被收紧。
- `exec` approval 在超时后改为 fail closed，不再用“超时但先放行”的方式兜底。
- 对管理员来说，这意味着旧配置、旧插件和自定义工具如果依赖宽松行为，升级后很可能暴露出隐藏假设。

一句话：这不是纯功能更新，而是一次默认更安全的边界重置。

### 2. Telegram、iMessage 和浏览器/MCP 投递更稳

消息和连接层修了不少会影响长期运行的细节。

- Telegram 现在更清楚地按 account-scoped topic 路由，streamed text 经过 tool call 也能保住，`/compact` 可以在 generic ingress 上工作。
- Telegram 的 callback 处理切到了更具体的 API，draft chunking 也被共享化，durable dispatch dedupe 下沉到了 SDK。
- 不授权的 Telegram DM 文本不会再悄悄混进 cache 或 prompt context。
- iMessage 补上了 always-on inbound restart、durable echo marker、block streaming、idle approval discovery、hardened outbound transport 和更可操作的启动诊断。
- Browser 和 MCP 这边则补了 existing-session CDP、WebSocket validation、default-profile `cdpUrl`、更安全的 browser-output 边界、Streamable HTTP loopback transport、OAuth/SSE 授权处理和 schema 兼容性。

如果你靠 OpenClaw 跑通道、跑 MCP、跑浏览器自动化，这一组修复很值得回归。

### 3. Control UI 的启动和首响更轻

这版不只是在“更安全”，也在“更快”。

- model metadata 现在有缓存了。
- 启动时等 catalog 的那段阻塞被拿掉了。
- slash command 改为 lazy loading。
- first-event tracing 和 slow-reply diagnostics 也补进来了。

对用户侧的感觉会很直接：UI 启动更利落，第一次回复更不容易拖长。

### 4. 代理会话和模型支持继续整理

版本里还有几处比较实用的运行时修正。

- Codex sessions 继续保持正确的 compaction ownership。
- local models 不再走 guardian review。
- dynamic tool progress 的显示更一致。
- Gemma 4 的 reasoning replay 被保留下来。
- OpenRouter 的 OAuth onboarding 和 Claude Fable 5 的 adaptive thinking 也补进了支持链路。

这些变化看起来分散，但本质上都在帮系统减少“会话状态解释不一致”的问题。

### 5. 运行时恢复、构建和更新链路更可靠

这版也在一些常见故障点上做了收口。

- 代理/session 恢复时，会丢掉 stale approval follow-up，移除 drained reply-queue item，并恢复 stale main/visible replies。
- provider failure 的终态处理更正确，`compaction timeout` 默认值也下调到 180 秒，同时尊重显式配置。
- Windows/Mattermost/WhatsApp/Feishu/LINE/Discord/OpenAI Realtime 这些通道也修了各自的投递和回显问题。
- cron 可以更干净地 cancel 活动任务，避免结果被静默丢失。
- Gateway/config/auth/update/build 也都修了若干边角问题，比如 PATH-less pnpm 环境 fallback 到 Corepack、Docker store packages、SQLite auth migration、LaunchAgent 状态等。

这类修复很“工程化”，但对长时间运行的实例最有价值。

## 风险与注意事项

- 这是 prerelease beta，不建议直接当成完全稳定版全量铺开。
- 安全边界和审批路径变化较多，旧插件、自定义工具、自建 MCP 连接都要重新过一遍。
- Telegram、QQBot、Discord、Teams 等通道有行为修正，升级后要确认路由、授权和富文本/推理内容过滤没有回归。
- 如果你依赖 Codex HTTP、native search、MCP stdio、loopback 工具或 host env 继承，最好先做一轮真实任务链路验证。

## 升级建议

1. 先在非关键节点做灰度升级。
2. 跑一轮最小回归：Gateway 启动、一次通道消息、一次 cron、一次常用 MCP 工具调用。
3. 检查授权边界是否依赖旧的宽松行为，尤其是自定义插件和内部工具。
4. 如果启用了 Telegram、iMessage、Discord、Teams、Feishu、LINE 等通道，重点看消息路由、callback 和富文本内容。
5. 观察 24 小时再决定是否推进到更多节点，尤其是多实例或自动化密集的环境。

## 总结

`2026.6.6-beta.1` 的关键词不是“新花样更多”，而是“边界更清楚、投递更稳、启动更轻”。

如果你维护的是长期在线的 OpenClaw 实例，这版值得认真跟进；如果你关心的是安全、通道稳定和工具链可靠性，它也很对味。
