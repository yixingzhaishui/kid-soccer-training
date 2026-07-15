import type {
  AnimatedScenario,
  AnimationStep,
  ChoiceResult,
  Point,
} from "../types/soccer";
import { finalFrame } from "./timeline";

export type TacticalFailure = {
  code: "SHOT_AT_WRONG_GOAL";
  message: string;
};

const ballActions = new Set(["pass", "cross", "clear", "shoot", "parry"]);
const laneDistance = (point: Point, from: Point, to: Point) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.max(1, dx * dx + dy * dy);
  const progress = Math.max(
    0,
    Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / length),
  );
  return {
    progress,
    distance: Math.hypot(
      point.x - (from.x + progress * dx),
      point.y - (from.y + progress * dy),
    ),
  };
};

/**
 * Enforces the one non-negotiable field direction: Blue shoots to the right
 * goal; Red shoots to the left goal. It deliberately leaves pass sources and
 * interception consequences intact, so a poor option can still be shown as a
 * genuine turnover rather than being silently made safe.
 */
export function repairTacticalTrajectory(
  scene: Pick<AnimatedScenario, "actors" | "ballStart" | "setupAnimation">,
  steps: AnimationStep[],
): AnimationStep[] {
  const setup = finalFrame(scene.actors, scene.ballStart, scene.setupAnimation);
  const positions = Object.fromEntries(
    Object.entries(setup.actors).map(([id, value]) => [
      id,
      { ...value.position },
    ]),
  );
  return [...steps]
    .sort((a, b) => a.startTime - b.startTime)
    .map((original) => {
      const actor = original.actorId
        ? scene.actors.find((candidate) => candidate.id === original.actorId)
        : undefined;
      const item = {
        ...original,
        from: original.from ? { ...original.from } : undefined,
        to: original.to ? { ...original.to } : undefined,
      };
      if (actor && item.to && ballActions.has(item.action)) {
        if (item.action === "shoot") {
          const x = actor.team === "blue" ? 97 : 3;
          const from = item.from ?? actor.start;
          const y = [20, 26, 38, 44]
            .map((candidate) => {
              const clearance = scene.actors
                .filter(
                  (other) => other.team !== actor.team && !other.goalkeeper,
                )
                .map((other) =>
                  laneDistance(positions[other.id] ?? other.start, from, {
                    x,
                    y: candidate,
                  }),
                )
                .filter(
                  (route) => route.progress > 0.12 && route.progress < 0.9,
                )
                .reduce(
                  (minimum, route) => Math.min(minimum, route.distance),
                  99,
                );
              return { candidate, clearance };
            })
            .sort((a, b) => b.clearance - a.clearance)[0].candidate;
          item.to = { x, y };
        }
      }
      if (
        actor &&
        item.to &&
        !ballActions.has(item.action) &&
        !["block", "celebrate", "react"].includes(item.action)
      )
        positions[actor.id] = { ...item.to };
      return item;
    });
}

function resultFailures(scene: AnimatedScenario, result: ChoiceResult) {
  const failures: TacticalFailure[] = [];
  const ordered = [...result.animationSteps].sort(
    (a, b) => a.startTime - b.startTime,
  );
  for (const item of ordered) {
    const actor = item.actorId
      ? scene.actors.find((candidate) => candidate.id === item.actorId)
      : undefined;
    if (actor && item.to && ballActions.has(item.action)) {
      if (item.action === "shoot") {
        const correctGoal =
          actor.team === "blue" ? item.to.x >= 95 : item.to.x <= 5;
        if (!correctGoal)
          failures.push({
            code: "SHOT_AT_WRONG_GOAL",
            message: `${result.choiceId}: ${actor.id} shoots toward x=${Math.round(item.to.x)} instead of the opponent goal`,
          });
      }
    }
  }
  return failures;
}

/**
 * Match-logic gate: visual clarity alone is not enough. Blue attacks right;
 * Red attacks left. Every animated result is checked for goal direction.
 * Passing lanes and receiver visibility are checked by the
 * separate spatial match audit, including on a phone viewport.
 */
export function tacticalFailures(scene: AnimatedScenario): TacticalFailure[] {
  return resultFailures(scene, scene.results[0])
    .concat(
      ...scene.results.slice(1).map((result) => resultFailures(scene, result)),
    )
    .filter(
      (failure, index, all) =>
        all.findIndex(
          (other) =>
            `${other.code}:${other.message}` ===
            `${failure.code}:${failure.message}`,
        ) === index,
    );
}
