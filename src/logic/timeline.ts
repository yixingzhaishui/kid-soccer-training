import type { AnimatedActor, AnimationStep, Point } from "../types/soccer";

export type ActorFrame = {
  position: Point;
  action: AnimationStep["action"];
  duration: number;
  emotion?: AnimationStep["emotion"];
};
export type SceneFrame = {
  actors: Record<string, ActorFrame>;
  ball: Point;
  ballDuration: number;
  cameraZoom: number;
};

export function initialFrame(actors: AnimatedActor[], ball: Point): SceneFrame {
  return {
    actors: Object.fromEntries(
      actors.map((item) => [
        item.id,
        { position: item.start, action: "walk" as const, duration: 0 },
      ]),
    ),
    ball,
    ballDuration: 0,
    cameraZoom: 1,
  };
}

export function applyAnimationStep(
  frame: SceneFrame,
  item: AnimationStep,
): SceneFrame {
  const next: SceneFrame = {
    actors: { ...frame.actors },
    ball: frame.ball,
    ballDuration: frame.ballDuration,
    cameraZoom: frame.cameraZoom,
  };
  if (item.action === "camera") {
    next.cameraZoom = item.cameraZoom ?? 1.04;
    return next;
  }
  if (item.actorId && next.actors[item.actorId]) {
    const movesActor = ![
      "pass",
      "shoot",
      "cross",
      "clear",
      "parry",
      "block",
      "celebrate",
      "react",
    ].includes(item.action);
    next.actors[item.actorId] = {
      ...next.actors[item.actorId],
      position:
        movesActor && item.to ? item.to : next.actors[item.actorId].position,
      action: item.action,
      duration: item.duration,
      emotion: item.emotion,
    };
  }
  if (
    [
      "pass",
      "shoot",
      "dribble",
      "receive",
      "cross",
      "clear",
      "catch",
      "parry",
      "block",
    ].includes(item.action) &&
    item.to
  ) {
    next.ball = item.to;
    next.ballDuration = item.duration;
  }
  return next;
}

export function finalFrame(
  actors: AnimatedActor[],
  ball: Point,
  steps: AnimationStep[],
): SceneFrame {
  return [...steps]
    .sort((a, b) => a.startTime - b.startTime)
    .reduce(applyAnimationStep, initialFrame(actors, ball));
}
export const timelineDuration = (steps: AnimationStep[]) =>
  Math.max(0, ...steps.map((item) => item.startTime + item.duration));
