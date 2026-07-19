import { describe, expect, it } from "vitest";
import { animatedScenarios } from "../src/lessons";
import type { AnimatedScenario, AnimationStep } from "../src/types/soccer";

/**
 * Similarity regression gate (2026-07-18 review).
 *
 * The curriculum once contained scenes whose choice animations were, from the
 * child's point of view, exactly the same play with a different title, and
 * template intros that repeated word-for-word inside a role pack. This gate
 * quantizes what the child actually watches — Tom's route plus every ball
 * flight — and fails when two scenes in the same pack collapse to the same
 * visual play or reuse identical narration text.
 */
const quantize = (value: number | undefined) =>
  value === undefined ? "?" : String(Math.round(value / 6));
const stepSignature = (step: AnimationStep) =>
  `${step.actorId ?? "-"}:${step.action}:${quantize(step.from?.x)},${quantize(
    step.from?.y,
  )}>${quantize(step.to?.x)},${quantize(step.to?.y)}`;
const choiceSignature = (steps: AnimationStep[]) =>
  steps
    .filter(
      (step) =>
        step.actorId === "nolan" ||
        ["pass", "cross", "shoot", "clear"].includes(step.action),
    )
    .map(stepSignature)
    .join("|");
const sceneSignature = (scene: AnimatedScenario) =>
  scene.results
    .map(
      (result) => `${result.quality}=${choiceSignature(result.animationSteps)}`,
    )
    .sort()
    .join("||");

describe("scene similarity gate", () => {
  it("never shows the child the same visual play under two different titles", () => {
    const byPack = new Map<string, AnimatedScenario[]>();
    for (const scene of animatedScenarios) {
      byPack.set(scene.category, [
        ...(byPack.get(scene.category) ?? []),
        scene,
      ]);
    }
    const duplicates: string[] = [];
    for (const [, scenes] of byPack) {
      const seen = new Map<string, string>();
      for (const scene of scenes) {
        const signature = sceneSignature(scene);
        const existing = seen.get(signature);
        if (existing) duplicates.push(`${existing} == ${scene.id}`);
        seen.set(signature, scene.id);
      }
    }
    expect(duplicates).toEqual([]);
  });

  it("gives every scene its own intro narration and consequence text", () => {
    const intros = new Map<string, string>();
    const consequences = new Map<string, string>();
    const clones: string[] = [];
    for (const scene of animatedScenarios) {
      const intro = scene.introNarration.trim();
      if (intros.has(intro))
        clones.push(`intro ${intros.get(intro)} == ${scene.id}`);
      intros.set(intro, scene.id);
      const text = scene.results
        .map((result) => result.narration.trim())
        .join("|");
      if (consequences.has(text))
        clones.push(`consequences ${consequences.get(text)} == ${scene.id}`);
      consequences.set(text, scene.id);
    }
    expect(clones).toEqual([]);
  });
});
