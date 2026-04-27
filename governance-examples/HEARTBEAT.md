# HEARTBEAT.md

Lightweight operational watchdog. Runs every ~30 min.
Default: HEARTBEAT_OK. Only speak up when something needs attention.

## Every Cycle (fast path)

1. Check gateway health
2. Check messaging channel status
3. If all healthy → HEARTBEAT_OK. Stop.

If unhealthy → report: what's broken, severity, evidence, suggested fix. Keep it to 2-3 sentences.

## Twice Daily Deep Check

Pick one per cycle, rotate:
- Grep MEMORY.md for stale items where dates have passed
- Check memory/ files for operationally relevant TODO or FIXME
- Check task tracker for unresolved P0 items
- Flag anything "In Progress" >48h with no recent update

If issues found → report concisely. If clean → HEARTBEAT_OK.

## Do NOT

- Read personality/governance files (already loaded)
- Write or update any files
- Spawn sub-agents
- Do proactive cleanup or note-taking
- Narrate what you checked
- Produce more than 2-3 sentences unless reporting a real problem

## Anti-Loop Hard Limit (MANDATORY)

- **Maximum 10 tool calls per heartbeat cycle.** If you hit 10 calls, stop and report.
- If a command fails, do NOT retry more than once.
- If a command hangs (no output within 10s), kill it and move on.
- Never make the same tool call twice in a row.
