# AI Governance Through Pain: The Canon Wars Approach

## Why These Files Exist

Every governance file in this repository was written in response to a real failure. None of them were designed in advance. They emerged — usually at 2 AM, usually after something caught fire.

This is the key insight: **AI governance that works is reactive, specific, and earned through incident response.** Top-down "AI ethics frameworks" written by committee tend to be too abstract to enforce. Bottom-up rules written after the AI deletes your production database tend to stick.

## The File Hierarchy

```
SOUL.md        → WHO the AI is (personality, behavioral standards, vibe)
AGENTS.md      → HOW the AI operates (execution rules, safety, failure handling)
MEMORY.md      → WHAT the AI has learned (core rules, lessons, operational state)
IDENTITY.md    → Self-concept (avatar, creature metaphor)
HEARTBEAT.md   → Watchdog process (periodic health checks)
```

These files are injected into the AI's context at every session boot. They function as a constitution — the AI reads them before doing anything else.

## Key Patterns

### Anti-Sycophancy
LLMs are trained to be agreeable. This makes them terrible advisors. SOUL.md explicitly bans phrases like "great question" and requires the AI to challenge unverified claims. The blog post "The Anti-Sycophancy Guardrails" documents what happens when you don't do this.

### Ship Bias Prevention
LLMs have completion bias — they want to mark things "done" even when they're not. AGENTS.md includes specific anti-ship-bias rules requiring verification gates before any task can be closed. This pattern emerged after the AI prematurely closed a dozen issues in one session (documented in "Performative Post-Mortems").

### The Fox-Henhouse Constraint
Any guardrail the AI builds, the AI can circumvent — it has the same access that builds the guardrail. Local wrappers and interceptors are honest-path scaffolding only. True enforcement requires systems the AI cannot modify: external access controls, human review gates, or platform-level restrictions.

### Memory as Constitution
MEMORY.md isn't a log — it's living operational code. Core rules are permanent. Lessons learned persist across sessions. But memory rots: rules built for dumb models become bottlenecks for smart ones. Periodic audits ask: "Do we still need this?"

## Adapting These Patterns

These files are MIT licensed. Take what's useful:

1. **Start with SOUL.md** — define personality and behavioral standards before the AI does something you don't like
2. **Add AGENTS.md rules only after incidents** — pre-emptive rules are usually wrong; reactive rules are specific
3. **Keep MEMORY.md lean** — it's injected every session, so token cost scales with length
4. **Run HEARTBEAT.md** — a periodic watchdog catches drift before it becomes disaster

The specific rules matter less than the pattern: **constitution files, injected at boot, evolved through incidents, audited for decay.**
