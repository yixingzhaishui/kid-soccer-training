import { useEffect, useMemo, useState } from "react";
import {
  applyAnimationStep,
  initialFrame,
  timelineDuration,
  type SceneFrame,
} from "../logic/timeline";
import type {
  ActiveArea,
  AnimatedActor,
  AnimationStep,
  Point,
} from "../types/soccer";
import { CartoonPlayer } from "./CartoonPlayer";

type Props = {
  actors: AnimatedActor[];
  ballStart: Point;
  steps: AnimationStep[];
  runKey: number;
  activeArea?: ActiveArea;
  initial?: SceneFrame;
  onComplete?: () => void;
  mini?: boolean;
  label?: string;
  playbackRate?: number;
};
export function SceneCanvas({
  actors,
  ballStart,
  steps,
  runKey,
  activeArea,
  initial,
  onComplete,
  mini = false,
  label = "Animated soccer scene",
  playbackRate = 1,
}: Props) {
  const base = useMemo(
    () => initial ?? initialFrame(actors, ballStart),
    [actors, ballStart, initial],
  );
  const goalkeepers = useMemo(
    () => actors.filter((actor) => actor.goalkeeper),
    [actors],
  );
  const [frame, setFrame] = useState<SceneFrame>(base);
  useEffect(() => {
    setFrame(base);
    const reduced =
        document.documentElement.dataset.reduceMotion === "true" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      scale = reduced ? 0.05 : 1 / Math.max(0.25, playbackRate),
      ordered = [...steps].sort((a, b) => a.startTime - b.startTime),
      duration = timelineDuration(steps) * scale;
    let frameId = 0,
      applied = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start,
        due: AnimationStep[] = [];
      while (
        applied < ordered.length &&
        ordered[applied].startTime * scale <= elapsed
      ) {
        due.push({
          ...ordered[applied],
          duration: ordered[applied].duration * scale,
        });
        applied++;
      }
      if (due.length)
        setFrame((current) => due.reduce(applyAnimationStep, current));
      if (elapsed >= duration + 180) {
        onComplete?.();
        return;
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [base, steps, runKey, onComplete, playbackRate]);
  return (
    <div className={`scene-canvas-wrap ${mini ? "mini" : ""}`}>
      <svg
        className="scene-canvas"
        viewBox="0 0 100 64"
        role="img"
        aria-label={label}
      >
        <defs>
          <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#52b96c" />
            <stop offset="1" stopColor="#167a43" />
          </linearGradient>
          <filter id="ballShadow">
            <feDropShadow dx="0" dy=".7" stdDeviation=".4" floodOpacity=".5" />
          </filter>
          <clipPath id="fieldClip">
            <path d="M4 4 L96 4 L100 60 L0 60Z" />
          </clipPath>
        </defs>
        <path d="M4 4 L96 4 L100 60 L0 60Z" fill="url(#grass)" />
        <g
          clipPath="url(#fieldClip)"
          className="field-camera"
          style={{ transform: `scale(${frame.cameraZoom})` }}
        >
          {[0, 1, 2, 3, 4, 5].map((stripe) => (
            <path
              key={stripe}
              d={`M${4 + stripe * 16} 4 L${20 + stripe * 16} 4 L${24 + stripe * 16} 60 L${stripe * 16} 60Z`}
              fill={stripe % 2 ? "rgba(255,255,255,.035)" : "rgba(0,0,0,.035)"}
            />
          ))}
          <path
            d="M4 4 L96 4 L100 60 L0 60Z M50 4 L50 60 M39 32 A11 8 0 1 0 61 32 A11 8 0 1 0 39 32"
            fill="none"
            stroke="rgba(255,255,255,.88)"
            strokeWidth=".7"
          />
          <path
            d="M4 17 L19 17 L20 47 L2 47 M96 17 L81 17 L80 47 L98 47"
            fill="none"
            stroke="rgba(255,255,255,.88)"
            strokeWidth=".7"
          />
          <path
            d="M3 25 L-1 25 L-1 40 L2 40 M97 25 L101 25 L101 40 L98 40"
            fill="none"
            stroke="#e7f5ed"
            strokeWidth="1.1"
          />
          {activeArea && (
            <g
              className="active-play-area"
              aria-label={`Active area: ${activeArea.label}`}
            >
              <rect
                x={activeArea.x}
                y={activeArea.y}
                width={activeArea.width}
                height={activeArea.height}
                rx="4"
              />
              <text
                x={activeArea.x + activeArea.width / 2}
                y={activeArea.y + 4}
                textAnchor="middle"
              >
                ACTIVE: {activeArea.label.toUpperCase()}
              </text>
            </g>
          )}
          {goalkeepers.map((keeper) => {
            const left = keeper.start.x < 50;
            return (
              <g
                key={`${keeper.id}-goal`}
                className={`goal-owner ${keeper.team}`}
                aria-label={`${keeper.team} team's goal`}
              >
                <rect
                  x={left ? 1 : 92}
                  y="28.5"
                  width="7"
                  height="7"
                  rx="1.5"
                />
                <text x={left ? 4.5 : 95.5} y="31.3" textAnchor="middle">
                  {keeper.team.toUpperCase()}
                </text>
                <text x={left ? 4.5 : 95.5} y="34" textAnchor="middle">
                  GOAL
                </text>
              </g>
            );
          })}
          {[...actors]
            .sort(
              (a, b) =>
                (frame.actors[a.id]?.position.y ?? a.start.y) -
                (frame.actors[b.id]?.position.y ?? b.start.y),
            )
            .map((item) => (
              <CartoonPlayer
                key={item.id}
                actor={item}
                frame={frame.actors[item.id] ?? base.actors[item.id]}
                mini={mini}
              />
            ))}
          <g
            className="game-ball"
            data-testid="game-ball"
            style={{
              transform: `translate(${frame.ball.x}px, ${Math.min(58, frame.ball.y + 4.5)}px)`,
              transitionDuration: `${frame.ballDuration}ms`,
            }}
          >
            <circle className="ball-glow" cx="0" cy="0" r={mini ? 2 : 3} />
            <ellipse cx="0" cy="1.5" rx="1.8" ry=".7" fill="rgba(0,0,0,.38)" />
            <g className="ball-spin">
              <circle
                cx="0"
                cy="0"
                r={mini ? 1.45 : 1.95}
                fill="white"
                stroke="#111827"
                strokeWidth=".5"
                filter="url(#ballShadow)"
              />
              <path
                d="M0 -1.25 L.9 -.35 L.55 1 L-.65 1 L-1 -.35Z"
                fill="#111827"
              />
              <path
                d="M0 -1.25 L0 -1.8 M.9 -.35 L1.6 -.7 M.55 1 L.9 1.55 M-.65 1 L-1.2 1.5 M-1 -.35 L-1.65 -.7"
                stroke="#111827"
                strokeWidth=".32"
              />
            </g>
          </g>
        </g>
        {!mini && (
          <>
            <g className="crowd">
              <circle cx="12" cy="3" r="1.2" />
              <circle cx="17" cy="3" r="1.2" />
              <circle cx="22" cy="3" r="1.2" />
              <circle cx="78" cy="3" r="1.2" />
              <circle cx="83" cy="3" r="1.2" />
              <circle cx="88" cy="3" r="1.2" />
            </g>
            <text className="field-caption" x="50" y="63" textAnchor="middle">
              {(
                actors.find((actor) => actor.id === "nolan")?.name ?? "TOM"
              ).toUpperCase()}
              ’S MATCH
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
