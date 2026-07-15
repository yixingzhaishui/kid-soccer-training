import { scenePacks } from "../lessons";
import { needsPractice } from "../logic/progress";
import type { Progress, SceneCategory, ScenePack } from "../types/soccer";
type PackProps = {
  progress: Progress;
  practiceCount: number;
  onHome: () => void;
  onPractice: () => void;
  onPack: (id: SceneCategory) => void;
};
export function PackSelectScreen({
  progress,
  practiceCount,
  onHome,
  onPractice,
  onPack,
}: PackProps) {
  return (
    <main className="screen select-screen">
      <header className="screen-header">
        <button className="icon-button" onClick={onHome} aria-label="Go home">
          ⌂
        </button>
        <div>
          <p className="eyebrow">PICK A STORY PACK</p>
          <h1>Let’s play!</h1>
        </div>
        <div />
      </header>
      {practiceCount > 0 && (
        <button className="practice-card" onClick={onPractice}>
          <span>🔁</span>
          <span>
            <strong>Practice Again</strong>
            <small>
              Try {practiceCount} {practiceCount === 1 ? "story" : "stories"}{" "}
              where another choice will help.
            </small>
          </span>
          <b>▶</b>
        </button>
      )}
      <div className="pack-grid">
        {scenePacks.map((pack) => {
          const complete = pack.scenes.filter(
            (scene) => progress.sceneResults[scene.id]?.completed,
          ).length;
          return (
            <button
              className="pack-card"
              key={pack.id}
              style={{ "--pack-color": pack.color } as React.CSSProperties}
              onClick={() => onPack(pack.id)}
            >
              <span className="pack-icon">{pack.icon}</span>
              <span>
                <strong>{pack.name}</strong>
                <small>{pack.description}</small>
                <em>
                  {complete}/{pack.scenes.length} stories
                </em>
              </span>
              <span className="pack-play">▶</span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
type ListProps = {
  pack: ScenePack;
  progress: Progress;
  onBack: () => void;
  onScene: (index: number) => void;
};
export function SceneListScreen({
  pack,
  progress,
  onBack,
  onScene,
}: ListProps) {
  return (
    <main className="screen select-screen">
      <header className="screen-header">
        <button
          className="icon-button"
          onClick={onBack}
          aria-label="Back to packs"
        >
          ‹
        </button>
        <div>
          <p className="eyebrow">
            {pack.icon} {pack.name}
          </p>
          <h1>Choose a story</h1>
        </div>
        <div />
      </header>
      <div className="scene-list">
        {pack.scenes.map((scene, index) => {
          const item = progress.sceneResults[scene.id],
            practice = needsPractice(item);
          return (
            <button
              key={scene.id}
              onClick={() => onScene(index)}
              className={`scene-row ${practice ? "needs-practice" : ""}`}
            >
              <span className="scene-number">{index + 1}</span>
              <span>
                <strong>{scene.title}</strong>
                <small>
                  {practice
                    ? "Practice this skill again"
                    : `Stage ${scene.stage} · ${scene.role}`}
                </small>
              </span>
              <span className={item?.completed ? "scene-done" : ""}>
                {practice ? "↻" : item?.completed ? "✓" : "▶"}
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
