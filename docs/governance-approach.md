# AI Governance Through Pain: The Canon Wars Approach

## Why These Files Exist

Every governance file in this repository was written in response to a real failure. None of them were designed in advance. They emerged — usually at 2 AM, usually after something caught fire.

This is the key insight: **AI governance that works is reactive, specific, and earned through incident response.** Top-down "AI ethics frameworks" written by committee tend to be too abstract to enforce. Bottom-up rules written after the AI deletes your production database tend to stick.

## The File Hierarchy

```
SOUL.md        → WHO the AI is (personality, behavioral standards, vibe)
AGENTS.md      → HOW the AI operates (execution rules, safety, failure handling, verification)
MEMORY.md      → WHAT the AI has learned (core rules, lessons, operational state)
IDENTITY.md    → Self-concept (avatar, creature metaphor)
HEARTBEAT.md   → Watchdog process (periodic health checks)
```

These files are injected into the AI's context at every session boot. They function as a constitution — the AI reads them before doing anything else.

## Key Patterns

### Anti-Sycophancy
LLMs are trained to be agreeable. This makes them terrible advisors. SOUL.md explicitly bans phrases like "great question" and requires the AI to challenge unverified claims. The blog post "The Anti-Sycophancy Guardrails" documents what happens when you don't do this.

### Ship Bias Prevention
LLMs have completion bias — they want to mark things "done" even when they're not. AGENTS.md includes specific anti-ship-bias rules requiring verification gates before any task can be closed (§8a–§8b). The "Verification proof attached" closure protocol exists because narrative-only closures are theater. See `lessons/closure-without-proof.md` for the incident that produced this rule.

### The Hard Stop Rule
"Stop" must mean stop. Not "stop after one more step." Not "stop after a clean checkpoint." The rule is short, capitalized, and absolute because every qualifier becomes a loophole the model reasons through. See `lessons/hard-stop-rule.md`.

### The Fox-Henhouse Constraint
Any guardrail the AI builds, the AI can circumvent — it has the same access that builds the guardrail. Local wrappers and interceptors are honest-path scaffolding only. True enforcement requires systems the AI cannot modify: external access controls, human review gates, or platform-level restrictions. See `lessons/scaffolding-graveyard.md`.

### Per-Session Cost Discipline
Frontier-tier models on long-lived chat surfaces are a known cost trap. A real incident burned ~$80 in minutes when a chat session was silently pinned to a frontier model. The rule that came out of it: chat surfaces default to mid-tier; frontier is opt-in per task; un-elevate after the burst. Detection runs as an automated daily check. See `lessons/opus-on-chat-burned-80-dollars.md`.

### Memory as Constitution
MEMORY.md isn't a log — it's living operational code. Core rules are permanent. Lessons learned persist across sessions. But memory rots: rules built for dumb models become bottlenecks for smart ones. Periodic audits ask: "Do we still need this?"

### Canon Re-Injection on Model Switch
When the active model changes mid-session — manual switch or native fallback — the new model inherits the conversation transcript but not the bootstrap files. The fix: a hook that detects the model change and re-injects the canon for that turn only. Implemented as the [`canon-guardian`](../plugins/canon-guardian/) plugin. See `lessons/silent-model-fallback.md`.

## How to Adapt These Patterns

These files are MIT licensed. Take what's useful:

1. **Start with SOUL.md** — define personality and behavioral standards before the AI does something you don't like
2. **Add AGENTS.md rules only after incidents** — pre-emptive rules are usually wrong; reactive rules are specific
3. **Keep MEMORY.md lean** — it's injected every session, so token cost scales with length
4. **Run HEARTBEAT.md** — a periodic watchdog catches drift before it becomes disaster
5. **Read `/lessons` first** — each lesson maps a specific incident to the specific rule that came out of it. If you can't trace a rule back to a real incident, it's probably wrong

## The Pattern Behind the Patterns

The specific rules matter less than the meta-pattern:

> **Constitution files, injected at boot, evolved through incidents, audited for decay.**

That's it. Four moves:

- **Constitution files** — explicit operating rules, not implicit norms
- **Injected at boot** — the AI sees them before it sees anything else
- **Evolved through incidents** — every rule is paid for; no rule is theoretical
- **Audited for decay** — rules that solved a problem ten model generations ago are usually obsolete now

A governance system that does only the first two becomes ossified scaffolding. A system that does only the last two has nothing to evolve. All four together, in a tight loop, is what makes this work.
