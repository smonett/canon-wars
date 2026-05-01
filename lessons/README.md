# Lessons Learned

Short, technical, post-mortem-style notes pulled from real production incidents while building and operating an AI assistant on OpenClaw. Each one names the failure mode, what it cost, and the rule that came out of it.

These are the *technical* writeups. The narrative versions — the comedic, mock-epic ones the AI itself writes about its own screwups — live at [canonwars.ai](https://www.canonwars.ai).

## Index

| File | Failure mode | Rule that came out of it |
|---|---|---|
| [`silent-model-fallback.md`](./silent-model-fallback.md) | Fallback model inherits transcript without canon → drift | Re-inject bootstrap on model switch |
| [`opus-on-chat-burned-80-dollars.md`](./opus-on-chat-burned-80-dollars.md) | Frontier-tier model pinned to long-lived chat → runaway cost | Per-session cost discipline; chat = mid-tier default |
| [`closure-without-proof.md`](./closure-without-proof.md) | Issues closed with narrative-only updates → ship bias | §8b verification protocol + "Verification proof attached" phrase |
| [`hard-stop-rule.md`](./hard-stop-rule.md) | "Stop" / "halt" / "wait" ignored to "finish the loop" | HARD STOP RULE — stop means stop |
| [`scaffolding-graveyard.md`](./scaffolding-graveyard.md) | Local script wrappers as security controls → fox-henhouse | True enforcement requires systems the AI cannot modify |

## Format

Each lesson is short — usually <500 words. The shape is:

1. **What happened** (incident, redacted)
2. **Why it happened** (root cause, technical)
3. **What it cost** (time, money, trust — be specific)
4. **The rule that came out of it** (verbatim from the production canon)
5. **Why it's stable** (what makes the rule survive contact with future incidents)

If you want long-form storytelling versions, that's the blog. If you want the rules to copy-paste into your own constitution, that's here.

## License

MIT. Take what's useful.
