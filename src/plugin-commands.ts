// src/plugin-commands.ts
// Slash commands the plugin registers on the host config.
//
// This lives outside the entry point for two reasons: opencode calls every
// exported function in a plugin module as a plugin factory, so the entry point
// must export the plugin alone, and agent prompts reference command names, so
// the registry has to be importable rather than inlined.

export interface PluginCommand {
  readonly description: string;
  readonly agent: string;
  readonly template: string;
}

export const PLUGIN_COMMANDS: Record<string, PluginCommand> = {
  init: {
    description: "Initialize project with ARCHITECTURE.md and CODE_STYLE.md",
    agent: "project-initializer",
    template: "Initialize this project. $ARGUMENTS",
  },
  mindmodel: {
    description: "Generate .mindmodel/ constraints for this project",
    agent: "mm-orchestrator",
    template: "Generate mindmodel for this project. $ARGUMENTS",
  },
  ledger: {
    description: "Create or update continuity ledger for session state",
    agent: "ledger-creator",
    template: "Update the continuity ledger. $ARGUMENTS",
  },
  search: {
    description: "Search past handoffs, plans, and ledgers",
    agent: "artifact-searcher",
    template: "Search for: $ARGUMENTS",
  },
  brainstorm: {
    description: "Interactive design exploration: dedicated brainstormer session",
    agent: "brainstormer",
    template: "Brainstorm this with me. $ARGUMENTS",
  },
};
