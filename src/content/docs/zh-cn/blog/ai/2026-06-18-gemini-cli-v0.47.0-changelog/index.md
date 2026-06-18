---
date: 2026-06-18
slug: zh-cn/blog/ai/2026-06-18-gemini-cli-v0.47.0-changelog
title: "Gemini CLI v0.47.0 Changelog 深度分析"
tags:
  - Gemini CLI
  - Changelog
  - MCP
  - Vertex AI
  - Shell
  - Stability
description: "0.47.0 主要修了模型路由、MCP 发现、resume、policy 解析和 shell 边界，整体偏稳定性维护。"
image: ./assets/2026-06-18-gemini-cli-v0.47.0-changelog-cover.png
source_url: https://www.vibesparking.com/zh-cn/blog/ai/2026-06-18-gemini-cli-v0.47.0-changelog/
author: AI 灵感闪现
cover: /Users/blogbin/WorkSpaces/VibeSparking/vs-sites/vs-sites-astro/.openclaw/workspace/src/content/docs/zh-cn/blog/ai/2026-06-18-gemini-cli-v0.47.0-changelog/assets/2026-06-18-gemini-cli-v0.47.0-changelog-cover.png
---

![Gemini CLI v0.47.0 版本要点信息图](./assets/2026-06-18-gemini-cli-v0.47.0-changelog-illustration.png)

# Gemini CLI v0.47.0 Changelog 深度分析

> 发布时间：2026-06-18 01:51:23 UTC  
> 覆盖版本：v0.47.0

---

## 一、TL;DR

这版最值得看 5 件事：

1. Gemini CLI 开始更明确地尊重 backend definitions，auto mode 在 flag 开启时会更稳定地落到 3.5 flash。
2. `fix(policy)` 同时补上了 `EBUSY` fallback 和 TOML parse recovery，配置文件和文件锁边界更不容易炸。
3. MCP tool discovery 做了 atomic update，工具发现过程不容易出现半更新状态。
4. Vertex AI model mapping 修复，云端模型路由更不容易偏。
5. Antigravity CLI 文档和迁移命令补齐，旧入口迁移会更顺手。

一句话：**v0.47.0 不是冲着新概念来的，而是在把真正会影响自动化和 agent 工作流的边界一层层收紧。**

## 二、版本定位

这次 release body 不长，但信号很集中。它不是那种“多了一个显眼功能”的版本，更像是一次把执行链路和配置链路补牢的维护更新。

你会看到几类非常典型的修补：

- 模型选择和 backend 定义收口
- policy / TOML / 文件锁这类配置边界修复
- MCP 工具发现的原子化更新
- Vertex AI 映射纠偏
- resume/session 状态清理
- shell 和 browser agent 文档边界清理

如果你把 Gemini CLI 接到自动化、agent loop、MCP 工具链，或者依赖它在复杂环境里稳定执行，这版比表面看起来更重要。

## 三、最重要的几处变化

### 3.1 backend definitions 与 auto mode 的关系更明确了

`Respect backend definitions for 3.5 flash and Update auto mode to use 3.5 flash when the flag is enabled.` 是这版最直接的行为变化之一。

它的意义不只是“默认模型变了”，而是 Gemini CLI 对 backend definition 的尊重程度更高了。换句话说：

- 如果你在配置里定义了 backend，运行时更不容易自己改口
- auto mode 在 flag 打开时会更稳定地选择 3.5 flash
- 模型路由更可预测，脚本和 agent 更容易复现

对于经常调模型、切后端、跑自动化的人来说，这类修复能显著降低“为什么今天跑出来和昨天不一样”的排查成本。

### 3.2 `fix(policy)` 处理了 `EBUSY` 和 TOML 解析恢复

`fix(policy): add EBUSY fallback and TOML parse recovery` 这条是典型的稳定性修复。

它覆盖的是两个很常见但很烦的边界：

- `EBUSY`，通常意味着文件或资源暂时被占用
- TOML parse recovery，意味着配置文件可能写坏了或者中途读到了不完整内容

这类修复的价值在于：

- 遇到短暂文件占用时不会直接崩
- TOML 配置出错时，恢复路径更清楚
- 自动化和本地开发环境都更不容易因为一次脏状态就挂住

对 CLI 工具来说，配置读取是第一跳，第一跳稳了，后面的调用链才有意义。

### 3.3 MCP tool discovery 做了 atomic update

`fix(core): implement atomic update in MCP tool discovery` 是本版另一个值得重视的修复。

它不是在回答“能不能发现工具”，而是在回答“更新工具列表的时候会不会暴露出半成品状态”。

这意味着：

- 工具发现刷新时更不容易抖动
- 并发或快速切换场景下，观察到的工具视图更一致
- agent 上层不太会因为瞬时不一致做出错误决策

如果你依赖 MCP 工具做动态编排，这种修复往往比新增一个工具更实用。

### 3.4 Vertex AI model mapping 修正

`Vertex ai model mapping fix` 说明 Gemini CLI 在 Vertex AI 相关模型映射上做了纠偏。

这类 bug 的问题不在“有没有模型”，而在“你以为映射对了，实际请求却落到了另一个别名或 provider 上”。

修复之后，比较直接的收益是：

- 云端模型路由更可预测
- 依赖 Vertex AI 的脚本更少误判
- 模型名、provider 和实际请求之间的歧义更少

如果你是混合云、企业内网或者多后端切换用户，这条值得优先回归。

### 3.5 Antigravity CLI 文档和迁移命令补上了

`Add documentation and migration commands for Antigravity CLI` 看似是文档更新，实际上通常意味着项目已经开始给某个入口提供更明确的迁移路径。

它的好处很现实：

- 用户不用靠猜来迁移
- 命令或配置切换更容易落地
- 旧路径和新路径的关系更清楚

对于 CLI 工具来说，迁移能不能成功，往往取决于有没有足够好的“过桥”内容。

### 3.6 browser agent 文档里的 experimental 文案被移除

`chore: remove experimental text from browser agent docs` 这个改动很小，但挺说明问题。

它通常意味着：

- 某块能力已经不想再被用户当成“试试看”来看待
- 文档状态在向更稳定的心智模型收口
- 用户对 browser agent 的预期会更明确

虽然只是文案，但 CLI 生态里，文案往往就是行为承诺的边界。

### 3.7 空 resume sessions 不再持久化

`Avoid persisting empty resume sessions` 是一个非常务实的清理型修复。

空 session 如果被写进状态，会带来很多噪音：

- 恢复列表看起来一堆“假条目”
- 自动恢复逻辑更容易误判
- 诊断时很难分清哪条是有效状态

现在这个问题被挡住后，resume 路径会更干净，长期运行的工作流也更好维护。

## 四、风险评估

这版整体不像 breaking release，但有三类地方值得重点看：

| 风险 | 说明 |
|---|---|
| auto mode / backend | 如果你依赖特定后端选择逻辑，最好重新确认 3.5 flash 的路由结果 |
| policy / TOML | 配置文件损坏、文件被占用、锁竞争场景需要回归 |
| MCP discovery | 动态工具列表和并发刷新场景要重新跑最小用例 |

## 五、升级建议

如果你符合下面任意一条，这版建议尽快试：

1. 你在用 Gemini CLI 的 auto mode 或自定义 backend definitions。
2. 你依赖 policy 文件、配置迁移或自动恢复逻辑。
3. 你把 Gemini CLI 接进 MCP 工具链或 agent loop。
4. 你在 Vertex AI 上跑模型，且在意路由稳定性。
5. 你会用 shell wrapper、browser agent 或长会话恢复。

如果你只是偶尔手动跑一下 CLI，这版也不算激进，但我仍然会建议至少做一次最小冒烟。

## 六、结论

Gemini CLI v0.47.0 没有靠大功能来吸引注意力。

它更像是在回答几个很务实的问题：

- backend 定义能不能更可信？
- 配置损坏时能不能更稳地恢复？
- MCP 工具发现能不能更一致？
- 云端模型映射能不能更准确？

这些问题都在往“更稳”走。对 CLI 和 agent 用户来说，这种稳定性修补通常比表面功能更值钱。

*来源：GitHub Release 与 compare diff*
