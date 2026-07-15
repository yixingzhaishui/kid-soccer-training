import { describe, expect, it } from "vitest";
import {
  applyAnimationStep,
  finalFrame,
  initialFrame,
  timelineDuration,
} from "../src/logic/timeline";
import type { AnimatedActor, AnimationStep } from "../src/types/soccer";
const nolan: AnimatedActor = {
  id: "nolan",
  role: "Winger",
  team: "blue",
  start: { x: 10, y: 20 },
  facing: 0,
  jerseyNumber: 7,
  name: "Nolan",
};
describe("scene timeline", () => {
  it("moves visible actors and the ball through different actions", () => {
    let frame = initialFrame([nolan], { x: 10, y: 20 });
    frame = applyAnimationStep(frame, {
      startTime: 0,
      duration: 800,
      actorId: "nolan",
      action: "run",
      to: { x: 30, y: 20 },
    });
    expect(frame.actors.nolan.position).toEqual({ x: 30, y: 20 });
    expect(frame.actors.nolan.action).toBe("run");
    frame = applyAnimationStep(frame, {
      startTime: 900,
      duration: 600,
      actorId: "nolan",
      action: "pass",
      to: { x: 55, y: 12 },
    });
    expect(frame.ball).toEqual({ x: 55, y: 12 });
    expect(frame.actors.nolan.position).toEqual({ x: 30, y: 20 });
  });
  it("computes final freeze frames and full duration", () => {
    const steps: AnimationStep[] = [
      {
        startTime: 100,
        duration: 900,
        actorId: "nolan",
        action: "run",
        to: { x: 40, y: 30 },
      },
      {
        startTime: 1200,
        duration: 700,
        actorId: "nolan",
        action: "shoot",
        to: { x: 98, y: 31 },
      },
    ];
    expect(timelineDuration(steps)).toBe(1900);
    const frame = finalFrame([nolan], { x: 10, y: 20 }, steps);
    expect(frame.actors.nolan.position).toEqual({ x: 40, y: 30 });
    expect(frame.ball).toEqual({ x: 98, y: 31 });
  });
});
