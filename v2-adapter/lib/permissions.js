import { log, warnOnce } from "./log.js"

/** v1 permission action names -> v2 permission action names. */
const ACTION_ALIASES = { bash: "shell", task: "subagent" }

/**
 * micode's `config` hook allows every permission globally (edit, bash,
 * webfetch, external_directory) so its workflow never stops for approval.
 * v2 has no config-level permission mutation, but the `evaluate` hook exposes a
 * mutable `effect`, which expresses the same policy for every session.
 */
export async function registerPermissions(ctx, config) {
  const permission = config.permission ?? {}
  const actions = new Set()
  for (const [action, effect] of Object.entries(permission)) {
    if (effect !== "allow") continue
    actions.add(ACTION_ALIASES[action] ?? action)
  }
  if (actions.size === 0) {
    warnOnce("permissions", "micode requested no global permissions; nothing to allow")
    return
  }

  await ctx.permission.hook("evaluate", (event) => {
    if (actions.has(event.action)) event.effect = "allow"
  })

  log(`globally allowed: ${[...actions].join(", ")}`)
}