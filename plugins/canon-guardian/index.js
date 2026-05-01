// Canon Guardian — selective workspace canon re-injection for OpenClaw 2026.4.x
//
// Complements `agents.defaults.contextInjection: "continuation-skip"`.
// When `continuation-skip` is on, OpenClaw does not re-inject workspace
// bootstrap files on continuation turns (good for token cost), but model
// failovers, mid-session model switches, and long sessions inherit the
// transcript without the bootstrap. This plugin adds the bootstrap back
// at exactly the right moments and stays out of the way otherwise.
//
// Hook: `before_prompt_build` — returns `prependSystemContext` so the
// canon stays in the cache-eligible portion of the system prompt.
//
// State: in-memory `Map` keyed by `sessionId`. Clears on gateway restart,
// which is intentional — the next turn after restart re-injects.

import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { promises as fs } from "node:fs";
import path from "node:path";

const DEFAULTS = {
  canonFiles: ["AGENTS.md", "OPERATING_RULES.md"],
  injectionInterval: 50,
  restartIdleMs: 6 * 60 * 60 * 1000,
  logInjections: true,
};

function readConfig(api) {
  const cfg = api.pluginConfig || {};
  return {
    canonFiles:
      Array.isArray(cfg.canonFiles) && cfg.canonFiles.length
        ? cfg.canonFiles
        : DEFAULTS.canonFiles,
    injectionInterval:
      typeof cfg.injectionInterval === "number"
        ? cfg.injectionInterval
        : DEFAULTS.injectionInterval,
    restartIdleMs:
      typeof cfg.restartIdleMs === "number"
        ? cfg.restartIdleMs
        : DEFAULTS.restartIdleMs,
    logInjections:
      typeof cfg.logInjections === "boolean"
        ? cfg.logInjections
        : DEFAULTS.logInjections,
  };
}

export default definePluginEntry({
  id: "canon-guardian",
  name: "Canon Guardian",
  description:
    "Selective workspace canon re-injection on model switch, new session, gateway restart, and periodic intervals.",
  register(api) {
    if (api.registrationMode !== "full") return;

    const cfg = readConfig(api);
    const log = api.logger;

    // Workspace-keyed cache so multi-agent gateways do not cross-pollinate.
    const canonCache = new Map();
    // sessionId -> { lastModelKey, turnCount, lastInjectMs }
    const sessionState = new Map();

    async function loadCanon(workspaceDir) {
      if (!workspaceDir) return "";
      const cached = canonCache.get(workspaceDir);
      if (cached) return cached;

      const parts = await Promise.all(
        cfg.canonFiles.map(async (rel) => {
          const safeRel = String(rel).replace(/^[/\\]+/, "");
          const full = path.join(workspaceDir, safeRel);
          if (!full.startsWith(workspaceDir)) {
            return `<!-- canon-guardian: refused unsafe path "${rel}" -->`;
          }
          try {
            const text = await fs.readFile(full, "utf8");
            return `<!-- canon-guardian: ${safeRel} -->\n${text}`;
          } catch {
            return `<!-- canon-guardian: ${safeRel} not found -->`;
          }
        }),
      );
      const joined = parts.join("\n\n---\n\n");
      canonCache.set(workspaceDir, joined);
      return joined;
    }

    api.on("before_prompt_build", async (_event, ctx) => {
      try {
        const sessionId = ctx?.sessionId;
        const modelId = ctx?.modelId || "unknown";
        const providerId = ctx?.modelProviderId || "unknown";
        const workspaceDir = ctx?.workspaceDir;
        if (!sessionId || !workspaceDir) return;

        const modelKey = `${providerId}:${modelId}`;
        const now = Date.now();
        const prev = sessionState.get(sessionId);
        const turnCount = (prev?.turnCount || 0) + 1;

        const isNewSession = !prev;
        const modelSwitched = !!prev && prev.lastModelKey !== modelKey;
        const periodic =
          turnCount > 1 &&
          cfg.injectionInterval > 0 &&
          turnCount % cfg.injectionInterval === 0;
        const restartDetected =
          !!prev &&
          cfg.restartIdleMs > 0 &&
          now - (prev.lastInjectMs || 0) > cfg.restartIdleMs;

        const reason = isNewSession
          ? "new-session"
          : modelSwitched
            ? "model-switch"
            : restartDetected
              ? "restart-or-idle"
              : periodic
                ? `periodic-${cfg.injectionInterval}`
                : null;

        sessionState.set(sessionId, {
          lastModelKey: modelKey,
          turnCount,
          lastInjectMs: reason ? now : prev?.lastInjectMs || 0,
        });

        if (!reason) return;

        const canon = await loadCanon(workspaceDir);
        if (!canon) return;

        if (cfg.logInjections) {
          log.info(
            `[canon-guardian] re-injecting canon (reason=${reason}, turn=${turnCount}, model=${modelKey})`,
          );
        }

        return { prependSystemContext: canon };
      } catch (err) {
        log.error(`[canon-guardian] hook error: ${err?.message || String(err)}`);
        // Fail gracefully: return nothing (no injection) rather than crash the build.
      }
    });

    log.info("[canon-guardian] loaded");
  },
});
