import { describe, expect, it } from "vitest";
import { animatedScenarios } from "../src/lessons";
import { tacticalFailures } from "../src/logic/tacticalQuality";

describe("match-logic quality gate", () => {
  it("keeps every shot aimed at the opponent goal and every pass physically plausible", () => {
    const failures = animatedScenarios.flatMap((scene) =>
      tacticalFailures(scene).map(
        (failure) => `${scene.id}: ${failure.code}: ${failure.message}`,
      ),
    );
    expect(failures).toEqual([]);
  });
});
