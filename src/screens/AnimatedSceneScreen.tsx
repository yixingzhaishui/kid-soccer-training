import { useCallback, useEffect, useMemo, useState } from "react";
import { ChoiceCard } from "../components/ChoiceCard";
import { ComparisonView } from "../components/ComparisonView";
import { SceneCanvas } from "../components/SceneCanvas";
import { pointsForResult } from "../logic/progress";
import { childFriendlyLabel } from "../logic/childLanguage";
import { finalFrame } from "../logic/timeline";
import type { AnimatedScenario, ChoiceResult } from "../types/soccer";

type Props = {
  scene: AnimatedScenario;
  sceneIndex: number;
  total: number;
  score: number;
  sceneScore: number;
  scenePlays: number;
  languageLevel: "younger" | "older";
  onHome: () => void;
  onBack: () => void;
  onSpeak: (text: string) => void;
  onResult: (result: ChoiceResult, awardPoints: number | undefined) => void;
  onNext: () => void;
};
type Phase = "watch" | "choose" | "rechoose" | "result" | "explain" | "compare";
const seededOrder = (choices: AnimatedScenario["choices"], seed: string) => {
  let hash = 2166136261;
  for (const char of seed)
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return [...choices].sort((a, b) => {
    const score = (id: string) => {
      let value = hash;
      for (const char of id)
        value = Math.imul(value ^ char.charCodeAt(0), 16777619);
      return value >>> 0;
    };
    return score(a.id) - score(b.id);
  });
};
export function AnimatedSceneScreen({
  scene,
  sceneIndex,
  total,
  score,
  sceneScore,
  scenePlays,
  languageLevel,
  onHome,
  onBack,
  onSpeak,
  onResult,
  onNext,
}: Props) {
  const [phase, setPhase] = useState<Phase>("watch");
  const [runKey, setRunKey] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [orderSeed] = useState(scenePlays);
  const [choiceRound, setChoiceRound] = useState(0);
  const [selected, setSelected] = useState<ChoiceResult | undefined>();
  const [scoreUsed, setScoreUsed] = useState(false);
  const [firstWasPoor, setFirstWasPoor] = useState(false);
  const [comebackUsed, setComebackUsed] = useState(false);
  const [earned, setEarned] = useState<number | undefined>();
  const setupFrame = useMemo(
      () => finalFrame(scene.actors, scene.ballStart, scene.setupAnimation),
      [scene],
    ),
    previewActors = useMemo(
      () =>
        scene.actors.map((actor) => ({
          ...actor,
          start: setupFrame.actors[actor.id]?.position ?? actor.start,
        })),
      [scene.actors, setupFrame],
    ),
    displayChoices = useMemo(() => {
      const ordered = seededOrder(scene.choices, `${scene.id}:${orderSeed}`),
        offset = choiceRound % ordered.length;
      return [...ordered.slice(offset), ...ordered.slice(0, offset)];
    }, [scene.choices, scene.id, orderSeed, choiceRound]);
  const setupDone = useCallback(() => {
    setPhase("choose");
    onSpeak(scene.stage === 2 ? "What will happen next?" : scene.prompt);
  }, [onSpeak, scene]);
  useEffect(() => {
    setPhase("watch");
    setSelected(undefined);
    setScoreUsed(false);
    setFirstWasPoor(false);
    setComebackUsed(false);
    setChoiceRound(0);
    setEarned(undefined);
    setRunKey((key) => key + 1);
    onSpeak(scene.introNarration);
  }, [scene, onSpeak]);
  const pick = (choiceId: string) => {
    const found = scene.results.find((item) => item.choiceId === choiceId);
    if (!found) {
      setPhase("choose");
      return;
    }
    const first = !scoreUsed,
      comeback =
        !first && firstWasPoor && !comebackUsed && found.quality !== "poor",
      points = first ? pointsForResult(found) : comeback ? 1 : undefined;
    setSelected(found);
    setEarned(
      points === undefined ? undefined : Math.max(0, points - sceneScore),
    );
    if (first) setFirstWasPoor(found.quality === "poor");
    if (comeback) setComebackUsed(true);
    setScoreUsed(true);
    setPhase("result");
    onResult(found, points);
  };
  const resultDone = useCallback(() => {
    if (!selected) return;
    setPhase("explain");
    onSpeak(selected.narration);
  }, [onSpeak, selected]);
  const replayAll = () => {
    setSelected(undefined);
    setPhase("watch");
    setRunKey((key) => key + 1);
    onSpeak(scene.introNarration);
  };
  const replayResult = (rate = 1) => {
    if (!selected) return;
    setPlaybackRate(rate);
    setPhase("result");
    setRunKey((key) => key + 1);
  };
  const chooseAgain = () => {
    setSelected(undefined);
    setPhase("rechoose");
    setChoiceRound((round) => round + 1);
    setRunKey((key) => key + 1);
    onSpeak(scene.prompt);
  };
  if (phase === "compare" && selected)
    return (
      <main className="screen scene-screen">
        <ComparisonView
          scene={scene}
          chosen={selected}
          onBack={() => setPhase("explain")}
          onContinue={onNext}
        />
      </main>
    );
  const steps =
    phase === "watch" || phase === "choose"
      ? scene.setupAnimation
      : phase === "rechoose"
        ? []
        : (selected?.animationSteps ?? []);
  const initial =
    phase === "result" || phase === "explain" || phase === "rechoose"
      ? setupFrame
      : undefined;
  return (
    <main className="screen scene-screen">
      <header className="scene-header">
        <button
          className="icon-button"
          onClick={onBack}
          aria-label="Back to stories"
        >
          ‹
        </button>
        <div>
          <strong>{scene.title}</strong>
          <span>
            {sceneIndex + 1} of {total} · Stage {scene.stage}
          </span>
        </div>
        <div className="scene-score" aria-label={`${score} total points`}>
          ⭐ {score}
        </div>
        <button className="icon-button" onClick={onHome} aria-label="Go home">
          ⌂
        </button>
      </header>
      <div className={`watch-banner ${phase}`}>
        <span>
          {phase === "watch"
            ? "👀"
            : phase === "choose" || phase === "rechoose"
              ? "🤔"
              : phase === "result"
                ? "🎬"
                : "💡"}
        </span>
        <strong>
          {phase === "watch"
            ? "Watch the game…"
            : phase === "choose" || phase === "rechoose"
              ? scene.stage === 2
                ? "What happens next?"
                : scene.prompt
              : phase === "result"
                ? "See what happens…"
                : selected?.quality === "poor"
                  ? "Let’s learn from it"
                  : "Nice choice!"}
        </strong>
        {phase === "watch" && <i />}
      </div>
      <SceneCanvas
        actors={scene.actors}
        ballStart={scene.ballStart}
        steps={steps}
        activeArea={scene.activeArea}
        initial={initial}
        runKey={runKey}
        playbackRate={playbackRate}
        onComplete={
          phase === "watch" || phase === "choose"
            ? setupDone
            : phase === "result" || phase === "explain"
              ? resultDone
              : undefined
        }
      />
      {(phase === "choose" || phase === "rechoose") && (
        <div className="choice-area">
          <p className="visible-cue">
            <span>👀 Look:</span>{" "}
            {childFriendlyLabel(scene.visibleCue, languageLevel)}
          </p>
          <div className={`choice-grid choices-${scene.choices.length}`}>
            {displayChoices.map((item) => {
              const label = childFriendlyLabel(
                scene.stage === 2
                  ? (item.predictionLabel ?? item.label)
                  : item.label,
                languageLevel,
              );
              return (
                <ChoiceCard
                  key={item.id}
                  choice={item}
                  displayLabel={label}
                  nolan={previewActors.find((actor) => actor.id === "nolan")!}
                  actors={previewActors}
                  ballStart={setupFrame.ball}
                  onClick={() => pick(item.id)}
                />
              );
            })}
          </div>
          {scene.stage === 3 && (
            <p className="gentle-timer">
              ⚡ The game is moving — choose when you’re ready.
            </p>
          )}
        </div>
      )}
      {phase === "result" && (
        <div className="result-playing">
          <span>Players are showing your choice</span>
          <i />
        </div>
      )}
      {phase === "explain" && selected && (
        <section className={`explain-card ${selected.quality}`}>
          <div className="explain-face">
            {selected.quality === "poor" ? "🧐" : "🥳"}
          </div>
          <div>
            <strong>
              {selected.quality === "best"
                ? "Great choice!"
                : selected.quality === "good"
                  ? "Good choice!"
                  : "See what happened?"}
            </strong>
            {earned !== undefined && (
              <div className="score-earned">
                {earned > 0
                  ? `⭐ +${earned} ${earned === 1 ? "point" : "points"}`
                  : selected.quality === "poor"
                    ? "⭐ No point yet — choose again"
                    : "⭐ Story score already saved"}
              </div>
            )}
            <p>{selected.narration}</p>
            <small>{selected.teamEffect}</small>
          </div>
          <div className="explain-actions">
            <button className="secondary" onClick={chooseAgain}>
              ↩ Choose again
            </button>
            <button className="secondary" onClick={() => replayResult(1)}>
              ↻ Replay result
            </button>
            <button className="secondary" onClick={() => replayResult(0.5)}>
              🐢 Show slowly
            </button>
            <button
              className="secondary compare-button"
              onClick={() => setPhase("compare")}
            >
              ▥ Compare choices
              {selected.quality === "poor" ? " — recommended" : ""}
            </button>
            <button className="primary" onClick={onNext}>
              Next story ›
            </button>
          </div>
        </section>
      )}
      {(phase === "choose" || phase === "rechoose" || phase === "explain") && (
        <button className="replay-whole" onClick={replayAll}>
          ↻ Watch the whole scene again
        </button>
      )}
    </main>
  );
}
