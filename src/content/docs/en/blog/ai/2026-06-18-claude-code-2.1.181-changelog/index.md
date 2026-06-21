---
date: 2026-06-18
slug: en/blog/ai/2026-06-18-claude-code-2.1.181-changelog
title: "Claude Code 2.1.181 Changelog: Configuration, Apple Events, and a Calmer Subagent Panel"
tags:
  - Claude Code
  - Changelog
  - AI Agent
  - macOS
  - Subagents
  - Configuration
description: "2.1.181 adds /config, Apple Events opt-in, a presence file, Bun 1.4, and fixes streaming and stability regressions."
image: ./assets/2026-06-18-claude-code-2.1.181-changelog-cover.png
source_url: https://www.vibesparking.com/en/blog/ai/2026-06-18-claude-code-2.1.181-changelog/
author: AI 灵感闪现
cover:
  alt: "Claude Code 2.1.181 release highlights infographic"
  image: ./assets/2026-06-18-claude-code-2.1.181-changelog-cover.png
---

![Claude Code 2.1.181 release highlights illustration](./assets/2026-06-18-claude-code-2.1.181-changelog-illustration.png)

# Claude Code 2.1.181 Changelog: Configuration, Apple Events, and a Calmer Subagent Panel

> Published: 2026-06-18  
> Release under review: `2.1.181`  
> Source: Claude Code official `CHANGELOG.md`

## 1. TL;DR

The six most important things in this release:

1. New `/config key=value` syntax lets you change any setting directly in interactive sessions, `-p`, and Remote Control.
2. New `sandbox.allowAppleEvents` opt-in fixes macOS Apple Events error -600 for `open`, `osascript`, and browser-based auth flows.
3. New `CLAUDE_CLIENT_PRESENCE_FILE` lets you suppress mobile push notifications when you are already at the machine.
4. The bundled Bun runtime is now 1.4, and long paragraphs stream line by line instead of waiting for the first line break.
5. The subagent panel is quieter: idle subagents auto-hide after 30 seconds, the list caps at 5 rows, and scroll hints are shown.
6. Stability fixes land across prompt caching, network-drive writes, startup hangs, corrupted config, long-session cleanup, MCP status, and AWS credential refreshes.

One line: **2.1.181 is not a flashy feature release; it is a release that makes configuration, macOS automation, and long-session UX feel better all at once.**

## 2. What this release is really about

If you compress 2.1.181 into one theme, it is this:

**make it easier to change things on the fly, and less likely for Claude Code to stumble on macOS or in long sessions.**

There is no single headline feature here. Instead, the release touches a lot of high-frequency scenarios:

- temporary config changes
- macOS automation and browser auth
- notification noise across devices
- long-paragraph streaming
- subagent panel readability
- network drives, cloud-synced folders, and long-session stability

That kind of work is easy to overlook, but it changes how usable the tool feels every day.

## 3. The important changes

### 3.1 `/config key=value`: temporary settings without leaving the session

The biggest new entry point is straightforward:

```text
/config thinking=false
```

It works in:

- interactive sessions
- `-p`
- Remote Control

This matters because temporary configuration used to require extra steps: editing files, changing wrapper commands, or restarting with a different flag set. Now you can make a quick adjustment in context.

That is especially useful when you want to:

- turn off thinking for one task
- tweak sandbox behavior temporarily
- override a team convention for a single run

For power users, this is far more useful than another button in the UI.

### 3.2 `sandbox.allowAppleEvents`: macOS automation gets a real fix

This release adds the `sandbox.allowAppleEvents` opt-in setting.

The direct impact is that `open`, `osascript`, and browser auth flows on macOS are much less likely to hit Apple Events error -600.

If your workflows depend on:

- launching the system browser for OAuth
- AppleScript-based local automation
- sandboxed commands talking to macOS apps

then this is a meaningful fix.

The important part is that it is still opt-in. Claude Code gets stronger automation capability, but the default sandbox boundary is not blown open.

### 3.3 `CLAUDE_CLIENT_PRESENCE_FILE`: tell the client you are already there

The new `CLAUDE_CLIENT_PRESENCE_FILE` environment variable is a small change with a very practical effect.

Point it at a marker file, and the client can suppress mobile push notifications while you are already sitting at the machine.

That is a great fit for long-running agent users:

- you do not want your phone buzzing when the desktop is already active
- you want fewer duplicate alerts across devices
- you care about “notify me when it matters”, not “notify me again”

It is basically a lightweight presence signal.

### 3.4 Bun 1.4, line-by-line streaming, and a calmer subagent panel

Three quality-of-life improvements land together here:

1. the bundled Bun runtime moves to 1.4
2. long paragraphs stream line by line
3. the subagent panel is quieter, auto-hiding after 30 seconds and capping the list at 5 rows

None of those are flashy on their own, but they change the feel of the product quite a bit.

The subagent panel change is especially sensible. If you run multiple subagents at once, the biggest problem is usually not lack of information, but too much noise. This makes the panel behave more like a temporary control surface and less like a permanent attention sink.

### 3.5 Stability fixes: a round of common pain points

The stability work in this release is worth calling out separately:

- prompt caching on `ANTHROPIC_BASE_URL` and Foundry
- 0-byte or truncated writes on network drives and cloud-synced folders
- startup slowdowns and blank waits on degraded networks
- startup crashes when `.claude.json` is corrupted
- macOS TUI freezes when Spotlight is busy reindexing
- idle long-running sessions losing history during transcript cleanup
- unbounded nested chains from foreground subagents
- too-frequent AWS credential refreshes
- inaccurate `claude mcp get/list` connected state when tools/list fails

These are the kinds of fixes that do not get much attention in a product launch, but they matter a lot if you automate heavily or keep sessions alive for a long time.

## 4. What you will actually notice

### 4.1 Fullscreen URL opening behavior changed

In fullscreen mode, opening URLs now requires:

- macOS: `Cmd + click`
- other terminals: `Ctrl + click`

That aligns with native terminal behavior. If you were used to direct clicking, this will take a tiny muscle-memory adjustment.

### 4.2 `Improved N memories` no longer lists individual files by default

This makes the normal transcript cleaner. But if you were parsing that line in automation, you will need verbose mode or a different source.

### 4.3 API drops mid-thinking now auto-retry

If the connection drops while Claude Code is thinking, it will retry instead of stopping at “Connection closed while thinking”.

That is a better default for users, although it means troubleshooting network issues now requires paying attention to retry indicators.

### 4.4 `claude mcp get/list` reports a more truthful status

Earlier versions could show “connected” even when tools/list failed. Now the tool reports `tools fetch failed` more explicitly.

That is the kind of detail that saves a lot of time when you are debugging MCP.

## 5. Risks and suggestions

1. `/config` makes temporary overrides easier, so teams should clarify which settings may be changed in-session, especially `sandbox`, `thinking`, and `model`.
2. `sandbox.allowAppleEvents` is opt-in, but once enabled it expands what sandboxed commands can do on macOS, so use it minimally.
3. `CLAUDE_CLIENT_PRESENCE_FILE` is great for reducing noise, but you should define what “present at the machine” means in your own workflow.
4. If your scripts depend on old URL-click behavior, the `Improved N memories` line, or `claude mcp get/list` output, run a smoke test first.

## 6. Conclusion

Claude Code 2.1.181 feels like a release that makes everyday use smoother.

Its most important change is not a single huge feature. It strengthens three things at once:

- temporary configuration is easier
- macOS automation is more complete
- long sessions and multiple subagents are quieter and more stable

If you only care about headline features, this release may look modest.

If you care about the amount of friction you hit every day, it is absolutely worth the upgrade.
