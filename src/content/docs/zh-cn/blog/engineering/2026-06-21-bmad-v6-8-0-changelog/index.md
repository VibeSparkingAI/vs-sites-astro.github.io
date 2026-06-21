---
date: 2026-06-21
slug: zh-cn/blog/engineering/2026-06-21-bmad-v6-8-0-changelog
title: "BMAD METHOD v6.8.0 Changelog：规划形态升级、UX 双轨契约与 Web Bundles 落地"
tags:
  - BMAD
  - Changelog
  - UX
  - Web Bundles
  - Spec
  - Release
description: "BMAD METHOD v6.8.0 用 bmad-ux、bmad-spec、Web Bundles 和更强的激活护栏，把规划方法从单一 IDE 形态推向多平台协作。"
image: ./assets/2026-06-21-bmad-v6-8-0-changelog-cover.png
source_url: https://www.vibesparking.com/zh-cn/blog/engineering/2026-06-21-bmad-v6-8-0-changelog/
author: AI 灵感闪现
cover:
  alt: "BMAD METHOD v6.8.0 Changelog：规划形态升级、UX 双轨契约与 Web Bundles 落地"
  image: ./assets/2026-06-21-bmad-v6-8-0-changelog-cover.png
---

# BMAD METHOD v6.8.0 Changelog：规划形态升级、UX 双轨契约与 Web Bundles 落地

BMAD METHOD `v6.8.0` 于 `2026-05-25 21:47 UTC` 发布。和前一轮把 PRD / Product Brief 重写清楚的 `v6.7.x` 相比，这次不是“再修一版文档”，而是把方法论的形态边界重新划开：UX 进入双轨契约，`bmad-spec` 成为新的内核蒸馏入口，Web Bundles 把能力扩展到 Gemini 和 ChatGPT，激活护栏也同步收紧。

这版最值得记住的一句话是：**BMAD 正在从单一 IDE 工作流，转向可在多平台、多角色、多输入形态之间流动的规划系统。**

![BMAD METHOD v6.8.0 规划系统信息图](./assets/2026-06-21-bmad-v6-8-0-changelog-illustration.png)

## 版本概览

- 版本：`v6.8.0`
- 发布时刻：`2026-05-25 21:47 UTC`
- 类型：正式发布
- 关键词：规划形态多样化、UX 双轨、SPEC 蒸馏、Web Bundles、激活护栏

## 先说结论

如果你只看一个结论，那就是：

1. BMAD 不再只围绕 Claude Code / Cursor 这类 IDE 工具组织能力。
2. `bmad-ux` 和 `bmad-spec` 把“设计”和“蒸馏”拆成了更清晰的契约。
3. Web Bundles 让 BMAD 首次具备了面向 Gemini / ChatGPT 的独立分发面。
4. 23+ 个技能的安全护栏加强，说明作者已经开始认真对待“代理会不会跳步执行”这个问题。

这不是一次单点增强，而是一次方法论平台化。

## 这版最重要的 4 个变化

### 1. `bmad-ux` 取代单文件 UX 设计，UX 进入双轨契约

旧的 `bmad-create-ux-design` 被新的 `bmad-ux` 结构替换后，UX 不再只是一个“产出 design.md 的步骤”，而是分成两个清晰的层：

- `DESIGN.md`：视觉令牌、色彩、排版、间距等设计系统
- `EXPERIENCE.md`：流程、信息架构、状态、无障碍和行为逻辑

这一步很关键。它把“看起来长什么样”和“系统怎么运作”分离开了，后续又通过 `{path.to.token}` 这种引用方式把两者重新连接起来。对工程团队来说，这意味着设计产物不再只是一份静态说明，而是可以被下游工作流稳定消费的结构化契约。

如果你过去在 UX 交付里经常遇到“视觉稿和行为稿对不上”，这次就是在直接修这个问题。

### 2. `bmad-spec` 晋升为新的蒸馏入口

`bmad-spec` 是这版里最像“内核升级”的技能。

它把任意混乱输入，比如脑暴记录、PRD、对话纪要、摘要，蒸馏成一个五字段的 `SPEC.md` 内核：

- Problem
- Capabilities
- Constraints
- Non-goals
- Success signal

这里的变化不只是输出格式更整齐，而是 BMAD 终于有了一个明确的“入口蒸馏层”。以后你不需要先把输入整理得很完美，先喂给 `bmad-spec`，它会先把问题压成可执行骨架，再让后续工作流接上去。

这对真实团队很有价值，因为大多数项目起点本来就不是完美 PRD，而是一堆半结构化信息。

### 3. Web Bundles 把 BMAD 推出了 IDE

这版的另一个标志性变化，是 Web Bundles 的推出。

它把 BMAD 的规划能力封装成面向 Gemini 和 ChatGPT 的六个独立 ZIP 包：

- Brainstorming
- Product Brief
- PRFAQ
- PRD
- UX
- Market & Industry Research

真正重要的点不是“又多了六个包”，而是这些包和 IDE 技能保持 schema 对齐。也就是说，你在 Web 侧和 IDE 侧之间切换时，不会丢掉结构和语义。

这意味着 BMAD 的能力边界开始外扩：它不再只是某个编辑器里的工作流，而是可以作为一种可迁移的规划格式存在。

### 4. 23+ 个技能激活护栏加强，代理不再能随便跳步骤

这一版还做了大量安全收口，尤其是围绕技能激活的护栏。

报告里明确提到，过去出现过代理跳过 append 步骤、绕过 `on_complete` hooks 的情况。v6.8.0 通过显式命名 prepend / append 步骤、要求确认、收紧激活序列，把这类“看似完成、实则少执行一步”的问题压了下去。

这类修复往往不显眼，但它决定了方法论是否真的可复用。一个流程如果不能被可靠执行，再漂亮也只是文档。

## 插图里这版想表达什么

上面的图可以把 v6.8.0 的主线理解成四个模块：

1. 输入蒸馏到 `bmad-spec`
2. UX 分裂成 `DESIGN.md` 和 `EXPERIENCE.md`
3. Web Bundles 让同一套结构可以跨平台传递
4. 激活护栏把执行边界重新收紧

换句话说，BMAD 这版不是在“加更多功能”，而是在把方法论拆成更稳的积木，并且让这些积木可以跨工具搬运。

## 主要特性

### `bmad-spec`：把乱输入压缩成可执行骨架

`bmad-spec` 的价值在于降噪。它不要求输入先变成整齐表格，而是先识别问题，再沉淀成核心规格。

它还有两个值得注意的细节：

- 吸收的内容会进入 `sources:` 列表，供下游跳过重复消费
- 支持 headless JSON 输出，便于自动化流水线调用

这说明 BMAD 开始更认真地面对“不是每次都有人类先帮你整理上下文”这件事。

### `bmad-ux`：从设计稿生成器变成双轨 UX 契约

这不是简单的命名替换。

新的 UX 技能增加了：

- named-protagonist journeys
- surface-closure validation
- 可选 reviewer gate
- 可扩展 producer-handoff 注册表

这些能力组合在一起，意味着 UX 不再只问“画得对不对”，而是同时问“是不是在正确的旅程里、有没有闭环、能不能交接出去”。

### 19 种高级启发技术补充

v6.8.0 还新增了 19 种启发技术，并把 framing 类别补进了体系里。比较亮眼的包括：

- Chain-of-Thought Scaffolding
- Six Thinking Hats
- Delphi Method
- Inversion Analysis
- Steelmanning
- Morphological Analysis
- Abstraction Laddering
- Cascading Failure Simulation
- Boundary & Edge Case Sweep

这件事的意义不只是“库更大”，而是 BMAD 正在把“怎么想”本身显式化。对于需要复杂决策的团队来说，这比又加一个模板更值钱。

### Sidebar 验证器

文档侧边栏顺序验证器 `tools/validate-sidebar-order.js` 也被接进来了，能检测重复、缺失、间隙和翻译偏差。

这类工具看起来像文档工程细节，但它会直接影响大型知识库是否还能被人稳定导航。方法论产品如果文档失序，用户体验会比功能缺失更快崩。

## Breaking Changes

### 1. `bmad-create-ux-design` 迁移到 `bmad-ux`

所有旧的 UX 工作流都需要迁移。安装器会自动移除旧技能，所以这不是“兼容并存”的升级，而是明确的切换。

### 2. `bmad-distillator` 退役，`bmad-spec` 接管

蒸馏入口发生了代际替换。自定义自动化、脚本或固定流程如果还在调用旧技能，需要改到 `bmad-spec`。

### 3. 自定义工作流要重新校验激活顺序

23+ 技能护栏加强后，原来依赖宽松执行顺序的流程，可能会在激活阶段被拦下。这个变化本质上是好事，但也意味着你不能再默认“代理会自己补完流程”。

## 升级建议

### 如果你已经在 v6.7.x

1. 先运行 `npx bmad-method install` 更新安装器。
2. 把所有 UX 调用从 `bmad-create-ux-design` 切到 `bmad-ux`。
3. 把所有蒸馏调用从 `bmad-distillator` 切到 `bmad-spec`。
4. 重新跑一次 PRD、Brief 和 UX 流程，确认新护栏不会把你的自定义步骤误伤。

### 如果你从更早版本升级

建议先补到 `v6.7.0`，完成 PRD / Brief 迁移，再升到 `v6.8.0`。直接跨版本升级可能同时撞上多层 breaking changes。

## 关键数据

| 指标 | 数值 |
|------|------|
| 新增核心技能 | 2（`bmad-spec`、`bmad-ux`） |
| 退役技能 | 2（`bmad-distillator`、`bmad-create-ux-design`） |
| Web Bundles | 6 个 |
| 新增启发技术 | 19 种 |
| 累计启发技术 | 69 种 |
| 修复数量 | 9+ |
| 强化护栏技能数 | 23+ |

## 风险与兼容性

- 这是一版正式发布，但涉及的工作流改动很大，升级前最好先做一次回归验证。
- Web Bundles 依赖 Gemini / ChatGPT 的平台能力，后续 schema 维护要持续跟进。
- 旧的 UX 和蒸馏入口已经明确退场，混用新旧技能会带来不必要的排障成本。
- 激活护栏增强后，熟练用户可能会觉得流程更慢，但这是在换取更可靠的执行一致性。

## 总结

BMAD METHOD `v6.8.0` 的主题不是“更多功能”，而是“更清晰的形态”。

它把 UX、蒸馏、Web 分发和激活安全全部重新整理了一遍，结果是：BMAD 更像一个可迁移、可验证、可多平台运行的规划系统了。

如果你关心的是规划方法能不能真正落地、落地之后能不能跨平台复用、复用时会不会悄悄失真，这版非常值得看。
