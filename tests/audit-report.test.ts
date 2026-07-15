import { it } from "vitest";
import { animatedScenarios } from "../src/lessons";
import { scoreCurriculum } from "../src/logic/scenarioQuality";

it("reports the honest hard-gate audit", () => {
  const audits = scoreCurriculum(animatedScenarios);
  const byCode = audits
    .flatMap((audit) => audit.hardFailures)
    .reduce<Record<string, number>>(
      (counts, failure) => ({
        ...counts,
        [failure.code]: (counts[failure.code] ?? 0) + 1,
      }),
      {},
    );
  console.info(
    JSON.stringify(
      {
        failedCases: audits.filter((audit) => audit.hardFailures.length).length,
        totalFailures: Object.values(byCode).reduce(
          (sum, count) => sum + count,
          0,
        ),
        byCode,
        examples: audits
          .filter((audit) => audit.hardFailures.length)
          .map((audit) => {
            const scene = animatedScenarios.find(
              (item) => item.id === audit.sceneId,
            )!;
            return {
              id: audit.sceneId,
              failures: audit.hardFailures.map(
                (failure) => `${failure.code}: ${failure.message}`,
              ),
              options: scene.choices.map((choice) => ({
                label: choice.label,
                route: choice.previewAnimation.map((step) => ({
                  from: step.from,
                  to: step.to,
                  action: step.action,
                })),
                ball: choice.previewBall,
                facing: choice.previewFacing,
              })),
              activeSteps: scene.results.map((result) => ({
                choiceId: result.choiceId,
                steps: result.animationSteps
                  .filter((step) =>
                    ["nolan", "red2"].includes(step.actorId ?? ""),
                  )
                  .map((step) => ({
                    at: step.startTime,
                    actor: step.actorId,
                    action: step.action,
                    to: step.to,
                  })),
              })),
            };
          }),
      },
      null,
      2,
    ),
  );
});
