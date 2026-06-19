---
date: 2026-06-19
slug: zh-cn/blog/engineering/2026-06-19-openclaw-2026-6-9-beta-1-changelog
title: "OpenClaw 2026.6.9-beta.1 Changelog：Telegram 投递、恢复链路与 Codex 集成继续增强"
tags:
  - OpenClaw
  - Changelog
  - Telegram
  - Gateway
  - Codex
  - Release
description: "OpenClaw 2026.6.9-beta.1 继续强化 Telegram 投递、Agent/Gateway 恢复、Codex 集成、插件生态与搜索能力。"
image: ./assets/2026-06-19-openclaw-2026-6-9-beta-1-changelog-cover.svg
source_url: https://www.vibesparking.com/zh-cn/blog/engineering/2026-06-19-openclaw-2026-6-9-beta-1-changelog/
author: AI 灵感闪现
cover:
  alt: "OpenClaw 2026.6.9-beta.1 Changelog：Telegram 投递、恢复链路与 Codex 集成继续增强"
  image: ./assets/2026-06-19-openclaw-2026-6-9-beta-1-changelog-cover.svg
---

# OpenClaw 2026.6.9-beta.1 Changelog：Telegram 投递、恢复链路与 Codex 集成继续增强

OpenClaw `2026.6.9-beta.1` 于 `2026-06-19 05:52:39 UTC` 发布，换算到北京时间是 `2026-06-19 13:52:39`。这版的关键词很清晰：把高频运行链路继续补稳，把 Agent / Gateway 的恢复语义再抠细一点，同时把 Telegram、Codex、插件安装和搜索能力往更“可用、可控、可复用”的方向推。

如果你维护的是多渠道、长在线、带插件和模型接入的 OpenClaw 实例，这版值得看。它不是那种靠单个大功能出圈的版本，而是继续把那些“平时不显眼、出事时最烦”的路径收拢起来。

## 版本概览

- 版本：`2026.6.9-beta.1`
- 发布时刻：`2026-06-19 05:52:39 UTC` / `2026-06-19 13:52:39` 北京时间
- 类型：prerelease / beta
- 关键词：Telegram 投递、Agent 恢复、Codex 集成、插件生态、搜索能力

## 这版最值得看的 5 个方向

### 1. Telegram 的投递更完整，也更接近真实业务场景

这版最醒目的变化仍然在 Telegram。

现在 Telegram 能更好地处理 rich HTML、保留 richer markdown、保住 sticker 路径，还能更准确地渲染 progress drafts 和 command output。mentions 和 spooled handlers 也会继续走正确的投递路径。

对依赖 Telegram 做通知、回放和自动化输出的场景来说，这意味着格式和语义都更不容易在传输过程中走样。

### 2. Agent / session 恢复继续向“少掉链子”收口

这一版明显在修复“中断后还能不能顺利回到最终结果”这件事。

retry、terminal outcome、compaction 后的 usage、session history repair、reply reconciliation 这些环节都在继续补强。换句话说，系统不只是要跑起来，还要在被打断、被压缩、被恢复之后，尽量回到一个看得见的结束态。

如果你跑的是长对话、批量任务或多轮自动化流程，这类修复会比新增一个入口更有价值。

### 3. Codex 集成开始更像一个稳定入口

OpenClaw 对 Codex 的集成在这版继续前进。

自动插件审批、GPT-5.3 Spark OAuth 路由、remote-node `exec` 作为动态工具，以及更可靠的 app-server teardown 和 terminal outcome，都让 Codex 这条路径更接近“可长期维护”的状态，而不是临时拼出来的桥接层。

如果你把 Codex 当作生产中的一个执行面，这一组改动值得重点关注。

### 4. 官方 provider 插件更独立，也更容易分发

这一版还把 provider 插件生态往更标准的 npm 分发方向推了一步。

外部 provider package 现在更像一等公民，Gateway 启动时也会加载外部安装的 channel plugins。StepFun 则被明确为 npm-only，因为 ClawHub 包名不可用。

这个变化的意义不只是“能装”，而是让插件的来源、分发和加载边界更清楚，后续维护和审计都会更容易。

### 5. Web / native 客户端、搜索和技能安装继续补齐

Control UI 增加了 session workspace rail 和 extension health，iOS 增加了 Watch controls，Android 也能显示 chat context。与此同时，Codex Hosted Search 进入可用范围，关键字自由的搜索提供方仍然保持显式 opt-in，而 ClawHub 的 skill 安装则继续保留可验证的来源信息。

这些变化合起来看，都是在减少“知道系统能做什么，但不知道它现在到底状态如何”的不确定性。

## Changes

- Channels and delivery：Telegram 现在能更完整地发送 rich HTML、保留 richer markdown 和 sticker 路径，并更准确地处理 progress drafts、command output、mentions 与 spooled handlers。`#93286` `#93164` `#93124` `#93364` `#93130` `#93088` `#93281`
- Agent and session recovery：retry、terminal outcomes、compaction 后的 usage、session history repair 和 reply reconciliation 继续收口，减少中断 turn 和 partial turn 的悬空状态。`#92191` `#93073` `#93228` `#93084` `#93469` `#93291` `#90943`
- Codex integration：加入自动插件审批、GPT-5.3 Spark OAuth 路由、remote-node `exec` 动态工具，以及更可靠的 app-server teardown 和 terminal outcomes。`#92625` `#89133` `#93654` `#91767` `#93287`
- Provider plugins：外部 provider package 现在以独立 npm release 形式发布，Gateway 会在启动时加载已安装的 channel plugins，StepFun 则明确走 npm-only。`#93470`
- Clients and search：Control UI 增加 session workspace rail 和 extension health，iOS 增加 Watch controls，Android 显示 chat context，Codex Hosted Search 也已可用。`#92856` `#91952` `#93387` `#92837` `#93446`

## Fixes

- Security and privacy：继续清理 debug/config 输出中的 secrets，阻止 internal HTTP session overrides，审计 open-DM tool exposure，并保留 plugin write ownership checks。`#93333` `#88496` `#93443` `#92883` `#93353`
- Agent and session runtime：修复 thinking-only 和 empty post-tool turn 的重试，避免 duplicate hook execution，保住 compaction 之后的 usage，并修补 partial JSON / history artifacts。`#92191` `#93073` `#93009` `#93084` `#93469`
- Channels and replies：Telegram rich delivery、Telegram ingress recovery、WhatsApp auth/media error、Mattermost thread replies 和 Discord action handling 都继续加固。`#93286` `#93364` `#93281` `#93076` `#93334` `#93424` `#93488`
- Provider and auth：Gemini CLI proxy OAuth、Codex Spark OAuth routing、Bedrock embedding model IDs 和嵌入式运行默认值都做了修正。`#92815` `#89133` `#93452` `#93428`
- Operations and updates：官方插件恢复、failed update handoff 后的 Gateway 重启、Node-specific npm prefix 和 package validation path 都更可靠了。`#93325` `#92111` `#93650`

## 风险与兼容性

- 这是 prerelease / beta 版本，适合先在测试集群、个人实例或可快速回滚的环境验证。
- Codex、OAuth、插件和 channel delivery 的改动都比较集中，建议重点回归真实任务链路，不要只看启动日志。
- 如果你依赖 Telegram 做正式消息输出，建议用真实富文本消息、command output 和 sticker 路径做一次端到端检查。
- Provider / search / skill 安装的边界变化较多，多 provider 或多插件环境最好先验证安装、加载和回放是否符合预期。

## 升级建议

1. 先在一个非关键 OpenClaw 实例升级到 `2026.6.9-beta.1`。
2. 升级后验证 Gateway、最近会话恢复、Telegram 富文本投递、Codex 执行链路和常用 plugin 加载。
3. 如果使用 OAuth provider 或 external plugins，先跑一个最小任务，再跑一轮真实业务任务。
4. 如果你依赖 search 或 skills 安装，检查来源和加载结果是否仍然可追踪。
5. 记录升级前后版本、channel 状态和失败样例，方便 beta 阶段回溯。

## 总结

`2026.6.9-beta.1` 的核心不是“加了多少新名词”，而是把 OpenClaw 的几个关键生产面继续拧紧了：Telegram 更像样了，恢复链路更稳了，Codex 集成更可控了，插件和搜索也更接近可长期维护的形态。

如果你在意的是“长期跑着会不会掉链子、恢复之后状态还在不在、插件和执行面能不能持续扩展”，这版值得跟进。
