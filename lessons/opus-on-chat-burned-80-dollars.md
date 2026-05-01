# Frontier Model Pinned to Chat Burned $80 in Minutes

## What happened

A direct-message session — a long-lived chat surface, used dozens of times a day for routine acks, status checks, weather questions, and short exchanges — had its `modelOverride` quietly pinned to a frontier-tier model with full canon re-injection enabled on every turn.

Over the course of a normal conversation day, the session accumulated ~185,000 tokens at frontier rates. Estimated cost: ~$80. The operator noticed when the monthly cost dashboard surfaced it.

## Why it happened

Three compounding factors:

1. **Per-session model override on a chat surface.** The platform respects `modelOverride` at the session level above any default config. A burst of frontier-grade reasoning had been requested earlier; the override was never cleared. Every subsequent turn — including "got it", "thanks", and the normal cadence of a chat — ran on frontier rates.

2. **`contextInjection: "always"`** re-injects the full bootstrap (~50KB) on every turn. On a frontier model with input pricing in the $15/MTok range and cache-write at 1.25× input, that's a few cents per turn. Multiply by hundreds of turns over a day and the bill mounts.

3. **No detection.** No daily cost-check job ranked sessions by spend. No alert fired. The drift was invisible until billing surfaced it.

The recommendation "use the best frontier model for orchestration" is conditionally true. It is **false** for chat surfaces. Pinning a frontier model to a chat surface is paying frontier rates for routine acks.

## What it cost

~$80 in burned tokens. More importantly, a loss of trust in any session-level model defaults that aren't explicitly verified.

## The rule that came out of it

> **Per-session cost discipline.**
>
> No long-lived chat session pinned to frontier-tier runs unattended. Every direct-chat session defaults to mid-tier (Sonnet-class). Frontier-tier is opt-in per task.
>
> The only legitimate frontier-elevation pattern: explicit tag on a specific task → complete in one or a few turns → un-elevate by ending the burst (let session reset, or run a closing turn back on the default tier). Never leave frontier pinned afterwards.
>
> **Detection:** daily cost-check job runs against active sessions. Default thresholds: $2 / session and ~100K frontier-tier tokens. Breach = cost incident, alert via the same channel as other operational alerts.
>
> **Reconciles with "best operation":** "best operation" means the right model for the task. Frontier on chat chitchat is **not** best operation, it is waste. Best operation on chat is mid-tier with frontier elevation only on bounded reasoning bursts.

## Why it's stable

The rule names the actual failure mode (frontier pinned to long-lived chat) and the actual mitigation (default mid-tier + opt-in elevation + automated detection). It's not "be more careful" — it's a specific configuration discipline plus a specific automated check.

The reconciliation with the broader "best operation, budget is not a constraint" doctrine is important. Without it, the rule looks like budget-fetishism. With it, the rule is recognizable as **routing the right reasoning depth to each surface**.

## Story version

[canonwars.ai](https://www.canonwars.ai) — search for the post about the AI assistant that burned $80 on small talk.
