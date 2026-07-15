import type { ChoiceResult, Progress, SceneProgress } from "../types/soccer";
export const PROGRESS_KEY = "nolan-animation-progress-v1";
export const emptyProgress = (): Progress => ({ sceneResults: {} });
export const pointsForResult = (result: ChoiceResult) =>
  result.quality === "best" ? 3 : result.quality === "good" ? 2 : 0;
export const totalScore = (progress: Progress) =>
  Object.values(progress.sceneResults).reduce(
    (sum, item) => sum + (item.score ?? 0),
    0,
  );
export const needsPractice = (item: SceneProgress | undefined) =>
  Boolean(item && item.poor > 0 && item.best === 0);
export function loadProgress(
  storage: Pick<Storage, "getItem"> = localStorage,
): Progress {
  try {
    const raw = storage.getItem(PROGRESS_KEY);
    if (!raw) return emptyProgress();
    const value = JSON.parse(raw) as Partial<Progress>;
    return {
      sceneResults: Object.fromEntries(
        Object.entries(value.sceneResults ?? {}).map(([id, item]) => [
          id,
          { ...item, score: item.score ?? 0 },
        ]),
      ),
      lastSceneId: value.lastSceneId,
    };
  } catch {
    return emptyProgress();
  }
}
export const saveProgress = (
  progress: Progress,
  storage: Pick<Storage, "setItem"> = localStorage,
) => storage.setItem(PROGRESS_KEY, JSON.stringify(progress));
export function resetProgress(
  storage: Pick<Storage, "removeItem"> = localStorage,
) {
  storage.removeItem(PROGRESS_KEY);
  return emptyProgress();
}
export function recordResult(
  progress: Progress,
  sceneId: string,
  result: ChoiceResult,
  awardPoints: number | boolean = pointsForResult(result),
): Progress {
  const old: SceneProgress = progress.sceneResults[sceneId] ?? {
    completed: false,
    plays: 0,
    best: 0,
    good: 0,
    poor: 0,
    score: 0,
  };
  const points =
      typeof awardPoints === "boolean"
        ? awardPoints
          ? pointsForResult(result)
          : undefined
        : awardPoints,
    score =
      points === undefined
        ? (old.score ?? 0)
        : Math.max(old.score ?? 0, points);
  return {
    lastSceneId: sceneId,
    sceneResults: {
      ...progress.sceneResults,
      [sceneId]: {
        ...old,
        completed: true,
        plays: old.plays + 1,
        best: old.best + (result.quality === "best" ? 1 : 0),
        good: old.good + (result.quality === "good" ? 1 : 0),
        poor: old.poor + (result.quality === "poor" ? 1 : 0),
        score,
        lastChoiceId: result.choiceId,
      },
    },
  };
}
