import { scenePacks } from "../lessons";
import { ROLE_QUIZ_BEST_KEY } from "../lessons/roleMap";
import { needsPractice } from "../logic/progress";
import type { Progress, SceneCategory, ScenePack } from "../types/soccer";

const quizBestStars = () => {
  const raw = Number(localStorage.getItem(ROLE_QUIZ_BEST_KEY) ?? "0");
  return Number.isFinite(raw) ? raw : 0;
};
type PackProps = {
  progress: Progress;
  practiceCount: number;
  starterDone: number;
  starterTotal: number;
  position?: {
    name: string;
    emoji: string;
    color: string;
    done: number;
    total: number;
  };
  onHome: () => void;
  onRoles: () => void;
  onPosition: () => void;
  onStarter: () => void;
  onPractice: () => void;
  onPack: (id: SceneCategory) => void;
};
export function PackSelectScreen({
  progress,
  practiceCount,
  starterDone,
  starterTotal,
  position,
  onHome,
  onRoles,
  onPosition,
  onStarter,
  onPractice,
  onPack,
}: PackProps) {
  const quizBest = quizBestStars();
  const badges = [
    {
      id: "graduate",
      icon: "🌱",
      label: "No-More-Chasing Graduate",
      earned: starterDone >= starterTotal,
      hint: "Finish all First Lessons",
    },
    {
      id: "zones",
      icon: "🗺️",
      label: "Zone Master",
      earned: quizBest >= 6,
      hint: "Score 6/6 in the position quiz",
    },
    {
      id: "position",
      icon: position?.emoji ?? "⭐",
      label: "Position Pro",
      earned: Boolean(position && position.done >= position.total),
      hint: "Finish your position pack",
    },
  ];
  const pathDone =
    starterDone >= starterTotal &&
    Boolean(position && position.done >= position.total);
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
      <div className="badge-strip" aria-label="Earned badges">
        {badges.map((badge) => (
          <span
            key={badge.id}
            className={`badge ${badge.earned ? "earned" : ""}`}
            title={badge.earned ? badge.label : badge.hint}
          >
            <b>{badge.earned ? badge.icon : "🔒"}</b>
            <small>{badge.earned ? badge.label : badge.hint}</small>
          </span>
        ))}
      </div>
      <p className="coach-path-label">
        🧑‍🏫 Coach’s path: First Lessons → learn your position → your position
        pack
      </p>
      <button className="practice-card starter-card" onClick={onStarter}>
        <span>🌱</span>
        <span>
          <strong>Step 1 · First Lessons</strong>
          <small>
            Don’t chase the ball. Know your job. Play together. ({starterDone}/
            {starterTotal})
          </small>
        </span>
        <b>{starterDone >= starterTotal ? "✅" : "▶"}</b>
      </button>
      {position ? (
        <button
          className="practice-card position-card"
          style={{ "--pack-color": position.color } as React.CSSProperties}
          onClick={onPosition}
        >
          <span>{position.emoji}</span>
          <span>
            <strong>Step 2 · My Position Pack</strong>
            <small>
              {position.name} lessons from your real 2-2-2 team. (
              {position.done}/{position.total})
            </small>
          </span>
          <b>{position.done >= position.total ? "✅" : "▶"}</b>
        </button>
      ) : (
        <button className="practice-card position-card" onClick={onRoles}>
          <span>🗺️</span>
          <span>
            <strong>Step 2 · Pick my position</strong>
            <small>
              Open the position map and choose where you play in the 2-2-2.
            </small>
          </span>
          <b>▶</b>
        </button>
      )}
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
      <p className="coach-path-label advanced-label">
        {pathDone
          ? "🎉 Path complete! Explore every position below."
          : "Step 3 · Advanced packs — coach’s tip: finish your path first."}
      </p>
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
