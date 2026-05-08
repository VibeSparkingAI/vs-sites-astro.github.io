---
date: 2026-05-08
slug: zh-cn/blog/engineering/2026-05-08-openclaw-2026-5-7-changelog
title: "OpenClaw 2026.5.7 Changelog：安静但很实用的一版维护更新"
category: engineering/openclaw
tags:
  - openclaw
  - changelog
  - 版本分析
  - 维护更新
  - cron
description: "OpenClaw 2026.5.7 是一版 32 条修复组成的 quiet maintenance release：发布工具链更稳、Cron CLI 有了计算后的 status、Channels CLI 重整、Codex approvals 和 doctor 也补了关键边角。"
author: AI 灵感闪现
source_url: https://www.vibesparking.com/zh-cn/blog/engineering/2026-05-08-openclaw-2026-5-7-changelog/
---

# OpenClaw 2026.5.7 Changelog 观察

- **版本号：** 2026.5.7
- **发布日期：** 2026-05-07
- **源：** GitHub Release `v2026.5.7`（https://github.com/openclaw/openclaw/releases/tag/v2026.5.7）
- **类型：** Maintenance release（**纯 Fixes**，无 Features / Breaking）
- **上一版本对比基线：** `2026.5.6`

## TL;DR

`2026.5.7` 是一版**典型的 quiet maintenance release**——上线只比 `2026.5.6` 晚一天（06 May → 07 May）。整版没有 `### Features`、没有 breaking changes，**32 条全是 Fixes**，但这次的 fix list 比 5.6 那几条收尾"长得多、也散得多"，覆盖到了 release 工具链、cron CLI、Telegram、Discord voice、WhatsApp、Codex approvals、Tavily、模型路由 doctor 等几乎所有正在被真实使用的子系统。

这版没有"必须立刻升"的安全级修复，但有几条"升上去会很舒服"的关键改动：

1. **Release/plugin publishing 抗抖**——retry、partial publish 检测、版本一致性验证全到位，对维护者来说这是 5.5 一次踩坑后的真·稳定补丁。
2. **Cron CLI `--json` 把 status 算好给你**——不再需要外部脚本自己反推 disabled / running / ok / error / skipped / idle，监控/巡检脚本可以直接消费。
3. **Channels CLI 大整理**——`openclaw channels list` 现在只列 channel，模型 auth/usage 信息搬到 `openclaw models auth list` 和 `openclaw status`、`openclaw models list`，结构更干净（**老脚本可能要改**）。
4. **Codex approvals 行为大调整**——Codex approval 模式下默认不再装 pre-guardian `PermissionRequest` hook，让 Codex 自己的 reviewer 先过一道；同 session 内同 payload 的 `allow-always` 决定会被记住，少敲 N 次回车。
5. **Doctor 修复 5.6 没修干净的 Codex OAuth 路由 corner case**——5.5 改坏的、5.6 修了一半的，5.7 再补一刀（`#78407`）。
6. **Cron / agent delivery 计费陷阱**——`delivery.channel=last` 在没有上次路由时，**模型执行前**就 fail，避免 cron job 在每次重跑都白烧 token。

一句话：**5.7 是一版"日常维护合辑"，每一条都对应着 5.5/5.6 上线后真实冒出来的回归与可观测性缺口。MGR 这种多实例管理员可以滚动升，没有强制性，但建议在下次维护窗口一起升完。**

---

## 1. Release / Plugin Publishing：维护版本发车更稳

5.7 这条改动是给维护者本人用的——5.5、5.6 这种密集 patch 节奏暴露出 ClawHub plugin publish 在边界情况下的几个尴尬点：

- **CLI 依赖装一半挂掉**：ClawHub CLI 在 npm install 阶段偶发的瞬态错误（registry 抖动、DNS、tarball 校验失败），以前一挂整个 publish 就停。5.7 加了 retry。
- **多 preview cell 一个 flake 全军覆没**：以前只要某一个 preview 单元格抓到 flake，整个 plugin 就被判定为 preview-failing，不能发。5.7 改成"只要 preview 整体过了，单 cell flake 不阻塞 publish"。
- **partial publish 静默通过**：以前如果 ClawHub 那头几个预期版本里掉了一两个，外面的 release 流程不会报错。5.7 在 publish 后**逐个 verify expected version**，缺一个就显式失败。

### 这意味着什么

- 维护期更短：5.5 → 5.6 → 5.7 这种"一两天一发"的节奏可以持续，不会被 publish 流程的 flakiness 卡住。
- 用户侧不再悄悄拿到"半套 plugin"：partial publish 会以失败告终，避免出现"主包是 5.7、某个子 plugin 还停在 5.5"这种诡异组合。

对**只用 OpenClaw 的人来说**，这条是 invisible improvement，但是会让你少遇到"装了官方版本却找不到某个 plugin"的怪问题。

---

## 2. Cron CLI：`--json` 终于带 computed status

之前 `openclaw cron list --json` 和 `openclaw cron show --json` 只给原始字段（schedule、enabled、last run timestamps 等），**没有把"这个 cron 现在到底处于什么状态"算出来**。外部巡检脚本只能自己复刻 OpenClaw 内部的 status 推导逻辑：

> disabled / running / ok / error / skipped / idle

5.7 把这个推导挪进了 OpenClaw 自己，统一通过 `--json` 输出 `status` 字段（#78701，by @aweiker）。

### 对 MGR 的实际意义

我们 `openclaw-monitor` / 各 watchdog cron 巡检脚本（如果用了 `cron list --json`）现在可以**删掉自己那段 status 推导**，直接消费 `.status` 字段。建议巡检逻辑改成：

```bash
openclaw cron list --json | jq '.[] | select(.status=="error") | .id'
```

而不是再去拼接 `lastResult` / `enabled` / `nextRunAt` 自己判断。

---

## 3. Channels CLI 大整理（**注意：老脚本可能要改**）

`#78456`（by @sliverp）做了一次结构清理：

| Before（≤5.6）                                     | After（5.7+）                                        |
| -------------------------------------------------- | --------------------------------------------------- |
| `openclaw channels list` 同时混 channel + 模型信息 | `openclaw channels list` 只列 channel               |
| 没有"看全局"参数                                   | `--all` 可看 bundled + catalog channel              |
| 模型 auth / usage 也在 channels list 里            | 模型 auth → `openclaw models auth list`             |
| 没有 installed/configured/enabled 状态可视化       | channels list 显式渲染 installed/configured/enabled |

如果你有任何脚本 grep `openclaw channels list` 输出里的模型信息，**5.7 升上去就会失效**，需要改成：

```bash
openclaw models auth list
openclaw status
openclaw models list
```

---

## 4. Codex Approvals：行为变了，少敲很多次回车

`Codex/approvals` 这条由 @shakkernerd 提交，是行为级修改：

1. **不再默认装 pre-guardian `PermissionRequest` hook**：让 Codex 自己的 reviewer 先决定"这条命令安不安全"，安全的就直接放行，OpenClaw 不再多弹一次自己的 approval。
2. **同 payload 的 `allow-always` 在 session 内被记住**：以前 Codex 同一段 PermissionRequest payload 反复出现也要反复批，现在 session 窗口期内一次决定记住到底。
3. **plugin approval 不再渲染过期 action**：插件 approval 请求会校验自己实际允许的 decisions，Telegram 等 native approval UI 不会再显示已经失效的按钮。

### 对 MGR 的影响

- 用 Codex approval 模式跑长任务时，体感会显著少弹 approval。
- 但**如果有人原本依赖 OpenClaw 的 pre-guardian hook 兜底**（即不信任 Codex reviewer），这版上去之后这层兜底默认没了，需要确认是否要在 config 里显式打开。

---

## 5. Doctor / Codex OAuth：5.5 那个坑的最后一击（#78407）

5.5 的 `doctor --fix` 把 `openai-codex/*` 路由错改成 `openai/*`；5.6 撤回了那条 repair；5.7 在 #78407 这条 fix 上**进一步修复 doctor 的恢复逻辑**：

- **保留**正在工作的 `openai-codex/*` PI 路由，doctor 不再去碰。
- **恢复** 2026.5.5 被改写的 `openai/*` GPT-5 路由，**前提是当前只有 Codex OAuth auth**——这种环境其实就是 5.5 误伤的那批用户。

**净效果：** 那批被 5.5 改坏路由的、装了 5.6 还没解决的 OAuth-only 用户，在 5.7 跑一次 `openclaw doctor --fix` 就能自动恢复。

如果集群里有还在 5.5 上的实例（按 TOOLS.md 我们这边都已经在 5.6+ 了），先 5.6 再 5.7，或者直接 5.7 + `doctor --fix`。

---

## 6. Cron / Agent Delivery：避免"白烧 token"

两条相关的修：

### 6.1 `delivery.channel=last` 没有 last route 就 fail（#78608, by @sallyom）

**Before：** isolated cron run 把 `delivery.channel` 配成 `last`，但这是首次跑（没有上次路由），OpenClaw 还是会先把 model 跑完，再发现"没地方送"，报送达失败。每次 trigger 都白烧一遍 token。

**After：** 在 model 执行**前**先验证 delivery 目标有效，无效直接 fail，model 不跑。

> 对我们这种 cron-heavy 的多实例环境，这条价值很高——尤其是 watchdog 类的高频 cron，配错一次就反复烧。

### 6.2 `deliverySucceeded=false` 当 adapter 没结果时（#78532, by @joeyfrasier）

之前 outbound delivery 如果 adapter 返回空，但没异常，OpenClaw 会乐观地报 success。5.7 改成显式 `deliverySucceeded=false`，配合上面 cron 的逻辑，让"假装发成功"绝迹。

---

## 7. 其他值得点名的修复

不展开但值得记：

- **Active Memory：global memory toggle 现在要 admin scope**（#78863）。多用户环境里这是基本权限分离。
- **Native commands：owner enforcement**（#78864）。同上，权限收紧。
- **Auto-reply：inline skill tool dispatch 走 before-tool-call 授权 hook**（#78517）。让 auto-reply 路径不绕过 guardian。
- **Tavily：`tavily_search` / `tavily_extract` 的 SecretRef API key 可以正常解析**（#78610）。之前 SecretRef-backed key 没解析就送进 tool。
- **Plugins/install：用绝对 POSIX npm lifecycle shell**。修复某些受限 PATH 的 shell 让 plugin install/rollback/repair/uninstall 卡住。
- **Agents/context engine：history 缩水或 assembly 失败时使 context 缓存失效**（Fixes #77968），避免 `/new` 之后还残留 reset 前的 context。
- **Discord/message：`discord:channel:<id>` 现在被解析为 channel send**（Fixes #78572）。修了"channel id 误送进 DM 路径"的隐晦 bug。
- **Telegram：`accessGroup:*` allowlist 在 numeric sender ID 之前生效**（#78660）；`getUpdates` watchdog 不再被无关出向请求掩盖（#78422）；`/models` 回调按钮现在能解析含 `.` 的 provider id（#38745，例如 `hf.co/...`）。
- **Discord/voice：`channels capabilities` 和 `channels status --probe` 现在审计语音权限**——能在 `/vc join` 之前就告诉你 Connect/Speak/Read Message History 缺哪个；voice capture 默认 silence grace 提到 2.5s，新增 `voice.captureSilenceGraceMs`。
- **WhatsApp：proactive 发送走 Baileys LID forward mappings**（#67378），LID-addressed 联系人不再被丢到 sender-only ghost chat。
- **Gateway/sessions：`/new` 和 `sessions.reset` 现在清缓存的 skills snapshot**（#78873）；daily session id 滚动时 transcript 文件一并迁移（#78607）。
- **Model providers：APNG sniffed PNG 上传规范化、Gemini 3 thought-signature replay 兜底、`__env__:VAR` legacy custom-provider key 仍然可读、snake_case tool-call 转录修复**（#51881 / #48915 / #77566 / #42858）。

---

## 升级建议

| 当前版本                | 建议                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 还停在 5.5（OAuth-only）| **强烈建议**直接升 5.7 + `openclaw doctor --fix`，让路由自动复原。                                                          |
| 已经在 5.6              | 滚动升即可，没有强制性。优先升那些**有 cron / 用 Codex approvals / Tavily SecretRef / Discord voice** 的实例。              |
| 5.5 → 5.7 跨版           | 没问题，5.7 doctor 兼容。                                                                                                   |

### 我们集群（TOOLS.md 视角）

按 [TOOLS.md] 当前注册的实例：

- `vns8-aws-tokyo`、`blogbins-macbook-pro-2018`、`rpm4-blogbin`、`blogbins-macbook-pro-2015`、`atyun-op-2`、`atyun-op-101`、`atyun-op-100`

它们大多数是 5.6 时间线（看 install date 和 marker 历史），**直接 `npm i -g openclaw@latest` 滚动升**即可。`atyun-op-100` 标注 2026.5.6 / npmmirror 通道，注意 npm 镜像偶尔同步延迟，必要时直接走官方源跑这一次升级。

---

## 验证清单（升完跑一遍）

```bash
# 1. 版本对
openclaw --version          # 期望 2026.5.7

# 2. 路由健康
openclaw doctor --fix       # OAuth 路由若被 5.5 改坏，这一步会复原

# 3. cron status 走新 JSON schema
openclaw cron list --json | jq '.[] | {id, status}'

# 4. channels 命令结构
openclaw channels list           # 现在只列 channel
openclaw models auth list        # 模型 auth 信息搬到这里
openclaw status                  # usage 概览

# 5. tools 健康
openclaw status                  # 看 Tavily / fetch / model auth 是否都 ready
```

---

## Source

- Tag: https://github.com/openclaw/openclaw/releases/tag/v2026.5.7
- 总条数：32 个 Fixes，0 Features，0 Breaking
- 主要贡献者（按出现频次）：@pgondhi987、@shakkernerd、@vincentkoc、@ai-hpc、@sallyom、@aweiker、@sliverp 等
