---
date: 2026-06-21
slug: zh-cn/blog/engineering/2026-06-21-gsd-v1-6-0-rc-1-changelog
title: "GSD Core v1.6.0-rc.1 Changelog：能力注册表与决议溯源体系落地"
tags:
  - GSD
  - Changelog
  - Capability Registry
  - Release
  - CLI
description: "GSD Core v1.6.0-rc.1 聚焦 Capability Registry、Resolution Provenance、Markdown Sectionizer 与安全性修复。"
source_url: https://www.vibesparking.com/zh-cn/blog/engineering/2026-06-21-gsd-v1-6-0-rc-1-changelog/
author: AI 灵感闪现
---

# GSD Core v1.6.0-rc.1 深度解读：能力注册表的诞生

> **版本：** v1.6.0-rc.1（预发布）  
> **发布时间：** 2026-06-20 19:58 UTC  
> **发布地址：** https://github.com/open-gsd/gsd-core/releases/tag/v1.6.0-rc.1  
> **安装：** `npm i @opengsd/gsd-core@1.6.0-rc.1`（`next` dist-tag）

---

## 概述

v1.6.0-rc.1 是 GSD Core 自 v1.5.0 稳定版以来的下一个重大预发布。本版本的核心主题是 **Capability Registry（能力注册表）**——一套完整的第三方能力管理体系，由 ADR-1244 定义，分五个 Phase 逐步落地。同时，Resolution Provenance（决议溯源）正式规范化为 P1-P4 四个层级，配套 CI 守卫确保不会"静默失败"。

这个版本共包含：
- **11 个 Feature**（其中 9 个属于 Capability Registry 体系）
- **16 个 Enhancement / Refactor**
- **24 个 Fix**

## Feature 亮点

### 🏗️ ADR-1244：Capability Registry 完整体系（Phase 1-5）

这是本版本最大的架构演进，由 @trek-e 在 6 天内密集交付：

| Phase | PR | 功能 |
|-------|-----|------|
| 1 | #1436 | 版本化能力清单 + 原生戳记（Versioned Capability Manifest） |
| 2 | #1440 | 运行时能力注册表覆盖层（Runtime Capability Registry Overlay） |
| 3 | #1443 | 能力来源解析器 + 账本（Capability Source Resolver + Ledger） |
| 4 | #1449 | 能力信任门 + 升级/兼容性检查（Trust Gate + Upgrade/Compat） |
| 5 | #1450 | 注册表驱动的第三方能力分发（Registry-Driven Dispatch） |

配套的 CLI 管理命令完整落地：
- `gsd capability install/update/remove/list/disable/enable` (#1457)
- `gsd capability outdated` 检查各来源更新 (#1488)
- 能力矩阵自动生成 + 漂移守护 (#1458)

**这意味着什么？** GSD 现在可以像包管理器一样管理第三方能力（skills、commands、tools），支持版本化、来源验证、完整性校验、信任门控——这是一套完整的供应链安全体系。

### 🔍 Resolution Provenance（决议溯源）P1-P4 (#1425)

决议系统不再"静默失败"。当配置加载、项目根解析、agent-skills 诊断出现问题时，GSD 现在会明确报告**来源和原因**：

- **P1:** 从后代目录向上查找最近的 `.planning/` 确定项目根
- **P2:** `loadConfig` 溯源 + agent-skills 诊断
- **P3:** 正式规范 Resolution 约定 + agent-skills 值信封
- **P4:** CI 守卫确保决议溯源不被破坏

### 🔧 小但重要的 Feature

- **#1419:** `--phase-req-ids` 支持同前缀数字 ID 范围展开（@behruznassre 首次贡献）
- **#1500:** 新增 `workflow.mvp_mode` 配置键

## Enhancement / 重构

### Epic #1372：Markdown Sectionizer 统一解析层

这是一次大规模的代码质量重构，将分散在多处的 ad-hoc Markdown 解析统一到一个规范的 `markdown-sectionizer` 接缝层：

- T0: 创建规范接缝 (#1381)
- T1: decisions 模块迁移 + 失败即报错守卫 (#1386)
- T2: adr-parser 迁移 (#1388)
- T3: check-command-router + gap-checker 迁移 (#1392)
- T4: roadmap-parser 迁移 (#1395)
- T5: uat + uat-predicate 迁移，退役 fence-stripper 重复代码 (#1397)
- T6: state.cts section-collects 迁移，STATE.md 字节级一致 (#1399)
- T7: ESLint 规则 `no-adhoc-markdown-parsing` + 祖父燃烧列表 (#1402)

**影响：** 所有 Markdown 解析现在走同一路径，减少了 7 处重复实现，显著降低了维护成本和解析不一致的 bug。

### 其他增强

- **#1470:** 文档化 `projects-sync`——首个参考第三方能力
- **#1495:** 修复并补全 ADR-1244 能力文档集（可跟随教程、覆盖层模型、参考缺口）
- **#1466:** @davesienkowski 加入 CODEOWNERS 审阅池

## 关键修复

### 安全性修复
- **#1407:** `setGsdConfig` 测试辅助函数防原型污染（CodeQL #40）
- **#1459:** 用户拥有的同意存储门控第三方能力激活；防止 env/cwd 泄露
- **#1460:** 按来源验证或拒绝能力的 `--integrity`；将 hook 命令限制在 bundle 内
- **#1461:** loader 遇到畸形覆盖层不再崩溃（跳过并警告）；限制来源 fetch/staging

### 正确性修复
- **#1469:** 损坏的能力账本 fail-closed 不丢数据；原子化账本写入
- **#1482:** 禁止无根基基线、抑制错误的回退、以及 planner verify 块中的过时产物权威
- **#1442:** antigravity 解析器优先选 GSD 拥有的目录而非第一个存在的（@davesienkowski）
- **#1484:** 修复 `sub_repos/.git` 优先级；保护 new-milestone 中未提交的数据

### 健壮性修复
- **#1376:** 当配置的 agent skills 全部解析失败时显示诊断
- **#1385:** 扫描活动 changeset 片段进行 #1777 纯净度门控
- **#1483:** 工作流感知的健康路径；从 W017 中排除活动 worktree
- **#1492:** 每次 wave 前刷新 wave manifest 并重新检查 base

## 风险评估

### ⚠️ 预发布警告
作为 `rc.1` 版本，这是一个**预发布**，通过 `next` dist-tag 发布。虽然变更量巨大（51 个 PR），但：

1. **Capability Registry 是新系统**——虽已有较完整的测试覆盖（#1497 行为验证），但作为 Phase 1-5 的首个完整实现，生产环境中可能存在边缘情况。
2. **Markdown Sectionizer 是大范围重构**——尽管有字节级一致性验证和 ESLint 守卫，任何解析路径的变化都值得关注。
3. **决议溯源会改变错误信息格式**——如果有脚本解析 GSD 输出，需要注意适配。

### ✅ 积极信号
- 24 个 Fix 表明团队在积极修 bug
- CodeQL 扫描已集成（#1407 响应了 CodeQL #40）
- CI 守卫层次完善（决议溯源 P4、ESLint 规则、纯净度门控）

## 升级建议

### 从 v1.5.0 升级
```bash
npm i @opengsd/gsd-core@1.6.0-rc.1
```

1. **测试环境先行**——先在非关键项目中验证
2. **关注 CLI 输出变化**——决议溯源可能改变错误/警告的措辞
3. **检查能力注册表**——运行 `gsd capability list` 确认现有配置兼容
4. **等待正式版**——如果风险敏感，建议等 v1.6.0 正式发布

### 从更早版本升级
中间跳过了 v1.5.0 的大量变更（包括 v1.5.0-rc.1 到 rc.5 的迭代），建议先查阅 v1.5.0 的 changelog。

## 与同类 SD（Spec-Driven）方法的对比

### vs BMAD Method
BMAD Method 侧重于业务流程建模和需求可追溯性。GSD v1.6.0 的 Capability Registry 提供了类似的可扩展性但更偏向**开发者工具链**：BMAD 关注"业务要什么"，GSD 关注"代码怎么组织"。Resolution Provenance 是 GSD 独有的——BMAD 没有等价的"配置溯源"概念。

### vs Spec-Kit
Spec-Kit 是一个轻量级的 spec 编写框架，强调模板和约定。GSD v1.6.0 的能力注册表超越了 Spec-Kit 的范畴：它不只是管理 spec，而是管理**整个工具链生态**。如果 Spec-Kit 是"spec 的包管理器"，GSD 现在是"开发工作流的包管理器"。Markdown Sectionizer 统一层也是 GSD 独有的基础设施投资。

### vs OpenSpec
OpenSpec 侧重于开放标准化的 spec 交换格式。GSD 的能力注册表采用了类似的"开放注册"理念——第三方可以提供能力并通过注册表分发——但 GSD 更强调**信任门控和完整性验证**（#1449, #1460）。OpenSpec 的信任模型更松散，GSD 的 fail-closed 设计更保守。

### vs Superpowers
Superpowers 聚焦于 agent 能力增强（skills、commands）。GSD v1.6.0 的 Capability Registry 在概念上最接近 Superpowers 的 skill 系统，但有两个关键区别：
1. **供应链安全：** GSD 引入了来源验证、完整性校验、信任门——Superpowers 目前没有等价机制。
2. **版本化：** GSD 的能力是版本化的（ADR-1244 Phase 1），Superpowers 的 skill 没有版本概念。

## 关键 PR 索引

| 类别 | PR | 标题 | 作者 |
|------|-----|------|------|
| 🏗️ | #1436 | ADR-1244 Phase 1: 版本化能力清单 | @trek-e |
| 🏗️ | #1440 | ADR-1244 Phase 2: 运行时覆盖层 | @trek-e |
| 🏗️ | #1443 | ADR-1244 Phase 3: 来源解析器+账本 | @trek-e |
| 🏗️ | #1449 | ADR-1244 Phase 4: 信任门+升级兼容 | @trek-e |
| 🏗️ | #1450 | ADR-1244 Phase 5: 第三方分发 | @trek-e |
| 🔍 | #1425 | Resolution Provenance P3 | @trek-e |
| 🔒 | #1459 | 用户同意存储门控 | @trek-e |
| 🔒 | #1460 | 完整性验证+命令限制 | @trek-e |
| 🐛 | #1482 | 禁止无根基基线 | @trek-e |
| 🐛 | #1469 | 账本原子写入 | @trek-e |
| 📝 | #1495 | ADR-1244 文档补全 | @trek-e |
| 🆕 | #1419 | ID 范围展开 | @behruznassre |

## 结语

v1.6.0-rc.1 是 GSD Core 的一次**基础架构跃迁**。Capability Registry 和 Resolution Provenance 不是表面功能——它们是 GSD 从"单体工具"走向"可扩展平台"的关键一步。如果这个 rc 周期顺利完成，v1.6.0 将成为 GSD 历史上最重要的里程碑之一。

建议密切关注 rc 反馈和后续 patch，准备好在正式版发布时升级。
