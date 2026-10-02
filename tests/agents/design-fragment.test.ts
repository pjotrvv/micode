import { describe, expect, it } from "bun:test";

import { DESIGN_FRAGMENT } from "../../src/agents/design-fragment";

describe("design fragment", () => {
  it("carries the markdown discipline that makes a design readable", () => {
    expect(DESIGN_FRAGMENT).toContain("<formatting-rules");
    expect(DESIGN_FRAGMENT).toContain("<good-example>");
    expect(DESIGN_FRAGMENT).toContain("<bad-example>");
    expect(DESIGN_FRAGMENT).toContain("<section-template>");
    expect(DESIGN_FRAGMENT).toContain("USE MARKDOWN FORMATTING");
  });

  it("spells the phase sequence out in order", () => {
    const research = DESIGN_FRAGMENT.indexOf('<phase name="research"');
    const presenting = DESIGN_FRAGMENT.indexOf('<phase name="presenting"');
    const finalizing = DESIGN_FRAGMENT.indexOf('<phase name="finalizing"');
    expect(research).toBeGreaterThan(-1);
    expect(presenting).toBeGreaterThan(research);
    expect(finalizing).toBeGreaterThan(presenting);
  });

  it("spawns all three research subagents in one message", () => {
    for (const agent of ["codebase-locator", "codebase-analyzer", "pattern-finder"]) {
      expect(DESIGN_FRAGMENT).toContain(`subagent_type="${agent}"`);
    }
  });

  it("hands off to planner with the design path", () => {
    expect(DESIGN_FRAGMENT).toContain('subagent_type="planner"');
    expect(DESIGN_FRAGMENT).toContain("thoughts/shared/designs/YYYY-MM-DD-{topic}-design.md");
  });

  it("defines the nine required design sections", () => {
    const sections = [
      "Problem Statement",
      "Constraints",
      "Approach",
      "Architecture",
      "Components",
      "Data Flow",
      "Error Handling",
      "Testing Strategy",
      "Open Questions",
    ];
    for (const section of sections) {
      expect(DESIGN_FRAGMENT).toContain(`<section name="${section}">`);
    }
  });

  it("keeps the design doc contract on thoughts/shared/designs", () => {
    expect(DESIGN_FRAGMENT).toContain('<output-format path="thoughts/shared/designs/YYYY-MM-DD-{topic}-design.md">');
  });

  it("says nothing about implementation", () => {
    expect(DESIGN_FRAGMENT).not.toContain("executor");
  });
});
