import { describe, expect, it } from "vitest";
import { animatedScenarios } from "../src/lessons";
import type { AnimatedScenario, AnimationStep } from "../src/types/soccer";

const deliveries = new Set(["pass", "cross", "clear"]);
const roleBallActions = new Set([
  "receive",
  "dribble",
  "shield",
  "pass",
  "cross",
  "clear",
  "shoot",
]);

function hasVisibleDelivery(scene: AnimatedScenario, steps: AnimationStep[]) {
  const startingOwner = scene.actors.find(
    (actor) =>
      Math.hypot(
        actor.start.x - scene.ballStart.x,
        actor.start.y - scene.ballStart.y,
      ) < 2.5,
  );
  // Defensive scenes begin with Red carrying the ball. Tom should not first
  // receive a Blue pass there; he must defend the danger.
  if (startingOwner?.team !== "blue") return true;
  const ordered = [...steps].sort((a, b) => a.startTime - b.startTime);
  const firstTomBallAction = ordered.find(
    (step) => step.actorId === "nolan" && roleBallActions.has(step.action),
  );
  if (!firstTomBallAction || scene.category === "goalkeeper") return true;
  const receivePoint =
    firstTomBallAction.from ??
    scene.actors.find((actor) => actor.id === "nolan")!.start;
  return ordered.some((step) => {
    if (step.startTime >= firstTomBallAction.startTime || !step.to)
      return false;
    const actor = step.actorId
      ? scene.actors.find((candidate) => candidate.id === step.actorId)
      : undefined;
    return (
      actor?.team === "blue" &&
      deliveries.has(step.action) &&
      Math.hypot(step.to.x - receivePoint.x, step.to.y - receivePoint.y) < 4
    );
  });
}

describe("ball-possession teaching gate", () => {
  it("shows how Tom receives the ball before every attacking option lets him use it", () => {
    const failures = animatedScenarios.flatMap((scene) =>
      scene.results
        .filter(
          (result) => !scene.formalConcept.toLowerCase().includes("defend"),
        )
        .filter((result) => !hasVisibleDelivery(scene, result.animationSteps))
        .map((result) => `${scene.id}/${result.choiceId}`),
    );
    expect(failures).toEqual([]);
  });
});
