import type { AnimatedScenario, AnimationStep, Point } from "../types/soccer";

export type CoachFailure = {
  code:
    | "SWITCH_STAYS_CROWDED"
    | "CUTBACK_NOT_BACKWARD"
    | "DELAY_DIVES_OR_KICKS"
    | "SCREEN_LEAVES_PASS_LANE"
    | "TACKLE_HAS_NO_EXPOSED_TOUCH"
    | "PARRY_STAYS_CENTRAL"
    | "DISTRIBUTION_NOT_FORWARD";
  message: string;
};

const distanceToLane = (point: Point, from: Point, to: Point) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.max(1, dx * dx + dy * dy);
  const progress = Math.max(
    0,
    Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / length),
  );
  return Math.hypot(
    point.x - (from.x + progress * dx),
    point.y - (from.y + progress * dy),
  );
};

const bestResult = (scene: AnimatedScenario) =>
  scene.results.find((result) => result.quality === "best");
const actorTeam = (scene: AnimatedScenario, step: AnimationStep) =>
  scene.actors.find((actor) => actor.id === step.actorId)?.team;

/** Coach-level tactical gates. These judge the named football duty, not merely
 * whether an animation is valid SVG or has different-looking arrows. */
export function coachFailures(scene: AnimatedScenario): CoachFailure[] {
  const best = bestResult(scene);
  if (!best) return [];
  const steps = [...best.animationSteps].sort(
    (a, b) => a.startTime - b.startTime,
  );
  const failures: CoachFailure[] = [];

  if (scene.skillId === "A15") {
    const switchPass = steps.find(
      (step) =>
        step.to &&
        step.from &&
        actorTeam(scene, step) === "blue" &&
        ["pass", "cross"].includes(step.action) &&
        Math.abs(step.to.y - step.from.y) >= 18,
    );
    if (!switchPass)
      failures.push({
        code: "SWITCH_STAYS_CROWDED",
        message: "best switch never moves the ball to a clearly different lane",
      });
  }

  if (scene.skillId === "A20") {
    const cutback = steps.find(
      (step) =>
        step.actorId === "nolan" &&
        step.from &&
        step.to &&
        ["pass", "cross"].includes(step.action) &&
        step.from.x >= 78 &&
        step.to.x <= step.from.x - 5,
    );
    if (!cutback)
      failures.push({
        code: "CUTBACK_NOT_BACKWARD",
        message: "best cutback does not travel backward from the end line",
      });
  }

  if (scene.skillId === "D11") {
    const tomDefends = steps.some(
      (step) => step.actorId === "nolan" && step.action === "defend",
    );
    const tomKicks = steps.some(
      (step) =>
        step.actorId === "nolan" &&
        ["pass", "cross", "clear", "shoot"].includes(step.action),
    );
    const blueRecovery = new Set(
      steps
        .filter(
          (step) =>
            step.actorId &&
            actorTeam(scene, step) === "blue" &&
            step.actorId !== "nolan" &&
            ["run", "defend"].includes(step.action),
        )
        .map((step) => step.actorId),
    ).size;
    if (!tomDefends || tomKicks || blueRecovery < 2)
      failures.push({
        code: "DELAY_DIVES_OR_KICKS",
        message:
          "delay must keep Tom goal-side while at least two teammates recover",
      });
  }

  if (scene.skillId === "D05") {
    const redPass = steps.find(
      (step) =>
        step.from &&
        step.to &&
        actorTeam(scene, step) === "red" &&
        step.action === "pass",
    );
    const tomBlock = steps.find(
      (step) =>
        step.actorId === "nolan" &&
        step.to &&
        ["defend", "block"].includes(step.action),
    );
    if (
      !redPass ||
      !tomBlock?.to ||
      distanceToLane(tomBlock.to, redPass.from!, redPass.to!) > 6
    )
      failures.push({
        code: "SCREEN_LEAVES_PASS_LANE",
        message: "screen does not visibly occupy the passer-to-target lane",
      });
  }

  if (scene.skillId === "D20") {
    const exposedTouch = steps.find(
      (step) =>
        actorTeam(scene, step) === "red" &&
        step.action === "dribble" &&
        step.from &&
        step.to &&
        Math.hypot(step.to.x - step.from.x, step.to.y - step.from.y) >= 5,
    );
    const tackle = steps.find(
      (step) =>
        step.actorId === "nolan" &&
        ["block", "defend"].includes(step.action) &&
        step.startTime >= (exposedTouch?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    if (!exposedTouch || !tackle)
      failures.push({
        code: "TACKLE_HAS_NO_EXPOSED_TOUCH",
        message: "best tackle is not triggered by a visible heavy touch",
      });
  }

  if (scene.skillId === "G03") {
    const parry = steps.find(
      (step) => step.actorId === "nolan" && step.action === "parry" && step.to,
    );
    if (!parry?.to || (parry.to.y > 20 && parry.to.y < 44))
      failures.push({
        code: "PARRY_STAYS_CENTRAL",
        message: "safe parry does not leave the central rebound corridor",
      });
  }

  if (scene.skillId === "G09") {
    const distribution = steps.find(
      (step) =>
        step.actorId === "nolan" &&
        step.action === "pass" &&
        step.from &&
        step.to,
    );
    if (!distribution?.to || distribution.to.x <= distribution.from!.x + 10)
      failures.push({
        code: "DISTRIBUTION_NOT_FORWARD",
        message: "goalkeeper distribution does not start a forward attack",
      });
  }

  return failures;
}
