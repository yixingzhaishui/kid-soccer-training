import type { AnimatedScenario } from "../types/soccer";

export const DEFAULT_CHILD_NAME = "Tom";

export function cleanChildName(value: string) {
  return value.replace(/\s+/g, " ").trimStart().slice(0, 20);
}

export function displayChildName(value: string) {
  return cleanChildName(value).trim() || DEFAULT_CHILD_NAME;
}

export function personalizeText(text: string, childName: string) {
  const name = displayChildName(childName);
  return text.replace(/Nolan(?=(?:'s|’s)?\b)/g, name);
}

export function personalizeScenario(
  scene: AnimatedScenario,
  childName: string,
): AnimatedScenario {
  const text = (value: string) => personalizeText(value, childName);
  return {
    ...scene,
    formalConcept: text(scene.formalConcept),
    visibleCue: text(scene.visibleCue),
    playerDuty: text(scene.playerDuty),
    introNarration: text(scene.introNarration),
    prompt: text(scene.prompt),
    actors: scene.actors.map((actor) =>
      actor.id === "nolan"
        ? { ...actor, name: displayChildName(childName) }
        : actor,
    ),
    choices: scene.choices.map((choice) => ({
      ...choice,
      spokenLabel: text(choice.spokenLabel),
      label: text(choice.label),
      predictionLabel: choice.predictionLabel
        ? text(choice.predictionLabel)
        : undefined,
    })),
    results: scene.results.map((result) => ({
      ...result,
      narration: text(result.narration),
      explanation: text(result.explanation),
      teamEffect: text(result.teamEffect),
      comparisonLine: text(result.comparisonLine),
    })),
  };
}
