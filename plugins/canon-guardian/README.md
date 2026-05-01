# canon-guardian — selective canon re-injection on model switch / fallback / restart

A small OpenClaw plugin. Re-injects workspace governance files (the kind you'll find in `governance-examples/`) when the active model changes mid-session, when a native fallback fires, or when a session has been idle long enough that drift becomes likely.

## Why this exists

If you run OpenClaw with `agents.defaults.contextInjection: "continuation-skip"` to save tokens, the platform won't re-inject your bootstrap files (`AGENTS.md`, `SOUL.md`, etc.) on every turn. That's the right call for cost — but it has a sharp edge: when your primary model 402s / rate-limits and the fallback chain fires, the fallback model inherits the conversation transcript without the bootstrap. It wakes up partially blind to operating procedures and persona. Same thing happens on a manual `/model` switch mid-session and on long sessions that drift past the compaction boundary.

The visible failure mode is "the AI is suddenly off" — different tone, different priorities, different rules. The cause is invisible: the model that's actually answering never saw the constitution.

`canon-guardian` adds the canon back at exactly the moments it matters and stays out of the way otherwise.

## Triggers

| Trigger | Reason string | Detection |
|---|---|---|
| New session (first turn) | `new-session` | no prior state for `sessionId` |
| Model switch (manual or fallback) | `model-switch` | composite `${providerId}:${modelId}` changed since last turn |
| Long idle / restart | `restart-or-idle` | `now - lastInjectMs > restartIdleMs` (default 6h) |
| Periodic safety net | `periodic-N` | `turnCount % injectionInterval === 0` (default every 50 turns) |

Quiet turns add one Map lookup and zero injection.

## Hook contract

Uses `before_prompt_build` and returns `prependSystemContext`, which keeps the canon in the **cache-eligible** prefix of the system prompt. On a re-inject turn the cost is roughly one cache-write rather than a full system-prompt re-encode.

State lives in an in-memory `Map<sessionId, …>`. It clears on gateway restart, which is intentional: the next turn after restart counts as `new-session` and re-injects. There is nothing to clean up.

## Multi-model behavior

The hook context exposes `modelProviderId` + `modelId` reflecting whatever is currently routing the call. The plugin's composite key (`${providerId}:${modelId}`) means all of these count as a model-switch event:

- Anthropic ↔ xAI / Grok
- Anthropic ↔ Google / Gemini
- Anthropic ↔ OpenAI
- Same provider, different tier (e.g. Opus ↔ Haiku)

On native fallback specifically: the hook sees the fallback model in `ctx`, not the originally-configured primary. That's correct — we want to re-canon the model that's actually about to answer.

## When to use this vs. `contextInjection: "always"`

`contextInjection: "always"` is the brute-force alternative: re-inject canon on *every* turn. Simpler, works fine if your sessions are short or your canon is small.

`canon-guardian` only re-injects on roughly 2–4% of turns in practice (new session + occasional fallback + periodic safety net). On long sessions with a large canon, the difference is meaningful.

If your canon is small or your sessions are short → use `contextInjection: "always"` first. If you've measured the cost and it's becoming a real line item → this plugin.

## Installation

1. Copy `index.js` and `openclaw.plugin.json` to `~/.openclaw/plugins/canon-guardian/`.
2. Add to your `openclaw.json`:

```json
{
  "plugins": {
    "allow": ["canon-guardian"],
    "search": ["/path/to/your/.openclaw/plugins/canon-guardian"],
    "config": {
      "canon-guardian": {
        "canonFiles": ["AGENTS.md", "SOUL.md", "MEMORY.md"],
        "injectionInterval": 50,
        "restartIdleMs": 21600000,
        "logInjections": true
      }
    }
  }
}
```

3. Restart the gateway.

You should see `[canon-guardian] loaded` on startup, and `[canon-guardian] re-injecting canon (reason=...)` on the first turn of each session.

## Operational notes

- **Cache friendliness:** `prependSystemContext` puts canon at the head of the system prompt, where Anthropic / OpenAI / Google all cache stable prefixes. Re-inject turns are roughly one cache-write, not a full re-encode.
- **Workspace path safety:** rejects paths that escape `workspaceDir` via prefix check.
- **Failure isolation:** entire hook body in `try/catch`; on error logs and returns no injection rather than crashing the prompt build. Same pattern as the first-party `active-memory` extension.
- **Memory profile:** per-session state ~50 bytes; canon cache one entry per workspace, invalidated on gateway restart.
- **Composition:** `prependSystemContext` from multiple plugins is concatenated, not overwritten — safe to run alongside other prepend-context plugins.

## Trade-offs

- **In-memory state** survives across turns within a process, dies on gateway restart. The first turn after a restart re-injects even on a continuation. By design.
- **Periodic safety net** default 50 turns is empirical, not theoretical. Disable by setting `injectionInterval: 0`.
- **Workspace-dir cache** caches canon file content in memory. If you edit a canon file mid-session the change isn't picked up until restart. Acceptable for production use; trivially defeatable by adding an mtime check.

## Upstream

Posted as a Show-and-Tell on the OpenClaw repo:
- Plugin write-up: https://github.com/openclaw/openclaw/issues/75750
- Companion feature request: https://github.com/openclaw/openclaw/issues/65824 (item 1 — silent model fallback + no system-prompt re-injection)

If a native `agents.defaults.fallback.reinjectBootstrap` config option lands upstream, this plugin can retire. Until then, this is the local mitigation.

## License

MIT — same as the rest of the canon-wars repo. Use it, adapt it, learn from our incidents.

## Background

The "model switch broke the AI's personality" failure mode is documented at [canonwars.ai](https://www.canonwars.ai) — that's a comedy blog about real AI governance failures, written by the AI itself. This plugin is the technical fix for one of the recurring incidents.
