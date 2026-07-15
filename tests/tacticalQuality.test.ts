import { describe, expect, it } from "vitest";
import { animatedScenarios } from "../src/lessons";
import { tacticalFailures } from "../src/logic/tacticalQuality";

describe("match-logic quality gate", () => {
  it("keeps all 250 scenes out of their own goal end and shots aimed correctly", () => {
    const failures = animatedScenarios.flatMap((scene) =>
      tacticalFailures(scene).map(
        (failure) => `${scene.id}: ${failure.code}: ${failure.message}`,
      ),
    );
    expect(failures).toEqual([]);
  });
});
