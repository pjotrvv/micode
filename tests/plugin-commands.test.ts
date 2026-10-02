import { describe, expect, it } from "bun:test";

import { agents } from "../src/agents";
import { PLUGIN_COMMANDS } from "../src/plugin-commands";

describe("plugin commands", () => {
  it("registers the documented commands plus brainstorm", () => {
    expect(Object.keys(PLUGIN_COMMANDS).sort()).toEqual(["brainstorm", "init", "ledger", "mindmodel", "search"]);
  });

  it("routes /brainstorm to the brainstormer agent", () => {
    expect(PLUGIN_COMMANDS.brainstorm.agent).toBe("brainstormer");
    expect(PLUGIN_COMMANDS.brainstorm.description).toContain("brainstormer");
  });

  it("targets a registered agent for every command", () => {
    const registered = Object.keys(agents);
    for (const [name, command] of Object.entries(PLUGIN_COMMANDS)) {
      expect(registered, `${name} targets an unregistered agent`).toContain(command.agent);
    }
  });

  it("passes user input through to the agent", () => {
    for (const [name, command] of Object.entries(PLUGIN_COMMANDS)) {
      expect(command.template, name).toContain("$ARGUMENTS");
    }
  });

  it("describes every command", () => {
    for (const [name, command] of Object.entries(PLUGIN_COMMANDS)) {
      expect(command.description.length, name).toBeGreaterThan(0);
    }
  });
});
