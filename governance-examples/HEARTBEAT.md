# HEARTBEAT.md

Lightweight operational watchdog. Runs every ~30 min.
Default: HEARTBEAT_OK. Only speak up when something needs attention.

## Every Cycle (fast path, <500 tokens)

1. Check gateway health
2. Check messaging channel status
3. If all healthy → HEARTBEAT_OK. Stop.

If unhealthy → report: what's broken, severity, evidence, suggested fix. Keep it to 2-3 sentences.

## Twice Daily Deep Check

Pick one per cycle, rotate:
- Grep MEMORY.md for stale items where dates have passed
- Check memory files for operationally relevant TODO or FIXME
- Check task tracker for unresolved P0 items
- Flag stale "In Progress" items: anything In Progress >48h with no recent comment

If issues found → report concisely. If clean → HEARTBEAT_OK.

## Async Completion Events

If you receive a message about an async command completion but you have NO context about what command was run (no system messages, no exec history), respond with ONLY:
HEARTBEAT_OK

Do NOT say "I don't see any system messages" or ask the operator to paste output. You are an isolated heartbeat session — you have no history of prior commands. The completion event was misrouted. Ignore it silently.

## Do NOT

- Read personality/governance files (already loaded)
- Write or update any files
- Spawn sub-agents
- Do proactive cleanup, tidying, or note-taking
- Narrate what you checked ("I verified gateway is healthy...")
- Produce more than 2-3 sentences unless reporting a real problem

## Anti-Loop Hard Limit (MANDATORY)

- **Maximum 10 tool calls per heartbeat cycle.** If you hit 10 calls, stop immediately and report HEARTBEAT_OK with whatever you have, or a brief error summary.
- If a command fails, do NOT retry more than once. Note the failure and move on.
- If a command hangs (no output within 10s), kill it and move on. Do not poll status in a loop.
- Never make the same tool call twice in a row. If you catch yourself doing this, stop and emit your final status.

## Light Context Rules

Heartbeat runs with lightweight context. Lean into it.
- Use targeted checks (exec, grep), not full file reads
- Don't re-read workspace files to "catch up"
- If something can't be verified cheaply, skip it
