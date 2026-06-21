---
date: 2026-06-21
slug: zh-cn/blog/engineering/2026-06-21-hermes-agent-2026-6-19-changelog
title: "Hermes Agent 2026.6.19 Changelog：Reach Release 把消息通道、桌面体验与异步 Subagent 一起拉满"
tags:
  - Hermes Agent
  - Changelog
  - Release
  - Desktop App
  - Subagent
  - Memory
description: "Hermes Agent 2026.6.19 / v0.17.0 \"The Reach Release\" 扩展了消息通道、桌面应用、异步 subagent、图像编辑和 memory 能力。"
image: ./assets/2026-06-21-hermes-agent-2026-6-19-changelog-cover.png
source_url: https://www.vibesparking.com/zh-cn/blog/engineering/2026-06-21-hermes-agent-2026-6-19-changelog/
author: AI 灵感闪现
cover:
  alt: "Hermes Agent 2026.6.19 Changelog：Reach Release 把消息通道、桌面体验与异步 Subagent 一起拉满"
  image: ./assets/2026-06-21-hermes-agent-2026-6-19-changelog-cover.png
---

# Hermes Agent 2026.6.19 Changelog：Reach Release 把消息通道、桌面体验与异步 Subagent 一起拉满

Hermes Agent `v2026.6.19` / `v0.17.0` 于 `2026-06-19 19:39 UTC` 发布，换算到北京时间是 `2026-06-20 03:39`。这版的主题非常明确：把 Hermes 的“触及范围”继续往外扩。新消息通道来了，桌面应用更成熟了，subagent 可以后台异步运行了，图像生成也开始支持编辑，memory 和 dashboard 的基础能力则继续补强。

这不是一版只靠几个 headline 功能撑起来的 release。报告里提到它一共关闭了 300+ issues，并有 245 位社区贡献者参与，说明这次整合覆盖的面很广，既有面向用户的功能，也有大量面向基础设施和维护体验的修补。

如果你把 Hermes 当作生产中的 agent 平台，这一版值得认真看。它不是单点炫技，而是把通道、界面、编排和记忆这几条主线一起往前推。

## 版本概览

- 版本：`v2026.6.19` / `v0.17.0`
- 发布时间：`2026-06-19 19:39 UTC` / `2026-06-20 03:39` 北京时间
- 类型：release
- 主题：Reach Release
- 关键词：消息通道、桌面应用、异步 subagent、image editing、memory、skills

## 这版最值得看的 6 个方向

### 1. 消息通道继续扩张，Hermes 真正开始“到处都能接”

这版最直观的变化，是 Hermes 把消息通道边界又往外推了一圈。

iMessage via Photon 解决了很多人最关心的中继问题，不再强依赖 Mac 代理；WhatsApp Business Cloud API 走官方第一方路径；SimpleX 补上了群组、附件和自动接受；Raft 则把外部 agent 网络桥接进来。

对多渠道部署来说，这意味着 Hermes 不是只会“多接几个平台”，而是开始更像一个可持续扩展的通信层。

### 2. 桌面应用从“可用”向“像样”再走一步

桌面端是这一版的第二个重点。

可重绑快捷键、原生 OS 通知、独立的 live subagent watch 窗口、Composer 模型选择器、VS Code 风格终端、RTL/bidi 自动检测、会话切换器和桌面宠物，这些改动合起来，让桌面应用不再只是一个壳。

它开始像一个认真考虑日常使用的工作台，而不是临时查看状态的控制面板。

### 3. 后台异步 Subagent 让长任务不再卡住主线程

`delegate_task(background=true)` 这类能力，意义不只是“可以后台跑”。

它改变的是交互模型：主 agent 可以继续处理别的事情，subagent 在后台执行，完成后再把结果作为新 turn 注入会话。

这对长任务、编排任务和并发委派都很关键。以前容易被阻塞的地方，现在终于更接近真正的异步协作。

### 4. Image generation 开始支持编辑，工作流更完整

这版的图像能力不再只停留在“从零生成”。

`image_generate` 现在支持 image-to-image 编辑，适合改 logo、去背景、草图转渲染，或者在已有素材上做局部修正。

对需要快速做内容资产、发布封面或轻量视觉迭代的场景，这个能力比单纯的文生图更实用。

### 5. Automation Blueprints 让自动化更容易被普通用户理解

自动化模板开始参数化，并且可以通过名字直接选择。

Hermes 会在需要时提示参数，而不是要求用户先熟悉一整套 cron 语法。更重要的是，这套 blueprint 可以在 dashboard、CLI/TUI、messenger 和文档里一致呈现。

这属于典型的“降低心智负担”升级，特别适合把复杂自动化交给更广泛的用户。

### 6. Memory 工具从单次操作升级为原子批量操作

memory 是这一版的另一个底层重点。

`operations` 数组让 add、replace、remove 可以原子批量执行，最终在字符预算内一次完成。这比传统的多轮编辑更稳定，也更适合自动化写入。

如果你在意会话状态、长期偏好或上下文组织，这类改动往往会在实际使用中带来很明显的可靠性提升。

### 7. 平台生态和协作面也在继续扩展

除了消息、桌面和 memory 这些显眼变化，Hermes 也在把平台能力往更完整的方向铺开。

dashboard 这版补齐了完整的 profile builder，可以在浏览器里配置模型、技能和 MCP 服务器；Skills Hub 浏览器也做了重做，加入了连接 hubs、Featured 区、安装前预览和安全扫描。再加上 curator 的成本优化、Gateway-Gateway relay 的阶段性推进，以及 Telegram Bot API 10.1 富文本消息默认开启，这些都说明 Hermes 已经不只是“能跑 agent”，而是开始把整个运行、安装、管理和协作链路连成一体。

## Changes

- Channels：新增 iMessage via Photon、WhatsApp Business Cloud API、SimpleX 和 Raft network bridge，覆盖更广的消息与 agent 通信场景。
- Desktop app：补上快捷键重绑、原生通知、watch windows、Composer 模型选择器、终端面板、RTL 检测、session 切换器和桌面宠物。
- Subagent：支持后台异步运行，主会话不再被长时间委派任务阻塞。
- Image generation：`image_generate` 开始支持 image-to-image 编辑。
- Automation：Blueprint 机制把自动化参数化，减少用户面对 cron 语法的门槛。
- Memory / dashboard：memory 原子批量操作、profile builder、Skills Hub 重做和安全登录强化一起把平台能力补齐。
- Ecosystem：curator 成本优化、Telegram Bot API 10.1 富文本消息和 Gateway-Gateway relay 继续把平台协作面往外扩。

## 架构重构

### God-file 拆分继续推进

这一版的代码层面同样不轻。

`cli.py`、`gateway/run.py` 和 `run_agent.py` 都经历了明显拆分，主入口、命令解析、gateway handler 和 turn loop 被切成了更小的模块。

这类重构不一定直接让用户“看到”什么新功能，但它通常意味着后续迭代会更稳，也更容易维护。

### 新增的系统能力

- Managed scope：支持管理员锁定、用户不可修改的配置与密钥。
- Multiplex profiles：多个 profile 可以在一个 gateway 上运行，属于可选能力。
- Pluggable cron：CronScheduler 和 managed-cron provider 更容易替换与扩展。

## 安全修复

- Own-policy gateway adapter 改为 fail-closed。
- Slack / Feishu / Discord 的审批按钮认证在缺少 allowlist 时也会 fail-closed。
- debug dump 中的 secrets 会被脱敏。
- 公开状态页隐藏 host metadata。
- shell-escape denylist 绕过被修复。
- 可疑的 MCP stdio 配置会在预检阶段被拦截。
- urllib3 与 PyJWT 的 CVE 修复已纳入。
- TodoStore 的内容长度与数量边界也补上了限制。

## 已回退

- `html-artifact` skill 以及相关 sketch / architecture-diagram / concept-diagrams fold 已回退。
- Cron per-job profile support 已回退。
- Nix `patchPhase` workaround 已回退。

## 风险与升级建议

### 风险等级：中等

- 这是一个范围很大的 release，通道、桌面、subagent、memory 和 dashboard 都有变化。
- iMessage Photon、WhatsApp Cloud API 和 Raft 都依赖外部或新引入的服务面，建议先做端到端验证。
- 异步 subagent 可能带来新的并发和资源竞争问题，最好先观察一段时间再全量铺开。
- image editing 和 blueprint 自动化会改变原有工作流，老配置最好先跑一轮回归。

### 升级建议

1. 先在测试实例或低风险实例上升级。
2. 优先验证消息通道、桌面通知、subagent 委派和 memory 写入。
3. 如果你依赖图像能力，做一次从生成到编辑的完整回归。
4. 检查 dashboard profile builder、skills 安装和安全登录流程是否符合预期。
5. 记录升级前后行为差异，特别是并发任务和长会话恢复。

## 总结

`v2026.6.19` 是一版很典型的“把范围推大”的 release。它不只是增加了几个入口，而是把 Hermes 往一个更完整的 agent 平台方向再推进了一步。

如果你关心的是“能不能接更多通道、能不能更像一个日常工作台、长任务会不会卡住、记忆和自动化会不会更稳”，这版值得跟进。
