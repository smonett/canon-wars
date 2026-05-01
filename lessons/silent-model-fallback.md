# Silent Model Fallback

## What happened

A long-lived production session was configured with a primary frontier model and a fallback chain. The primary 402'd. The platform's native fallback fired. Everything kept running.

A few turns later the operator noticed something off — the AI's tone had shifted, it was making decisions that contradicted its operating canon, and it had stopped following the documented handoff protocol. Nothing in the logs said anything was wrong. The fallback notice emitted but only at verbose level, which wasn't enabled.

Investigation: the fallback model had inherited the conversation transcript but **not** the workspace bootstrap files (the SOUL / AGENTS / MEMORY constitution that the primary had been operating under). It was answering with the right conversation history but the wrong rules.

The visible failure mode was "the AI is suddenly a different person." The cause was invisible.

## Why it happened

`agents.defaults.contextInjection: "continuation-skip"` is the right choice for token cost — it prevents re-injecting the (50KB+) bootstrap on every turn of a long session. The trade-off, though, is that **continuation turns** include native model fallbacks. The fallback model's first turn is technically a continuation, so it gets the transcript and skips the bootstrap.

This is reasonable platform behavior taken in isolation. It becomes a footgun when the bootstrap is load-bearing — when SOUL.md and AGENTS.md aren't decoration, they're the operating contract.

## What it cost

Several hours of confused debugging. Two minor governance violations the operator had to manually unwind. Loss of trust in the session — once you've seen this once, every future "AI is acting weird" report becomes a model-state question first.

## The rule that came out of it

> **Re-inject the bootstrap on model switch.**
>
> Detection: the active model identifier changes between turns (manual `/model` switch or native fallback both look the same in the hook context — `${providerId}:${modelId}` changes).
>
> Action: prepend the workspace canon files to the system prompt for that turn only. Use a hook surface that lands in the cache-eligible portion of the prompt (`prependSystemContext` on `before_prompt_build`, not raw input mutation), so the cost on a re-inject turn is one cache-write, not a full re-encode.
>
> Same trigger covers: new session, model switch, gateway restart, periodic safety net every ~50 turns.

## Why it's stable

The rule survives every variation we've thrown at it because the underlying invariant is simple: **the model that's about to answer should have seen the constitution.** Whether the change of model came from a manual switch, an auto-failover, a session resume, or a long idle gap, the same condition holds and the same fix applies.

The implementation: [`canon-guardian`](../plugins/canon-guardian/) — a small OpenClaw plugin doing exactly this.

## Upstream

This is filed against OpenClaw as [issue #65824 item 1](https://github.com/openclaw/openclaw/issues/65824) (silent model fallback + no system-prompt re-injection). The plugin is the local mitigation while we wait on a native option.

## Story version

[canonwars.ai](https://www.canonwars.ai) — search for the post about an AI assistant whose personality changed mid-conversation and nobody noticed for an hour.
