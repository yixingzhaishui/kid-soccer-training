import { useEffect, useMemo, useState } from "react";
import { CartoonPlayer } from "../components/CartoonPlayer";
import {
  ROLE_QUIZ_BEST_KEY,
  mapRoleById,
  mapRoles,
  quizRounds,
  shiftedZone,
  type MapRole,
  type Phase,
} from "../lessons/roleMap";
import type { AnimatedActor } from "../types/soccer";

type Mode = "learn" | "quiz-pick" | "quiz" | "quiz-done";
type Props = {
  childName: string;
  /** The child's saved real-team position (persisted in settings). */
  positionId?: string;
  onPositionChange: (positionId: string) => void;
  onHome: () => void;
  onSpeak: (text: string) => void;
};

const loadBest = () => {
  const raw = Number(localStorage.getItem(ROLE_QUIZ_BEST_KEY) ?? "0");
  return Number.isFinite(raw) ? raw : 0;
};

const actorFor = (role: MapRole): AnimatedActor => ({
  id: role.id,
  team: "blue",
  role: role.name,
  start: role.kickoff,
  facing: 0,
  jerseyNumber: 1 + mapRoles.findIndex((candidate) => candidate.id === role.id),
  name: undefined,
  goalkeeper: role.id === "gk",
});

/** Red ghosts mirror blue's opposite phase so both teams breathe together. */
const redGhosts = (phase: Phase) =>
  mapRoles
    .filter((role) => role.id !== "gk")
    .map((role) => {
      const spot = role.spot[phase === "attack" ? "defend" : "attack"];
      return { id: `ghost-${role.id}`, x: 100 - spot.x, y: spot.y };
    });

function FieldBackground() {
  return (
    <>
      <path d="M4 4 L96 4 L100 60 L0 60Z" fill="url(#roleGrass)" />
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
        strokeWidth=".5"
      />
      <path
        d="M4 17 L18 17 L18 47 L4 47 M96 17 L82 17 L82 47 L96 47"
        fill="none"
        stroke="rgba(255,255,255,.88)"
        strokeWidth=".5"
      />
      <text x="7" y="12" className="role-goal-label">
        🥅 OUR GOAL
      </text>
      <text x="72" y="12" className="role-goal-label">
        THEIR GOAL 🥅
      </text>
    </>
  );
}

export function RoleMapScreen({
  childName,
  positionId,
  onPositionChange,
  onHome,
  onSpeak,
}: Props) {
  const name = childName.trim() || "Nolan";
  const [mode, setMode] = useState<Mode>("learn");
  const [phase, setPhase] = useState<Phase>("attack");
  const [selectedId, setSelectedId] = useState<string>(positionId ?? "ld");
  const [myRoleId, setMyRoleId] = useState<string>(positionId ?? "ld");
  const [round, setRound] = useState(0);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState<null | {
    correct: boolean;
    tappedId: string;
  }>(null);
  const [best, setBest] = useState(loadBest);
  const [quizSeed, setQuizSeed] = useState(() => Math.random());
  const rounds = useMemo(() => quizRounds(quizSeed), [quizSeed]);
  const selected = mapRoleById(selectedId)!;
  const myRole = mapRoleById(myRoleId)!;
  const current = rounds[round];
  const quizPhase: Phase = mode === "quiz" ? current.phase : phase;

  useEffect(() => {
    if (mode === "learn")
      onSpeak(
        `${selected.name}. ${phase === "attack" ? "When we attack" : "When we defend"}: ${selected.duty[phase]}`,
      );
  }, [mode, selected, phase, onSpeak]);
  useEffect(() => {
    if (mode === "quiz" && !feedback) onSpeak(current.prompt);
  }, [mode, round, current, feedback, onSpeak]);

  const tapZone = (roleId: string) => {
    if (mode !== "quiz" || feedback) return;
    const correct = roleId === myRoleId;
    setFeedback({ correct, tappedId: roleId });
    if (correct) {
      setStars((count) => count + 1);
      onSpeak("Yes! That is your zone.");
    } else
      onSpeak(
        current.shift
          ? `Not there. The whole team slides toward the ball. ${myRole.duty[current.phase]}`
          : `Not there. ${myRole.duty[current.phase]}`,
      );
  };
  const nextRound = () => {
    setFeedback(null);
    if (round < rounds.length - 1) setRound((index) => index + 1);
    else {
      const total = stars;
      if (total > best) {
        setBest(total);
        localStorage.setItem(ROLE_QUIZ_BEST_KEY, String(total));
      }
      setMode("quiz-done");
    }
  };
  const startQuiz = () => {
    setQuizSeed(Math.random());
    setRound(0);
    setStars(0);
    setFeedback(null);
    setMode("quiz");
  };

  const zonesToShow =
    mode === "quiz"
      ? mapRoles
      : mapRoles.filter((role) => role.id === selectedId);
  const showPlayers = mode === "learn";

  return (
    <main className="screen role-map-screen">
      <header className="screen-header">
        <button className="ghost" onClick={onHome}>
          ← Home
        </button>
        <h1>🗺️ My Position Map</h1>
        <span className="role-map-best" aria-label={`Best quiz ${best} of 6`}>
          ⭐ {best}/6
        </span>
      </header>

      {mode === "learn" && (
        <div className="role-chip-row" role="tablist" aria-label="Pick a role">
          {mapRoles.map((role) => (
            <button
              key={role.id}
              role="tab"
              aria-selected={role.id === selectedId}
              className={`role-chip ${role.id === selectedId ? "active" : ""}`}
              style={{ borderColor: role.color }}
              onClick={() => setSelectedId(role.id)}
            >
              {role.emoji} {role.name}
            </button>
          ))}
        </div>
      )}

      {(mode === "learn" || mode === "quiz") && (
        <div className="role-field-wrap">
          <svg
            className="scene-canvas role-field"
            viewBox="0 0 100 64"
            role="img"
            aria-label="Position map field"
          >
            <defs>
              <linearGradient id="roleGrass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#52b96c" />
                <stop offset="1" stopColor="#167a43" />
              </linearGradient>
            </defs>
            <FieldBackground />
            {zonesToShow.map((role) => {
              // Quiz zones slide sideways with the ball; the learn map shows
              // the base shape so the child first anchors the home zones.
              const raw =
                mode === "quiz"
                  ? shiftedZone(role, quizPhase, current.ball)
                  : role.zones[quizPhase];
              // Zones share edges on purpose; in quiz mode shrink each target
              // slightly so a tap can never land on two zones at once.
              const inset = mode === "quiz" ? 1.6 : 0;
              const area = {
                x: raw.x + inset,
                y: raw.y + inset,
                width: raw.width - inset * 2,
                height: raw.height - inset * 2,
              };
              const isAnswer = feedback && role.id === myRoleId;
              const isTapped = feedback && role.id === feedback.tappedId;
              const state = !feedback
                ? mode === "quiz"
                  ? "neutral"
                  : "selected"
                : isAnswer
                  ? "correct"
                  : isTapped
                    ? "wrong"
                    : "neutral";
              return (
                <rect
                  key={role.id}
                  className={`role-zone ${state}`}
                  x={area.x}
                  y={area.y}
                  width={area.width}
                  height={area.height}
                  rx="2.4"
                  style={{ color: role.color }}
                  onClick={() => tapZone(role.id)}
                />
              );
            })}
            {mode === "learn" &&
              redGhosts(phase).map((ghost) => (
                <circle
                  key={ghost.id}
                  className="role-ghost"
                  cx={ghost.x}
                  cy={ghost.y}
                  r="1.8"
                  style={{
                    transitionDuration: "900ms",
                  }}
                />
              ))}
            {showPlayers &&
              mapRoles.map((role) => (
                <g
                  key={role.id}
                  onClick={() => setSelectedId(role.id)}
                  className="role-player-hit"
                >
                  <CartoonPlayer
                    actor={actorFor(role)}
                    frame={{
                      position: role.spot[phase],
                      action: "walk",
                      duration: 900,
                    }}
                    mini
                  />
                </g>
              ))}
            <g
              className="role-ball"
              style={{
                transform: `translate(${
                  mode === "quiz"
                    ? current.ball.x
                    : phase === "attack"
                      ? 62
                      : 34
                }px, ${mode === "quiz" ? current.ball.y : 32}px)`,
              }}
            >
              <circle r="1.5" fill="#fff" stroke="#222" strokeWidth=".3" />
            </g>
          </svg>
        </div>
      )}

      {mode === "learn" && (
        <>
          <div className="phase-toggle" role="tablist" aria-label="Game phase">
            <button
              role="tab"
              aria-selected={phase === "attack"}
              className={phase === "attack" ? "active" : ""}
              onClick={() => setPhase("attack")}
            >
              ⚔️ We attack
            </button>
            <button
              role="tab"
              aria-selected={phase === "defend"}
              className={phase === "defend" ? "active" : ""}
              onClick={() => setPhase("defend")}
            >
              🛡️ We defend
            </button>
          </div>
          <section
            className="role-card"
            style={{ borderColor: selected.color }}
          >
            <h2>
              {selected.emoji} {selected.name}
            </h2>
            <p>{selected.duty[phase]}</p>
            <p className="role-cue">
              📣 Sideline word: <strong>{selected.cue}</strong>
            </p>
          </section>
          <button className="primary huge" onClick={() => setMode("quiz-pick")}>
            🎯 Quiz: where should {name} stand?
          </button>
        </>
      )}

      {mode === "quiz-pick" && (
        <section className="role-card role-quiz-pick">
          <h2>Which player are you?</h2>
          <div className="role-chip-row">
            {mapRoles.map((role) => (
              <button
                key={role.id}
                className={`role-chip ${role.id === myRoleId ? "active" : ""}`}
                style={{ borderColor: role.color }}
                onClick={() => {
                  setMyRoleId(role.id);
                  onPositionChange(role.id);
                }}
              >
                {role.emoji} {role.name}
              </button>
            ))}
          </div>
          <button className="primary huge" onClick={startQuiz}>
            ▶ Start quiz
          </button>
          <button className="ghost" onClick={() => setMode("learn")}>
            ← Back to the map
          </button>
        </section>
      )}

      {mode === "quiz" && (
        <section className="role-card role-quiz-card">
          <p className="role-quiz-progress">
            Round {round + 1} of {rounds.length} · ⭐ {stars}
          </p>
          {!feedback && <h2>{current.prompt}</h2>}
          {feedback && (
            <>
              <h2>
                {feedback.correct
                  ? "⭐ Yes! That is your zone."
                  : "❌ Not there."}
              </h2>
              {!feedback.correct && (
                <p>
                  {current.shift
                    ? `The whole team slides toward the ball. ${myRole.duty[current.phase]}`
                    : myRole.duty[current.phase]}
                </p>
              )}
              <button className="primary huge" onClick={nextRound}>
                {round < rounds.length - 1 ? "Next ▶" : "See my stars"}
              </button>
            </>
          )}
        </section>
      )}

      {mode === "quiz-done" && (
        <section className="role-card role-quiz-card">
          <h2>
            {stars === rounds.length
              ? `🏆 Perfect, ${name}! ${stars} of ${rounds.length}!`
              : `⭐ ${stars} of ${rounds.length} zones found!`}
          </h2>
          <p>
            {stars === rounds.length
              ? "You know exactly where your position lives on the field."
              : `Keep looking at the map — your zone moves when the ball changes sides.`}
          </p>
          <button className="primary huge" onClick={startQuiz}>
            🔁 Try again
          </button>
          <button className="ghost" onClick={() => setMode("learn")}>
            🗺️ Back to the map
          </button>
        </section>
      )}
    </main>
  );
}
