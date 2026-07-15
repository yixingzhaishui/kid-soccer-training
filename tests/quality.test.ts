import { describe, expect, it } from "vitest";
import { animatedScenarios } from "../src/lessons";
import { scoreCurriculum } from "../src/logic/scenarioQuality";

describe("100-point scenario quality gate", () => {
  const scores = scoreCurriculum(animatedScenarios);
  it("scores every case above 96 out of 100", () => {
    const failures = scores
      .filter((item) => item.score <= 96)
      .map((item) => ({
        id: item.sceneId,
        score: item.score,
        lost: item.criteria
          .filter((criterion) => criterion.earned < criterion.maximum)
          .map(
            (criterion) =>
              `${criterion.label} ${criterion.earned}/${criterion.maximum}`,
          ),
      }));
    expect(failures).toEqual([]);
  });
  it("keeps the complete curriculum average above 98", () =>
    expect(
      scores.reduce((sum, item) => sum + item.score, 0) / scores.length,
    ).toBeGreaterThan(98));
});
