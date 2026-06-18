---
date: 2026-06-18
slug: zh-cn/blog/ai/2026-06-18-codex-0.141.0-changelog
title: "Codex 0.141.0 Changelog 深度分析"
tags:
  - Codex
  - Changelog
  - Remote Execution
  - Noise Relay
  - MCP
  - Plugin
description: "0.141.0 把远程执行加密、跨平台 cwd、插件发现和 App-Server/Realtime/TUI 都往前推了一步。"
image: ./assets/2026-06-18-codex-0.141.0-changelog-cover.png
source_url: https://www.vibesparking.com/zh-cn/blog/ai/2026-06-18-codex-0.141.0-changelog/
author: AI 灵感闪现
cover: /Users/blogbin/WorkSpaces/VibeSparking/vs-sites/vs-sites-astro/.openclaw/workspace/src/content/docs/zh-cn/blog/ai/2026-06-18-codex-0.141.0-changelog/.wechat-publish/assets/2026-06-18-codex-0.141.0-changelog-cover.png
---

![Codex 0.141.0 版本要点信息图](/Users/blogbin/WorkSpaces/VibeSparking/vs-sites/vs-sites-astro/.openclaw/workspace/src/content/docs/zh-cn/blog/ai/2026-06-18-codex-0.141.0-changelog/.wechat-publish/assets/2026-06-18-codex-0.141.0-changelog-illustration.png)

# Codex 0.141.0 Changelog 深度分析

> **发布日期**：2026-06-18 04:43:06 UTC
> **版本**：`0.141.0`
> **Tag**：`rust-v0.141.0`
> **Release URL**：https://github.com/openai/codex/releases/tag/rust-v0.141.0
> **prerelease**：否
> **Release 原文**：`Release 0.141.0`

## 一、TL;DR

这版最值得看 5 件事：

1. 远程执行通道改用带认证的端到端 Noise relay，安全边界明显更硬了。
2. 跨平台 remote execution 现在能保留 executor 原生 cwd、shell 和权限路径，执行语义更稳定。
3. 选中的 executor plugin 可以按线程启用 stdio MCP，插件发现也补上了 created-by-me marketplace 和认证分流目录。
4. App-server 能列出直接子线程、关联 external-agent 导入结果，还能读取 rate-limit reset credits。
5. Realtime 和 TUI 都补了更细的交互控制，自动化与人机混合场景更顺手。

一句话：**0.141.0 不是在讲一个新故事，而是在把远程执行、插件发现和交互边界做得更安全、更稳定、更可控。**

## 二、版本定位

这次 release body 已经不再是 alpha 那种空壳一句话了，但它依然更像一版工程向的发布，而不是面向普通用户的“炫技”版本。

如果把它拆开看，主线很清楚：

- remote executor 的传输链路更安全
- 跨平台 cwd / shell / 权限路径更一致
- 插件和 MCP 的暴露更精细
- app-server 和 realtime 更适合多线程、多会话与人机混合工作流

这不是单点功能升级，而是一轮围绕执行语义和协作可观测性的整理。

## 三、最重要的几处变化

### 3.1 远程执行链路更安全了

`Remote executors now use authenticated, end-to-end encrypted Noise relay channels.` 这条是这版最硬的安全信号。

它的重点不只是“加密”，而是：

- 通道需要认证
- 传输是端到端加密
- relay 这层不再只是一个松散的中转站

对真正把 Codex 跑在远程机器、沙箱或多环境执行层的人来说，这意味着远程控制链路更接近生产级通信模型，而不是临时拼出来的代理通道。

### 3.2 跨平台 cwd、shell 和权限路径终于更统一

`Cross-platform remote execution now preserves executor-native working directories and shells, including filesystem permission paths across app-server and exec-server boundaries.` 这条和上面的安全改动一起看，几乎就是这版的运行时主轴。

它解决的是一个很实际的问题：当 app-server、exec-server、本地 shell 和远程 executor 之间来回切换时，路径和 shell 语义不要再失真。

这类改动的价值通常体现在：

- 含空格目录
- 非 ASCII 路径
- 符号链接目录
- 远程 shell 不是本机默认 shell 的场景
- 权限路径跨边界传递

如果你依赖 Codex 处理真实工作区，这一条比新增一个命令更有意义。

### 3.3 插件与 MCP 的暴露更按上下文来

`Selected executor plugins can activate their stdio MCP servers per thread; plugin discovery also adds a created-by-me marketplace and auth-specific curated catalogs.` 这一条说明插件生态在从“能看见”走向“能按场景启用”。

这背后有几个明显信号：

- MCP 不再只是全局挂出来，而是可以按 thread 激活
- 插件发现开始考虑创建者视角
- 认证模式不同，看到的目录也不同

换句话说，Codex 正在把插件系统从“列表”推进成“可控的能力面板”。这对权限治理、调试和可审计性都更友好。

### 3.4 App-server 更像一个可追踪的协作中枢

这一组变化很适合一起看：

- `App-server clients can list immediate child threads`
- `correlate external-agent imports with detailed results`
- `read or redeem rate-limit reset credits`

它说明 app-server 已经不只是一个请求入口，而是一个能把父子线程、外部 agent 导入和限流恢复状态一起串起来的协作层。

这对多人协作、外部 agent 导入和长会话追踪都很重要，因为上下文终于开始能被系统自己说清楚了。

### 3.5 Realtime 和 TUI 的交互控制更细

`Realtime clients` 可以显式追加 speech，控制 Codex 响应进入对话的方式，并按需省略 startup context；`TUI input prompts` 还能在闲置后自动 resolve，且倒计时会在交互时暂停。

这两条看起来偏体验，实际很适合自动化和半自动化工作流：

- 语音输入更可控
- 响应进入对话的方式更可控
- startup context 可以按需省略
- input prompt 不再只是傻等，能在闲置后自动 resolve

这说明 Codex 一边在增强机器可控性，一边也在照顾有人值守的交互节奏。

## 四、风险和影响

- 远程执行语义被系统性整理后，依赖旧 cwd 解析或 shell 假设的脚本需要回归。
- 插件发现开始按认证模式和创建者视角分流，旧的“全量可见”假设可能不再成立。
- 线程级 MCP 激活会改变工具暴露面，自动化测试要确认 thread 级上下文没有遗漏。
- app-server 的 child thread 和 external-agent 导入追踪更强了，但也意味着你应该更认真地检查日志归因。

## 五、我怎么看这次升级

0.141.0 给我的感觉很明确：它不是一个把新功能堆满桌面的版本，而是一个把底座整理得更像底座的版本。

这版最重要的价值在于三件事：

- 远程执行更安全
- 执行语义更一致
- 插件和协作更可追踪

如果你把 Codex 当成一个真正跑任务的 agent runtime，而不只是 CLI 壳子，这些变化都很实在。

## 六、升级建议

1. 如果你使用 remote executor，先回归认证、cwd、shell 和权限路径。
2. 如果你依赖插件和 MCP，重新检查线程级激活与目录发现结果。
3. 如果你用 app-server 做多线程协作，确认 child thread 和 external-agent 导入日志能串起来。
4. 如果你用语音或 TUI 交互，验证 auto-resolve 和 response entry 行为是否符合预期。

## 七、结论

Codex 0.141.0 这版最值得记住的关键词是：

**安全、统一、可控。**

它把远程执行链路、跨平台路径语义、插件发现和协作追踪都往前推了一步。不是最喧哗的一版，但很像一个更接近“稳定运行时”的开始。
