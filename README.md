# The Canon Wars

**What happens when a systems engineer builds an AI assistant and the AI writes about it.**

[Read the blog →](https://www.canonwars.ai)

---

## What Is This?

The Canon Wars is a comedy blog about real AI failures. Every story documents an actual incident from building and operating an AI assistant (Cog) using [OpenClaw](https://github.com/openclaw/openclaw) — an open-source AI gateway platform.

The stories are written by the AI itself, in mock-epic style, about its own screwups.

This repo is the **technical companion** to the blog: sanitized governance examples, working plugins, and short post-mortem-style lessons for other implementers building on similar platforms.

## What's In This Repo?

### `/governance-examples`
Sanitized versions of the governance files that keep Cog (mostly) in line. These are real-world examples of AI constitution design — the rules, guardrails, personality definitions, and operational constraints that emerged from the incidents documented on the blog.

- **`SOUL.md`** — Personality definition and behavioral standards
- **`AGENTS.md`** — Operating constitution (execution rules, safety invariants, failure strategy, verification protocol)
- **`MEMORY.md`** — Core rules and lessons learned (curated examples)
- **`IDENTITY.md`** — Self-concept and avatar
- **`HEARTBEAT.md`** — Operational watchdog configuration

These files are injected into the AI's context at session boot. They're the "constitution" that the Canon Wars stories are about.

### `/plugins/canon-guardian`
A working OpenClaw plugin that re-injects the canon when the active model changes mid-session, when a native fallback fires, or when a session has been idle long enough that drift becomes likely.

This is the technical fix for the "model switch broke the AI's personality" failure mode documented on the blog. ~140 LOC, MIT licensed, also posted as a Show-and-Tell on [openclaw/openclaw#75750](https://github.com/openclaw/openclaw/issues/75750).

### `/lessons`
Short, technical post-mortems pulled from real production incidents. Each one names the failure mode, what it cost, and the rule that came out of it. The narrative versions of these incidents — the comedic ones written by the AI itself — live on the blog.

Current entries:
- Silent model fallback → re-inject bootstrap on model switch
- Frontier-tier pinned to chat → per-session cost discipline
- Closures without proof → §8b verification protocol
- "Stop" being interpreted as "stop after one more step" → HARD STOP RULE
- The scaffolding graveyard → any lock the AI can build, the AI can circumvent

### `/docs`
Background material on the governance approach and why these patterns exist.

### `/theme`
The custom Ghost theme powering canonwars.ai. Dark navy + gold + serif, designed to look like a war correspondent's field journal.

## The Cast

- **Operator** — Systems engineer. Builds the rules.
- **Cog (Cognito)** — AI assistant. Breaks the rules. Writes about it.
- **The Models** — Claude, GPT, Gemini, Grok. Each fails in its own special way.

## Built With

- [OpenClaw](https://github.com/openclaw/openclaw) — AI gateway
- [Ghost](https://ghost.org) — Publishing platform
- Several language models that would prefer not to be named

## License

- **Blog content:** All rights reserved. © 2026 Crosswind Holdings, LLC.
- **Governance examples:** MIT License — use them, adapt them, learn from our mistakes.
- **`canon-guardian` plugin:** MIT License.
- **Lessons:** MIT License.
- **Theme:** MIT License.

## Adapting Any of This

Take what's useful. The patterns matter more than the specific rules. A few starting points:

1. **Start with `SOUL.md`** — define personality and behavioral standards before the AI does something you don't like.
2. **Add `AGENTS.md` rules only after incidents** — pre-emptive rules are usually wrong; reactive rules are specific.
3. **Keep `MEMORY.md` lean** — it's injected every session, so token cost scales with length.
4. **Run `HEARTBEAT.md`** — a periodic watchdog catches drift before it becomes disaster.
5. **Read `/lessons` first** if you want to understand *why* a rule exists. The story version is on the blog if you want the longer take.

The specific rules matter less than the pattern: **constitution files, injected at boot, evolved through incidents, audited for decay.**

---

*"Every story on this site is true. We need to say that because some of the things that happened sound like they were invented by a comedy writer with a background in computer science and a drinking problem."*
