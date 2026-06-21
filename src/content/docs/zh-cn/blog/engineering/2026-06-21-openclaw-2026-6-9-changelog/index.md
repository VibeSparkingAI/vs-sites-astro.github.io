---
date: 2026-06-21
slug: zh-cn/blog/engineering/2026-06-21-openclaw-2026-6-9-changelog
title: "OpenClaw 2026.6.9 Changelog：正式版发布，Telegram、恢复链路与 Codex 集成继续增强"
tags:
  - OpenClaw
  - Changelog
  - Telegram
  - Gateway
  - Codex
  - Release
description: "OpenClaw 2026.6.9 正式版在 Telegram 投递、Agent/Gateway 恢复、Codex 集成、插件生态与安全边界上继续收口。"
image: ./assets/2026-06-21-openclaw-2026-6-9-changelog-cover.svg
source_url: https://www.vibesparking.com/zh-cn/blog/engineering/2026-06-21-openclaw-2026-6-9-changelog/
author: AI 灵感闪现
cover:
  alt: "OpenClaw 2026.6.9 Changelog：正式版发布，Telegram、恢复链路与 Codex 集成继续增强"
  image: ./assets/2026-06-21-openclaw-2026-6-9-changelog-cover.svg
---

# OpenClaw 2026.6.9 Changelog：正式版发布，Telegram、恢复链路与 Codex 集成继续增强

OpenClaw `2026.6.9` 于 `2026-06-21 01:44 UTC` 发布，换算到北京时间是 `2026-06-21 09:44`。这是一版正式稳定版，也是 `2026.6.9-beta.1` 之后两天快速修复后的收束。它不是靠一个大功能撑场面，而是把 422 个 PR 覆盖到的关键路径继续打磨平：Telegram 更完整，Agent / Gateway 更能恢复，Codex 集成更顺，插件生态更模块化。

如果你维护的是长在线、多渠道、带插件和模型接入的 OpenClaw 实例，这版值得优先升级。它的价值不在于“第一次出现了什么”，而在于“系统出问题时更容易回来，而且回来之后更像原本那样工作”。

## 版本概览

- 版本：`2026.6.9`
- 发布时间：`2026-06-21 01:44 UTC` / `2026-06-21 09:44` 北京时间
- 类型：stable / 正式版
- 关键词：Telegram 投递、Agent 恢复、Codex 集成、插件生态、搜索与安全

## 这版最值得看的 5 个方向

### 1. Telegram 频道继续升级

Telegram 这一轮获得了很密集的改进，核心是让富消息更接近真实业务场景。

现在支持更完整的富 HTML 消息发送，也会保留 richer markdown 的换行、贴纸路径和命令输出。HTML 表格会被更安全地规范化，mentions 也更准确地绑定机器人身份，活跃 handler 的恢复逻辑重新回来了。

如果你把 Telegram 当作正式投递渠道，这些修复会直接影响消息可读性和回放一致性。

### 2. Agent / Gateway 恢复能力更强

这版明显在修“静默失败”和“恢复后不对劲”的问题。

thinking-only 轮次、空 post-tool 轮次、重复 hook 执行、pending subagent 交付、compaction 后 usage 统计、部分 JSON / 历史记录损坏，这些都被继续补上。

对长任务、自动化任务和多轮对话来说，这类修复比单个新按钮更重要。

### 3. Codex 集成更像生产入口

OpenClaw 与 Codex 的协作在这版继续加深。

自动插件审批、GPT-5.3 Spark OAuth 路由恢复、远程节点 `exec` 作为动态工具、以及更可靠的 app server 关闭流程，都让 Codex 这条链路更像长期可维护的执行面，而不是临时拼接层。

如果你把 Codex 用在实际工作流里，这组改动值得重点关注。

### 4. 官方 provider 插件开始独立发包

这一版把 provider 生态往更模块化的方向推了一步。

外部 provider package 现在是独立 npm 发布，Gateway 启动时也会自动加载已安装的 channel 插件。StepFun 这类 provider 则可以从 npm 或 ClawHub 安装，分发边界更清晰。

对运维和插件作者来说，这意味着来源、安装和升级路径都更明确了。

### 5. Web、移动端与搜索继续补齐

Control UI 增加了 Session 工作区侧栏和扩展健康状态，iOS 增加了 Watch 控制，Android 也补上了聊天上下文显示。

同时，Codex 托管搜索进入可用范围，免 Key 搜索 provider 需要主动选择，ClawHub 的技能安装也继续保留来源签名。

这些变化合起来，都是在减少“系统能做什么，但当前状态到底怎样”的不确定感。

## Changes

- Provider / 认证：Codex 托管搜索、Gemini CLI OAuth 代理穿透、外部 provider 的选择保留当前上下文，避免切换时丢失用户意图。
- 插件 / 安装：官方 provider 独立 npm 发包，Gateway 启动时加载已安装 channel 插件，StepFun 支持 npm / ClawHub 安装。
- Dashboard / 移动端：Session 工作区侧栏、插件健康状态、紧凑 cron 列表、iOS Watch 控制和 Android 聊天上下文一起补齐。
- Codex / 可观测性：自动插件审批、SecretRefs、ClawHub skill 来源签名、OpenTelemetry 日志导出和远程节点 exec 都继续加强。
- QA / 发布工程：QA 场景迁移到 YAML，profile 覆盖更广，插件和 channel 的发布覆盖也更完整。

## Fixes

- Security and privacy：继续从 debug / config 输出中脱敏 secrets，阻止内部 HTTP session 覆盖，审计 open DM 工具暴露面，并保留插件写权限所有权检查。
- Agent / session runtime：修复 thinking-only 与空 post-tool 轮次的重试，防止重复 hook 执行，保留 compaction 后的 usage，并修补部分 JSON / 历史记录损坏。
- Channels and replies：Telegram 富消息、HTML 表格、WhatsApp 断开认证保留文本、Mattermost 线程回复、Discord action 处理和 Feishu mention 去重都继续加固。
- Storage and migration：修正 NFS 上 SQLite WAL 的行为，清理 reindex 临时文件，把 setup 状态移出 workspace 点目录，并导入 default-agent auth profile。
- Provider and model：修复 Gemini CLI 代理 OAuth、Codex Spark OAuth 路由、Bedrock embedding 模型 ID，以及嵌入运行中的默认模型配置。
- CLI / UI / operations：子命令后继续接受全局 flag，终端输出保留可见，CJK IME 组合更稳定，升级失败后也能更可靠地重启 managed Gateway。

## 风险与兼容性

- 这是正式版，但覆盖面很大，422 个 PR 说明它不是“小补丁”。
- Telegram 的富 HTML、Markdown 和 command output 变化较多，升级后建议先发一条真实测试消息。
- provider 插件化和 Codex 集成的变化集中在安装、审批和执行入口，最好做一轮真实工作流回归。
- 如果你使用 NFS 或共享存储，SQLite、reindex 和恢复链路仍然要重点观察。

## 升级建议

1. 如果你已经在 `2026.6.9-beta.1` 上，建议直接升级到正式版。
2. 如果你还在 `2026.6.8` 或更早版本，先在低风险实例或测试节点上验证，再逐步铺开。
3. 升级后先检查 Gateway、Telegram 投递、Codex 执行、常用 provider 和已安装插件加载情况。
4. 如果你依赖多渠道消息，至少跑一次真实富文本、一次命令输出和一次带回放的任务。
5. 有共享存储或多实例部署的，继续看 recovery、history 和 SQLite 日志，确认没有隐藏回归。

## 总结

`2026.6.9` 的重点不是“发布了一个新大版本”，而是把 OpenClaw 的关键运行面继续收紧：消息投递更像样，恢复链路更稳，Codex 更适合放进生产，插件和 provider 的边界也更清晰。

如果你关心的是“长时间跑着会不会掉链子、恢复后状态还在不在、升级后还能不能继续稳定扩展”，这版值得跟进。
