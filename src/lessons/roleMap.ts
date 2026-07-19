/**
 * Role map for a 7-a-side 2-2-2 formation (goalkeeper, two defenders, two
 * midfielders, two forwards). Blue attacks the right goal, matching every
 * scene animation in the app.
 *
 * Coordinates use the shared field system: x 0-100 left→right, y 4-60
 * top→bottom. Each role owns three rectangles — where it lives when the
 * whole team attacks, when the whole team defends, and where it starts at
 * kickoff. The zones deliberately overlap a little: real teammates share
 * edges, and the child should see that zones breathe forward and backward
 * together, not that the pitch is split into private boxes.
 */
export type Phase = "attack" | "defend";

export type Zone = { x: number; y: number; width: number; height: number };

export type MapRole = {
  id: string;
  /** Short name the child reads, e.g. "Left Defender". */
  name: string;
  emoji: string;
  color: string;
  /** Kickoff / neutral standing spot. */
  kickoff: { x: number; y: number };
  zones: Record<Phase, Zone>;
  /** Where this player stands inside the zone during each phase. */
  spot: Record<Phase, { x: number; y: number }>;
  duty: Record<Phase, string>;
  /** One word a parent can shout from the sideline. */
  cue: string;
};

const zone = (x: number, y: number, width: number, height: number): Zone => ({
  x,
  y,
  width,
  height,
});

export const mapRoles: MapRole[] = [
  {
    id: "gk",
    name: "Goalkeeper",
    emoji: "🧤",
    color: "#e2a600",
    kickoff: { x: 7, y: 32 },
    zones: {
      attack: zone(2, 16, 18, 32),
      defend: zone(1, 18, 13, 28),
    },
    spot: { attack: { x: 14, y: 32 }, defend: { x: 7, y: 32 } },
    duty: {
      attack: "Step off your line and be the extra passer behind everyone.",
      defend:
        "Protect the goal and shout directions — you see the whole field.",
    },
    cue: "Talk!",
  },
  {
    id: "ld",
    name: "Left Defender",
    emoji: "🛡️",
    color: "#2583da",
    kickoff: { x: 22, y: 18 },
    zones: {
      attack: zone(20, 6, 30, 26),
      defend: zone(4, 6, 26, 27),
    },
    spot: { attack: { x: 36, y: 18 }, defend: { x: 15, y: 20 } },
    duty: {
      attack: "Step up near the halfway line, but always stay behind the ball.",
      defend: "Get between the ball and our goal on your side. This is home.",
    },
    cue: "Stay home!",
  },
  {
    id: "rd",
    name: "Right Defender",
    emoji: "🛡️",
    color: "#2583da",
    kickoff: { x: 22, y: 46 },
    zones: {
      attack: zone(20, 32, 30, 26),
      defend: zone(4, 31, 26, 27),
    },
    spot: { attack: { x: 36, y: 46 }, defend: { x: 15, y: 44 } },
    duty: {
      attack: "Step up near the halfway line, but always stay behind the ball.",
      defend: "Get between the ball and our goal on your side. This is home.",
    },
    cue: "Stay home!",
  },
  {
    id: "lm",
    name: "Left Midfielder",
    emoji: "🧭",
    color: "#8b5cf6",
    kickoff: { x: 42, y: 18 },
    zones: {
      attack: zone(44, 6, 32, 26),
      defend: zone(22, 6, 28, 27),
    },
    spot: { attack: { x: 58, y: 18 }, defend: { x: 34, y: 20 } },
    duty: {
      attack:
        "Be the bridge: help the forwards and offer a pass in the middle.",
      defend: "Run back and fill the middle before the ball gets there.",
    },
    cue: "Help both!",
  },
  {
    id: "rm",
    name: "Right Midfielder",
    emoji: "🧭",
    color: "#8b5cf6",
    kickoff: { x: 42, y: 46 },
    zones: {
      attack: zone(44, 32, 32, 26),
      defend: zone(22, 31, 28, 27),
    },
    spot: { attack: { x: 58, y: 46 }, defend: { x: 34, y: 44 } },
    duty: {
      attack:
        "Be the bridge: help the forwards and offer a pass in the middle.",
      defend: "Run back and fill the middle before the ball gets there.",
    },
    cue: "Help both!",
  },
  {
    id: "lf",
    name: "Left Forward",
    emoji: "⚡",
    color: "#f97316",
    kickoff: { x: 60, y: 20 },
    zones: {
      attack: zone(60, 5, 36, 27),
      defend: zone(42, 8, 22, 25),
    },
    spot: { attack: { x: 78, y: 18 }, defend: { x: 52, y: 22 } },
    duty: {
      attack: "Stay high and wide so their defenders cannot squeeze together.",
      defend: "Drop to the halfway line and rest — do not chase into our box.",
    },
    cue: "Stretch!",
  },
  {
    id: "rf",
    name: "Right Forward",
    emoji: "⚡",
    color: "#f97316",
    kickoff: { x: 60, y: 44 },
    zones: {
      attack: zone(60, 32, 36, 27),
      defend: zone(42, 31, 22, 25),
    },
    spot: { attack: { x: 78, y: 46 }, defend: { x: 52, y: 42 } },
    duty: {
      attack: "Stay high and wide so their defenders cannot squeeze together.",
      defend: "Drop to the halfway line and rest — do not chase into our box.",
    },
    cue: "Stretch!",
  },
];

export const mapRoleById = (id: string) =>
  mapRoles.find((role) => role.id === id);

export type QuizRound = {
  phase: Phase;
  ball: { x: number; y: number };
  prompt: string;
  /** True when the teaching point is the sideways team slide toward the ball. */
  shift: boolean;
};

export const ROLE_QUIZ_BEST_KEY = "nolan-role-quiz-best-v1";

/**
 * The second half of the zone lesson: zones are not painted boxes — the whole
 * team slides sideways toward the ball. A ball near one touchline drags every
 * zone a few steps that way; a central ball leaves the base shape alone.
 */
export function shiftedZone(
  role: MapRole,
  phase: Phase,
  ball: { x: number; y: number },
): Zone {
  const base = role.zones[phase];
  const slide = ball.y < 24 ? -5 : ball.y > 40 ? 5 : 0;
  const y = Math.max(4, Math.min(60 - base.height, base.y + slide));
  return { ...base, y };
}

/** Deterministic small RNG so tests can replay a seed while play stays fresh. */
const mulberry32 = (seed: number) => {
  let state = Math.floor(seed * 2 ** 31) || 1;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

type RoundTemplate = Omit<QuizRound, "ball"> & {
  ballX: [number, number];
  ballY: [number, number];
};
const roundPool: RoundTemplate[] = [
  {
    phase: "defend",
    ballX: [22, 34],
    ballY: [27, 37],
    prompt: "Red has the ball near our goal. Tap YOUR zone.",
    shift: false,
  },
  {
    phase: "attack",
    ballX: [58, 70],
    ballY: [27, 37],
    prompt: "We have the ball in their half. Tap YOUR zone.",
    shift: false,
  },
  {
    phase: "defend",
    ballX: [42, 52],
    ballY: [27, 37],
    prompt: "Red wins the ball in the middle. Tap YOUR zone.",
    shift: false,
  },
  {
    phase: "attack",
    ballX: [34, 46],
    ballY: [27, 37],
    prompt: "Our defender has the ball. Tap YOUR zone.",
    shift: false,
  },
  {
    phase: "attack",
    ballX: [70, 82],
    ballY: [27, 37],
    prompt: "We attack near their box. Tap YOUR zone.",
    shift: false,
  },
  {
    phase: "defend",
    ballX: [24, 36],
    ballY: [8, 18],
    prompt: "Red attacks down one wing — the whole team slides! Tap YOUR zone.",
    shift: true,
  },
  {
    phase: "defend",
    ballX: [24, 36],
    ballY: [46, 56],
    prompt:
      "Red attacks the other wing — everyone slides across! Tap YOUR zone.",
    shift: true,
  },
  {
    phase: "attack",
    ballX: [56, 68],
    ballY: [8, 18],
    prompt:
      "Our winger has it on the touchline — slide with the ball! Tap YOUR zone.",
    shift: true,
  },
  {
    phase: "attack",
    ballX: [56, 68],
    ballY: [46, 56],
    prompt: "We attack down the far side — slide over! Tap YOUR zone.",
    shift: true,
  },
];

/**
 * Six random rounds per run: always at least two sideways-slide rounds and
 * both phases, never the same order twice, ball position jittered inside each
 * template window so answers cannot be memorized by position.
 */
export function quizRounds(seed = Math.random()): QuizRound[] {
  const random = mulberry32(seed);
  const pick = (pool: RoundTemplate[], count: number) => {
    const copy = [...pool];
    const chosen: RoundTemplate[] = [];
    while (chosen.length < count && copy.length)
      chosen.push(copy.splice(Math.floor(random() * copy.length), 1)[0]);
    return chosen;
  };
  const base = pick(
    roundPool.filter((round) => !round.shift),
    4,
  );
  const slides = pick(
    roundPool.filter((round) => round.shift),
    2,
  );
  const mixed = [...base, ...slides];
  for (let index = mixed.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    [mixed[index], mixed[swap]] = [mixed[swap], mixed[index]];
  }
  return mixed.map((template) => ({
    phase: template.phase,
    prompt: template.prompt,
    shift: template.shift,
    ball: {
      x: template.ballX[0] + random() * (template.ballX[1] - template.ballX[0]),
      y: template.ballY[0] + random() * (template.ballY[1] - template.ballY[0]),
    },
  }));
}

/**
 * Bridge from the child's real 2-2-2 position to the 11-a-side scene
 * curriculum. Each list is a hand-picked, age-first path: the reviewed core
 * scenes of the matching roles plus the simplest teamwork combinations. The
 * app shows this as "My Position Pack" so the child never has to know what
 * an "attacking midfielder" is to find their own lessons.
 */
const forwardPack = [
  "STR-01",
  "STR-02",
  "STR-03",
  "STR-04",
  "STR-05",
  "STR-06",
  "STR-08",
  "WNG-01",
  "WNG-03",
  "WNG-05",
  "TW-06",
  "STR-07",
];
const midfielderPack = [
  "CM-01",
  "CM-02",
  "CM-03",
  "CM-04",
  "CM-05",
  "CM-06",
  "CM-07",
  "CM-08",
  "AM-04",
  "DM-04",
  "TW-04",
  "TW-09",
];
const defenderPack = [
  "CB-01",
  "CB-02",
  "CB-03",
  "CB-04",
  "CB-05",
  "CB-06",
  "FB-01",
  "FB-02",
  "FB-03",
  "FB-05",
  "FB-06",
  "DM-06",
];
export const positionPackIds: Record<string, string[]> = {
  gk: [
    "GK-01",
    "GK-02",
    "GK-03",
    "GK-04",
    "GK-05",
    "GK-06",
    "GK-07",
    "GK-12",
    "GK-18",
    "GK-22",
  ],
  ld: defenderPack,
  rd: defenderPack,
  lm: midfielderPack,
  rm: midfielderPack,
  lf: forwardPack,
  rf: forwardPack,
};

export const pointInZone = (
  point: { x: number; y: number },
  target: Zone,
): boolean =>
  point.x >= target.x &&
  point.x <= target.x + target.width &&
  point.y >= target.y &&
  point.y <= target.y + target.height;
