export type Point = { x: number; y: number };
export type ActiveArea = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
};
export type Team = "blue" | "red";
export type SceneCategory =
  | "winger"
  | "striker"
  | "central-midfielder"
  | "attacking-midfielder"
  | "defensive-midfielder"
  | "fullback"
  | "center-defender"
  | "goalkeeper"
  | "teamwork";
export type SceneStage = 1 | 2 | 3;
export type Action =
  | "run"
  | "walk"
  | "turn"
  | "dribble"
  | "pass"
  | "shoot"
  | "receive"
  | "defend"
  | "celebrate"
  | "react"
  | "camera"
  | "scan"
  | "press"
  | "cross"
  | "block"
  | "clear"
  | "set"
  | "dive"
  | "catch"
  | "parry"
  | "shield";

export type AnimatedActor = {
  id: string;
  role: string;
  team: Team;
  start: Point;
  facing: number;
  jerseyNumber: number;
  name?: string;
  goalkeeper?: boolean;
};

export type AnimationStep = {
  startTime: number;
  duration: number;
  actorId?: string;
  action: Action;
  from?: Point;
  to?: Point;
  targetId?: string;
  emotion?: "happy" | "worried" | "surprised";
  cameraZoom?: number;
};

export type AnimatedChoice = {
  id: string;
  label: string;
  spokenLabel: string;
  predictionLabel?: string;
  icon: string;
  previewAnimation: AnimationStep[];
  previewFacing?: { from: number; to: number };
  previewBall?: { from: Point; to: Point; action: Action };
};

export type ChoiceResult = {
  choiceId: string;
  animationSteps: AnimationStep[];
  narration: string;
  explanation: string;
  quality: "best" | "good" | "poor";
  freezeFrameTime: number;
  teamEffect: string;
  comparisonLine: string;
};

export type AnimatedScenario = {
  id: string;
  title: string;
  category: SceneCategory;
  role: string;
  stage: SceneStage;
  formalConcept: string;
  skillId: string;
  visibleCue: string;
  playerDuty: string;
  introNarration: string;
  prompt: string;
  actors: AnimatedActor[];
  ballStart: Point;
  setupAnimation: AnimationStep[];
  pauseTime: number;
  activeArea: ActiveArea;
  choices: AnimatedChoice[];
  results: ChoiceResult[];
};

export type ScenePack = {
  id: SceneCategory;
  name: string;
  icon: string;
  color: string;
  description: string;
  scenes: AnimatedScenario[];
};

export type SceneProgress = {
  completed: boolean;
  plays: number;
  best: number;
  good: number;
  poor: number;
  score: number;
  lastChoiceId?: string;
};
export type Progress = {
  sceneResults: Record<string, SceneProgress>;
  lastSceneId?: string;
};
export type Settings = {
  speechEnabled: boolean;
  reducedMotion: boolean;
  childName: string;
  languageLevel: "younger" | "older";
  /** The child's real 2-2-2 position id from the role map (e.g. "lf"). */
  positionId?: string;
};
