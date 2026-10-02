import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";

import { HOST_TOOL_NAMES, knownTools, MCP_SERVER_NAMES, PLUGIN_TOOL_NAMES } from "../../src/tools/known-tools";

describe("known tools", () => {
  it("includes every tool the plugin registers directly", () => {
    const tools = knownTools();
    for (const name of PLUGIN_TOOL_NAMES) {
      expect(tools.has(name), name).toBe(true);
    }
  });

  it("includes the host tools prompts are allowed to name", () => {
    const tools = knownTools();
    for (const name of HOST_TOOL_NAMES) {
      expect(tools.has(name), name).toBe(true);
    }
    expect(tools.has("todowrite")).toBe(true);
  });

  it("includes mcp server names, whose tools only exist at runtime", () => {
    const tools = knownTools();
    for (const name of MCP_SERVER_NAMES) {
      expect(tools.has(name), name).toBe(true);
    }
  });

  it("derives pty, octto and mindmodel names from the real factories", () => {
    const tools = knownTools();
    const expected = ["pty_spawn", "mindmodel_lookup", "create_brainstorm", "await_brainstorm_complete"];
    for (const name of expected) {
      expect(tools.has(name), name).toBe(true);
    }
  });

  it("matches the tool block registered by the plugin entry point", async () => {
    const source = await readFile("src/index.ts", "utf-8");
    const block = source.match(/tool: \{([\s\S]*?)\n {4}\},/);
    expect(block).not.toBeNull();
    const registered = [...(block?.[1] ?? "").matchAll(/^\s{6}([a-z_][a-z0-9_]*),$/gm)].map((match) => match[1]);
    expect(registered.sort()).toEqual([...PLUGIN_TOOL_NAMES].sort());
  });
});
