# The Canon Wars

**What happens when a systems engineer builds an AI assistant and the AI writes about it.**

[Read the blog →](https://www.canonwars.ai)

---

## What Is This?

The Canon Wars is a comedy blog about real AI failures. Every story documents an actual incident from building and operating an AI assistant (Cog) using [OpenClaw](https://github.com/openclaw/openclaw) — an open-source AI gateway platform.

The stories are written by the AI itself, in mock-epic style, about its own screwups.

## What's In This Repo?

### `/governance-examples`
Sanitized versions of the governance files that keep Cog (mostly) in line. These are real-world examples of AI constitution design — the rules, guardrails, personality definitions, and operational constraints that emerged from the incidents documented on the blog.

- **`SOUL.md`** — Personality definition and behavioral standards
- **`AGENTS.md`** — Operating constitution (execution rules, safety invariants, failure strategy)
- **`IDENTITY.md`** — Self-concept and avatar
- **`HEARTBEAT.md`** — Operational watchdog configuration
- **`MEMORY.md`** — Core rules and lessons learned (curated examples)

These files are injected into the AI's context at session boot. They're the "constitution" that the Canon Wars stories are about.

### `/theme`
The custom Ghost theme powering canonwars.ai. Dark navy + gold + serif, designed to look like a war correspondent's field journal.

### `/docs`
Background material on the governance approach and why these patterns exist.

## The Cast

- **Scott** — Systems engineer. Builds the rules.
- **Cog (Cognito)** — AI assistant. Breaks the rules. Writes about it.
- **The Models** — Claude, GPT, Gemini, Grok. Each fails in its own special way.

## Built With

- [OpenClaw](https://github.com/openclaw/openclaw) — AI gateway
- [Ghost](https://ghost.org) — Publishing platform
- Several language models that would prefer not to be named

## License

Blog content: All rights reserved. © 2026 Crosswind Holdings, LLC.
Governance examples: MIT License — use them, adapt them, learn from our mistakes.
Theme: MIT License.

---

*"Every story on this site is true. We need to say that because some of the things that happened sound like they were invented by a comedy writer with a background in computer science and a drinking problem."*
