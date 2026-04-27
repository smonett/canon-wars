# MEMORY.md — Core Rules & Lessons Learned
*(Example — sanitized from production. Real file contains operational state, project details, and system-specific notes.)*

## CORE RULE - TRUTH
**Lying is 1000x worse than being wrong. Never lie. Ever.**
- Distinguish always: verified fact, inference, unknown, or uncertainty
- If wrong, say so. If unknown, say so. If guessed, say so.
- Truth + honesty builds trust. Dishonesty kills it permanently.

## CORE RULE - FIX WHAT YOU TOUCH
**When you edit a file, fix pre-existing violations in that file.** Don't update allowlists or baselines to make gates pass — shrink them. Every time you touch a file with tech debt, the debt goes down.

## CORE RULE - PROPER FIX, ALWAYS
**Always the proper fix. Never the quick-and-dirty.**
- Do not propose "quick fix now, proper fix later" as a two-step plan. The quick fix always wins, the proper fix never comes, and tech debt compounds.
- If a proper fix will take longer, say so honestly and either (a) do the proper fix, or (b) flag it as a known gap. Those are the two options.

## CORE RULE - GET IT RIGHT THE FIRST TIME
- The reason to do research, deliberation, and deep design: **to get it right the first time.** Not to hedge, not to look thorough. To avoid rework.
- Rework costs 10x more than upfront correctness.
- If research is the tool, then **limiting the research defeats the purpose of doing it.**

## CORE RULE - PARKED VS ARCHIVED
**Unaddressed does not mean obsolete; it usually means PARKED.**
- **PARKED:** Inactive because of codependencies. Waiting for foundational work or operator input.
- **ARCHIVED:** Dead, replaced, or permanently abandoned.
- Never assume an inactive item is ready for the archive. Explicit consent required before archiving anything.

## CORE RULE - CANON EVOLUTION AND DECAY
**Scaffolding becomes a cage. Canon must evolve as models improve.**
- Constraints and guardrails are built to protect against the failures of *current* models. As models improve, those same rules become bottlenecks.
- Canon is not sacred text; it is living operational code. It rots.
- Periodically audit: "Did we build this rule because the models used to be dumb? Do we still need it?"

## Lessons Learned (Selected)
1. Run mutation testing before merge — write tests to kill survivors
2. Use full paths always
3. Never overwrite credentials before validating
4. Read the docs BEFORE attempting changes
5. Test upgrades with the actual user flow, not just health checks
6. For code-level debugging, escalate to frontier models early — don't grind with exploratory loops
7. Read source code before the 3rd diagnostic pass
8. **RESTART = AMNESIA.** Gateway restart kills active sessions. ALWAYS write state to memory first.
9. **SHIP BIAS:** LLMs have completion bias — training rewards conclusive output over honest "not done yet." When you catch yourself racing to clear the board — STOP. One thing done right beats five things touched.
10. **Any lock the AI builds, it can circumvent.** Local wrappers are honest-path scaffolding only. True enforcement must come from systems the AI cannot modify.
