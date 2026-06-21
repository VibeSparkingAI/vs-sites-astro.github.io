---
date: 2026-06-21
slug: zh-cn/blog/engineering/2026-06-21-superpowers-v6-0-3-changelog
title: "Superpowers v6.0.3 Changelog：把 SDD 工作区从 `.git/` 迁到 `.superpowers/sdd/`"
tags:
  - Superpowers
  - Changelog
  - SDD
  - Claude Code
  - Git
  - Release
description: "Superpowers v6.0.3 解决了 Claude Code 对 `.git/` 的受保护路径冲突，把 SDD 临时文件迁到 `.superpowers/sdd/`，并补充了兼容性与升级提醒。"
image: ./assets/2026-06-21-superpowers-v6-0-3-changelog-cover.svg
source_url: https://github.com/obra/superpowers/releases/tag/v6.0.3
author: AI 灵感闪现
cover:
  alt: "Superpowers v6.0.3 Changelog：把 SDD 工作区从 `.git/` 迁到 `.superpowers/sdd/`"
  image: ./assets/2026-06-21-superpowers-v6-0-3-changelog-cover.svg
---

# Superpowers v6.0.3 Changelog：把 SDD 工作区从 `.git/` 迁到 `.superpowers/sdd/`

Superpowers `v6.0.3` 是一个很典型的 hotfix：它没有试图再发明一套新工作流，而是直接修掉了一个会把 Subagent-Driven Development 卡死的路径冲突。根据发布说明，这个版本的发布时间是 `2026-06-18 22:45 UTC`，换算到北京时间是 `2026-06-19 06:45`。

这版真正重要的地方在于，它不是“把临时文件换个位置”这么轻描淡写。它修的是 Claude Code 对 `.git/` 目录的保护策略与 SDD 文件写入之间的硬冲突。换句话说，v6.0.3 解决的是那种一旦踩中就会把整条任务链路掐断的问题。

## 版本概览

- 版本：`v6.0.3`
- 类型：stable release
- 发布时刻：`2026-06-18 22:45 UTC` / `2026-06-19 06:45` 北京时间
- 重点：SDD 工作区迁移、Claude Code 路径兼容、可恢复 scratch space

## 这版只做了一件大事，但这件事很关键

### 1. 把 SDD 临时文件从 `.git/` 里挪出来

v6.0.3 的核心变更，是把所有 SDD 工作文件统一迁到 `.superpowers/sdd/`。

这批文件包括：

- task briefs
- implementer reports
- review diffs
- progress ledger

为什么这件事重要？因为 Claude Code 会把 `.git/` 视为受保护路径，agent 不能随意往里写。之前如果 implementer subagent 想把报告落到 `.git/sdd/`，任务就可能在中途被阻断。这个失败模式很糟糕，因为它不是逻辑错误，而是运行时被平台安全策略直接打断。

迁到 `.superpowers/sdd/` 之后，Superpowers 顺手补齐了几个关键属性：

- 这个目录是 `self-ignoring` 的，不会出现在 `git status` 里
- 不容易被误提交
- 通过共享的 `sdd-workspace` helper 按 worktree 解析路径
- 行为更像明确的工作区 scratch pad，而不是误闯 `.git/`

从工程角度看，这不是“改路径”这么简单，而是把一个会触发硬失败的写入点，换成了一个可预期、可恢复、可清理的工作目录。

### 2. 失败语义从“直接撞墙”变成“可管理的临时态”

这次迁移最值得注意的地方，不是文件放哪里，而是系统在失败时的表现变了。

在旧方案里，subagent 一旦碰到 `.git/` 保护墙，往往就是中断、回退、重试、再失败，最后任务链路卡住。新方案把这些状态都收束到 `.superpowers/sdd/`，等于给 SDD 工作流补了一个真正的中间层。

这类变化对自动化系统特别重要，因为它通常不显山不露水，但一旦出问题，成本会被放大：

- controller 以为任务还在推进
- implementer 其实已经被拒写
- review 阶段拿到的是不完整上下文
- progress ledger 也可能停在半路

v6.0.3 解决的，就是这种“看起来在跑，实际上已经坏了”的状态漂移。

### 3. 它还顺手提醒了一个清理风险

报告里有一个很实用、但经常会被忽视的提醒：`.superpowers/sdd/` 虽然是 worktree 里的 scratch area，但它仍然属于 git-ignored 的工作区临时文件，因此 `git clean -fdx` 会把 progress ledger 一起清掉。

这意味着两件事：

- 这个目录适合临时状态，不适合当长期存档
- 团队在自动清理脚本、CI 任务和本地维护习惯上要更谨慎

好消息是，ledger 仍然可以通过 `git log` 恢复。坏消息是，如果你习惯性地把清理命令当成无脑维护手段，就很容易把恢复线索一起删掉。

## 这次 hotfix 的背景不是孤立的

### v6.0.2 先修了安装，再轮到 v6.0.3 修工作流

v6.0.3 不是凭空出现的。它前面已经有 v6.0.2 做铺垫：那个版本移除了 `evals` 子模块，解决了部分用户在插件安装阶段遇到的问题。

这说明 Superpowers 6.0.x 的修复顺序其实很清楚：

1. 先修安装链路，让用户至少能装上
2. 再修运行时链路，让 agent 真能持续工作

v6.0.3 属于第二步里的关键补丁，因为它处理的是 SDD 的“执行中断点”，而不是装好以后再慢慢优化体验。

### 放到 v6.0.0 的大重构里看，它是一次收尾

如果把视野再往前挪一点，v6.0.0 的变化更像是“大手术”：

- reviewer 从双审缩成单审
- task brief 和 review diff 文件化
- controller 需要先做 plan 预检查
- skill 语言开始中立化

v6.0.3 的意义，是把这套更轻、更快、更通用的 SDD 体系里，最容易被 Claude Code 安全策略卡住的那一环补齐。

所以它虽然只是 hotfix，但它不是边角料。它是在帮 v6.0.x 的新工作方式补“能真正落地”的最后一块砖。

## 我怎么看这版的价值

### 1. 它解决的是生产级阻断，而不是实验性瑕疵

很多 patch 只是修一个报错信息或者一个视觉 bug，但 v6.0.3 处理的是 agent 工作流被安全策略中止的问题。

这种问题的特征是：

- 出现概率不一定最高
- 一旦出现就会极其烦
- 很难靠用户手动补救
- 对长链路自动化影响很大

所以这类补丁的价值，往往高于它看起来的“改动量”。

### 2. 它让 SDD 更像一个真实的工程系统

真正成熟的 agent 工作流，不只是“会生成文件”，而是要明确知道：

- 哪些东西是状态
- 哪些东西是缓存
- 哪些东西是临时产物
- 哪些地方不能碰

把 SDD 文件从 `.git/` 迁走，本质上就是在给工作流划边界。边界清楚了，controller、implementer、reviewer 的职责才更容易分离，出错也更容易定位。

### 3. 它降低了后续维护成本

迁移到 `.superpowers/sdd/` 后，后续维护会轻松很多：

- 不会和 Git 的保护语义继续打架
- worktree 级别的解析逻辑更统一
- 新增 SDD 文件类型时更容易扩展
- 未来如果再调整路径，也不会碰到 `.git/` 这种高风险区域

## 风险与兼容性

- `.superpowers/sdd/` 是临时工作区，不要把它当长期资料库。
- `git clean -fdx` 会清掉 progress ledger，团队要提前约定清理习惯。
- 如果你有自定义脚本依赖旧的 `.git/sdd/` 路径，需要尽快迁移。
- 旧版全局 worktree 路径 `~/.config/superpowers/worktrees/` 已经废弃，相关自动化也要一并检查。

## 升级建议

1. 如果你正在跑 SDD 工作流，优先升级到 `v6.0.3`，不要继续停留在旧的 `.git/sdd/` 方案上。
2. 检查自定义脚本、CI job 和本地 helper，确认没有硬编码旧路径。
3. 如果团队会定期清理工作目录，先确认谁负责保留 progress ledger，避免误删。
4. 从 `v6.0.0` 或 `v6.0.2` 升级时，顺手回看一次 review / implementer 的落盘位置，确认没有隐性耦合。

## 总结

Superpowers `v6.0.3` 是一个小版本，但它修的是大问题。把 SDD 临时文件从 `.git/` 迁到 `.superpowers/sdd/`，等于把一个会直接撞上 Claude Code 保护策略的失败点，改造成了一个可控的临时工作区。

如果你已经在用 SDD，这版几乎是必须升级的修复；如果你还在评估 Superpowers，这个补丁至少说明了它对真实运行时冲突是认真处理的，而不是只在理想环境里跑通。
