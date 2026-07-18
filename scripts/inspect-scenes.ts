import { animatedScenarios } from "../src/lessons";
import { coachFailures } from "../src/logic/coachQuality";

const skillCounts = Object.entries(
  animatedScenarios.reduce<Record<string, number>>((counts, scene) => {
    counts[scene.skillId] = (counts[scene.skillId] ?? 0) + 1;
    return counts;
  }, {}),
).sort(([a], [b]) => a.localeCompare(b));

const failures = animatedScenarios.flatMap((scene) =>
  coachFailures(scene).map((failure) => ({
    scene: scene.id,
    skill: scene.skillId,
    code: failure.code,
    message: failure.message,
  })),
);

const scenesBySkill = Object.fromEntries(
  [...new Set(animatedScenarios.map((scene) => scene.skillId))]
    .sort()
    .map((skill) => [
      skill,
      animatedScenarios
        .filter((scene) => scene.skillId === skill)
        .map((scene) => scene.id),
    ]),
);

const detailIds = new Set(process.argv.slice(2));
const details = animatedScenarios
  .filter((scene) => detailIds.has(scene.id))
  .map((scene) => ({
    id: scene.id,
    title: scene.title,
    trigger: scene.setupNarration,
    skillId: scene.skillId,
    ballStart: scene.ballStart,
    actors: scene.actors.map(({ id, team, start }) => ({ id, team, start })),
    results: scene.results.map((result) => ({
      choiceId: result.choiceId,
      steps: [...result.animationSteps]
        .sort((a, b) => a.startTime - b.startTime)
        .map(({ startTime, action, actorId, from, to }) => ({
          startTime,
          action,
          actorId,
          from,
          to,
        })),
    })),
  }));

console.log(
  JSON.stringify({ skillCounts, scenesBySkill, failures, details }, null, 2),
);

if (failures.length > 0) process.exitCode = 1;
