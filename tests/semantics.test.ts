import { describe, expect, it } from "vitest";
import { animatedScenarios } from "../src/lessons";
import { semanticIssues } from "../src/logic/optionSemantics";
import { childFriendlyLabel } from "../src/logic/childLanguage";

describe("option and consequence semantics", () => {
  it("matches every option label to the active role animation", () => {
    const issues = animatedScenarios.flatMap(semanticIssues);
    expect(issues).toEqual([]);
  });
  it("shows receive-on-half-turn and receive-without-scanning correctly", () => {
    const scene = animatedScenarios.find((item) => item.id === "AM-07")!,
      good = scene.choices.find((item) => item.id === "a")!,
      poor = scene.choices.find((item) => item.id === "c")!,
      goodResult = scene.results.find((item) => item.choiceId === "a")!,
      poorResult = scene.results.find((item) => item.choiceId === "c")!;
    expect(good.previewFacing).toBeDefined();
    expect(
      goodResult.animationSteps.some(
        (item) => item.actorId === "nolan" && item.action === "scan",
      ),
    ).toBe(true);
    expect(poor.previewFacing).toBeUndefined();
    expect(
      poorResult.animationSteps.some(
        (item) => item.actorId === "nolan" && item.action === "scan",
      ),
    ).toBe(false);
    expect(poor.previewAnimation[0].from).toEqual(poor.previewAnimation[0].to);
  });
  it("offers plain-language labels for younger players", () => {
    expect(childFriendlyLabel("Counterpress now", "younger")).toBe(
      "win it back fast",
    );
    expect(childFriendlyLabel("Combine With an Underlap", "younger")).toContain(
      "run inside",
    );
    expect(childFriendlyLabel("Counterpress now", "older")).toBe(
      "Counterpress now",
    );
  });
});
