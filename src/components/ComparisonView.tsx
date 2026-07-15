import { useMemo, useState } from "react";
import { finalFrame } from "../logic/timeline";
import type { AnimatedScenario, ChoiceResult } from "../types/soccer";
import { SceneCanvas } from "./SceneCanvas";

type Props = {
  scene: AnimatedScenario;
  chosen: ChoiceResult;
  onBack: () => void;
  onContinue: () => void;
};
export function ComparisonView({ scene, chosen, onBack, onContinue }: Props) {
  const [runKey, setRunKey] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const other =
    scene.results.find(
      (item) =>
        item.choiceId !== chosen.choiceId &&
        (chosen.quality === "poor"
          ? item.quality !== "poor"
          : item.quality === "poor"),
    ) ??
    scene.results.find((item) => item.choiceId !== chosen.choiceId) ??
    chosen;
  const setup = useMemo(
    () => finalFrame(scene.actors, scene.ballStart, scene.setupAnimation),
    [scene],
  );
  const chosenLabel =
    scene.choices.find((item) => item.id === chosen.choiceId)?.label ??
    "Your choice";
  const otherLabel =
    scene.choices.find((item) => item.id === other.choiceId)?.label ??
    "Another choice";
  return (
    <section className="comparison-screen" aria-label="Choice comparison">
      <p className="eyebrow">SEE THE DIFFERENCE</p>
      <h2>Your choice and another choice</h2>
      <div className="comparison-grid">
        <article>
          <header>
            <span>Your choice</span>
            <strong>{chosenLabel}</strong>
          </header>
          <SceneCanvas
            actors={scene.actors}
            ballStart={scene.ballStart}
            steps={chosen.animationSteps}
            activeArea={scene.activeArea}
            initial={setup}
            runKey={runKey}
            playbackRate={playbackRate}
            mini
            label={`Your choice: ${chosenLabel}`}
          />
          <p>{chosen.teamEffect}</p>
        </article>
        <article>
          <header>
            <span>Another choice</span>
            <strong>{otherLabel}</strong>
          </header>
          <SceneCanvas
            actors={scene.actors}
            ballStart={scene.ballStart}
            steps={other.animationSteps}
            activeArea={scene.activeArea}
            initial={setup}
            runKey={runKey}
            playbackRate={playbackRate}
            mini
            label={`Another choice: ${otherLabel}`}
          />
          <p>{other.teamEffect}</p>
        </article>
      </div>
      <div className="compare-why">
        <span>💡</span>
        <p>
          {chosen.quality === "poor"
            ? other.comparisonLine
            : chosen.comparisonLine}
        </p>
      </div>
      <div className="compare-actions">
        <button className="secondary" onClick={onBack}>
          ‹ Back
        </button>
        <button
          className="secondary"
          onClick={() => {
            setPlaybackRate(1);
            setRunKey((key) => key + 1);
          }}
        >
          ↻ Replay both
        </button>
        <button
          className="secondary"
          onClick={() => {
            setPlaybackRate(0.5);
            setRunKey((key) => key + 1);
          }}
        >
          🐢 Show slowly
        </button>
        <button className="primary" onClick={onContinue}>
          Continue ›
        </button>
      </div>
    </section>
  );
}
