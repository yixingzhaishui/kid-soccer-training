import type { AnimatedActor, AnimatedChoice, Point } from "../types/soccer";
import { optionIntent } from "../logic/optionSemantics";

type Props = {
  choice: AnimatedChoice;
  displayLabel?: string;
  nolan: AnimatedActor;
  actors: AnimatedActor[];
  ballStart: Point;
  onClick: () => void;
  disabled?: boolean;
};
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export function ChoiceCard({
  choice,
  displayLabel,
  nolan,
  actors,
  ballStart,
  onClick,
  disabled,
}: Props) {
  const move = choice.previewAnimation.find(
      (item) => item.actorId === "nolan" && item.to,
    ),
    intent = optionIntent(choice.label);
  const from = move?.from ?? nolan.start,
    to = move?.to ?? nolan.start,
    moved = distance(from, to) > 1.5;
  const bend = Math.max(
      -8,
      Math.min(8, (to.y - from.y) * 0.25 + (to.x - from.x > 0 ? -4 : 4)),
    ),
    mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 + bend };
  const route = `M${from.x} ${from.y} Q${mid.x} ${mid.y} ${to.x} ${to.y}`;
  const nearby = actors
    .filter((actor) => actor.id !== "nolan")
    .sort(
      (a, b) => distance(a.start, nolan.start) - distance(b.start, nolan.start),
    );
  const shown = [
    ...nearby.filter((actor) => actor.team === "blue").slice(0, 2),
    ...nearby.filter((actor) => actor.team === "red").slice(0, 3),
  ];
  const name = (nolan.name ?? "Tom").toUpperCase(),
    facing = choice.previewFacing,
    caption =
      intent === "closed-receive"
        ? `Watch ${nolan.name ?? "Tom"} receive closed`
        : intent === "orient"
          ? `Watch ${nolan.name ?? "Tom"} scan and open`
          : intent === "ball" ||
              intent === "ball-travel" ||
              intent === "ball-hold"
            ? `Watch ${nolan.name ?? "Tom"} play the ball`
            : intent === "hold" || intent === "active-hold"
              ? `Watch ${nolan.name ?? "Tom"} hold position`
              : intent === "defend"
                ? `Watch ${nolan.name ?? "Tom"} protect space`
                : `Watch ${nolan.name ?? "Tom"} move`;
  return (
    <button
      className="choice-card"
      onClick={onClick}
      disabled={disabled}
      aria-label={displayLabel ?? choice.label}
    >
      <svg
        className="choice-preview"
        viewBox="0 0 100 64"
        aria-hidden="true"
        data-testid={`role-path-${choice.id}`}
      >
        <rect width="100" height="64" rx="7" fill="#258c50" />
        <path
          d="M3 4H97V60H3ZM50 4V60M42 32a8 8 0 1 0 16 0 8 8 0 1 0-16 0"
          fill="none"
          stroke="#ffffff99"
          strokeWidth="1"
        />
        {shown.map((actor) => (
          <g
            key={actor.id}
            className={`preview-person ${actor.team}`}
            transform={`translate(${actor.start.x} ${actor.start.y})`}
          >
            <circle cy="-2.3" r="2" />
            <path d="M0 0v5M-2 2l2 1 2-1M0 5l-2 3M0 5l2 3" />
            <text x="0" y="3" textAnchor="middle">
              {actor.jerseyNumber}
            </text>
          </g>
        ))}
        {choice.previewBall ? (
          <circle className="preview-context-ball moving-ball" r="2.2">
            <animate
              attributeName="cx"
              values={`${choice.previewBall.from.x};${choice.previewBall.to.x};${choice.previewBall.from.x}`}
              dur="1.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values={`${choice.previewBall.from.y};${choice.previewBall.to.y};${choice.previewBall.from.y}`}
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
        ) : (
          <circle
            className="preview-context-ball"
            cx={ballStart.x}
            cy={ballStart.y}
            r="2.2"
          />
        )}
        {moved ? (
          <>
            <path className="role-motion-path" d={route} />
            <circle className="role-destination" cx={to.x} cy={to.y} r="4" />
            <g className="preview-person blue active moving">
              <animateMotion
                path={route}
                dur="1.8s"
                repeatCount="indefinite"
                keyPoints="0;1;0"
                keyTimes="0;.65;1"
                calcMode="linear"
              />
              <g className="role-facing">
                <circle cy="-2.5" r="2.4" />
                <path d="M0 0v6M-2.5 2l2.5 1 2.5-1M0 6l-2.2 3.4M0 6l2.2 3.4" />
                <polygon className="facing-pointer" points="2,-3 7,-1 2,1" />
                {facing && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values={`${facing.from};${facing.to};${facing.from}`}
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                )}
              </g>
            </g>
          </>
        ) : (
          <g
            className="preview-person blue active staying"
            transform={`translate(${from.x} ${from.y})`}
          >
            <g className="role-facing">
              <circle cy="-2.5" r="2.4" />
              <path d="M0 0v6M-2.5 2l2.5 1 2.5-1M0 6l-2.2 3.4M0 6l2.2 3.4" />
              <polygon className="facing-pointer" points="2,-3 7,-1 2,1" />
              {facing && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values={`${facing.from};${facing.to};${facing.from}`}
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              )}
            </g>
            <circle className="stay-ring" r="6" />
          </g>
        )}
        <g className="preview-key">
          <rect x="4" y="5" width="30" height="9" rx="4.5" />
          <text x="19" y="11.5" textAnchor="middle">
            {name} PATH
          </text>
        </g>
      </svg>
      <span className="choice-icon">{choice.icon}</span>
      <strong>{displayLabel ?? choice.label}</strong>
      <small>{caption}</small>
    </button>
  );
}
