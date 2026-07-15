import { finalFrame } from "./timeline";
import type {
  AnimatedScenario,
  AnimationStep,
  ChoiceResult,
  Point,
} from "../types/soccer";

type BlockedPath = { step: AnimationStep; blockerIds: string[] };

function segmentDistance(point: Point, start: Point, end: Point) {
  const dx = end.x - start.x,
    dy = end.y - start.y,
    lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0)
    return {
      distance: Math.hypot(point.x - start.x, point.y - start.y),
      progress: 0,
    };
  const progress = Math.max(
      0,
      Math.min(
        1,
        ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared,
      ),
    ),
    closest = { x: start.x + progress * dx, y: start.y + progress * dy };
  return {
    distance: Math.hypot(point.x - closest.x, point.y - closest.y),
    progress,
  };
}

export function blockedBestChoicePaths(
  scene: AnimatedScenario,
  result: ChoiceResult,
): BlockedPath[] {
  const setup = finalFrame(scene.actors, scene.ballStart, scene.setupAnimation),
    positions = Object.fromEntries(
      Object.entries(setup.actors).map(([id, frame]) => [
        id,
        { ...frame.position },
      ]),
    );
  let ball = { ...setup.ball };
  const blocked: BlockedPath[] = [];
  for (const item of [...result.animationSteps].sort(
    (a, b) => a.startTime - b.startTime,
  )) {
    const kicker = item.actorId
      ? scene.actors.find((actor) => actor.id === item.actorId)
      : undefined;
    if (
      kicker?.team === "blue" &&
      item.to &&
      ["pass", "cross", "clear", "shoot"].includes(item.action)
    ) {
      const start = item.from ?? ball,
        end = item.to,
        blockerIds = scene.actors
          .filter(
            (actor) =>
              actor.team !== kicker.team &&
              !(item.action === "shoot" && actor.goalkeeper),
          )
          .filter((actor) => {
            const lane = segmentDistance(
              positions[actor.id] ?? actor.start,
              start,
              end,
            );
            return (
              lane.progress > 0.14 && lane.progress < 0.9 && lane.distance < 3.2
            );
          })
          .map((actor) => actor.id);
      if (blockerIds.length) blocked.push({ step: item, blockerIds });
    }
    if (
      item.actorId &&
      item.to &&
      ![
        "pass",
        "shoot",
        "cross",
        "clear",
        "parry",
        "block",
        "celebrate",
        "react",
      ].includes(item.action)
    )
      positions[item.actorId] = { ...item.to };
    if (
      item.to &&
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
      ].includes(item.action)
    )
      ball = { ...item.to };
  }
  return blocked;
}
