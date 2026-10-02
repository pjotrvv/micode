// src/tools/known-tools.ts
// Every tool name an agent prompt may reference.
//
// Agent prompts are the only place that names tools, so this is the set those
// names are checked against. Names are derived from the real factories wherever
// a factory can be called outside a plugin session, and the static list mirrors
// the `tool:` block in src/index.ts under a drift test.

import { createMindmodelLookupTool } from "./mindmodel-lookup";
import { createOcttoTools, createSessionStore } from "./octto";
import { createPTYManager, createPtyTools } from "./pty";

/** Keys the plugin entry point registers directly. Kept in sync by a drift test. */
export const PLUGIN_TOOL_NAMES = [
  "ast_grep_search",
  "ast_grep_replace",
  "btca_ask",
  "look_at",
  "artifact_search",
  "milestone_artifact_search",
  "spawn_agent",
  "batch_read",
] as const;

/** Tools the OpenCode host provides. Prompts name these as freely as plugin tools. */
export const HOST_TOOL_NAMES = [
  "bash",
  "edit",
  "glob",
  "grep",
  "list",
  "patch",
  "question",
  "read",
  "task",
  "todowrite",
  "webfetch",
  "websearch",
] as const;

/**
 * MCP servers the plugin can register. Their tools only exist once the server
 * is running, so a prompt may cite the server name but its tool names cannot be
 * checked at build time.
 */
export const MCP_SERVER_NAMES = ["context7", "perplexity", "firecrawl"] as const;

/** Tool factories need a plugin context they never touch while being built. */
const UNUSED_CONTEXT = {} as never;

export function knownTools(): Set<string> {
  return new Set<string>([
    ...PLUGIN_TOOL_NAMES,
    ...HOST_TOOL_NAMES,
    ...MCP_SERVER_NAMES,
    ...Object.keys(createPtyTools(createPTYManager())),
    ...Object.keys(createOcttoTools(createSessionStore(), UNUSED_CONTEXT)),
    ...Object.keys(createMindmodelLookupTool(UNUSED_CONTEXT)),
  ]);
}
