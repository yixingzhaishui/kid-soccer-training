import { describe, expect, it } from "vitest";
import { animatedScenarios } from "../src/lessons";
import {
  emptyProgress,
  loadProgress,
  needsPractice,
  PROGRESS_KEY,
  recordResult,
  resetProgress,
  saveProgress,
  totalScore,
} from "../src/logic/progress";
class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
}
describe("animated story progress", () => {
  it("records quality, awards a capped score, and persists the selected consequence", () => {
    const storage = new MemoryStorage();
    const scene = animatedScenarios[0];
    const first = recordResult(
      emptyProgress(),
      scene.id,
      scene.results.at(-1)!,
    );
    expect(first.sceneResults[scene.id].score).toBe(0);
    expect(needsPractice(first.sceneResults[scene.id])).toBe(true);
    const comeback = recordResult(first, scene.id, scene.results[0], 1);
    expect(comeback.sceneResults[scene.id].score).toBe(1);
    expect(needsPractice(comeback.sceneResults[scene.id])).toBe(false);
    const improved = recordResult(comeback, scene.id, scene.results[0]);
    saveProgress(improved, storage);
    expect(loadProgress(storage).sceneResults[scene.id]).toMatchObject({
      completed: true,
      plays: 3,
      best: 2,
      poor: 1,
      score: 3,
      lastChoiceId: scene.results[0].choiceId,
    });
    expect(totalScore(loadProgress(storage))).toBe(3);
  });
  it("loads malformed storage safely and resets", () => {
    const storage = new MemoryStorage();
    storage.setItem(PROGRESS_KEY, "{broken");
    expect(loadProgress(storage)).toEqual(emptyProgress());
    saveProgress(
      recordResult(
        emptyProgress(),
        animatedScenarios[0].id,
        animatedScenarios[0].results[0],
      ),
      storage,
    );
    expect(resetProgress(storage)).toEqual(emptyProgress());
    expect(storage.getItem(PROGRESS_KEY)).toBeNull();
  });
});
