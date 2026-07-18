import { describe, expect, it } from "vitest";
import { animatedScenarios } from "../src/lessons";
import { coachFailures } from "../src/logic/coachQuality";

describe("coach-level tactical gates", () => {
  it("passes named-skill tactical requirements in every applicable case", () => {
    const failures = animatedScenarios.flatMap((scene) =>
      coachFailures(scene).map(
        (failure) => `${scene.id}: ${failure.code}: ${failure.message}`,
      ),
    );
    expect(failures).toEqual([]);
  });
});
