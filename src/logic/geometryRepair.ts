import type { AnimatedActor, AnimationStep, Point } from "../types/soccer";
import { applyAnimationStep, finalFrame, initialFrame } from "./timeline";
import { visuallyOccludes } from "./spatialQuality";

const clamp = (point: Point): Point => ({
  x: Math.max(5, Math.min(95, point.x)),
  y: Math.max(9, Math.min(55, point.y)),
});
const movesActor = (step: AnimationStep) =>
  Boolean(
    step.actorId &&
    step.to &&
    ![
      "pass",
      "shoot",
      "cross",
      "clear",
      "parry",
      "block",
      "celebrate",
      "react",
    ].includes(step.action),
  );
const candidates = (point: Point, actor: AnimatedActor) => {
  const goalSide = actor.team === "blue" ? -1 : 1;
  return [
    point,
    { x: point.x + goalSide * 10, y: point.y },
    { x: point.x, y: point.y + 12 },
    { x: point.x, y: point.y - 12 },
    { x: point.x - goalSide * 10, y: point.y },
    { x: point.x + goalSide * 8, y: point.y + 10 },
    { x: point.x + goalSide * 8, y: point.y - 10 },
    { x: point.x - goalSide * 8, y: point.y + 10 },
    { x: point.x - goalSide * 8, y: point.y - 10 },
    { x: point.x + goalSide * 18, y: point.y },
    { x: point.x - goalSide * 18, y: point.y },
    { x: point.x, y: point.y + 20 },
    { x: point.x, y: point.y - 20 },
    { x: point.x + goalSide * 16, y: point.y + 16 },
    { x: point.x + goalSide * 16, y: point.y - 16 },
    { x: point.x - goalSide * 16, y: point.y + 16 },
    { x: point.x - goalSide * 16, y: point.y - 16 },
  ].map(clamp);
};

const freePoint = (
  desired: Point,
  actor: AnimatedActor,
  actors: AnimatedActor[],
  positions: Record<string, Point>,
) =>
  candidates(desired, actor).find((point) =>
    actors.every(
      (other) =>
        other.id === actor.id ||
        !visuallyOccludes(
          actor,
          point,
          other,
          positions[other.id] ?? other.start,
        ),
    ),
  ) ?? clamp(desired);
const freeGoalSidePoint = (
  receiver: Point,
  ux: number,
  uy: number,
  actor: AnimatedActor,
  actors: AnimatedActor[],
  positions: Record<string, Point>,
) => {
  const perpendicular = { x: -uy, y: ux },
    options = [10, 14, 18, 22].flatMap((advance) =>
      [0, 7, -7, 12, -12].map((side) =>
        clamp({
          x: receiver.x + ux * advance + perpendicular.x * side,
          y: receiver.y + uy * advance + perpendicular.y * side,
        }),
      ),
    );
  return (
    options.find((point) =>
      actors.every(
        (other) =>
          other.id === actor.id ||
          !visuallyOccludes(
            actor,
            point,
            other,
            positions[other.id] ?? other.start,
          ),
      ),
    ) ?? options[0]
  );
};

export function spreadActorStarts(actors: AnimatedActor[]): AnimatedActor[] {
  const ordered = [...actors].sort(
      (a, b) =>
        Number(a.id.startsWith("support-")) -
        Number(b.id.startsWith("support-")),
    ),
    positions: Record<string, Point> = {},
    result: AnimatedActor[] = [];
  for (const actor of ordered) {
    const start = freePoint(actor.start, actor, result, positions);
    positions[actor.id] = start;
    result.push({ ...actor, start });
  }
  return actors.map((actor) => result.find((item) => item.id === actor.id)!);
}

/** Adjusts movement endpoints and moves markers aside before a receiver arrives. */
export function repairAnimationGeometry(
  actors: AnimatedActor[],
  ballStart: Point,
  steps: AnimationStep[],
  prior: AnimationStep[] = [],
): AnimationStep[] {
  let frame = prior.length
    ? finalFrame(actors, ballStart, prior)
    : initialFrame(actors, ballStart);
  const positions = Object.fromEntries(
    Object.entries(frame.actors).map(([id, value]) => [
      id,
      { ...value.position },
    ]),
  );
  const repaired: AnimationStep[] = [],
    ordered = [...steps].sort((a, b) => a.startTime - b.startTime);
  let lastBlueKickFrom: Point | undefined;
  for (const original of ordered) {
    let item = {
      ...original,
      to: original.to ? { ...original.to } : undefined,
    };
    const actor = item.actorId
      ? actors.find((candidate) => candidate.id === item.actorId)
      : undefined;
    if (actor && item.to && movesActor(item)) {
      const dx = item.to.x - (lastBlueKickFrom?.x ?? item.to.x - 1),
        dy = item.to.y - (lastBlueKickFrom?.y ?? item.to.y),
        length = Math.max(1, Math.hypot(dx, dy)),
        ux = dx / length,
        uy = dy / length,
        receiverProgress = lastBlueKickFrom
          ? (item.to.x - lastBlueKickFrom.x) * ux +
            (item.to.y - lastBlueKickFrom.y) * uy
          : 0;
      const conflicts = actors.filter((other) => {
        if (other.id === actor.id) return false;
        const otherPoint = positions[other.id] ?? other.start,
          tacticallyBlocks =
            item.action === "receive" &&
            actor.team === "blue" &&
            other.team === "red" &&
            !other.goalkeeper &&
            lastBlueKickFrom &&
            Math.hypot(otherPoint.x - item.to!.x, otherPoint.y - item.to!.y) <
              11 &&
            (otherPoint.x - lastBlueKickFrom.x) * ux +
              (otherPoint.y - lastBlueKickFrom.y) * uy <=
              receiverProgress + 0.5;
        return (
          visuallyOccludes(actor, item.to!, other, otherPoint) ||
          Boolean(tacticallyBlocks)
        );
      });
      const protectRoute = actor.id === "nolan" || item.action === "receive";
      if (protectRoute) {
        for (const other of conflicts) {
          if (other.id === "nolan") {
            item.to = freePoint(item.to, actor, actors, positions);
            positions[actor.id] = { ...item.to };
            continue;
          }
          const current = positions[other.id] ?? other.start;
          const markSide =
            item.action === "receive" &&
            actor.team === "blue" &&
            other.team === "red"
              ? {
                  x: item.to.x + ux * 11,
                  y: item.to.y + uy * 11 + (current.y <= item.to.y ? -5 : 5),
                }
              : {
                  x: item.to.x + (other.team === "red" ? 10 : -10),
                  y: item.to.y + (current.y <= item.to.y ? -7 : 7),
                };
          const desired =
            item.action === "receive" &&
            actor.team === "blue" &&
            other.team === "red"
              ? freeGoalSidePoint(
                  item.to,
                  ux,
                  uy,
                  other,
                  actors.filter((candidate) => candidate.id !== actor.id),
                  positions,
                )
              : freePoint(
                  markSide,
                  other,
                  actors.filter((candidate) => candidate.id !== actor.id),
                  positions,
                );
          const latestOtherStart = Math.max(
            -1,
            ...repaired
              .filter(
                (candidate) =>
                  candidate.actorId === other.id &&
                  candidate.startTime < item.startTime,
              )
              .map((candidate) => candidate.startTime),
          );
          const avoidanceStart = Math.max(
              0,
              item.startTime - 650,
              latestOtherStart + 1,
            ),
            avoidanceDuration = Math.max(120, item.startTime - avoidanceStart);
          const avoidance: AnimationStep = {
            startTime: avoidanceStart,
            duration: avoidanceDuration,
            action: other.team === "red" ? "defend" : "run",
            actorId: other.id,
            from: current,
            to: desired,
          };
          repaired.push(avoidance);
          positions[other.id] = desired;
        }
      } else item.to = freePoint(item.to, actor, actors, positions);
      positions[actor.id] = { ...item.to };
    }
    if (
      actor?.team === "blue" &&
      item.from &&
      ["pass", "cross", "clear"].includes(item.action)
    )
      lastBlueKickFrom = { ...item.from };
    repaired.push(item);
    frame = applyAnimationStep(frame, item);
  }
  const end = Math.max(
    0,
    ...repaired.map((item) => item.startTime + item.duration),
  );
  // Recompute the actual rendered freeze frame. Several reactions can overlap
  // in time, so the incremental bookkeeping above is not always the same as
  // the timeline order seen by the child.
  const renderedFreeze = [...repaired]
    .sort((a, b) => a.startTime - b.startTime)
    .reduce(
      applyAnimationStep,
      prior.length
        ? finalFrame(actors, ballStart, prior)
        : initialFrame(actors, ballStart),
    );
  for (const [id, state] of Object.entries(renderedFreeze.actors))
    positions[id] = { ...state.position };
  // Freeze frames must remain readable. Move the lower-priority figure away;
  // never move Tom merely to make a collision disappear.
  for (let pass = 0; pass < 80; pass++) {
    let pair: [AnimatedActor, AnimatedActor] | undefined;
    outer: for (let i = 0; i < actors.length; i++)
      for (let j = i + 1; j < actors.length; j++)
        if (
          visuallyOccludes(
            actors[i],
            positions[actors[i].id],
            actors[j],
            positions[actors[j].id],
          )
        ) {
          const bothBackground =
            actors[i].id.startsWith("support-") &&
            actors[j].id.startsWith("support-");
          if (
            bothBackground &&
            Math.hypot(
              positions[actors[i].id].x - positions[actors[j].id].x,
              positions[actors[i].id].y - positions[actors[j].id].y,
            ) > 3
          )
            continue;
          pair = [actors[i], actors[j]];
          break outer;
        }
    if (!pair) break;
    const [a, b] = pair;
    let movable =
      a.id === "nolan"
        ? b
        : b.id === "nolan"
          ? a
          : a.id.startsWith("support-") && !b.id.startsWith("support-")
            ? a
            : b.id.startsWith("support-") && !a.id.startsWith("support-")
              ? b
              : a.goalkeeper && !b.goalkeeper
                ? b
                : b.goalkeeper && !a.goalkeeper
                  ? a
                  : b;
    const destination = freePoint(
      positions[movable.id],
      movable,
      actors.filter((candidate) => candidate.id !== movable.id),
      positions,
    );
    if (
      destination.x === positions[movable.id].x &&
      destination.y === positions[movable.id].y
    )
      break;
    repaired.push({
      startTime: end + 10,
      duration: 600,
      action: movable.team === "red" ? "defend" : "run",
      actorId: movable.id,
      from: positions[movable.id],
      to: destination,
    });
    positions[movable.id] = destination;
  }
  return repaired.sort((a, b) => a.startTime - b.startTime);
}
