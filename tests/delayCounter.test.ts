import { describe, expect, it } from "vitest";
import { animatedScenarios, sceneById } from "../src/lessons";

const ballActions = new Set(["pass", "cross", "clear", "shoot"]);

describe("counter-delay match logic", () => {
  it("keeps Nolan goal-side and makes the countering team turn wide in DM-06", () => {
    const scene = sceneById("DM-06")!;
    const nolan = scene.actors.find((actor) => actor.id === "nolan")!;
    const redCarrier = scene.actors.find((actor) => actor.id === "redBall")!;
    const result = scene.results.find((item) => item.choiceId === "a")!;
    expect(
      result.animationSteps.some(
        (step) =>
          step.actorId === "nolan" &&
          step.action === "defend" &&
          Boolean(step.to) &&
          step.to!.x < redCarrier.start.x,
      ),
    ).toBe(true);
    expect(
      result.animationSteps.some(
        (step) =>
          step.actorId?.startsWith("blue") && ballActions.has(step.action),
      ),
    ).toBe(false);
    expect(
      result.animationSteps.some(
        (step) => step.actorId === "redBall" && step.action === "turn",
      ),
    ).toBe(true);
  });

  it("uses the same delay pattern for every defensive delay scene", () => {
    const delayScenes = animatedScenarios.filter(
      (scene) =>
        scene.category === "defensive-midfielder" &&
        /delay|slow/i.test(scene.formalConcept),
    );
    expect(delayScenes.length).toBeGreaterThan(0);
    for (const scene of delayScenes) {
      const best = scene.results.find((result) => result.quality === "best")!;
      expect(
        best.animationSteps.some(
          (step) =>
            step.actorId?.startsWith("blue") && ballActions.has(step.action),
        ),
      ).toBe(false);
    }
  });
});
