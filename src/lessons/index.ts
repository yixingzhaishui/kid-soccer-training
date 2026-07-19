import inventoryMarkdown from "../../SCENARIO_INVENTORY.md?raw";
import type {
  ActiveArea,
  AnimatedActor,
  AnimatedChoice,
  AnimatedScenario,
  AnimationStep,
  ChoiceResult,
  Point,
  SceneCategory,
  ScenePack,
  SceneStage,
} from "../types/soccer";
import { applyAnimationStep, finalFrame } from "../logic/timeline";
import {
  kickActions,
  movementActions,
  optionIntent,
  pointDistance,
} from "../logic/optionSemantics";
import {
  repairAnimationGeometry,
  spreadActorStarts,
} from "../logic/geometryRepair";
import { visuallyOccludes, visuallySameOnPhone } from "../logic/spatialQuality";
import { repairTacticalTrajectory } from "../logic/tacticalQuality";
import { bespokeAnimationIds, sceneOverrides } from "./sceneOverrides";

type InventoryRow = {
  id: string;
  role: string;
  trigger: string;
  decision: string;
  good: string;
  poor: string;
  location: string;
  assets: string;
};
type Meta = {
  title: string;
  goodLabel: string;
  poorLabel: string;
  icon: string;
};

const metadata: Record<string, Meta> = Object.fromEntries(
  `
WNG-01|Stay Wide|Stay wide|Crowd the ball|↔
WNG-02|Read the Fullback|Attack open side|Run at cover|🧭
WNG-03|Cross Early|Cross now|Keep dribbling|🥅
WNG-04|End-Line Cutback|Cut it back|Cross blindly|↩
WNG-05|Back-Post Run|Run back post|Watch outside|⚡
WNG-06|Short or Behind|Read defender|Choose wrong run|👀
WNG-07|Track the Overlap|Track fullback|Stay high|🏃
WNG-08|Counter With Width|Sprint wide|Run central|🪽
STR-01|Near or Far Post|Attack near post|Follow defender|🎯
STR-02|Check to the Ball|Come short|Wait high|↙
STR-03|Run Behind|Sprint behind|Come crowded|⚡
STR-04|Hold It Up|Shield and lay off|Turn blindly|🛡️
STR-05|Shoot or Square|Pass across goal|Shoot narrow|👟
STR-06|Follow the Rebound|Attack rebound|Celebrate early|💥
STR-07|Curve the Press|Block one side|Press straight|🌙
STR-08|Stay Onside|Delay the run|Go too early|🚩
CM-01|Scan First|Scan and turn|Receive blind|👀
CM-02|Turn or Play Back|Read the pressure|Force the turn|🔄
CM-03|Switch the Play|Switch sides|Stay crowded|↔
CM-04|Support Behind|Drop to help|Run away|🔻
CM-05|Third-Player Run|Run beyond|Watch the pass|3️⃣
CM-06|Control the Tempo|Slow and regroup|Rush forward|⏱️
CM-07|Cover the Fullback|Cover the channel|Join the attack|🧹
CM-08|Arrive Late|Wait then arrive|Run in early|⏳
AM-01|Find the Pocket|Move between lines|Stand by striker|🪄
AM-02|Turn Between Lines|Scan and turn|Turn blind|👀
AM-03|Play the Runner|Through pass now|Delay the pass|🧵
AM-04|One-Two Near Goal|Pass and continue|Pass and stop|🔁
AM-05|Edge of the Box|Read shot lane|Force the shot|🎯
AM-06|Win It Back|Counterpress now|Complain and jog|⚡
DM-01|Screen the Striker|Block central lane|Chase the ball|🚧
DM-02|Escape the Press|Open safe side|Close the body|🧭
DM-03|Cover Inside|Slide inside|Stay central|↔
DM-04|Track the Runner|Follow runner|Watch the ball|🏃
DM-05|Break the Line|Pass forward|Pass sideways|⬆
DM-06|Delay the Counter|Jockey and wait|Dive into tackle|⏳
FB-01|Show Outside|Guide outside|Open inside|➡
FB-02|Stop the Cross|Close early|Wait too long|🚫
FB-03|Overlap|Run outside|Stand behind|🏃
FB-04|Underlap|Run inside|Duplicate width|↗
FB-05|Know When to Hold|Stay and protect|Both go forward|✋
FB-06|Recover Inside|Sprint goal-side|Jog straight back|⚡
CB-01|Stay Goal-Side|Get goal-side|Follow wrong side|🛡️
CB-02|Step or Drop|Drop with runner|Step without pressure|⬇
CB-03|Cover the Partner|Slide behind|Both step|🤝
CB-04|Clear the Danger|Clear wide|Pass across goal|💨
CB-05|Track the Cross|Track striker|Watch the ball|👀
CB-06|Hold the Line|Step together|Drop alone|📏
GK-01|Set the Angle|Set and narrow|Stay on line|🧤
GK-02|Sweep the Through Ball|Come quickly|Hesitate|⚡
GK-03|Parry Safely|Push it wide|Parry central|↗
GK-04|Open-Side Distribution|Roll wide|Roll central|🎳
GK-05|Organize the Corner|Point and mark|Stay silent|📣
GK-06|Claim the Cross|Come and catch|Stay on line|🙌
GK-07|Make the Second Save|Recover and set|Watch rebound|🔄
TW-01|Share the Space|Split the lanes|Stay together|↔
TW-02|Support Triangle|Make a triangle|Stand in a line|🔺
TW-03|Wall Pass|Pass and run|Pass and wait|🔁
TW-04|Third-Player Team Run|Third player goes|Everyone watches|3️⃣
TW-05|Team Switch|Recycle and switch|Follow the ball|🔄
TW-06|Attack a 2v1|Wait then pass|Pass too early|2️⃣
TW-07|Defend a 2v1|Delay and protect|Dive in|🛡️
TW-08|Pressure Cover Balance|Take three jobs|All chase|⚖️
TW-09|Three-Lane Counter|Fill three lanes|Bunch central|⚡
TW-10|Protect the Lead|Shield or recycle|Cross blindly|🔒`
    .trim()
    .split("\n")
    .map((line) => {
      const [id, title, goodLabel, poorLabel, icon] = line.split("|");
      return [id, { title, goodLabel, poorLabel, icon }];
    }),
);

const baseRows: InventoryRow[] = inventoryMarkdown
  .split("## Duplicate-concept review")[0]
  .split("\n")
  .filter((line) =>
    /^\| (WNG-|STR-|CM-|AM-|DM-|FB-|CB-|GK-|TW-)\d\d /.test(line),
  )
  .map((line) => {
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    return {
      id: cells[0],
      role: cells[1],
      trigger: cells[2],
      decision: cells[3],
      good: cells[4],
      poor: cells[5],
      location: cells[6],
      assets: cells[7],
    };
  });

type ExpansionConfig = {
  prefix: string;
  role: string;
  core: number;
  topics: string[];
};
const expansionConfigs: ExpansionConfig[] = [
  {
    prefix: "WNG",
    role: "Winger",
    core: 8,
    topics: [
      "First Touch Down Line",
      "Receive on the Back Foot",
      "Protect Near Touchline",
      "Use the Overlap Decoy",
      "Combine With an Underlap",
      "Cross Low Behind Defense",
      "Clip the Far-Post Cross",
      "Delay Until Support Arrives",
      "Attack an Isolated Center Back",
      "Rotate With Number Ten",
      "Change Wings After Recycle",
      "D:Press the Opposing Fullback",
      "D:Block the Clearance Lane",
      "D:Defend the Back Post",
      "D:Recover Through the Inside Lane",
      "Become the Corner-Kick Outlet",
      "Carry the Counter to Commit",
      "Release the Overlapping Fullback",
      "Protect a Lead by the Corner",
      "Attack a Tired Defender",
      "Escape a Double Team",
      "Win and Use the Throw-In",
    ],
  },
  {
    prefix: "STR",
    role: "Striker",
    core: 8,
    topics: [
      "Move on the Blind Side",
      "Pin the Center Defender",
      "Spin Off the Shoulder",
      "Dummy the Near-Post Cross",
      "Finish the Pullback",
      "Choose One Touch or Control",
      "Chip the Rushing Goalkeeper",
      "Finish With the Weak Foot",
      "Time the Header",
      "Attack the Cutback Zone",
      "Clear Space for a Teammate",
      "Drag a Center Back Wide",
      "Bounce Pass Under Contact",
      "Shield and Win the Foul",
      "D:Press the Goalkeeper",
      "D:Jump on a Back-Pass Trigger",
      "D:Screen the Holding Midfielder",
      "D:Defend the Near Post at a Corner",
      "Become the Counterattack Outlet",
      "Secure a Direct Clearance",
      "Attack the Second Cross",
      "React to a Loose Box Ball",
    ],
  },
  {
    prefix: "CM",
    role: "Central midfielder",
    core: 8,
    topics: [
      "Receive Behind the First Press",
      "Carry Through an Open Midfield",
      "Draw Pressure Before Passing",
      "Play Around the Corner",
      "Find the Opposite Fullback",
      "Recycle Through the Center Back",
      "Change the Passing Angle",
      "Support a Wide Overload",
      "Balance an Attacking Triangle",
      "Play Into the Striker Feet",
      "Follow the Pass Into Space",
      "Disguise the Forward Pass",
      "D:Protect the Center After Turnover",
      "D:Track an Opposing Number Eight",
      "D:Double the Wide Ball",
      "D:Collect the Second Ball",
      "D:Stop the Cutback Runner",
      "D:Screen the Counter Pass",
      "Manage the Final Minute",
      "Speed Up Against a Backpedaling Line",
      "Offer Behind a Trapped Winger",
      "Arrive for the Recycled Cross",
    ],
  },
  {
    prefix: "AM",
    role: "Attacking midfielder",
    core: 6,
    topics: [
      "Receive on the Half Turn",
      "Drift Away From the Holding Midfielder",
      "Find the Weak-Side Pocket",
      "Slip a Reverse Pass",
      "Play the Wide Runner Through",
      "Disguise the Striker Pass",
      "Carry at the Back Four",
      "Commit a Defender Then Release",
      "Create the Box Overload",
      "Attack the Penalty Spot Late",
      "Combine With the Overlap",
      "Use the Underlapping Runner",
      "Recycle a Blocked Attack",
      "Shoot After a Layoff",
      "Follow a Saved Shot",
      "D:Press the Opponent Pivot",
      "D:Trap the Fullback After Turnover",
      "D:Recover Goal-Side of Number Six",
      "D:Block the First Counter Pass",
      "D:Compete for the Second Ball",
      "Protect Possession Near the Box",
      "Draw a Foul Between Lines",
      "Switch to the Opposite Winger",
      "Create Space With a Decoy Run",
    ],
  },
  {
    prefix: "DM",
    role: "Defensive midfielder",
    core: 6,
    topics: [
      "Drop Between Center Backs",
      "Show for the Goalkeeper",
      "Turn Away From the First Presser",
      "Switch From the Base",
      "Break Pressure With a Bounce Pass",
      "Carry Into the Free Lane",
      "Hold Position During Both Overlaps",
      "Cover the Center Back Who Steps",
      "D:Screen the Number Ten",
      "D:Close the Top of the Box",
      "D:Protect the Cutback Zone",
      "D:Win the Second Ball",
      "D:Track the Late Midfield Runner",
      "D:Shift Behind the Press",
      "D:Cover the Opposite Half-Space",
      "D:Delay a Wide Counter",
      "D:Stop the Central Counter",
      "D:Defend the Box Edge",
      "D:Organize the Midfield Line",
      "D:Choose When to Tackle",
      "Recycle While Protecting a Lead",
      "Find the Advanced Eight",
      "Support Behind a Risky Pass",
      "Become the Safe Throw-In Option",
    ],
  },
  {
    prefix: "FB",
    role: "Fullback",
    core: 6,
    topics: [
      "Receive From the Goalkeeper",
      "Break the First Press Wide",
      "Play Inside Then Move",
      "Switch Through the Back Line",
      "Cross From Deep",
      "Cut Back From the End Line",
      "Support Without Overlapping",
      "Create a Wide Two Against One",
      "Invert Into Midfield",
      "Recognize the Winger Rotation",
      "D:Delay the Fast Winger",
      "D:Stop the Inside Cut",
      "D:Track the Overlap",
      "D:Defend the Back-Post Cross",
      "D:Protect the Cutback",
      "D:Cover the Center Back",
      "D:Win the Far-Post Header",
      "D:Step With the Defensive Line",
      "D:Recover After a Set Piece",
      "D:Clear the Loose Wide Ball",
      "Manage a One-Goal Lead",
      "Become the Counter Outlet",
      "Underlap After a Switch",
      "Recycle When the Cross Is Blocked",
    ],
  },
  {
    prefix: "CB",
    role: "Center defender",
    core: 6,
    topics: [
      "Play Through the Open Fullback",
      "Carry Into Midfield",
      "Break a Line With a Pass",
      "Switch to the Weak Side",
      "Find the Defensive Midfielder",
      "Use the Goalkeeper to Escape",
      "D:Defend a Direct Long Ball",
      "D:Win the First Header",
      "D:Collect the Second Ball",
      "D:Track a Channel Run",
      "D:Pass On a Crossing Runner",
      "D:Defend the Near-Post Cross",
      "D:Defend the Cutback Zone",
      "D:Block the Edge-of-Box Shot",
      "D:Delay the Central Counter",
      "D:Cover Behind the Fullback",
      "D:Stay Compact With the Partner",
      "D:Step Into an Interception",
      "D:Drop When the Passer Looks Up",
      "D:Clear Behind for a Corner",
      "Organize the Line at a Free Kick",
      "Protect Possession Under Pressure",
      "Choose the Safe Throw-In",
      "Manage the Last Attack",
    ],
  },
  {
    prefix: "GK",
    role: "Goalkeeper",
    core: 7,
    topics: [
      "Set for a Near-Post Shot",
      "Set for a Far-Post Shot",
      "Hold a Clean Low Shot",
      "Tip a High Shot Over",
      "Smother at the Striker Feet",
      "Spread in a One Against One",
      "Sweep Outside the Box",
      "Clear a Back Pass Under Pressure",
      "Pass Through the First Line",
      "Clip the Ball to the Fullback",
      "Throw a Fast Counterattack",
      "Slow Distribution to Protect a Lead",
      "Switch Distribution After a Press",
      "Call the Defensive Line Up",
      "Organize a Wide Free Kick",
      "Build the Corner-Kick Wall",
      "Claim a Near-Post Corner",
      "Punch Through Crowded Traffic",
      "Stay for an Outswinging Cross",
      "Come for an Inswinging Cross",
      "Recover to the Goal Line",
      "Cover the Fullback Back Pass",
      "Manage the Final Aerial Ball",
    ],
  },
];
const goodConsequences = [
  "Blue breaks the next line and attacks facing forward.",
  "Nolan creates a clear teammate chance.",
  "The team keeps the ball and gains field position.",
  "The opponent is forced away from the dangerous space.",
  "Blue reaches the next action before the defense resets.",
  "Nolan’s movement opens two useful passing lanes.",
  "The ball reaches a teammate in space.",
  "Blue controls the moment and keeps team shape.",
];
const poorConsequences = [
  "The passing window closes and blue must retreat.",
  "The opponent reaches the dangerous space first.",
  "Two blue players become trapped in one lane.",
  "The rushed action gives the opponent a fast counter.",
  "A free opponent receives behind Nolan.",
  "The ball runs out and the attack ends.",
  "The defense resets before blue can use the opening.",
  "Nolan arrives late and the teammate is left alone.",
];
const locationByRole: Record<string, string> = {
  WNG: "Wide channel",
  STR: "Central final third",
  CM: "Middle third",
  AM: "Between lines",
  DM: "Space before defense",
  FB: "Wide defensive and attacking lane",
  CB: "Central defensive third",
  GK: "Penalty area",
};
function matchTrigger(title: string, location: string, defensive: boolean) {
  const action = title.toLowerCase(),
    place = location.toLowerCase();
  if (/corner|free kick|wall/.test(action))
    return `${defensive ? "Red" : "Blue"} has a set piece near ${place}; Nolan checks the ball, the goal, and every runner before ${action}.`;
  if (/cross|cutback|far-post|near-post|header|aerial/.test(action))
    return `The ball moves into a wide crossing position while attackers and defenders race into ${place}; Nolan must read ${action}.`;
  if (/shot|finish|rebound|saved|loose box|one against one/.test(action))
    return `A shot can happen in ${place} and the goalkeeper and defenders are still moving; Nolan sees the cue for ${action}.`;
  if (/press|turnover|counter|back-pass|clearance/.test(action))
    return `Possession changes suddenly in ${place}; both teams sprint to reset and Nolan must decide how to ${action}.`;
  if (/receive|turn|first touch|back foot|under pressure/.test(action))
    return `A pass travels toward Nolan in ${place} as an opponent closes from the blind side; the match problem is ${action}.`;
  if (/run|overlap|underlap|track|recover|rotate|move|drift/.test(action))
    return `A teammate and an opponent make opposite runs through ${place}; Nolan must time ${action} without breaking the team shape.`;
  if (/switch|opposite|weak side|recycle|distribution|pass/.test(action))
    return `The near side of ${place} becomes crowded while space opens across the field; Nolan reads when to ${action}.`;
  return `${defensive ? "Red attacks" : "Blue builds"} through ${place} as nearby teammates and opponents change lanes; Nolan recognizes the moment to ${action}.`;
}
function poorChoiceLabel(title: string, defensive: boolean) {
  const action = title.toLowerCase();
  if (/parry|tip/.test(action)) return "Push the ball central";
  if (/claim|catch|smother|come for/.test(action))
    return "Stay on the goal line";
  if (/clear/.test(action)) return "Play across your own goal";
  if (/finish|shot|shoot|header|rebound|loose box/.test(action))
    return "Wait for one more touch";
  if (/switch|opposite|weak.side|recycle/.test(action))
    return "Keep playing into traffic";
  if (/press|close|step|jump on/.test(action)) return "Wait and press too late";
  if (/track|cover|screen|recover|defend|protect.*zone/.test(action))
    return "Chase only the ball";
  if (/cross|cut back|cutback/.test(action))
    return "Keep dribbling into pressure";
  if (/overlap|underlap|run|move|rotate|drift|arrive/.test(action))
    return "Stand and watch the play";
  if (/receive|turn|first touch|back foot/.test(action))
    return "Receive without scanning";
  if (/delay|slow|manage|protect a lead|hold position/.test(action))
    return "Rush forward immediately";
  if (/pass|play|find|release|distribution|throw/.test(action))
    return "Force the closed passing lane";
  return defensive
    ? "Leave the dangerous player"
    : "Carry into the crowded space";
}
const expansionRows: InventoryRow[] = [];
for (const config of expansionConfigs) {
  config.topics.forEach((raw, offset) => {
    const defensive = raw.startsWith("D:"),
      title = raw.replace(/^D:/, ""),
      location = locationByRole[config.prefix];
    const number = config.core + offset + 1,
      id = `${config.prefix}-${String(number).padStart(2, "0")}`,
      action = title.toLowerCase(),
      goodOpeners = [
        `Nolan spots the cue early and chooses when to ${action}.`,
        `Good scan: Nolan sees the space for ${action} before it closes.`,
        `Nolan checks the moving players, then decides to ${action}.`,
      ],
      poorOpeners = [
        `Nolan reacts after the opening for ${action} has closed.`,
        `Nolan watches the ball but misses the moving-player cue for ${action}.`,
        `The first option disappears before Nolan tries to ${action}.`,
      ];
    metadata[id] = {
      title,
      goodLabel: title,
      poorLabel: poorChoiceLabel(title, defensive),
      icon: defensive ? "🛡️" : "⚽",
    };
    expansionRows.push({
      id,
      role: config.role,
      trigger: matchTrigger(title, location, defensive),
      decision: title,
      good: `${goodOpeners[number % goodOpeners.length]} ${goodConsequences[(number + config.prefix.charCodeAt(0)) % goodConsequences.length]}`,
      poor: `${poorOpeners[number % poorOpeners.length]} ${poorConsequences[(number * 2 + config.prefix.charCodeAt(1)) % poorConsequences.length]}`,
      location,
      assets: `${defensive ? "defensive " : ""}${title.toLowerCase()} movement, ball, teammates, opponents`,
    });
  });
}
// Individually reviewed scene fixes: replace template-generated triggers and
// consequences (and the rare wrong title) with hand-written, scene-specific
// text. Applied only to expansion rows; core rows come from the reviewed
// inventory markdown.
for (const row of expansionRows) {
  const override = sceneOverrides[row.id];
  if (!override) continue;
  if (override.trigger) row.trigger = override.trigger;
  if (override.good) row.good = override.good;
  if (override.poor) row.poor = override.poor;
  if (override.title) {
    row.decision = override.title;
    metadata[row.id].title = override.title;
  }
  if (override.goodLabel) metadata[row.id].goodLabel = override.goodLabel;
  if (override.poorLabel) metadata[row.id].poorLabel = override.poorLabel;
  if (override.icon) metadata[row.id].icon = override.icon;
}
const rows: InventoryRow[] = [...baseRows, ...expansionRows];
const reviewedCoreIds = new Set(baseRows.map((row) => row.id));

type DutyFamily =
  | "cross"
  | "finish"
  | "receive"
  | "combine"
  | "switch"
  | "carry"
  | "hold"
  | "move"
  | "press"
  | "cover"
  | "delay"
  | "set-piece"
  | "build"
  | "possession"
  | "gk-shot"
  | "gk-cross"
  | "gk-sweep"
  | "gk-distribute"
  | "gk-organize";
function dutyFamily(row: InventoryRow): DutyFamily {
  const text = `${row.decision} ${row.trigger}`.toLowerCase();
  if (row.id === "STR-28") return "receive";
  if (row.id === "AM-10") return "combine";
  if (row.id.startsWith("GK-")) {
    if (/organize|wall|line up|call/.test(text)) return "gk-organize";
    if (/distribution|pass|throw|back pass|counterattack/.test(text))
      return "gk-distribute";
    if (/sweep|striker feet|one against one|outside the box/.test(text))
      return "gk-sweep";
    if (/cross|corner|aerial|punch|claim/.test(text)) return "gk-cross";
    return "gk-shot";
  }
  // A post-corner counter can mention a corner, but the named teaching action
  // is still delay/jockey — not set-piece defending.
  if (/delay|slow|manage|protect a lead|hold position/.test(text))
    return "delay";
  if (/corner|free kick|throw-in|set piece|aerial|header/.test(text))
    return "set-piece";
  if (/press|clearance lane|win it back|counterpress|turnover/.test(text))
    return "press";
  if (/track|cover|screen|recover|protect the cutback|defend|mark/.test(text))
    return "cover";
  if (/cross|cut back|cutback|end line/.test(text)) return "cross";
  if (/finish|shoot|shot|rebound|loose box|penalty spot/.test(text))
    return "finish";
  if (/receive|first touch|back foot|half turn|turn away|scan/.test(text))
    return "receive";
  if (/one-two|wall pass|bounce pass|combine|third.player/.test(text))
    return "combine";
  if (/switch|opposite|weak side|change wings/.test(text)) return "switch";
  if (/shield|hold up|protect near|secure a direct/.test(text)) return "hold";
  if (/carry|beat|attack an isolated|commit a defender|dribble/.test(text))
    return "carry";
  if (/run|move|overlap|underlap|rotate|drift|arrive|outlet/.test(text))
    return "move";
  if (
    /goalkeeper|center back|back line|build|recycle|safe option|show for/.test(
      text,
    )
  )
    return "build";
  return "possession";
}
const dutyLabels: Record<DutyFamily, string> = {
  cross: "create the cross",
  finish: "finish the chance",
  receive: "scan and receive",
  combine: "combine together",
  switch: "use the open side",
  carry: "attack with the ball",
  hold: "protect the ball",
  move: "make the helpful run",
  press: "press together",
  cover: "protect the danger",
  delay: "slow the attack",
  "set-piece": "set-piece duty",
  build: "help the build-up",
  possession: "keep team shape",
  "gk-shot": "protect the goal",
  "gk-cross": "control the cross",
  "gk-sweep": "sweep behind defense",
  "gk-distribute": "start the attack",
  "gk-organize": "organize defenders",
};
function attackingSkillId(row: InventoryRow, text: string) {
  const id = row.id;
  if (id === "CB-07") return "A15";
  if (id === "CB-11") return "A07";
  if (id === "CB-27") return "D12";
  if (id === "CB-29") return "A06";
  if (id === "DM-27") return "T05";
  if (id === "FB-14") return "A06";
  if (id === "FB-16") return "A05";
  if (id === "WNG-08") return "T01";
  if (id === "WNG-12") return "A11";
  if (id === "STR-14") return "A04";
  if (id === "STR-20" || id === "CM-15" || id === "AM-15") return "A05";
  if (id === "CM-13" || id === "CM-14") return "A06";
  if (id === "CM-19") return "A09";
  if (id === "AM-08") return "A02";
  if (id === "AM-10" || id === "AM-12") return "A25";
  if (id === "AM-19") return "A07";
  if (id === "AM-27") return "A10";
  if (id === "AM-29") return "A15";
  if (/counter.*width|three.lane|counter outlet|carry the counter/.test(text))
    return "T01";
  if (/protect(?:ing)? (?:a )?lead|final minute|manage the last/.test(text))
    return "T05";
  if (/rest defense|hold position during|know when to hold/.test(text))
    return "T04";
  if (/rebound|saved shot|loose box/.test(text)) return "A24";
  if (/shoot or|square|shot lane|edge of the box/.test(text)) return "A23";
  if (/finish|near or far post|penalty spot|header/.test(text)) return "A22";
  if (/back.post run|far.post run/.test(text)) return "A21";
  if (/cutback|cut back|end.line/.test(text)) return "A20";
  if (/cross/.test(text)) return "A19";
  if (/underlap/.test(text)) return "A18";
  if (/overlap/.test(text)) return "A17";
  if (/tempo|slow|speed up/.test(text)) return "A16";
  if (/switch|opposite|weak.side|change wings/.test(text)) return "A15";
  if (/third.player/.test(text)) return "A14";
  if (/one.two|wall pass|bounce pass|combine/.test(text)) return "A13";
  if (
    /beat|body position|body shape|isolated|tired defender|double team/.test(
      text,
    )
  )
    return "A12";
  if (/carry|commit|draw pressure/.test(text)) return "A11";
  if (
    /shield|hold up|protect.*ball|protect possession|secure.*clearance/.test(
      text,
    )
  )
    return "A10";
  if (
    /run behind|blind side|shoulder|stay onside|provide depth|follow the pass/.test(
      text,
    )
  )
    return "A09";
  if (/stay wide|hold width|sprint wide/.test(text)) return "A08";
  if (/support behind|drop between|safe reset|recycle/.test(text)) return "A07";
  if (/support|show for|triangle|outlet|passing angle/.test(text)) return "A06";
  if (
    /make space|share the space|decoy|clear space|rotate|drag a center back|overload/.test(
      text,
    )
  )
    return "A05";
  if (/first touch|one touch or control/.test(text)) return "A04";
  if (/open body|back foot|half turn/.test(text)) return "A03";
  if (
    /pocket|between lines|come short|receive behind|trapped winger|drift away/.test(
      text,
    )
  )
    return "A02";
  return "A01";
}
function skillIdFor(row: InventoryRow) {
  const text = `${row.decision} ${row.trigger}`.toLowerCase(),
    id = row.id,
    defensive = defensiveIds.has(id) || row.assets.startsWith("defensive");
  const coreSkillIds: Record<string, string> = {
    "WNG-01": "A08",
    "WNG-02": "A12",
    "WNG-03": "A19",
    "WNG-04": "A20",
    "WNG-05": "A21",
    "WNG-06": "A02",
    "WNG-07": "D06",
    "WNG-08": "T01",
    "STR-01": "A22",
    "STR-02": "A02",
    "STR-03": "A09",
    "STR-04": "A10",
    "STR-05": "A23",
    "STR-06": "A24",
    "STR-07": "D02",
    "STR-08": "A09",
    "CM-01": "A01",
    "CM-02": "A03",
    "CM-03": "A15",
    "CM-04": "A07",
    "CM-05": "A14",
    "CM-06": "A16",
    "CM-07": "D03",
    "CM-08": "A22",
    "AM-01": "A02",
    "AM-02": "A03",
    "AM-03": "A26",
    "AM-04": "A13",
    "AM-05": "A23",
    "AM-06": "T03",
    "AM-07": "A03",
    "DM-01": "D05",
    "DM-02": "A03",
    "DM-03": "D03",
    "DM-04": "D06",
    "DM-05": "A26",
    "DM-06": "D11",
    "FB-01": "D08",
    "FB-02": "D09",
    "FB-03": "A17",
    "FB-04": "A18",
    "FB-05": "T04",
    "FB-06": "T02",
    "CB-01": "D07",
    "CB-02": "D13",
    "CB-03": "D03",
    "CB-04": "D19",
    "CB-05": "D16",
    "CB-06": "D12",
    "GK-01": "G01",
    "GK-02": "G05",
    "GK-03": "G03",
    "GK-04": "G09",
    "GK-05": "G10",
    "GK-06": "G07",
    "GK-07": "G11",
    "TW-01": "A05",
    "TW-02": "A06",
    "TW-03": "A13",
    "TW-04": "A14",
    "TW-05": "A15",
    "TW-06": "A11",
    "TW-07": "D11",
    "TW-08": "D04",
    "TW-09": "T01",
    "TW-10": "T05",
  };
  if (coreSkillIds[id]) return coreSkillIds[id];
  const reviewedExtendedSkillIds: Record<string, string> = {
    "WNG-09": "A04",
    "WNG-10": "A03",
    "WNG-11": "A10",
    "WNG-12": "A05",
    "WNG-13": "A13",
    "WNG-18": "A05",
    "WNG-19": "A15",
    "WNG-22": "D16",
    "WNG-30": "A06",
    "STR-09": "A09",
    "STR-10": "A27",
    "STR-12": "A05",
    "STR-15": "A23",
    "STR-18": "A22",
    "STR-21": "A13",
    "STR-24": "D01",
    "STR-26": "D15",
    "STR-29": "A22",
    "CM-12": "A13",
    "CM-13": "A15",
    "CM-14": "A07",
    "CM-18": "A26",
    "CM-20": "A25",
    "CM-21": "T04",
    "CM-22": "D06",
    "CM-23": "D03",
    "CM-30": "A22",
    "AM-11": "A26",
    "AM-20": "A23",
    "AM-25": "D05",
    "AM-28": "A10",
    "AM-30": "A05",
    "DM-09": "A04",
    "DM-10": "A15",
    "DM-14": "D03",
    "DM-16": "D10",
    "DM-20": "D03",
    "DM-23": "D11",
    "DM-25": "D12",
    "DM-28": "A26",
    "DM-29": "A07",
    "DM-30": "A06",
    "FB-07": "A03",
    "FB-08": "A04",
    "FB-09": "A13",
    "FB-10": "A15",
    "FB-13": "A06",
    "FB-15": "A05",
    "FB-17": "D11",
    "FB-21": "D17",
    "FB-22": "D03",
    "FB-24": "D12",
    "FB-27": "T05",
    "FB-30": "A07",
    "CB-09": "A26",
    "CB-10": "A15",
    "CB-12": "A07",
    "CB-16": "D06",
    "CB-18": "D15",
    "CB-22": "D03",
    "CB-23": "D03",
    "CB-24": "D03",
    "CB-26": "D19",
    "GK-08": "G01",
    "GK-09": "G01",
    "GK-10": "G02",
    "GK-11": "G03",
    "GK-12": "G04",
    "GK-13": "G06",
    "GK-14": "G05",
    "GK-15": "G09",
    "GK-16": "G09",
    "GK-17": "G09",
    "GK-18": "G09",
    "GK-19": "G09",
    "GK-20": "G09",
    "GK-21": "G10",
    "GK-22": "G10",
    "GK-23": "G10",
    "GK-24": "G07",
    "GK-25": "G08",
    "GK-26": "G12",
    "GK-27": "G07",
    "GK-28": "G13",
    "GK-29": "G09",
    "GK-30": "G07",
  };
  if (reviewedExtendedSkillIds[id]) return reviewedExtendedSkillIds[id];
  if (!id.startsWith("GK-") && !defensive) return attackingSkillId(row, text);
  if (id === "CB-13") return "D13";
  if (id === "CB-27") return "D12";
  if (id.startsWith("GK-")) {
    if (/organize|wall|call|line up/.test(text)) return "G10";
    if (/second save|recover|rebound/.test(text)) return "G11";
    if (/punch/.test(text)) return "G08";
    if (/claim|come for.*cross|catch.*cross/.test(text)) return "G07";
    if (/distribution|pass|throw|roll|counterattack/.test(text)) return "G09";
    if (/spread|one against one/.test(text)) return "G06";
    if (/sweep|through ball|outside the box/.test(text)) return "G05";
    if (/smother|striker feet/.test(text)) return "G04";
    if (/parry|tip/.test(text)) return "G03";
    if (/catch|hold a clean/.test(text)) return "G02";
    return "G01";
  }
  if (/counterpress|win it back|after turnover/.test(text)) return "T03";
  if (/recover|defensive transition/.test(text)) return "T02";
  if (/protect a lead|final minute|manage the last/.test(text)) return "T05";
  if (/rest defense|hold position during|know when to hold/.test(text))
    return "T04";
  if (/squeeze|line up|hold the line|step together/.test(text)) return "D12";
  if (/drop when|step or drop|unpressured/.test(text)) return "D13";
  if (/pass on|exchange mark/.test(text)) return "D14";
  if (/near.post cross/.test(text)) return "D15";
  if (/far.post|back.post cross|track the cross/.test(text)) return "D16";
  if (/cutback zone|cutback runner/.test(text)) return "D17";
  if (/second ball|first header|collect/.test(text)) return "D18";
  if (/clear danger|clear wide|loose wide ball/.test(text)) return "D19";
  if (/when to tackle|tackle timing/.test(text)) return "D20";
  if (/delay.*counter|defend a 2v1/.test(text)) return "D11";
  if (/block.*shot|box edge/.test(text)) return "D10";
  if (/stop the cross|block.*cross|close down early/.test(text)) return "D09";
  if (/show outside|stop the inside cut/.test(text)) return "D08";
  if (/goal.side|stay compact/.test(text)) return "D07";
  if (/track.*runner|track.*overlap|late midfield runner/.test(text))
    return "D06";
  if (/screen|block.*lane|protect the center/.test(text)) return "D05";
  if (/balance|opposite half.space|weak side/.test(text)) return "D04";
  if (/cover|slide behind|shift behind/.test(text)) return "D03";
  if (/curve.*press|block one side/.test(text)) return "D02";
  if (/press|close the top|step into/.test(text)) return "D01";
  return "D03";
}

const categoryFor = (id: string): SceneCategory =>
  id.startsWith("WNG")
    ? "winger"
    : id.startsWith("STR")
      ? "striker"
      : id.startsWith("CM")
        ? "central-midfielder"
        : id.startsWith("AM")
          ? "attacking-midfielder"
          : id.startsWith("DM")
            ? "defensive-midfielder"
            : id.startsWith("FB")
              ? "fullback"
              : id.startsWith("CB")
                ? "center-defender"
                : id.startsWith("GK")
                  ? "goalkeeper"
                  : "teamwork";
const defensiveIds = new Set([
  "WNG-07",
  "STR-07",
  "CM-07",
  "AM-06",
  "DM-01",
  "DM-03",
  "DM-04",
  "DM-06",
  "FB-01",
  "FB-02",
  "FB-05",
  "FB-06",
  "CB-01",
  "CB-02",
  "CB-03",
  "CB-04",
  "CB-05",
  "CB-06",
  "CB-13",
  "CB-27",
  "GK-01",
  "GK-02",
  "GK-03",
  "GK-04",
  "GK-05",
  "GK-06",
  "GK-07",
  "TW-07",
  "TW-08",
]);
const crossers = new Set(["WNG-03", "WNG-04", "FB-03", "FB-04"]);
const finishers = new Set([
  "WNG-05",
  "STR-01",
  "STR-03",
  "STR-06",
  "CM-08",
  "AM-05",
]);
const passFinishers = new Set(["STR-05", "AM-03", "TW-06"]);
const alternateLabels: Record<string, string> = {
  "WNG-06": "Come short",
  "STR-05": "Take a safe shot",
  "CM-02": "Play back",
  "AM-05": "Recycle safely",
  "DM-02": "Return first-time",
  "FB-05": "Slide central",
  "CB-04": "Pass wide",
  "GK-04": "Throw wide",
  "TW-02": "Use other corner",
};
const p = (x: number, y: number): Point => ({ x, y });
function focusedDutyArea(
  row: InventoryRow,
  fallback: ActiveArea,
  nolan: Point,
  carrier: Point,
  target: Point,
): ActiveArea {
  if (reviewedCoreIds.has(row.id)) return fallback;
  const family = dutyFamily(row),
    wide = ["cross", "move", "gk-cross"].includes(family),
    large = family === "switch",
    width = large ? 62 : wide ? 36 : family.startsWith("gk-") ? 27 : 32,
    height = wide ? 24 : family.startsWith("gk-") ? 34 : 30;
  const focusX = family.startsWith("gk-") ? 8 : (nolan.x + carrier.x) / 2,
    focusY = wide ? nolan.y : (nolan.y + carrier.y) / 2;
  return {
    x: Math.max(1, Math.min(99 - width, focusX - width / 2)),
    y: Math.max(5, Math.min(59 - height, focusY - height / 2)),
    width,
    height,
    label: dutyLabels[family],
  };
}
const step = (
  startTime: number,
  duration: number,
  action: AnimationStep["action"],
  actorId?: string,
  from?: Point,
  to?: Point,
  emotion?: AnimationStep["emotion"],
): AnimationStep => ({
  startTime,
  duration,
  action,
  actorId,
  from,
  to,
  emotion,
});
const actor = (
  id: string,
  team: "blue" | "red",
  role: string,
  start: Point,
  number: number,
  name?: string,
  goalkeeper = false,
): AnimatedActor => ({
  id,
  team,
  role,
  start,
  facing: team === "blue" ? 0 : 180,
  jerseyNumber: number,
  name,
  goalkeeper,
});
const result = (
  choiceId: string,
  quality: ChoiceResult["quality"],
  narration: string,
  explanation: string,
  teamEffect: string,
  animationSteps: AnimationStep[],
): ChoiceResult => ({
  choiceId,
  quality,
  narration,
  explanation,
  teamEffect,
  comparisonLine:
    quality === "poor"
      ? "The other choice helps the whole team."
      : "This choice solves the game problem.",
  animationSteps,
  freezeFrameTime: Math.max(
    ...animationSteps.map((item) => item.startTime + item.duration),
  ),
});
const choice = (
  id: string,
  label: string,
  icon: string,
  action: AnimationStep["action"],
  from: Point,
  to: Point,
  previewFacing?: AnimatedChoice["previewFacing"],
  previewBall?: AnimatedChoice["previewBall"],
): AnimatedChoice => ({
  id,
  label,
  spokenLabel: label,
  icon,
  previewAnimation: [step(0, 1100, action, "nolan", from, to)],
  previewFacing,
  previewBall,
});
function rolePreview(
  steps: AnimationStep[],
  start: Point,
  fallback: Point,
  comparison: AnimationStep[] = [],
) {
  const bodyActions = new Set([
      "run",
      "walk",
      "turn",
      "dribble",
      "defend",
      "scan",
      "press",
      "shield",
      "set",
      "dive",
    ]),
    motions = steps.filter(
      (item) =>
        item.actorId === "nolan" && item.to && bodyActions.has(item.action),
    ),
    other = comparison.filter(
      (item) =>
        item.actorId === "nolan" && item.to && bodyActions.has(item.action),
    ),
    signature = (item: AnimationStep | undefined) =>
      item
        ? `${item.action}:${item.from?.x},${item.from?.y}>${item.to?.x},${item.to?.y}`
        : "";
  const motion =
    motions.find(
      (item, index) => signature(item) !== signature(other[index]),
    ) ?? motions[0];
  return {
    action: motion?.action ?? "walk",
    from: motion?.from ?? start,
    to: motion?.to ?? fallback,
  };
}
function semanticDestination(
  l: ReturnType<typeof layout>,
  quality: "good" | "poor",
) {
  const preferred = quality === "good" ? l.goodTo : l.badTo;
  if (pointDistance(l.nolan, preferred) >= 4) return preferred;
  const direction = l.defending ? -1 : 1,
    vertical = l.nolan.y < 32 ? 8 : -8;
  return clampPoint(p(l.nolan.x + direction * 12, l.nolan.y + vertical));
}
function optionDestination(
  label: string,
  l: ReturnType<typeof layout>,
  quality: "good" | "poor",
) {
  const text = label.toLowerCase(),
    start = l.nolan,
    vertical = start.y < 32 ? -1 : 1;
  // DM-07 is a build-out action, not a generic retreat. Tom drops only into
  // the split centre-backs, receives facing the field, then progresses the
  // ball. Keeping this coordinate explicit prevents the option card from
  // showing a route back toward Blue's goal.
  if (/drop between center backs/.test(text)) return p(start.x - 13, start.y);
  if (/drop|play back|recycle|reset|come short|support behind/.test(text))
    return clampPoint(p(start.x - 12, start.y - vertical * 5));
  if (/run away|stay high|watch outside|celebrate early/.test(text))
    return clampPoint(p(start.x + 13, start.y + vertical * 9));
  if (/wide|outside|touchline/.test(text))
    return clampPoint(p(start.x + 5, start.y < 32 ? 10 : 54));
  if (/central|inside/.test(text)) return clampPoint(p(start.x + 6, 32));
  if (/back post|far post/.test(text))
    return clampPoint(p(Math.max(start.x + 15, 78), start.y < 32 ? 51 : 13));
  if (/near post|behind|overlap|underlap/.test(text))
    return clampPoint(p(start.x + 15, start.y + vertical * 7));
  if (/press|close|track|get goal-side|recover|cover|slide/.test(text))
    return clampPoint(l.carrier);
  return semanticDestination(l, quality);
}
function namedKick(label: string): AnimationStep["action"] {
  if (/^cross|^cut/i.test(label)) return "cross";
  if (/^shoot|^finish/i.test(label)) return "shoot";
  if (/^clear/i.test(label)) return "clear";
  if (/^(?:push|parry|tip)/i.test(label)) return "parry";
  return "pass";
}
function neutralChoiceIcon(label: string) {
  const intent = optionIntent(label);
  if (["ball", "ball-hold"].includes(intent)) return "⚽";
  if (intent === "ball-travel") return "🔁";
  if (["travel", "defend"].includes(intent)) return "🏃";
  if (["orient", "closed-receive"].includes(intent)) return "👀";
  if (["hold", "active-hold"].includes(intent)) return "⏸️";
  return "🧭";
}
function predictionLabel(
  row: InventoryRow,
  quality: "good" | "alternate" | "poor",
  defending: boolean,
) {
  if (quality === "alternate") return "Blue keeps a safe option";
  if (quality === "poor")
    return defending ? "Red reaches the danger" : "The opening closes";
  const family = dutyFamily(row);
  if (defending)
    return family === "press"
      ? "Red is forced away"
      : "Blue protects the danger";
  if (["finish", "cross"].includes(family)) return "Blue creates a chance";
  if (["switch", "combine"].includes(family)) return "Blue finds open space";
  return "Blue keeps the move going";
}
function enforceOptionResult(
  label: string,
  quality: "good" | "poor",
  l: ReturnType<typeof layout>,
  raw: AnimationStep[],
): AnimationStep[] {
  const intent = optionIntent(label),
    start = l.nolan,
    destination = optionDestination(label, l, quality);
  if (intent === "closed-receive")
    return [
      step(0, 800, "pass", "blue1", l.carrier, start),
      step(650, 500, "receive", "nolan", start, start),
      step(900, 1100, "press", "red1", undefined, start),
      step(1700, 600, "block", "red1", start, start),
      step(
        2200,
        1000,
        "dribble",
        "red1",
        start,
        p(Math.max(12, start.x - 16), Math.max(8, Math.min(56, start.y + 8))),
      ),
      step(3200, 500, "react", "nolan", undefined, undefined, "worried"),
    ];
  if (intent === "active-hold") {
    const withoutRole = raw.filter((item) => item.actorId !== "nolan");
    return [
      step(0, 700, "scan", "nolan", start, start),
      step(650, 1000, "defend", "nolan", start, start),
      ...withoutRole,
      step(3300, 500, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (intent === "ball-hold") {
    const action = namedKick(label),
      target = quality === "good" ? l.target : l.badTo;
    return [
      step(0, 500, "receive", "nolan", start, start),
      step(500, 850, action, "nolan", start, target),
      step(1300, 600, "receive", "blue2", target, target),
      step(1700, 900, "press", "red1", undefined, target),
      step(
        2700,
        500,
        "react",
        "nolan",
        undefined,
        undefined,
        quality === "poor" ? "worried" : "happy",
      ),
      step(
        3300,
        500,
        "react",
        "blue2",
        undefined,
        undefined,
        quality === "poor" ? "worried" : "happy",
      ),
    ];
  }
  if (intent === "ball-travel") {
    const action = namedKick(label),
      target = l.target;
    return [
      step(0, 700, action, "nolan", start, target),
      step(300, 1500, "run", "nolan", start, destination),
      step(900, 600, "receive", "blue2", target, target),
      step(1700, 700, "pass", "blue2", target, destination),
      step(2500, 500, "receive", "nolan", destination, destination),
      step(3200, 500, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (intent === "hold") {
    const withoutRole = raw.filter((item) => item.actorId !== "nolan");
    return [
      step(
        0,
        1500,
        "react",
        "nolan",
        start,
        start,
        quality === "poor" ? "worried" : undefined,
      ),
      ...withoutRole,
      step(
        3300,
        500,
        "react",
        "nolan",
        undefined,
        undefined,
        quality === "poor" ? "worried" : "happy",
      ),
    ];
  }
  if (intent === "orient") {
    const withoutEarlyWrong = raw.filter(
      (item) =>
        !(
          item.actorId === "nolan" &&
          item.startTime < 1000 &&
          movementActions.has(item.action)
        ),
    );
    return [
      step(0, 550, "scan", "nolan", start, start),
      step(
        500,
        650,
        "turn",
        "nolan",
        start,
        p(start.x + (l.defending ? -1.5 : 1.5), start.y),
      ),
      ...withoutEarlyWrong.map((item) => ({
        ...item,
        startTime: item.startTime + 900,
      })),
    ];
  }
  if (intent === "travel") {
    const first = raw.find(
        (item) =>
          item.actorId === "nolan" &&
          item.from &&
          item.to &&
          movementActions.has(item.action) &&
          pointDistance(item.from, item.to) >= 3.5,
      ),
      old = first?.to;
    const mapped = raw.map((item) => {
      const replace = (point: Point | undefined) =>
        point && old && pointDistance(point, old) < 1.5 ? destination : point;
      if (item === first) return { ...item, from: start, to: destination };
      const blueFollow =
        !l.defending &&
        item.actorId &&
        l.actors.find((actor) => actor.id === item.actorId)?.team === "blue";
      return blueFollow
        ? { ...item, from: replace(item.from), to: replace(item.to) }
        : item;
    });
    return first
      ? mapped
      : [
          step(
            0,
            1400,
            quality === "poor" ? "walk" : "run",
            "nolan",
            start,
            destination,
          ),
          ...raw
            .filter(
              (item) =>
                item.actorId !== "nolan" || !movementActions.has(item.action),
            )
            .map((item) => ({ ...item, startTime: item.startTime + 700 })),
        ];
  }
  if (intent === "ball") {
    const action = namedKick(label);
    if (/recycle.*switch/i.test(label) && quality === "good") return raw;
    if (/recycle|play back|return/i.test(label)) {
      const reset = p(Math.min(start.x - 8, l.carrier.x), l.carrier.y);
      return [
        step(0, 500, "receive", "nolan", start, start),
        step(600, 850, "pass", "nolan", start, reset),
        step(1400, 500, "receive", "blue1", reset, reset),
        step(
          2000,
          900,
          "dribble",
          "blue1",
          reset,
          p(Math.max(10, reset.x - 8), reset.y + 5),
        ),
        step(3000, 500, "celebrate", "nolan", undefined, undefined, "happy"),
      ];
    }
    const hasKick = raw.some(
      (item) => item.actorId === "nolan" && kickActions.has(item.action),
    );
    if (hasKick) return raw;
    const target = quality === "good" ? l.target : l.badTo;
    return [
      step(0, 700, "receive", "nolan", start, start),
      step(650, 900, action, "nolan", start, target),
      step(
        1450,
        700,
        quality === "good" ? "receive" : "block",
        quality === "good" ? "blue2" : "red1",
        target,
        target,
      ),
      ...raw
        .filter((item) => item.actorId !== "nolan")
        .map((item) => ({ ...item, startTime: item.startTime + 1600 })),
    ];
  }
  return raw;
}

const roleBallActions = new Set<AnimationStep["action"]>([
  "receive",
  "dribble",
  "shield",
  "pass",
  "cross",
  "clear",
  "shoot",
]);
const ballDeliveryActions = new Set<AnimationStep["action"]>([
  "pass",
  "cross",
  "clear",
]);

/**
 * An action only teaches soccer when the child can see how Tom got the ball.
 * Some old generic templates began with Tom dribbling or passing even though
 * Blue's centre-back still owned the ball. Establish a visible delivery first
 * and move the remaining consequence later as one sequence.
 */
function establishTomPossession(
  l: ReturnType<typeof layout>,
  raw: AnimationStep[],
): AnimationStep[] {
  if (l.defending) return raw;
  const ordered = [...raw].sort((a, b) => a.startTime - b.startTime);
  const firstRoleBallAction = ordered.find(
    (item) => item.actorId === "nolan" && roleBallActions.has(item.action),
  );
  if (!firstRoleBallAction) return raw;
  const receivePoint = firstRoleBallAction.from ?? l.nolan;
  const deliveryAlreadyShown = ordered.some((item) => {
    if (item.startTime >= firstRoleBallAction.startTime || !item.to)
      return false;
    const actor = item.actorId
      ? l.actors.find((candidate) => candidate.id === item.actorId)
      : undefined;
    return (
      actor?.team === "blue" &&
      ballDeliveryActions.has(item.action) &&
      pointDistance(item.to, receivePoint) < 4
    );
  });
  if (deliveryAlreadyShown) return raw;

  const shifted = raw
    .filter(
      (item) =>
        !(
          item === firstRoleBallAction &&
          item.action === "receive" &&
          pointDistance(item.to ?? receivePoint, receivePoint) < 1.5
        ),
    )
    .map((item) => ({ ...item, startTime: item.startTime + 1100 }));
  return [
    step(0, 650, "pass", "blue1", l.carrier, receivePoint),
    step(600, 450, "receive", "nolan", receivePoint, receivePoint),
    ...shifted,
  ];
}
function semanticChoice(
  id: string,
  label: string,
  icon: string,
  quality: "good" | "poor",
  l: ReturnType<typeof layout>,
  steps: AnimationStep[],
  comparison: AnimationStep[],
): AnimatedChoice {
  const intent = optionIntent(label),
    start = l.nolan,
    ordered = [...steps].sort((a, b) => a.startTime - b.startTime),
    base = rolePreview(
      ordered,
      start,
      quality === "good" ? l.goodTo : l.badTo,
      comparison,
    );
  if (intent === "active-hold")
    return choice(id, label, icon, "scan", start, start, {
      from: l.defending ? 0 : 180,
      to: l.defending ? 75 : 105,
    });
  if (intent === "ball-hold") {
    const action = namedKick(label),
      kick = ordered.find(
        (item) =>
          item.actorId === "nolan" && kickActions.has(item.action) && item.to,
      ),
      target = kick?.to ?? (quality === "good" ? l.target : l.badTo);
    return choice(id, label, icon, action, start, start, undefined, {
      from: kick?.from ?? start,
      to: target,
      action,
    });
  }
  if (intent === "ball-travel") {
    const action = namedKick(label),
      kick = ordered.find(
        (item) =>
          item.actorId === "nolan" && kickActions.has(item.action) && item.to,
      ),
      motion = ordered.find(
        (item) =>
          item.actorId === "nolan" &&
          item.to &&
          rolePathActions.has(item.action),
      ),
      destination = motion?.to ?? optionDestination(label, l, quality),
      target = kick?.to ?? l.target;
    return choice(id, label, icon, "run", start, destination, undefined, {
      from: kick?.from ?? start,
      to: target,
      action,
    });
  }
  if (intent === "hold" || intent === "closed-receive")
    return choice(
      id,
      label,
      icon,
      intent === "closed-receive" ? "receive" : "react",
      start,
      start,
      undefined,
      intent === "closed-receive"
        ? { from: l.carrier, to: start, action: "pass" }
        : undefined,
    );
  if (intent === "orient")
    return choice(
      id,
      label,
      icon,
      "turn",
      start,
      p(start.x + (l.defending ? -1.5 : 1.5), start.y),
      { from: l.defending ? 0 : 180, to: l.defending ? 90 : 0 },
      /receive|back foot|half turn/i.test(label)
        ? { from: l.carrier, to: start, action: "pass" }
        : undefined,
    );
  if (intent === "travel") {
    const motion = ordered.find(
      (item) =>
        item.actorId === "nolan" && item.to && rolePathActions.has(item.action),
    );
    return choice(
      id,
      label,
      icon,
      quality === "poor" ? "walk" : "run",
      start,
      motion?.to ?? optionDestination(label, l, quality),
    );
  }
  if (intent === "ball") {
    const action = namedKick(label),
      kick = ordered.find(
        (item) =>
          item.actorId === "nolan" && kickActions.has(item.action) && item.to,
      ),
      target = kick?.to ?? (quality === "good" ? l.target : l.badTo),
      approach = ordered.find(
        (item) =>
          item.actorId === "nolan" &&
          item.from &&
          item.to &&
          movementActions.has(item.action) &&
          pointDistance(item.from, item.to) >= 3.5 &&
          (!kick || item.startTime <= kick.startTime),
      );
    return choice(
      id,
      label,
      icon,
      approach?.action ?? action,
      start,
      approach?.to ?? start,
      undefined,
      { from: kick?.from ?? start, to: target, action },
    );
  }
  if (quality === "poor")
    return choice(
      id,
      label,
      icon,
      "walk",
      start,
      clampPoint(p(start.x - 12, start.y + (start.y < 32 ? 10 : -10))),
    );
  const facing = ["scan", "turn", "set"].includes(base.action)
    ? { from: l.defending ? 0 : 180, to: l.defending ? 90 : 0 }
    : undefined;
  return choice(id, label, icon, base.action, base.from, base.to, facing);
}
function alignChoicePreview(
  item: AnimatedChoice,
  steps: AnimationStep[],
  l: ReturnType<typeof layout>,
): AnimatedChoice {
  const intent = optionIntent(item.label);
  if (
    ["hold", "active-hold", "closed-receive", "orient", "ball-hold"].includes(
      intent,
    )
  )
    return item;
  const motion = [...steps]
    .sort((a, b) => a.startTime - b.startTime)
    .find(
      (candidate) =>
        candidate.actorId === "nolan" &&
        candidate.from &&
        candidate.to &&
        [
          "run",
          "walk",
          "dribble",
          "defend",
          "press",
          "shield",
          "dive",
        ].includes(candidate.action) &&
        pointDistance(candidate.from, candidate.to) >= 4,
    );
  return motion
    ? {
        ...item,
        previewAnimation: [
          step(0, 1100, motion.action, "nolan", l.nolan, motion.to),
        ],
      }
    : item;
}
const rolePathActions = new Set<AnimationStep["action"]>([
  "run",
  "walk",
  "dribble",
  "defend",
  "press",
  "shield",
]);
function readableDestination(start: Point, to: Point, minDistance = 18) {
  const dx = to.x - start.x,
    dy = to.y - start.y,
    length = Math.hypot(dx, dy);
  if (length >= minDistance) return to;
  const ux = length > 1 ? dx / length : 1,
    uy = length > 1 ? dy / length : start.y < 32 ? 1 : -1;
  let destination = clampPoint(
    p(start.x + ux * minDistance, start.y + uy * minDistance),
  );
  if (pointDistance(start, destination) >= minDistance - 1) return destination;
  const vertical = start.y < 32 ? 1 : -1;
  destination = clampPoint(
    p(
      start.x + ux * Math.min(12, minDistance),
      start.y + vertical * minDistance,
    ),
  );
  return destination;
}
function remapEndpoint(
  steps: AnimationStep[],
  old: Point,
  destination: Point,
  actors: AnimatedActor[],
) {
  const replace = (point: Point | undefined) =>
    point && pointDistance(point, old) < 1.5 ? destination : point;
  return steps.map((item) => {
    const team = item.actorId
      ? actors.find((actor) => actor.id === item.actorId)?.team
      : undefined;
    return team === "blue" || item.actorId === "nolan"
      ? { ...item, from: replace(item.from), to: replace(item.to) }
      : item;
  });
}
function ensurePhoneReadableSteps(
  label: string,
  steps: AnimationStep[],
  l: ReturnType<typeof layout>,
) {
  const intent = optionIntent(label);
  let repaired = steps;
  if (
    !["hold", "active-hold", "closed-receive", "orient", "ball-hold"].includes(
      intent,
    )
  ) {
    const first = [...repaired]
      .sort((a, b) => a.startTime - b.startTime)
      .find(
        (item) =>
          item.actorId === "nolan" &&
          item.from &&
          item.to &&
          rolePathActions.has(item.action) &&
          pointDistance(item.from, item.to) > 1.5,
      );
    if (first?.to) {
      const old = first.to,
        destination = readableDestination(l.nolan, old),
        firstIndex = repaired.indexOf(first);
      repaired = remapEndpoint(repaired, old, destination, l.actors).map(
        (item, index) =>
          index === firstIndex
            ? { ...item, from: l.nolan, to: destination }
            : item,
      );
    }
  }
  if (["ball", "ball-travel", "ball-hold"].includes(intent)) {
    const kick = repaired.find(
      (item) =>
        item.actorId === "nolan" &&
        item.from &&
        item.to &&
        kickActions.has(item.action),
    );
    if (kick?.from && kick.to && pointDistance(kick.from, kick.to) < 18) {
      const old = kick.to,
        destination = readableDestination(kick.from, old, 20),
        kickIndex = repaired.indexOf(kick);
      repaired = remapEndpoint(repaired, old, destination, l.actors).map(
        (item, index) =>
          index === kickIndex ? { ...item, to: destination } : item,
      );
    }
  }
  return repaired;
}
function contrastSteps(
  steps: AnimationStep[],
  reference: AnimatedChoice,
  l: ReturnType<typeof layout>,
  quarterTurn = false,
) {
  const first = [...steps]
    .sort((a, b) => a.startTime - b.startTime)
    .find(
      (item) =>
        item.actorId === "nolan" &&
        item.from &&
        item.to &&
        rolePathActions.has(item.action) &&
        pointDistance(item.from, item.to) > 1.5,
    );
  const referenceMove = reference.previewAnimation.find(
    (item) => item.actorId === "nolan" && item.from && item.to,
  );
  if (first?.to && referenceMove?.to) {
    const gx = referenceMove.to.x - l.nolan.x,
      gy = referenceMove.to.y - l.nolan.y,
      length = Math.max(1, Math.hypot(gx, gy));
    const ux = quarterTurn ? -gy / length : -gx / length,
      uy = quarterTurn ? gx / length : -gy / length;
    const destination = readableDestination(
        l.nolan,
        clampPoint(p(l.nolan.x + ux * 25, l.nolan.y + uy * 25)),
        22,
      ),
      old = first.to,
      firstIndex = steps.indexOf(first);
    return remapEndpoint(steps, old, destination, l.actors).map(
      (item, index) =>
        index === firstIndex
          ? { ...item, from: l.nolan, to: destination }
          : item,
    );
  }
  const kick = steps.find(
    (item) =>
      item.actorId === "nolan" &&
      item.from &&
      item.to &&
      kickActions.has(item.action),
  );
  if (kick?.from && kick.to && reference.previewBall) {
    const gx = reference.previewBall.to.x - reference.previewBall.from.x,
      gy = reference.previewBall.to.y - reference.previewBall.from.y,
      length = Math.max(1, Math.hypot(gx, gy));
    // A goalkeeper's alternative distribution must turn into the field,
    // rather than rotate toward the touchline beside their own goal.
    const rotateIntoField = quarterTurn && kick.from.x < 20,
      ux = quarterTurn
        ? rotateIntoField
          ? gy / length
          : -gy / length
        : -gx / length,
      uy = quarterTurn
        ? rotateIntoField
          ? -gx / length
          : gx / length
        : -gy / length;
    const destination = readableDestination(
        kick.from,
        clampPoint(
          p(
            kick.from.x + ux * (rotateIntoField ? 40 : 25),
            kick.from.y + uy * (rotateIntoField ? 40 : 25),
          ),
        ),
        rotateIntoField ? 35 : 22,
      ),
      old = kick.to,
      kickIndex = steps.indexOf(kick);
    return remapEndpoint(steps, old, destination, l.actors).map(
      (item, index) =>
        index === kickIndex ? { ...item, to: destination } : item,
    );
  }
  return steps;
}
function synchronizeReadableChoice(
  choiceItem: AnimatedChoice,
  steps: AnimationStep[],
  l: ReturnType<typeof layout>,
) {
  const intent = optionIntent(choiceItem.label),
    preview = choiceItem.previewAnimation.find(
      (item) => item.actorId === "nolan" && item.from && item.to,
    );
  if (
    !["travel", "ball-travel"].includes(intent) ||
    !preview?.from ||
    !preview.to ||
    pointDistance(preview.from, preview.to) >= 18
  )
    return { choice: choiceItem, steps };
  const destination = readableDestination(l.nolan, preview.to),
    ordered = [...steps].sort((a, b) => a.startTime - b.startTime),
    first = ordered.find(
      (item) =>
        item.actorId === "nolan" &&
        item.from &&
        item.to &&
        rolePathActions.has(item.action) &&
        pointDistance(item.from, item.to) > 1.5,
    );
  if (!first?.to)
    return {
      choice: {
        ...choiceItem,
        previewAnimation: [{ ...preview, to: destination }],
      },
      steps,
    };
  const firstIndex = steps.indexOf(first),
    updated = remapEndpoint(steps, first.to, destination, l.actors).map(
      (item, index) =>
        index === firstIndex
          ? { ...item, from: l.nolan, to: destination }
          : item,
    );
  return {
    choice: {
      ...choiceItem,
      previewAnimation: [{ ...preview, from: l.nolan, to: destination }],
    },
    steps: updated,
  };
}
function appendSafeExit(
  actorId: string,
  steps: AnimationStep[],
  l: ReturnType<typeof layout>,
  setup: AnimationStep[],
) {
  const frame = [...steps]
      .sort((a, b) => a.startTime - b.startTime)
      .reduce(applyAnimationStep, finalFrame(l.actors, l.carrier, setup)),
    actorItem = l.actors.find((item) => item.id === actorId);
  if (!actorItem) return steps;
  const current = frame.actors[actorId].position,
    candidates: Array<Point> = [];
  for (let y = 10; y <= 54; y += 8)
    for (let x = 10; x <= 90; x += 10) candidates.push(p(x, y));
  const destination = candidates
    .sort((a, b) => pointDistance(a, current) - pointDistance(b, current))
    .find((candidate) =>
      l.actors.every(
        (other) =>
          other.id === actorId ||
          !visuallyOccludes(
            actorItem,
            candidate,
            other,
            frame.actors[other.id].position,
          ),
      ),
    );
  return destination
    ? [
        ...steps,
        step(
          Math.max(...steps.map((item) => item.startTime + item.duration)) + 10,
          600,
          actorItem.team === "red" ? "defend" : "run",
          actorId,
          current,
          destination,
        ),
      ]
    : steps;
}

type FormationSlot = {
  role: string;
  position: Point;
  number: number;
  goalkeeper?: boolean;
};
const blueFormation: FormationSlot[] = [
  { role: "Goalkeeper", position: p(8, 32), number: 1, goalkeeper: true },
  { role: "Fullback", position: p(23, 20), number: 3 },
  { role: "Center defender", position: p(23, 44), number: 4 },
  { role: "Left winger", position: p(43, 14), number: 11 },
  { role: "Central midfielder", position: p(40, 32), number: 8 },
  { role: "Right winger", position: p(43, 50), number: 7 },
  { role: "Striker", position: p(63, 32), number: 9 },
];
const redFormation: FormationSlot[] = [
  { role: "Goalkeeper", position: p(92, 32), number: 1, goalkeeper: true },
  { role: "Fullback", position: p(77, 44), number: 3 },
  { role: "Center defender", position: p(77, 20), number: 4 },
  { role: "Left winger", position: p(57, 50), number: 11 },
  { role: "Central midfielder", position: p(60, 32), number: 8 },
  { role: "Right winger", position: p(57, 14), number: 7 },
  { role: "Striker", position: p(37, 32), number: 9 },
];
const roleFamily = (role: string) =>
  role.toLowerCase().includes("goalkeeper")
    ? "goalkeeper"
    : role.toLowerCase().includes("defender") ||
        role.toLowerCase().includes("fullback")
      ? "defender"
      : role.toLowerCase().includes("midfielder")
        ? "midfielder"
        : role.toLowerCase().includes("striker")
          ? "striker"
          : role.toLowerCase().includes("winger")
            ? "winger"
            : "player";
function completeMatch(activeActors: AnimatedActor[], index: number) {
  const completeTeam = (team: "blue" | "red", formation: FormationSlot[]) => {
    const current = activeActors.filter((item) => item.team === team),
      available = [...formation];
    current.forEach((item) => {
      const family = roleFamily(item.role);
      let slotIndex = available.findIndex(
        (slot) => roleFamily(slot.role) === family,
      );
      if (slotIndex < 0) slotIndex = 0;
      available.splice(slotIndex, 1);
    });
    const shift = ((index % 3) - 1) * 0.35;
    return [
      ...current,
      ...available.map((slot, slotIndex) =>
        actor(
          `support-${team}-${slotIndex}`,
          team,
          slot.role,
          p(slot.position.x, slot.position.y + shift),
          slot.number,
          undefined,
          Boolean(slot.goalkeeper),
        ),
      ),
    ];
  };
  return spreadActorStarts([
    ...completeTeam("blue", blueFormation),
    ...completeTeam("red", redFormation),
  ]);
}

function layout(row: InventoryRow, index: number) {
  const category = categoryFor(row.id),
    defending = defensiveIds.has(row.id) || row.assets.startsWith("defensive"),
    goalkeeper = category === "goalkeeper";
  const lane = index % 3;
  const unique = (index + 1) / 1000;
  const y = (lane === 0 ? 17 : lane === 1 ? 32 : 47) + unique;
  const jitter = (index % 4) * 2 + unique;
  const lineups: Record<
    SceneCategory,
    { blue1: string; blue2: string; red1: string; red2: string }
  > = {
    winger: {
      blue1: "Central midfielder",
      blue2: "Striker",
      red1: "Fullback",
      red2: "Center defender",
    },
    striker: {
      blue1: "Attacking midfielder",
      blue2: "Winger",
      red1: "Center defender",
      red2: "Center defender",
    },
    "central-midfielder": {
      blue1: "Center defender",
      blue2: "Winger",
      red1: "Central midfielder",
      red2: "Defensive midfielder",
    },
    "attacking-midfielder": {
      blue1: "Central midfielder",
      blue2: "Striker",
      red1: "Defensive midfielder",
      red2: "Center defender",
    },
    "defensive-midfielder": {
      blue1: "Center defender",
      blue2: "Fullback",
      red1: "Attacking midfielder",
      red2: "Striker",
    },
    fullback: {
      blue1: "Winger",
      blue2: "Central midfielder",
      red1: "Winger",
      red2: "Fullback",
    },
    "center-defender": {
      blue1: "Fullback",
      blue2: "Defensive midfielder",
      red1: "Striker",
      red2: "Attacking midfielder",
    },
    goalkeeper: {
      blue1: "Center defender",
      blue2: "Fullback",
      red1: "Striker",
      red2: "Winger",
    },
    teamwork: {
      blue1: "Central midfielder",
      blue2: "Winger",
      red1: "Defender",
      red2: "Striker",
    },
  };
  const lineup = lineups[category];
  const defensiveWideY = Math.max(5, Math.min(36, y - 11.5));
  const areaByCategory: Record<
    SceneCategory,
    {
      attack: [number, number, number, number, string];
      defense: [number, number, number, number, string];
    }
  > = {
    winger: {
      attack: [50, index % 2 ? 36 : 5, 46, 23, "wide attack"],
      defense: [28, defensiveWideY, 36, 23, "wide recovery"],
    },
    striker: {
      attack: [65, 14, 31, 36, "scoring area"],
      defense: [54, 12, 40, 40, "pressing area"],
    },
    "central-midfielder": {
      attack: [25, 9, 50, 46, "middle third"],
      defense: [16, 9, 46, 46, "central cover"],
    },
    "attacking-midfielder": {
      attack: [48, 12, 40, 40, "between lines"],
      defense: [47, 10, 42, 44, "counterpress"],
    },
    "defensive-midfielder": {
      attack: [12, 9, 48, 46, "build-up base"],
      defense: [8, 10, 45, 44, "screening zone"],
    },
    fullback: {
      attack: [48, index % 2 ? 36 : 5, 45, 23, "overlap lane"],
      defense: [3, defensiveWideY, 42, 23, "wide defense"],
    },
    "center-defender": {
      attack: [5, 10, 48, 44, "build-up line"],
      defense: [2, 12, 41, 40, "danger area"],
    },
    goalkeeper: {
      attack: [1, 18, 25, 29, "goal area"],
      defense: [1, 18, 25, 29, "goal area"],
    },
    teamwork: {
      attack: [22, 8, 58, 48, "team shape"],
      defense: [15, 8, 55, 48, "team defense"],
    },
  };
  const [ax, ay, aw, ah, areaLabel] = defending
    ? areaByCategory[category].defense
    : areaByCategory[category].attack;
  const areaShift = category === "goalkeeper" ? 0 : ((index % 3) - 1) * 1.5;
  const activeArea = {
    x: Math.max(0, Math.min(100 - aw, ax + areaShift)),
    y: Math.max(4, Math.min(60 - ah, ay + (index % 2 ? 1.2 : -1.2))),
    width: aw,
    height: ah,
    label: areaLabel,
  };
  if (goalkeeper) {
    const nolan = row.id === "GK-28" ? p(28, 32) : p(8, 32),
      redBall = p(38 + jitter, y),
      red2 = p(28 + jitter, 48 - y / 3),
      target = p(25, 14 + (index % 2) * 35),
      active = [
        actor("nolan", "blue", "Goalkeeper", nolan, 1, "Nolan", true),
        actor("blue1", "blue", lineup.blue1, p(22, 20), 4),
        actor("blue2", "blue", lineup.blue2, p(30, 51), 2),
        actor("redBall", "red", lineup.red1, redBall, 9),
        actor("red2", "red", lineup.red2, red2, 10),
        actor("redGK", "red", "Goalkeeper", p(92, 32), 1, undefined, true),
      ];
    return {
      defending: true,
      nolan,
      // GK-15 and GK-29 teach back-pass play: the ball must visibly start
      // with the blue defender who plays it back, not with a red carrier.
      carrier:
        row.id === "GK-15"
          ? p(22, 20)
          : row.id === "GK-29"
            ? p(30, 51)
            : redBall,
      goodTo: p(13, 30 + (index % 3) * 3),
      badTo: p(7, 34),
      target,
      activeArea: focusedDutyArea(row, activeArea, nolan, redBall, target),
      actors: completeMatch(active, index),
    };
  }
  if (defending) {
    if (row.id === "DM-01") {
      const screenNolan = p(25, 48),
        redBall = p(48, 32),
        danger = p(22, 32),
        screen = p(35, 32),
        active = [
          actor("nolan", "blue", row.role, screenNolan, 7, "Nolan"),
          actor("blue1", "blue", "Center defender", p(19, 42), 4),
          actor("blue2", "blue", "Fullback", p(18, 18), 3),
          actor("blueGK", "blue", "Goalkeeper", p(8, 32), 1, undefined, true),
          actor("redBall", "red", "Attacking midfielder", redBall, 10),
          actor("red2", "red", "Striker", p(30, 20), 9),
          actor("red3", "red", "Winger", p(54, 49), 11),
          actor("redGK", "red", "Goalkeeper", p(92, 32), 1, undefined, true),
        ];
      return {
        defending: true,
        nolan: screenNolan,
        carrier: redBall,
        goodTo: screen,
        badTo: p(45, 38),
        target: danger,
        activeArea: {
          x: 18,
          y: 14,
          width: 38,
          height: 40,
          label: "screen striker lane",
        },
        actors: completeMatch(active, index),
      };
    }
    const defensiveX: Record<SceneCategory, [number, number]> = {
      winger: [38, 50],
      striker: [62, 72],
      "central-midfielder": [34, 47],
      "attacking-midfielder": [56, 64],
      "defensive-midfielder": [30, 44],
      fullback: [27, 43],
      "center-defender": [25, 41],
      goalkeeper: [8, 38],
      teamwork: [30, 44],
    };
    const [nolanX, carrierX] = defensiveX[category],
      defenseY =
        category === "striker" ||
        category === "attacking-midfielder" ||
        category === "defensive-midfielder" ||
        category === "center-defender" ||
        category === "teamwork"
          ? 32
          : y;
    // FB-25 recovers after an attacking corner, so Tom begins high and wide
    // instead of already sitting in his defensive slot.
    const nolan = row.id === "FB-25" ? p(52, 12) : p(nolanX + unique, defenseY),
      redBall = p(
        carrierX + jitter / 3,
        Math.max(12, Math.min(52, defenseY - 3)),
      ),
      red2 = p(carrierX + 8, Math.max(13, Math.min(51, defenseY + 12))),
      target = p(Math.max(14, nolanX - 9), 12 + (index % 3) * 19),
      active = [
        actor("nolan", "blue", row.role, nolan, 7, "Nolan"),
        actor(
          "blue1",
          "blue",
          lineup.blue1,
          p(Math.max(18, nolanX - 8), 45),
          4,
        ),
        actor(
          "blue2",
          "blue",
          lineup.blue2,
          p(Math.max(16, nolanX - 11), 17),
          2,
        ),
        actor("blueGK", "blue", "Goalkeeper", p(8, 32), 1, undefined, true),
        actor("redBall", "red", lineup.red1, redBall, 10),
        actor("red2", "red", lineup.red2, red2, 9),
        actor(
          "red3",
          "red",
          "Supporting midfielder",
          p(Math.min(76, carrierX + 5), 47),
          8,
        ),
        actor("redGK", "red", "Goalkeeper", p(92, 32), 1, undefined, true),
      ];
    return {
      defending: true,
      nolan,
      carrier: redBall,
      goodTo: p(Math.min(carrierX - 3, nolanX + 6), defenseY - 2),
      badTo: p(Math.min(88, carrierX + 4), defenseY + 5),
      target,
      activeArea: focusedDutyArea(row, activeArea, nolan, redBall, target),
      actors: completeMatch(active, index),
    };
  }
  const wideY = index % 2 === 0 ? 13 + unique : 51 - unique;
  const positions: Record<
    SceneCategory,
    {
      nolan: Point;
      carrier: Point;
      target: Point;
      primary: Point;
      secondary: Point;
      good: Point;
      bad: Point;
    }
  > = {
    winger: {
      nolan: p(58, wideY),
      carrier: p(40, 32),
      target: p(75, 40),
      primary: p(67, wideY + 5),
      secondary: p(80, 34),
      good: p(61, wideY),
      bad: p(65, wideY + 3),
    },
    striker: {
      nolan: p(70, 32),
      carrier: p(48, 35),
      target: p(62, wideY),
      primary: p(78, 27),
      secondary: p(80, 42),
      good: p(82, 34),
      bad: p(76, 32),
    },
    "central-midfielder": {
      nolan: p(44, 32),
      carrier: p(25, 35),
      target: p(67, wideY),
      primary: p(54, 25),
      secondary: p(58, 42),
      good: p(48, 32),
      bad: p(53, 32),
    },
    "attacking-midfielder": {
      nolan: p(61, 32),
      carrier: p(42, 35),
      target: p(79, 38),
      primary: p(69, 25),
      secondary: p(76, 43),
      good: p(65, 34),
      bad: p(69, 32),
    },
    "defensive-midfielder": {
      nolan: p(31, 32),
      carrier: p(18, 36),
      target: p(48, wideY),
      primary: p(43, 25),
      secondary: p(50, 43),
      good: p(35, 32),
      bad: p(42, 32),
    },
    fullback: {
      nolan: p(49, wideY),
      carrier: p(58, wideY + 5),
      target: p(78, 34),
      primary: p(68, wideY + 7),
      secondary: p(76, 38),
      good: p(65, wideY),
      bad: p(62, wideY + 4),
    },
    "center-defender": {
      nolan: p(26, 32),
      carrier: p(17, wideY),
      target: p(45, wideY),
      primary: p(43, 27),
      secondary: p(49, 42),
      good: p(30, 32),
      bad: p(40, 32),
    },
    goalkeeper: {
      nolan: p(8, 32),
      carrier: p(38, 32),
      target: p(25, wideY),
      primary: p(30, 32),
      secondary: p(40, 40),
      good: p(12, 32),
      bad: p(7, 34),
    },
    teamwork: {
      nolan: p(55, 32),
      carrier: p(35, 35),
      target: p(75, wideY),
      primary: p(65, 25),
      secondary: p(73, 43),
      good: p(59, 32),
      bad: p(64, 32),
    },
  };
  const pos = positions[category],
    family = dutyFamily(row),
    primaryRole = category === "fullback" ? "Fullback" : lineup.red1,
    archetype =
      reviewedCoreIds.has(row.id) || row.id === "WNG-13" ? 1 : index % 3,
    depthShift = (archetype - 1) * 6,
    verticalShift = ["winger", "fullback"].includes(category)
      ? 0
      : (archetype - 1) * 4,
    nolan = p(pos.nolan.x + unique + depthShift, pos.nolan.y + verticalShift),
    carrier = p(
      pos.carrier.x + unique / 2 + depthShift * 0.55,
      pos.carrier.y - verticalShift * 0.5,
    );
  let target = p(
      pos.target.x + depthShift * 0.7,
      pos.target.y + unique - verticalShift,
    ),
    primary = p(
      pos.primary.x + unique + depthShift,
      pos.primary.y + verticalShift * 0.5,
    ),
    secondary = p(
      pos.secondary.x + depthShift * 0.8,
      pos.secondary.y + unique - verticalShift * 0.6,
    ),
    goodTo = p(pos.good.x + unique + depthShift, pos.good.y + verticalShift),
    badTo = p(pos.bad.x + depthShift, pos.bad.y + unique + verticalShift);
  if (row.id === "DM-07") {
    // A real 7v7 build-out: the defensive midfielder begins ahead of the two
    // centre-backs, drops into their split, receives away from the striker,
    // then can play forward to the open fullback. The red striker starts
    // beyond Tom, so Tom is never hidden behind the marker at the receive.
    const buildNolan = p(37, 32),
      buildCarrier = p(25, 22),
      buildTarget = p(51, 14),
      buildGoodTo = p(24, 32),
      buildBadTo = p(47, 32),
      buildActors = [
        actor("nolan", "blue", row.role, buildNolan, 7, "Nolan"),
        actor("blue1", "blue", "Center defender", buildCarrier, 4),
        actor("blue2", "blue", "Fullback", buildTarget, 3),
        actor("blueGK", "blue", "Goalkeeper", p(8, 32), 1, undefined, true),
        actor("red1", "red", "Striker", p(49, 32), 9),
        actor("red2", "red", "Attacking midfielder", p(45, 45), 10),
        actor("redGK", "red", "Goalkeeper", p(92, 32), 1, undefined, true),
      ];
    return {
      defending: false,
      nolan: buildNolan,
      carrier: buildCarrier,
      target: buildTarget,
      goodTo: buildGoodTo,
      badTo: buildBadTo,
      activeArea: {
        x: 14,
        y: 10,
        width: 43,
        height: 40,
        label: "build-out triangle",
      },
      actors: completeMatch(buildActors, index),
    };
  }
  if (
    family === "receive" ||
    family === "hold" ||
    family === "possession" ||
    family === "build"
  ) {
    goodTo = p(nolan.x + 2, nolan.y);
    primary = p(
      Math.max(nolan.x + 10, primary.x),
      Math.max(9, Math.min(55, nolan.y + (index % 2 ? 8 : -8))),
    );
    badTo = p(primary.x - 2, primary.y);
  }
  if (family === "carry") {
    primary = p(nolan.x + 9, nolan.y);
    goodTo = p(
      primary.x + 5,
      Math.max(9, Math.min(55, nolan.y + (index % 2 ? 10 : -10))),
    );
    badTo = p(primary.x - 1, primary.y);
  }
  if (family === "move") {
    const behind = /behind|back.post|beyond|overlap|underlap/.test(
      row.decision.toLowerCase(),
    );
    goodTo = behind
      ? p(
          primary.x + 7,
          Math.max(8, Math.min(56, nolan.y + (index % 2 ? 7 : -7))),
        )
      : p(
          nolan.x + 4,
          Math.max(8, Math.min(56, nolan.y + (index % 2 ? 8 : -8))),
        );
    badTo = p(primary.x - 1, primary.y);
  }
  if (family === "combine") {
    goodTo = p(
      primary.x + 5,
      Math.max(9, Math.min(55, primary.y + (index % 2 ? 10 : -10))),
    );
    target = p(
      nolan.x + 9,
      Math.max(9, Math.min(55, nolan.y + (index % 2 ? -8 : 8))),
    );
    badTo = p(primary.x - 1, primary.y);
  }
  if (family === "switch") {
    target = p(Math.max(62, nolan.x + 16), nolan.y < 32 ? 51 : 13);
    primary = p(nolan.x + 7, nolan.y);
    secondary = p(
      nolan.x + 10,
      Math.max(9, Math.min(55, nolan.y + (index % 2 ? 7 : -7))),
    );
    goodTo = p(nolan.x + 1, nolan.y);
    badTo = p(primary.x - 1, primary.y);
  }
  if (family === "cross") {
    goodTo = p(Math.max(75, nolan.x + 13), nolan.y < 32 ? 10 : 54);
    primary = p(nolan.x + 8, nolan.y < 32 ? nolan.y + 7 : nolan.y - 7);
    target = p(82, 34);
    badTo = p(primary.x - 1, primary.y);
  }
  if (family === "finish") {
    goodTo = p(82, index % 2 ? 38 : 27);
    primary = p(78, index % 2 ? 27 : 39);
    secondary = p(84, index % 2 ? 43 : 22);
    target = p(74, index % 2 ? 18 : 48);
    badTo = p(primary.x - 2, primary.y);
  }
  const active = [
    actor("nolan", "blue", row.role, nolan, 7, "Nolan"),
    actor("blue1", "blue", lineup.blue1, carrier, 8),
    actor("blue2", "blue", lineup.blue2, target, 11),
    actor("blueGK", "blue", "Goalkeeper", p(8, 32), 1, undefined, true),
    actor("red1", "red", primaryRole, primary, 4),
    actor("red2", "red", lineup.red2, secondary, 5),
    actor("redGK", "red", "Goalkeeper", p(92, 32), 1, undefined, true),
  ];
  return {
    defending: false,
    nolan,
    carrier,
    goodTo,
    badTo,
    target,
    activeArea: focusedDutyArea(row, activeArea, nolan, carrier, target),
    actors: completeMatch(active, index),
  };
}

function dutyGoodAnimation(
  row: InventoryRow,
  index: number,
  l: ReturnType<typeof layout>,
): AnimationStep[] {
  const family = dutyFamily(row),
    { nolan, carrier, goodTo, target } = l,
    far = p(Math.min(88, target.x + 7), target.y),
    goal = p(97, 32);
  // ── Individually authored timelines (2026-07-18 similarity review). Each of
  // these scenes previously shared a template animation with another scene in
  // its pack; every branch below proves its own named skill distinctly. ──
  if (row.id === "STR-12") {
    const high = target.y < 32,
      nearPost = p(82, high ? 28 : 36),
      backZone = p(84, high ? 37 : 27);
    return [
      step(0, 700, "pass", "blue1", carrier, target),
      step(650, 400, "receive", "blue2", target, target),
      step(900, 900, "run", "nolan", nolan, nearPost),
      step(1000, 1100, "run", "blue1", carrier, backZone),
      step(1700, 800, "cross", "blue2", target, backZone),
      step(2400, 400, "turn", "nolan", nearPost, p(nearPost.x + 2, nearPost.y)),
      step(2650, 400, "receive", "blue1", backZone, backZone),
      step(3050, 700, "shoot", "blue1", backZone, goal),
      step(3750, 400, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "STR-17") {
    const headerPoint = p(83, 29);
    return [
      step(0, 500, "scan", "nolan", nolan, nolan),
      step(450, 900, "cross", "blue2", target, headerPoint),
      step(800, 900, "run", "nolan", nolan, headerPoint),
      step(500, 900, "defend", "red1", undefined, p(80, 35)),
      step(1800, 700, "shoot", "nolan", headerPoint, p(96, 29)),
      step(2600, 500, "celebrate", "blue2", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "STR-18") {
    const high = target.y < 32,
      endLine = p(88, high ? 10 : 54),
      spot = p(81, 34);
    return [
      step(0, 700, "pass", "blue1", carrier, target),
      step(650, 400, "receive", "blue2", target, target),
      step(1000, 1000, "dribble", "blue2", target, endLine),
      step(1000, 1100, "run", "nolan", nolan, spot),
      step(1100, 1100, "defend", "red1", undefined, p(88, high ? 24 : 40)),
      step(2100, 800, "cross", "blue2", endLine, spot),
      step(2850, 400, "receive", "nolan", spot, spot),
      step(3250, 700, "shoot", "nolan", spot, p(96, 30)),
    ];
  }
  if (row.id === "STR-29") {
    const high = target.y < 32,
      dropZone = p(68, target.y),
      farPost = p(84, high ? 40 : 24);
    return [
      step(0, 650, "pass", "blue1", carrier, target),
      step(600, 350, "receive", "blue2", target, target),
      step(950, 700, "cross", "blue2", target, p(82, 34)),
      step(1600, 500, "clear", "red1", p(82, 34), dropZone),
      step(2000, 600, "run", "blue2", target, dropZone),
      step(2100, 1000, "run", "nolan", nolan, farPost),
      step(2600, 350, "receive", "blue2", dropZone, dropZone),
      step(2950, 750, "cross", "blue2", dropZone, farPost),
      step(3650, 600, "shoot", "nolan", farPost, goal),
    ];
  }
  if (row.id === "CM-16") {
    const wideY = target.y,
      support = p(56, Math.max(9, Math.min(55, wideY + (wideY < 32 ? 9 : -9)))),
      upLine = p(76, wideY);
    return [
      step(0, 700, "pass", "blue1", carrier, target),
      step(650, 400, "receive", "blue2", target, target),
      step(750, 900, "press", "red1", undefined, p(target.x + 4, target.y)),
      step(1000, 900, "run", "nolan", nolan, support),
      step(1950, 700, "pass", "blue2", target, support),
      step(2600, 350, "receive", "nolan", support, support),
      step(2700, 900, "run", "blue2", target, upLine),
      step(3050, 700, "pass", "nolan", support, upLine),
      step(3700, 400, "receive", "blue2", upLine, upLine),
    ];
  }
  if (row.id === "CM-27") {
    const reset = p(Math.max(12, carrier.x - 4), carrier.y),
      wide = p(30, target.y < 32 ? 50 : 14);
    return [
      step(0, 700, "pass", "blue1", carrier, nolan),
      step(650, 400, "receive", "nolan", nolan, nolan),
      step(800, 1000, "press", "red1", undefined, p(nolan.x + 4, nolan.y)),
      step(1300, 700, "pass", "nolan", nolan, reset),
      step(1700, 900, "run", "nolan", nolan, p(nolan.x - 9, nolan.y - 6)),
      step(1950, 400, "receive", "blue1", reset, reset),
      step(2450, 900, "pass", "blue1", reset, wide),
      step(3300, 400, "receive", "blue2", wide, wide),
      step(3700, 400, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "CM-28") {
    return [
      step(0, 550, "pass", "blue1", carrier, nolan),
      step(300, 1300, "run", "red1", undefined, p(66, 28)),
      step(400, 1300, "run", "red2", undefined, p(64, 40)),
      step(550, 350, "receive", "nolan", nolan, nolan),
      step(950, 800, "pass", "nolan", nolan, target),
      step(1700, 350, "receive", "blue2", target, target),
      step(2100, 1000, "dribble", "blue2", target, p(80, target.y)),
      step(3100, 500, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "AM-30") {
    const decoy = p(70, 44),
      feet = p(70, 30);
    return [
      step(0, 1200, "run", "nolan", nolan, decoy),
      step(250, 1200, "defend", "red1", undefined, p(68, 41)),
      step(1300, 900, "run", "blue2", target, feet),
      step(2200, 800, "pass", "blue1", carrier, feet),
      step(2950, 400, "receive", "blue2", feet, feet),
      step(3400, 500, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "DM-19") {
    const spot = p(24, 36);
    return [
      step(0, 1600, "run", "red3", undefined, spot),
      step(200, 1400, "defend", "nolan", nolan, p(26, 35)),
      step(1900, 700, "pass", "redBall", carrier, spot),
      step(2500, 500, "block", "nolan", p(26, 35), spot),
      step(3000, 700, "clear", "nolan", spot, p(42, 10)),
      step(3700, 400, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "DM-23") {
    const line = p(carrier.x - 13, 32);
    return [
      step(0, 1400, "dribble", "redBall", carrier, p(carrier.x - 10, 32)),
      step(150, 1200, "defend", "nolan", nolan, line),
      step(500, 1500, "run", "blue1", undefined, p(carrier.x - 16, 38)),
      step(800, 1500, "run", "blue2", undefined, p(carrier.x - 16, 26)),
      step(
        2000,
        800,
        "turn",
        "redBall",
        p(carrier.x - 10, 32),
        p(carrier.x - 8, 44),
      ),
      step(2800, 700, "defend", "nolan", line, p(carrier.x - 11, 40)),
      step(3500, 400, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "CB-22") {
    const flank = p(30, 47);
    return [
      step(0, 1400, "dribble", "redBall", carrier, flank),
      step(200, 1300, "run", "nolan", nolan, p(20, 44)),
      step(600, 1100, "defend", "blue1", undefined, p(26, 46)),
      step(1900, 700, "dribble", "redBall", flank, p(26, 46)),
      step(2400, 500, "block", "nolan", p(20, 44), p(24, 45)),
      step(2900, 700, "clear", "nolan", p(24, 45), p(40, 56)),
      step(3600, 400, "celebrate", "blue2", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "FB-25") {
    return [
      step(0, 1400, "dribble", "redBall", carrier, p(34, 30)),
      step(100, 1600, "run", "nolan", nolan, p(30, 26)),
      step(900, 1500, "run", "blue1", undefined, p(26, 38)),
      step(1800, 700, "defend", "nolan", p(30, 26), p(31, 29)),
      step(2000, 900, "turn", "redBall", p(34, 30), p(36, 40)),
      step(3000, 600, "defend", "nolan", p(31, 29), p(33, 36)),
      step(3600, 400, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "GK-12") {
    const touch = p(20, 33);
    return [
      step(0, 1200, "dribble", "redBall", carrier, touch),
      step(300, 1200, "run", "nolan", nolan, p(18, 33)),
      step(1600, 500, "dive", "nolan", p(18, 33), touch),
      step(2100, 600, "catch", "nolan", touch, touch),
      step(2800, 500, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "GK-15") {
    const dropPoint = p(11, 25),
      outlet = p(40, 52);
    return [
      step(0, 800, "pass", "blue1", carrier, dropPoint),
      step(100, 1200, "press", "redBall", undefined, p(17, 29)),
      step(400, 1000, "run", "blue2", undefined, outlet),
      step(700, 800, "run", "nolan", nolan, dropPoint),
      step(1600, 800, "pass", "nolan", dropPoint, outlet),
      step(2350, 400, "receive", "blue2", outlet, outlet),
      step(2800, 900, "dribble", "blue2", outlet, p(48, 50)),
      step(3700, 400, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "GK-16") {
    return [
      step(0, 600, "catch", "nolan", nolan, nolan),
      step(650, 500, "scan", "nolan", nolan, nolan),
      step(700, 900, "run", "redBall", carrier, p(24, 28)),
      step(800, 900, "run", "red2", undefined, p(24, 14)),
      step(1500, 800, "pass", "nolan", nolan, p(22, 20)),
      step(2250, 400, "receive", "blue1", p(22, 20), p(22, 20)),
      step(2700, 900, "dribble", "blue1", p(22, 20), p(34, 22)),
      step(3600, 400, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "GK-18") {
    const sprintTo = p(44, 51);
    return [
      step(0, 500, "catch", "nolan", nolan, nolan),
      step(400, 1000, "run", "blue2", undefined, sprintTo),
      step(600, 1000, "run", "redBall", carrier, p(50, 40)),
      step(1000, 900, "pass", "nolan", nolan, sprintTo),
      step(1850, 400, "receive", "blue2", sprintTo, sprintTo),
      step(2300, 1000, "dribble", "blue2", sprintTo, p(58, 48)),
      step(3300, 400, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "GK-19") {
    const safeWide = p(34, 53);
    return [
      step(0, 600, "catch", "nolan", nolan, nolan),
      step(700, 600, "scan", "nolan", nolan, nolan),
      step(800, 1100, "run", "blue2", undefined, safeWide),
      step(1400, 700, "walk", "nolan", nolan, p(10, 34)),
      step(2300, 800, "pass", "nolan", p(10, 34), safeWide),
      step(3050, 400, "receive", "blue2", safeWide, safeWide),
      step(3500, 400, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "GK-22") {
    const landing = p(15, 38);
    return [
      step(0, 700, "scan", "nolan", nolan, nolan),
      step(400, 900, "run", "blue1", undefined, p(14, 26)),
      step(700, 900, "run", "blue2", undefined, p(16, 40)),
      step(1700, 900, "cross", "redBall", carrier, landing),
      step(2550, 700, "clear", "blue2", landing, p(36, 54)),
      step(3300, 400, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "GK-23") {
    return [
      step(0, 700, "scan", "nolan", nolan, nolan),
      step(400, 900, "run", "blue1", undefined, p(16, 28)),
      step(700, 900, "run", "blue2", undefined, p(16, 31)),
      step(1800, 700, "shoot", "redBall", carrier, p(6, 36)),
      step(2200, 500, "dive", "nolan", nolan, p(6, 36)),
      step(2700, 500, "catch", "nolan", p(6, 36), p(6, 36)),
      step(3300, 400, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "GK-27") {
    const highPoint = p(16, 36);
    return [
      step(0, 900, "run", "red2", undefined, p(12, 36)),
      step(300, 900, "cross", "redBall", carrier, highPoint),
      step(500, 1000, "run", "nolan", nolan, highPoint),
      step(1600, 600, "catch", "nolan", highPoint, highPoint),
      step(2300, 600, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "GK-29") {
    const wideSide = p(10, 44);
    return [
      step(0, 800, "run", "nolan", nolan, wideSide),
      step(300, 1000, "press", "redBall", undefined, p(31, 50)),
      step(900, 800, "pass", "blue2", carrier, wideSide),
      step(1650, 400, "receive", "nolan", wideSide, wideSide),
      step(2150, 800, "pass", "nolan", wideSide, p(22, 20)),
      step(2900, 400, "receive", "blue1", p(22, 20), p(22, 20)),
      step(3400, 400, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "DM-01") {
    const danger = p(22, 32),
      screen = p((carrier.x + danger.x) / 2, (carrier.y + danger.y) / 2);
    return [
      step(0, 1200, "run", "red2", undefined, danger),
      step(150, 1200, "defend", "nolan", nolan, screen),
      step(
        550,
        900,
        "dribble",
        "redBall",
        carrier,
        p(carrier.x - 4, carrier.y),
      ),
      step(1450, 850, "pass", "redBall", p(carrier.x - 4, carrier.y), danger),
      step(1950, 600, "block", "nolan", screen, screen),
      step(2500, 850, "clear", "blue1", screen, p(46, 52)),
      step(3400, 500, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "DM-26") {
    const heavyTouch = p(carrier.x - 11, carrier.y + (index % 2 ? 5 : -5));
    return [
      step(0, 900, "defend", "nolan", nolan, p(carrier.x - 7, carrier.y)),
      step(250, 1300, "dribble", "redBall", carrier, heavyTouch),
      step(
        1450,
        650,
        "block",
        "nolan",
        p(carrier.x - 7, carrier.y),
        heavyTouch,
      ),
      step(2050, 700, "receive", "blue1", heavyTouch, heavyTouch),
      step(2700, 850, "pass", "blue1", heavyTouch, p(48, 50)),
      step(3500, 500, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (row.id === "FB-12") {
    const endLine = p(86, nolan.y < 32 ? 10 : 54),
      lateRunner = p(75, nolan.y < 32 ? 27 : 37);
    return [
      step(0, 700, "pass", "blue1", carrier, nolan),
      step(650, 450, "receive", "nolan", nolan, nolan),
      step(1050, 1300, "dribble", "nolan", nolan, endLine),
      step(900, 1500, "run", "blue2", target, lateRunner),
      step(
        1250,
        1300,
        "defend",
        "red1",
        undefined,
        p(82, nolan.y < 32 ? 18 : 46),
      ),
      step(2350, 850, "cross", "nolan", endLine, lateRunner),
      step(3100, 450, "receive", "blue2", lateRunner, lateRunner),
      step(3550, 750, "shoot", "blue2", lateRunner, goal),
    ];
  }
  if (row.id === "TW-05") {
    const weakSide = p(67, nolan.y < 32 ? 52 : 12);
    return [
      step(0, 650, "pass", "blue1", carrier, nolan),
      step(600, 450, "receive", "nolan", nolan, nolan),
      step(1050, 700, "pass", "nolan", nolan, carrier),
      step(1700, 450, "receive", "blue1", carrier, carrier),
      step(2150, 1200, "pass", "blue1", carrier, weakSide),
      step(3250, 450, "receive", "blue2", weakSide, weakSide),
      step(3650, 900, "dribble", "blue2", weakSide, p(78, weakSide.y)),
    ];
  }
  if (row.id === "AM-09") {
    const pocket = p(Math.max(62, nolan.x + 4), nolan.y < 32 ? 49 : 15);
    return [
      step(0, 1200, "run", "nolan", nolan, pocket),
      step(300, 1200, "defend", "red1", undefined, p(nolan.x + 5, nolan.y)),
      step(1100, 1100, "pass", "blue1", carrier, pocket),
      step(2100, 450, "receive", "nolan", pocket, pocket),
      step(2550, 850, "pass", "nolan", pocket, p(80, 34)),
      step(3350, 450, "receive", "blue2", p(80, 34), p(80, 34)),
    ];
  }
  if (row.id === "CB-07") {
    const openFullback = p(52, nolan.y < 32 ? 52 : 12);
    return [
      step(0, 650, "pass", "blue1", carrier, nolan),
      step(600, 450, "receive", "nolan", nolan, nolan),
      step(1000, 550, "scan", "nolan", nolan, p(nolan.x + 2, nolan.y)),
      step(1500, 1200, "pass", "nolan", p(nolan.x + 2, nolan.y), openFullback),
      step(2600, 450, "receive", "blue2", openFullback, openFullback),
      step(3000, 1000, "dribble", "blue2", openFullback, p(65, openFullback.y)),
    ];
  }
  if (row.id === "DM-07")
    return [
      // Tom first drops into the split. This is a short, controlled movement
      // away from pressure—not a run toward Blue's goal.
      step(0, 1200, "run", "nolan", nolan, goodTo),
      step(350, 1000, "defend", "red1", undefined, p(42, 32)),
      step(900, 850, "pass", "blue1", carrier, goodTo),
      step(1650, 500, "receive", "nolan", goodTo, goodTo),
      step(2100, 900, "pass", "nolan", goodTo, target),
      step(2900, 500, "receive", "blue2", target, target),
      step(3350, 900, "dribble", "blue2", target, p(61, 16)),
    ];
  if (family === "gk-organize")
    return [
      step(0, 700, "scan", "nolan", nolan, nolan),
      step(300, 1200, "run", "blue1", p(22, 20), p(15, 38)),
      step(1000, 1200, "cross", "redBall", carrier, p(15, 38)),
      step(2000, 700, "clear", "blue1", p(15, 38), p(39, 52)),
      step(3000, 500, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  if (family === "gk-distribute")
    return [
      step(0, 600, "catch", "nolan", nolan, nolan),
      step(700, 600, "scan", "nolan", nolan, nolan),
      step(1400, 1000, "pass", "nolan", nolan, target),
      step(2300, 500, "receive", "blue2", target, target),
      step(2800, 1000, "dribble", "blue2", target, p(48, target.y)),
    ];
  if (family === "gk-sweep")
    return [
      step(0, 1400, "run", "nolan", nolan, p(24, 32)),
      step(200, 1500, "dribble", "redBall", carrier, p(27, 34)),
      step(1500, 700, "clear", "nolan", p(24, 32), p(40, 10)),
      step(2400, 900, "run", "nolan", p(24, 32), p(9, 32)),
      step(3300, 500, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  if (family === "gk-cross")
    return [
      step(0, 1200, "cross", "redBall", carrier, p(13, 34)),
      step(400, 1200, "run", "nolan", nolan, p(13, 34)),
      step(
        1500,
        700,
        row.decision.toLowerCase().includes("punch") ? "parry" : "catch",
        "nolan",
        p(13, 34),
        p(13, 34),
      ),
      step(2300, 900, "pass", "nolan", p(13, 34), target),
      step(3200, 500, "receive", "blue2", target, target),
    ];
  if (family === "gk-shot")
    return [
      step(0, 700, "set", "nolan", nolan, p(10, 32)),
      step(600, 800, "shoot", "redBall", carrier, p(6, index % 2 ? 27 : 38)),
      step(1000, 800, "dive", "nolan", p(10, 32), p(7, index % 2 ? 27 : 38)),
      step(
        1600,
        600,
        row.decision.toLowerCase().includes("parry") ? "parry" : "catch",
        "nolan",
        p(7, index % 2 ? 27 : 38),
        p(14, index % 2 ? 18 : 50),
      ),
      step(2700, 600, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  if (l.defending) {
    if (family === "delay") {
      // Delay is not a clearance or a forward pass. Nolan gets goal-side of
      // the counter, makes the carrier slow down and turn wide, while the two
      // blue recovery runners get back behind the ball.
      const jockey = p(carrier.x - 6, carrier.y + (index % 2 ? 3 : -3));
      const wideTurn = p(
        carrier.x + 2,
        Math.max(10, Math.min(54, carrier.y + (index % 2 ? 12 : -12))),
      );
      return [
        step(0, 1300, "defend", "nolan", nolan, jockey),
        step(
          150,
          1650,
          "dribble",
          "redBall",
          carrier,
          p(carrier.x - 4, carrier.y),
        ),
        step(
          500,
          1800,
          "run",
          "blue1",
          undefined,
          p(carrier.x - 10, carrier.y + 9),
        ),
        step(
          900,
          1800,
          "run",
          "blue2",
          undefined,
          p(carrier.x - 11, carrier.y - 9),
        ),
        step(
          1850,
          900,
          "turn",
          "redBall",
          p(carrier.x - 4, carrier.y),
          wideTurn,
        ),
        step(
          2900,
          700,
          "defend",
          "nolan",
          jockey,
          p(carrier.x - 3, wideTurn.y),
        ),
        step(3500, 500, "celebrate", "nolan", undefined, undefined, "happy"),
      ];
    }
    if (family === "press")
      return [
        step(0, 1100, "press", "nolan", nolan, goodTo),
        step(
          300,
          1400,
          "dribble",
          "redBall",
          carrier,
          p(goodTo.x + 4, goodTo.y),
        ),
        step(1300, 700, "block", "nolan", goodTo, p(goodTo.x + 2, goodTo.y)),
        step(
          2000,
          900,
          "pass",
          "redBall",
          carrier,
          p(carrier.x + 8, carrier.y + 10),
        ),
        step(
          2700,
          700,
          "defend",
          "blue1",
          undefined,
          p(goodTo.x - 5, goodTo.y + 9),
        ),
        step(3300, 500, "celebrate", "nolan", undefined, undefined, "happy"),
      ];
    if (family === "cover" || family === "set-piece")
      return [
        step(0, 1400, "run", "red2", undefined, p(carrier.x - 8, target.y)),
        step(
          300,
          1300,
          family === "set-piece" ? "cross" : "pass",
          "redBall",
          carrier,
          p(carrier.x - 8, target.y),
        ),
        step(500, 1300, "run", "nolan", nolan, goodTo),
        step(1700, 700, "block", "nolan", goodTo, goodTo),
        step(2300, 900, "clear", "nolan", goodTo, target),
        step(3200, 500, "celebrate", "blue1", undefined, undefined, "happy"),
      ];
    return [
      step(0, 1500, "dribble", "redBall", carrier, p(carrier.x - 8, carrier.y)),
      step(200, 1300, "defend", "nolan", nolan, goodTo),
      step(700, 1700, "run", "blue1", undefined, p(goodTo.x - 5, goodTo.y + 8)),
      step(
        1700,
        800,
        "turn",
        "redBall",
        p(carrier.x - 8, carrier.y),
        p(carrier.x + 2, carrier.y - 8),
      ),
      step(
        2500,
        800,
        "pass",
        "redBall",
        p(carrier.x + 2, carrier.y - 8),
        p(carrier.x + 12, carrier.y - 10),
      ),
      step(3300, 500, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (family === "cross")
    return [
      step(0, 700, "pass", "blue1", carrier, nolan),
      step(600, 500, "receive", "nolan", nolan, nolan),
      step(1000, 1000, "dribble", "nolan", nolan, goodTo),
      step(1900, 900, "cross", "nolan", goodTo, target),
      step(2700, 700, "shoot", "blue2", target, goal),
      step(3400, 500, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  if (family === "finish")
    return [
      step(0, 1100, "run", "nolan", nolan, goodTo),
      step(500, 900, "pass", "blue1", carrier, goodTo),
      step(1300, 500, "receive", "nolan", goodTo, goodTo),
      step(1900, 800, "shoot", "nolan", goodTo, goal),
      step(2800, 600, "celebrate", "blue2", undefined, undefined, "happy"),
    ];
  if (family === "receive")
    return [
      step(0, 600, index % 2 ? "scan" : "turn", "nolan", nolan, nolan),
      step(500, 900, "pass", "blue1", carrier, nolan),
      step(1300, 500, "receive", "nolan", nolan, goodTo),
      step(1800, 700, "turn", "nolan", goodTo, p(goodTo.x + 3, goodTo.y)),
      step(2400, 900, "pass", "nolan", p(goodTo.x + 3, goodTo.y), target),
      step(3200, 500, "receive", "blue2", target, target),
    ];
  if (family === "combine")
    return [
      step(0, 700, "pass", "nolan", nolan, target),
      step(300, 1500, "run", "nolan", nolan, goodTo),
      step(700, 500, "receive", "blue2", target, target),
      step(1300, 700, "pass", "blue2", target, goodTo),
      step(2000, 500, "receive", "nolan", goodTo, goodTo),
      step(
        2600,
        700,
        index % 2 ? "shoot" : "pass",
        "nolan",
        goodTo,
        index % 2 ? goal : far,
      ),
      step(3300, 500, "celebrate", "blue2", undefined, undefined, "happy"),
    ];
  if (family === "switch")
    return [
      step(0, 700, "scan", "nolan", nolan, nolan),
      step(500, 700, "pass", "blue1", carrier, nolan),
      step(1200, 500, "receive", "nolan", nolan, nolan),
      step(1700, 1200, "pass", "nolan", nolan, target),
      step(2800, 500, "receive", "blue2", target, target),
      step(3200, 900, "dribble", "blue2", target, far),
    ];
  if (family === "hold")
    return [
      step(0, 800, "pass", "blue1", carrier, nolan),
      step(700, 500, "receive", "nolan", nolan, nolan),
      step(1100, 1300, "shield", "nolan", nolan, goodTo),
      step(900, 1500, "run", "blue2", target, far),
      step(2300, 800, "pass", "nolan", goodTo, far),
      step(3100, 500, "receive", "blue2", far, far),
    ];
  if (family === "carry")
    return [
      step(0, 500, "receive", "nolan", nolan, nolan),
      step(400, 1500, "dribble", "nolan", nolan, goodTo),
      step(700, 1300, "defend", "red1", undefined, p(goodTo.x + 3, goodTo.y)),
      step(1900, 800, "pass", "nolan", goodTo, target),
      step(2700, 500, "receive", "blue2", target, target),
      step(3200, 700, "shoot", "blue2", target, goal),
    ];
  if (family === "move")
    return [
      step(0, 1500, "run", "nolan", nolan, goodTo),
      step(
        300,
        1200,
        "defend",
        "red1",
        undefined,
        p(goodTo.x - 3, goodTo.y + 4),
      ),
      step(900, 900, "pass", "blue1", carrier, goodTo),
      step(1700, 500, "receive", "nolan", goodTo, goodTo),
      step(2300, 800, "pass", "nolan", goodTo, target),
      step(3100, 500, "receive", "blue2", target, target),
    ];
  return [
    step(0, 600, index % 2 ? "scan" : "run", "nolan", nolan, goodTo),
    step(500, 800, "pass", "blue1", carrier, goodTo),
    step(1200, 500, "receive", "nolan", goodTo, goodTo),
    step(1800, 900, "pass", "nolan", goodTo, target),
    step(2600, 500, "receive", "blue2", target, target),
    step(3100, 800, "dribble", "blue2", target, far),
  ];
}

function dutyPoorAnimation(
  row: InventoryRow,
  index: number,
  l: ReturnType<typeof layout>,
): AnimationStep[] {
  const family = dutyFamily(row),
    { nolan, carrier, badTo, target } = l,
    blueGoal = p(3, 32);
  // ── Individually authored poor consequences for the 2026-07-18 review. ──
  if (row.id === "STR-12") {
    const high = target.y < 32,
      nearPost = p(82, high ? 28 : 36);
    return [
      step(0, 700, "pass", "blue1", carrier, target),
      step(650, 400, "receive", "blue2", target, target),
      step(900, 900, "run", "nolan", nolan, nearPost),
      step(1700, 800, "cross", "blue2", target, nearPost),
      step(2450, 600, "shoot", "nolan", nearPost, p(93, 31)),
      step(3050, 500, "catch", "redGK", p(93, 31), p(93, 31)),
      step(3600, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "STR-17") {
    return [
      step(0, 800, "run", "nolan", nolan, p(84, 30)),
      step(800, 900, "cross", "blue2", target, p(88, 26)),
      step(1700, 600, "clear", "red1", p(88, 26), p(70, 12)),
      step(2400, 500, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "STR-18") {
    const high = target.y < 32,
      endLine = p(88, high ? 10 : 54),
      spot = p(80, 34);
    return [
      step(0, 700, "pass", "blue1", carrier, target),
      step(650, 400, "receive", "blue2", target, target),
      step(1000, 1000, "dribble", "blue2", target, endLine),
      step(1000, 1100, "run", "nolan", nolan, p(89, 32)),
      step(2100, 800, "cross", "blue2", endLine, spot),
      step(2850, 400, "receive", "red1", spot, spot),
      step(3250, 600, "clear", "red1", spot, p(60, 10)),
      step(3850, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "STR-29") {
    const dropZone = p(68, target.y),
      oldSpot = p(84, 32);
    return [
      step(0, 650, "pass", "blue1", carrier, target),
      step(600, 350, "receive", "blue2", target, target),
      step(950, 700, "cross", "blue2", target, p(82, 34)),
      step(1600, 500, "clear", "red1", p(82, 34), dropZone),
      step(1700, 900, "walk", "nolan", nolan, p(64, 40)),
      step(2100, 600, "run", "blue2", target, dropZone),
      step(2700, 350, "receive", "blue2", dropZone, dropZone),
      step(3050, 700, "cross", "blue2", dropZone, oldSpot),
      step(3700, 500, "clear", "red2", oldSpot, p(60, 50)),
      step(4100, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "CM-16") {
    return [
      step(0, 700, "pass", "blue1", carrier, target),
      step(650, 400, "receive", "blue2", target, target),
      step(750, 900, "press", "red1", undefined, p(target.x + 4, target.y)),
      step(900, 800, "walk", "nolan", nolan, p(46, 32)),
      step(1800, 800, "dribble", "blue2", target, p(70, target.y)),
      step(
        2600,
        500,
        "block",
        "red1",
        p(target.x + 4, target.y),
        p(70, target.y),
      ),
      step(3100, 800, "dribble", "red1", p(70, target.y), p(58, 34)),
      step(3900, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "CM-27") {
    const hopeful = p(60, 30);
    return [
      step(0, 700, "pass", "blue1", carrier, nolan),
      step(650, 400, "receive", "nolan", nolan, nolan),
      step(1150, 700, "pass", "nolan", nolan, hopeful),
      step(1600, 900, "run", "nolan", nolan, p(nolan.x + 8, nolan.y + 2)),
      step(1800, 500, "block", "red1", undefined, hopeful),
      step(2300, 900, "dribble", "red1", hopeful, p(42, 32)),
      step(3200, 600, "pass", "red1", p(42, 32), p(30, 38)),
      step(3800, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "CM-28") {
    return [
      step(0, 550, "pass", "blue1", carrier, nolan),
      step(400, 1100, "run", "red1", undefined, p(66, 28)),
      step(500, 1100, "run", "red2", undefined, p(64, 40)),
      step(550, 350, "receive", "nolan", nolan, nolan),
      step(1000, 1200, "dribble", "nolan", nolan, p(50, 32)),
      step(2300, 800, "pass", "nolan", p(50, 32), target),
      step(3000, 500, "block", "red1", p(66, 28), target),
      step(3500, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "AM-30") {
    const crowd = p(74, 33);
    return [
      step(0, 1200, "react", "nolan", nolan, nolan),
      step(400, 800, "run", "blue2", target, crowd),
      step(900, 800, "defend", "red1", undefined, p(73, 34)),
      step(1900, 800, "pass", "blue1", carrier, crowd),
      step(2650, 500, "block", "red1", p(73, 34), crowd),
      step(3150, 800, "dribble", "red1", crowd, p(60, 30)),
      step(3950, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "DM-19") {
    const spot = p(24, 36);
    return [
      step(0, 900, "walk", "nolan", nolan, p(33, 30)),
      step(300, 1600, "run", "red3", undefined, spot),
      step(2000, 700, "pass", "redBall", carrier, spot),
      step(2650, 400, "receive", "red3", spot, spot),
      step(3050, 600, "shoot", "red3", spot, blueGoal),
      step(3700, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "DM-23") {
    return [
      step(0, 1200, "dribble", "redBall", carrier, p(28, 33)),
      step(200, 1000, "run", "nolan", nolan, p(40, 28)),
      step(1300, 900, "dribble", "redBall", p(28, 33), p(16, 33)),
      step(2300, 600, "shoot", "redBall", p(16, 33), blueGoal),
      step(3000, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "CB-22") {
    const flank = p(30, 47);
    return [
      step(0, 1400, "dribble", "redBall", carrier, flank),
      step(300, 700, "defend", "nolan", nolan, p(27, 30)),
      step(1800, 1000, "dribble", "redBall", flank, p(16, 42)),
      step(2900, 600, "shoot", "redBall", p(16, 42), p(3, 34)),
      step(3500, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "FB-25") {
    return [
      step(0, 1400, "dribble", "redBall", carrier, p(34, 30)),
      step(100, 1300, "walk", "nolan", nolan, p(44, 12)),
      step(1500, 1100, "dribble", "redBall", p(34, 30), p(18, 32)),
      step(2700, 600, "shoot", "redBall", p(18, 32), blueGoal),
      step(3300, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "GK-12") {
    const touch = p(20, 33);
    return [
      step(0, 1200, "dribble", "redBall", carrier, touch),
      step(300, 600, "set", "nolan", nolan, nolan),
      step(1500, 800, "dribble", "redBall", touch, p(14, 33)),
      step(2400, 600, "shoot", "redBall", p(14, 33), p(3, 27)),
      step(2600, 600, "dive", "nolan", nolan, p(5, 28)),
      step(3300, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "GK-15") {
    const dropPoint = p(11, 25),
      touch = p(9, 34);
    return [
      step(0, 800, "pass", "blue1", carrier, dropPoint),
      step(200, 1100, "press", "redBall", undefined, p(17, 29)),
      step(500, 800, "run", "nolan", nolan, dropPoint),
      step(1400, 400, "receive", "nolan", dropPoint, dropPoint),
      step(1900, 700, "dribble", "nolan", dropPoint, touch),
      step(2600, 500, "block", "redBall", p(17, 29), touch),
      step(3100, 500, "shoot", "redBall", touch, blueGoal),
      step(3700, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "GK-16") {
    return [
      step(0, 600, "catch", "nolan", nolan, nolan),
      step(650, 900, "press", "redBall", carrier, p(26, 22)),
      step(900, 700, "pass", "nolan", nolan, p(22, 20)),
      step(1550, 400, "receive", "blue1", p(22, 20), p(22, 20)),
      step(1950, 500, "block", "redBall", p(26, 22), p(22, 20)),
      step(2450, 800, "dribble", "redBall", p(22, 20), p(12, 26)),
      step(3250, 500, "shoot", "redBall", p(12, 26), p(3, 30)),
      step(3750, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "GK-18") {
    return [
      step(0, 500, "catch", "nolan", nolan, nolan),
      step(500, 900, "run", "redBall", carrier, p(46, 36)),
      step(700, 900, "run", "red2", undefined, p(38, 46)),
      step(900, 800, "set", "nolan", nolan, nolan),
      step(2200, 900, "pass", "nolan", nolan, p(40, 48)),
      step(3050, 500, "block", "red2", p(38, 46), p(40, 48)),
      step(3550, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "GK-19") {
    const rushed = p(30, 36);
    return [
      step(0, 500, "catch", "nolan", nolan, nolan),
      step(600, 700, "pass", "nolan", nolan, rushed),
      step(900, 800, "run", "redBall", carrier, rushed),
      step(1700, 500, "block", "redBall", rushed, rushed),
      step(2200, 800, "dribble", "redBall", rushed, p(18, 34)),
      step(3000, 500, "shoot", "redBall", p(18, 34), p(3, 34)),
      step(3500, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "GK-22") {
    const farPost = p(13, 40);
    return [
      step(0, 800, "walk", "nolan", nolan, p(7, 32)),
      step(400, 1000, "run", "red2", undefined, farPost),
      step(1600, 900, "cross", "redBall", carrier, farPost),
      step(2450, 400, "receive", "red2", farPost, farPost),
      step(2850, 500, "shoot", "red2", farPost, p(3, 34)),
      step(3350, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "GK-23") {
    return [
      step(0, 900, "walk", "nolan", nolan, p(9, 32)),
      step(1500, 800, "shoot", "redBall", carrier, p(4, 38)),
      step(1900, 600, "dive", "nolan", p(9, 32), p(6, 37)),
      step(2600, 500, "react", "nolan", undefined, undefined, "worried"),
      step(3100, 400, "react", "blue1", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "GK-27") {
    return [
      step(0, 900, "run", "red2", undefined, p(11, 35)),
      step(400, 700, "walk", "nolan", nolan, p(7, 33)),
      step(1300, 900, "cross", "redBall", carrier, p(9, 36)),
      step(2200, 400, "receive", "red2", p(11, 35), p(9, 36)),
      step(2650, 500, "shoot", "red2", p(9, 36), p(3, 33)),
      step(3200, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "GK-29") {
    const looseWide = p(9, 48);
    return [
      step(0, 600, "set", "nolan", nolan, nolan),
      step(300, 1000, "press", "redBall", undefined, p(31, 50)),
      step(900, 800, "pass", "blue2", carrier, looseWide),
      step(1800, 900, "run", "redBall", p(31, 50), p(12, 49)),
      step(2700, 400, "receive", "redBall", looseWide, p(12, 49)),
      step(3100, 500, "shoot", "redBall", p(12, 49), p(4, 36)),
      step(3600, 400, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (row.id === "DM-07")
    return [
      // Staying high puts Tom behind the striker's press; the centre-back's
      // direct pass is intercepted before Blue can turn upfield.
      step(0, 1100, "run", "nolan", nolan, badTo),
      step(450, 1000, "pass", "blue1", carrier, badTo),
      step(1150, 650, "block", "red1", p(49, 32), badTo),
      step(1800, 900, "dribble", "red1", badTo, p(34, 26)),
      step(2550, 700, "pass", "red1", p(34, 26), p(18, 38)),
      step(3200, 650, "shoot", "red2", p(18, 38), blueGoal),
      step(3900, 500, "react", "nolan", undefined, undefined, "worried"),
    ];
  if (family.startsWith("gk-")) {
    if (family === "gk-distribute")
      return [
        step(0, 700, "catch", "nolan", nolan, nolan),
        step(800, 900, "pass", "nolan", nolan, p(28, 32)),
        step(1500, 500, "receive", "red2", p(28, 32), p(27, 32)),
        step(2100, 800, "shoot", "red2", p(27, 32), blueGoal),
        step(2900, 600, "react", "nolan", undefined, undefined, "worried"),
      ];
    if (family === "gk-cross" || family === "gk-organize")
      return [
        step(0, 900, "walk", "nolan", nolan, p(7, 32)),
        step(500, 1200, "cross", "redBall", carrier, p(13, 38)),
        step(1600, 500, "receive", "red2", p(13, 38), p(12, 38)),
        step(2200, 700, "shoot", "red2", p(12, 38), blueGoal),
        step(2900, 600, "react", "nolan", undefined, undefined, "worried"),
      ];
    if (family === "gk-sweep")
      return [
        step(0, 1200, "walk", "nolan", nolan, p(15, 32)),
        step(300, 1500, "dribble", "redBall", carrier, p(18, 34)),
        step(1700, 800, "shoot", "redBall", p(18, 34), blueGoal),
        step(2600, 600, "react", "nolan", undefined, undefined, "worried"),
      ];
    return [
      step(0, 800, "shoot", "redBall", carrier, p(8, 32)),
      step(500, 800, "dive", "nolan", nolan, p(8, 32)),
      step(1100, 600, "parry", "nolan", p(8, 32), p(19, 34)),
      step(1800, 700, "shoot", "red2", p(19, 34), blueGoal),
      step(2700, 600, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (l.defending) {
    if (family === "press")
      return [
        step(0, 1200, "walk", "nolan", nolan, badTo),
        step(
          300,
          1500,
          "dribble",
          "redBall",
          carrier,
          p(carrier.x - 10, carrier.y),
        ),
        step(
          1500,
          800,
          "pass",
          "redBall",
          p(carrier.x - 10, carrier.y),
          p(carrier.x - 18, target.y),
        ),
        step(
          2200,
          500,
          "receive",
          "red2",
          p(carrier.x - 18, target.y),
          p(carrier.x - 19, target.y),
        ),
        step(2800, 800, "shoot", "red2", p(carrier.x - 19, target.y), blueGoal),
        step(3400, 500, "react", "nolan", undefined, undefined, "worried"),
      ];
    if (family === "cover" || family === "set-piece")
      return [
        step(0, 1200, "run", "nolan", nolan, badTo),
        step(200, 1500, "run", "red2", undefined, p(carrier.x - 14, target.y)),
        step(
          700,
          1100,
          family === "set-piece" ? "cross" : "pass",
          "redBall",
          carrier,
          p(carrier.x - 14, target.y),
        ),
        step(
          1800,
          500,
          "receive",
          "red2",
          p(carrier.x - 14, target.y),
          p(carrier.x - 15, target.y),
        ),
        step(2400, 800, "shoot", "red2", p(carrier.x - 15, target.y), blueGoal),
        step(3200, 500, "react", "nolan", undefined, undefined, "worried"),
      ];
    return [
      step(0, 900, "defend", "nolan", nolan, badTo),
      step(
        400,
        1600,
        "dribble",
        "redBall",
        carrier,
        p(carrier.x - 14, carrier.y),
      ),
      step(
        1700,
        700,
        "pass",
        "redBall",
        p(carrier.x - 14, carrier.y),
        p(carrier.x - 20, target.y),
      ),
      step(2400, 700, "shoot", "red2", p(carrier.x - 20, target.y), blueGoal),
      step(3200, 500, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (family === "combine")
    return [
      step(0, 700, "pass", "nolan", nolan, target),
      step(500, 1300, "walk", "nolan", nolan, badTo),
      step(900, 800, "pass", "blue2", target, goodPoint(badTo)),
      step(1700, 700, "defend", "red1", undefined, goodPoint(badTo)),
      step(2400, 1000, "dribble", "red1", goodPoint(badTo), p(35, 36)),
      step(3300, 500, "react", "nolan", undefined, undefined, "worried"),
    ];
  const loseAt = badTo;
  return [
    step(
      0,
      1100,
      family === "receive" ? "turn" : family === "hold" ? "dribble" : "run",
      "nolan",
      nolan,
      loseAt,
    ),
    step(600, 800, "pass", "blue1", carrier, loseAt),
    step(1300, 700, "defend", "red1", undefined, loseAt),
    step(2000, 1100, "dribble", "red1", loseAt, p(35, index % 2 ? 23 : 43)),
    step(2900, 600, "run", "red2", undefined, p(43, index % 2 ? 45 : 20)),
    step(3400, 500, "react", "nolan", undefined, undefined, "worried"),
  ];
}

const goodPoint = (point: Point) => p(point.x + 1, point.y);

function goodAnimation(
  row: InventoryRow,
  index: number,
  l: ReturnType<typeof layout>,
): AnimationStep[] {
  const { nolan, carrier, goodTo, target } = l;
  if (!reviewedCoreIds.has(row.id)) return dutyGoodAnimation(row, index, l);
  if (row.id === "TW-09")
    return [
      step(0, 1400, "run", "nolan", nolan, p(67, 32)),
      step(0, 1500, "run", "blue2", target, p(72, 52)),
      step(300, 900, "pass", "blue1", carrier, p(67, 32)),
      step(1300, 500, "receive", "nolan", p(67, 32), p(68, 32)),
      step(1900, 800, "pass", "nolan", p(68, 32), p(72, 52)),
      step(2600, 800, "shoot", "blue2", p(72, 52), p(97, 34)),
      step(3300, 500, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  if (row.id === "FB-03")
    return [
      step(0, 1600, "run", "nolan", nolan, p(76, 12)),
      step(300, 1200, "shield", "blue2", target, p(67, 22)),
      step(700, 1900, "run", "blue1", carrier, p(84, 38)),
      step(1300, 700, "pass", "blue2", p(67, 22), p(76, 12)),
      step(2000, 500, "receive", "nolan", p(76, 12), p(77, 12)),
      step(2500, 900, "cross", "nolan", p(77, 12), p(84, 38)),
      step(3400, 600, "shoot", "blue1", p(84, 38), p(97, 32)),
    ];
  if (row.id === "TW-02")
    return [
      step(0, 1200, "run", "nolan", nolan, p(43, 31)),
      step(0, 1200, "run", "blue2", target, p(53, 48)),
      step(600, 800, "pass", "blue1", carrier, p(43, 31)),
      step(1300, 500, "receive", "nolan", p(43, 31), p(44, 31)),
      step(1800, 800, "pass", "nolan", p(44, 31), p(53, 48)),
      step(2500, 700, "pass", "blue2", p(53, 48), p(69, 34)),
      step(3200, 500, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  if (row.id === "TW-07")
    return [
      step(0, 1500, "defend", "nolan", nolan, p(28, 32)),
      step(200, 1800, "dribble", "redBall", carrier, p(31, 30)),
      step(900, 1800, "run", "blue1", p(24, 45), p(27, 37)),
      step(1900, 900, "turn", "redBall", p(31, 30), p(40, 22)),
      step(2600, 700, "defend", "blue1", p(27, 37), p(32, 30)),
      step(3300, 500, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  if (row.id === "GK-01")
    return [
      step(0, 900, "set", "nolan", nolan, p(12, 32)),
      step(700, 900, "shoot", "redBall", carrier, p(4, 27)),
      step(1200, 900, "dive", "nolan", p(12, 32), p(8, 27)),
      step(1300, 700, "block", "nolan", p(8, 27), p(19, 20)),
      step(2500, 600, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  if (row.id === "GK-02")
    return [
      step(0, 1600, "run", "nolan", nolan, p(23, 32)),
      step(300, 1500, "dribble", "redBall", carrier, p(25, 34)),
      step(1500, 800, "clear", "nolan", p(23, 32), p(36, 10)),
      step(2400, 900, "run", "nolan", p(23, 32), p(11, 32)),
      step(3300, 500, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  if (row.id === "GK-03")
    return [
      step(0, 900, "shoot", "redBall", carrier, p(6, 35)),
      step(500, 900, "dive", "nolan", nolan, p(7, 36)),
      step(900, 700, "parry", "nolan", p(7, 36), p(13, 56)),
      step(1800, 900, "run", "blue1", p(22, 20), p(16, 48)),
      step(2800, 500, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  if (row.id === "GK-04")
    return [
      step(0, 700, "catch", "nolan", nolan, nolan),
      step(800, 500, "scan", "nolan", nolan, p(9, 31)),
      step(1400, 1000, "pass", "nolan", p(9, 31), target),
      step(2300, 500, "receive", "blue2", target, p(target.x + 1, target.y)),
      step(2800, 1100, "dribble", "blue2", target, p(48, 52)),
    ];
  if (row.id === "GK-05")
    return [
      step(0, 700, "scan", "nolan", nolan, p(9, 31)),
      step(300, 1100, "run", "blue1", p(22, 20), p(15, 42)),
      step(1200, 1100, "cross", "redBall", carrier, p(15, 42)),
      step(2100, 800, "clear", "blue1", p(15, 42), p(39, 54)),
      step(3000, 600, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  if (row.id === "GK-06")
    return [
      step(0, 1200, "cross", "redBall", carrier, p(13, 32)),
      step(500, 1200, "run", "nolan", nolan, p(13, 32)),
      step(1500, 700, "catch", "nolan", p(13, 32), p(13, 32)),
      step(2200, 900, "run", "nolan", p(13, 32), p(8, 32)),
      step(3100, 500, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  if (row.id === "GK-07")
    return [
      step(0, 700, "shoot", "redBall", carrier, p(7, 27)),
      step(400, 700, "dive", "nolan", nolan, p(7, 27)),
      step(900, 600, "parry", "nolan", p(7, 27), p(18, 38)),
      step(1400, 700, "set", "nolan", p(7, 27), p(9, 32)),
      step(1900, 700, "shoot", "red2", p(18, 38), p(5, 36)),
      step(2100, 700, "dive", "nolan", p(9, 32), p(6, 36)),
      step(2600, 700, "catch", "nolan", p(6, 36), p(6, 36)),
      step(3300, 500, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  if (row.id.startsWith("GK-")) {
    const style = index % 6;
    if (style === 0)
      return [
        step(0, 700, "set", "nolan", nolan, p(10, 32)),
        step(600, 800, "shoot", "redBall", carrier, p(5, 28)),
        step(1000, 800, "dive", "nolan", p(10, 32), p(6, 28)),
        step(1500, 600, "block", "nolan", p(6, 28), p(19, 18)),
        step(2600, 600, "celebrate", "blue1", undefined, undefined, "happy"),
      ];
    if (style === 1)
      return [
        step(0, 1200, "cross", "redBall", carrier, p(13, 34)),
        step(500, 1100, "run", "nolan", nolan, p(13, 34)),
        step(1500, 700, "catch", "nolan", p(13, 34), p(13, 34)),
        step(2400, 800, "pass", "nolan", p(13, 34), target),
        step(3200, 500, "receive", "blue2", target, target),
      ];
    if (style === 2)
      return [
        step(0, 800, "shoot", "redBall", carrier, p(6, 38)),
        step(400, 800, "dive", "nolan", nolan, p(7, 38)),
        step(1000, 600, "parry", "nolan", p(7, 38), p(14, 55)),
        step(1900, 900, "run", "nolan", p(7, 38), p(8, 32)),
        step(3000, 500, "celebrate", "blue1", undefined, undefined, "happy"),
      ];
    if (style === 3)
      return [
        step(0, 700, "catch", "nolan", nolan, nolan),
        step(800, 600, "scan", "nolan", nolan, p(9, 31)),
        step(1500, 1000, "pass", "nolan", p(9, 31), target),
        step(2400, 500, "receive", "blue2", target, target),
        step(2900, 1000, "dribble", "blue2", target, p(49, target.y)),
      ];
    if (style === 4)
      return [
        step(0, 1500, "run", "nolan", nolan, p(24, 32)),
        step(300, 1500, "dribble", "redBall", carrier, p(26, 34)),
        step(1500, 800, "clear", "nolan", p(24, 32), p(39, 9)),
        step(2500, 900, "run", "nolan", p(24, 32), p(9, 32)),
        step(3400, 500, "celebrate", "blue1", undefined, undefined, "happy"),
      ];
    return [
      step(0, 700, "set", "nolan", nolan, p(9, 32)),
      step(600, 800, "shoot", "redBall", carrier, p(7, 34)),
      step(1000, 800, "dive", "nolan", p(9, 32), p(7, 34)),
      step(1500, 600, "catch", "nolan", p(7, 34), p(7, 34)),
      step(2500, 900, "pass", "nolan", p(7, 34), target),
    ];
  }
  if (row.id === "AM-04")
    return [
      step(0, 700, "pass", "nolan", nolan, target),
      step(400, 1500, "run", "nolan", nolan, p(79, 31)),
      step(700, 500, "receive", "blue2", target, target),
      step(1300, 700, "pass", "blue2", target, p(79, 31)),
      step(2000, 500, "receive", "nolan", p(79, 31), p(80, 31)),
      step(2500, 700, "shoot", "nolan", p(80, 31), p(97, 32)),
      step(3200, 500, "celebrate", "blue2", undefined, undefined, "happy"),
    ];
  if (row.id === "WNG-04") {
    const endLine = p(84, nolan.y < 32 ? 10 : 54),
      cutback = p(75, nolan.y < 32 ? 24 : 40);
    return [
      step(0, 1500, "dribble", "nolan", nolan, endLine),
      step(500, 1200, "run", "blue2", target, cutback),
      step(
        700,
        1200,
        "defend",
        "red1",
        undefined,
        p(81, nolan.y < 32 ? 18 : 46),
      ),
      step(1500, 900, "cross", "nolan", endLine, cutback),
      step(2300, 500, "receive", "blue2", cutback, cutback),
      step(2800, 800, "shoot", "blue2", cutback, p(97, 32)),
      step(3500, 500, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }
  if (crossers.has(row.id))
    return [
      step(0, 1100, "dribble", "nolan", nolan, goodTo),
      step(900, 1000, "cross", "nolan", goodTo, target),
      step(1800, 500, "receive", "blue2", target, target),
      step(2300, 800, "shoot", "blue2", target, p(97, 32)),
      step(3000, 600, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  if (passFinishers.has(row.id))
    return [
      step(0, 800, "run", "blue2", target, p(82, 38)),
      step(300, 900, "pass", "nolan", nolan, p(82, 38)),
      step(1200, 500, "receive", "blue2", p(82, 38), p(83, 38)),
      step(1900, 700, "shoot", "blue2", p(83, 38), p(97, 32)),
      step(2800, 600, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  if (finishers.has(row.id))
    return [
      step(0, 1200, "run", "nolan", nolan, goodTo),
      step(600, 900, "pass", "blue1", carrier, goodTo),
      step(1400, 500, "receive", "nolan", goodTo, goodTo),
      step(2000, 800, "shoot", "nolan", goodTo, p(97, 32)),
      step(2900, 600, "celebrate", "blue2", undefined, undefined, "happy"),
    ];
  return dutyGoodAnimation(row, index, l);
}

function poorAnimation(
  row: InventoryRow,
  index: number,
  l: ReturnType<typeof layout>,
): AnimationStep[] {
  const { nolan, carrier, badTo, target } = l;
  const text = row.poor.toLowerCase();
  if (row.id === "GK-28")
    return [
      step(0, 1200, "dribble", "redBall", carrier, p(24, 18)),
      step(250, 1200, "dive", "nolan", nolan, p(36, 16)),
      step(1350, 750, "pass", "redBall", p(24, 18), p(20, 44)),
      step(1950, 700, "shoot", "red2", p(20, 44), p(3, 38)),
      step(2700, 500, "react", "nolan", undefined, undefined, "worried"),
    ];
  if (!reviewedCoreIds.has(row.id)) return dutyPoorAnimation(row, index, l);
  if (row.id === "GK-01" || row.id === "GK-02")
    return [
      step(0, 1100, "walk", "nolan", nolan, badTo),
      step(400, 1300, "dribble", "redBall", carrier, p(18, 36)),
      step(1700, 800, "shoot", "redBall", p(18, 36), p(3, 32)),
      step(2300, 600, "react", "nolan", undefined, undefined, "worried"),
    ];
  if (row.id === "GK-03")
    return [
      step(0, 800, "shoot", "redBall", carrier, p(8, 32)),
      step(500, 900, "dive", "nolan", nolan, p(8, 32)),
      step(1000, 600, "parry", "nolan", p(8, 32), p(20, 32)),
      step(1700, 700, "shoot", "red2", p(20, 32), p(3, 32)),
      step(2500, 600, "react", "nolan", undefined, undefined, "worried"),
    ];
  if (row.id === "GK-04")
    return [
      step(0, 700, "catch", "nolan", nolan, nolan),
      step(900, 900, "pass", "nolan", nolan, p(29, 32)),
      step(1500, 500, "receive", "red2", p(29, 32), p(28, 32)),
      step(2100, 800, "shoot", "red2", p(28, 32), p(3, 32)),
      step(2700, 600, "react", "nolan", undefined, undefined, "worried"),
    ];
  if (row.id === "GK-05")
    return [
      step(0, 800, "walk", "nolan", nolan, p(8, 34)),
      step(800, 1100, "cross", "redBall", carrier, p(14, 43)),
      step(1600, 700, "receive", "red2", p(14, 43), p(13, 42)),
      step(2200, 700, "shoot", "red2", p(13, 42), p(3, 34)),
      step(2800, 600, "react", "nolan", undefined, undefined, "worried"),
    ];
  if (row.id === "GK-06")
    return [
      step(0, 900, "walk", "nolan", nolan, p(7, 32)),
      step(500, 1200, "cross", "redBall", carrier, p(13, 34)),
      step(1600, 500, "receive", "red2", p(13, 34), p(12, 35)),
      step(2200, 700, "shoot", "red2", p(12, 35), p(3, 32)),
      step(2800, 600, "react", "nolan", undefined, undefined, "worried"),
    ];
  if (row.id === "GK-07")
    return [
      step(0, 700, "shoot", "redBall", carrier, p(7, 27)),
      step(400, 700, "dive", "nolan", nolan, p(7, 27)),
      step(900, 600, "parry", "nolan", p(7, 27), p(18, 38)),
      step(1500, 900, "walk", "nolan", p(7, 27), p(8, 29)),
      step(1700, 700, "shoot", "red2", p(18, 38), p(3, 36)),
      step(2400, 600, "react", "nolan", undefined, undefined, "worried"),
    ];
  if (row.id.startsWith("GK-")) {
    const style = index % 4;
    if (style === 0)
      return [
        step(0, 900, "walk", "nolan", nolan, p(7, 34)),
        step(500, 900, "shoot", "redBall", carrier, p(3, 27)),
        step(1800, 600, "react", "nolan", undefined, undefined, "worried"),
        step(2700, 600, "react", "blue1", undefined, undefined, "worried"),
      ];
    if (style === 1)
      return [
        step(0, 1100, "cross", "redBall", carrier, p(14, 37)),
        step(700, 900, "walk", "nolan", nolan, p(7, 32)),
        step(1500, 500, "receive", "red2", p(14, 37), p(13, 37)),
        step(2100, 700, "shoot", "red2", p(13, 37), p(3, 33)),
        step(2800, 600, "react", "nolan", undefined, undefined, "worried"),
      ];
    if (style === 2)
      return [
        step(0, 800, "shoot", "redBall", carrier, p(7, 31)),
        step(500, 800, "dive", "nolan", nolan, p(7, 31)),
        step(1000, 600, "parry", "nolan", p(7, 31), p(19, 34)),
        step(1700, 700, "shoot", "red2", p(19, 34), p(3, 35)),
        step(2600, 600, "react", "nolan", undefined, undefined, "worried"),
      ];
    return [
      step(0, 700, "catch", "nolan", nolan, nolan),
      step(900, 900, "pass", "nolan", nolan, p(28, 32)),
      step(1500, 500, "receive", "red2", p(28, 32), p(27, 32)),
      step(2100, 800, "shoot", "red2", p(27, 32), p(3, 32)),
      step(2800, 600, "react", "nolan", undefined, undefined, "worried"),
    ];
  }
  if (text.includes("offside"))
    return [
      step(0, 1500, "run", "nolan", nolan, p(86, nolan.y)),
      step(800, 900, "pass", "blue1", carrier, p(86, nolan.y)),
      step(1700, 700, "walk", "red1", undefined, p(81, 34)),
      step(2400, 600, "react", "nolan", undefined, undefined, "surprised"),
    ];
  if (
    text.includes("goalkeeper") ||
    text.includes("hands") ||
    text.includes("held")
  )
    return [
      step(0, 1000, "run", "nolan", nolan, badTo),
      step(900, 1100, "cross", "nolan", badTo, p(91, 32)),
      step(1900, 700, "catch", "redGK", p(92, 32), p(91, 32)),
      step(2700, 600, "react", "nolan", undefined, undefined, "worried"),
    ];
  if (
    l.defending &&
    (text.includes("shot") ||
      text.includes("scores") ||
      text.includes("goal") ||
      text.includes("finish"))
  )
    return [
      step(0, 1100, "run", "nolan", nolan, badTo),
      step(300, 1300, "dribble", "redBall", carrier, p(22, 35)),
      step(1300, 700, "pass", "redBall", p(22, 35), p(17, 42)),
      step(2000, 500, "receive", "red2", p(17, 42), p(16, 40)),
      step(2500, 800, "shoot", "red2", p(16, 40), p(3, 32)),
      step(3000, 500, "react", "nolan", undefined, undefined, "worried"),
    ];
  return dutyPoorAnimation(row, index, l);
}

function alternateAnimation(
  row: InventoryRow,
  l: ReturnType<typeof layout>,
): AnimationStep[] {
  const alt = p(Math.min(88, l.goodTo.x + 5), Math.max(9, 58 - l.goodTo.y));
  if (row.id === "GK-04")
    return [
      step(0, 700, "catch", "nolan", l.nolan, l.nolan),
      step(800, 600, "scan", "nolan", l.nolan, p(9, 34)),
      step(1500, 1100, "pass", "nolan", p(9, 34), p(34, 14)),
      step(2500, 500, "receive", "blue1", p(34, 14), p(35, 14)),
      step(3000, 900, "dribble", "blue1", p(35, 14), p(48, 17)),
    ];
  if (l.defending)
    return [
      step(0, 1100, "run", "nolan", l.nolan, alt),
      step(500, 1200, "defend", "blue1", p(24, 40), p(29, 34)),
      step(1500, 800, "pass", "blue1", p(29, 34), alt),
      step(2300, 800, "clear", "nolan", alt, p(46, 54)),
      step(3100, 500, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  return [
    step(0, 1000, "run", "nolan", l.nolan, alt),
    step(600, 900, "pass", "blue1", l.carrier, alt),
    step(1400, 500, "receive", "nolan", alt, alt),
    step(1900, 900, "pass", "nolan", alt, l.target),
    step(2700, 500, "receive", "blue2", l.target, l.target),
    step(3100, 700, "celebrate", "blue1", undefined, undefined, "happy"),
  ];
}

const clampPoint = (point: Point) =>
  p(Math.max(5, Math.min(95, point.x)), Math.max(8, Math.min(56, point.y)));
function supportingSetupSteps(
  actors: AnimatedActor[],
  defending: boolean,
): AnimationStep[] {
  return actors
    .filter((item) => item.id.startsWith("support-") && !item.goalkeeper)
    .map((item, index) => {
      const attacking = item.team === (defending ? "red" : "blue"),
        dx = attacking ? -2.8 : 2.2,
        dy = item.start.y < 32 ? 2.2 : -2.2;
      return step(
        350 + (index % 4) * 260,
        1500,
        attacking ? "run" : "defend",
        item.id,
        item.start,
        clampPoint(p(item.start.x + dx, item.start.y + dy)),
      );
    });
}
function supportingReactionSteps(
  actors: AnimatedActor[],
  defending: boolean,
  quality: "good" | "poor",
): AnimationStep[] {
  return actors
    .filter((item) => item.id.startsWith("support-") && !item.goalkeeper)
    .map((item, index) => {
      const blueAdvantage = quality === "good",
        dx = blueAdvantage
          ? item.team === "blue"
            ? 4
            : 2
          : item.team === "red"
            ? -5
            : -3.5,
        towardBall = item.start.y < 32 ? 3 : -3;
      const action =
        item.team === (blueAdvantage ? "red" : "blue") ? "defend" : "run";
      return step(
        250 + (index % 4) * 380,
        1800,
        action,
        item.id,
        undefined,
        clampPoint(p(item.start.x + dx, item.start.y + towardBall)),
      );
    });
}

function distanceFromLane(point: Point, start: Point, end: Point) {
  const dx = end.x - start.x,
    dy = end.y - start.y,
    length = dx * dx + dy * dy;
  if (!length) return { distance: 99, progress: 0 };
  const progress = Math.max(
      0,
      Math.min(
        1,
        ((point.x - start.x) * dx + (point.y - start.y) * dy) / length,
      ),
    ),
    x = start.x + progress * dx,
    y = start.y + progress * dy;
  return { distance: Math.hypot(point.x - x, point.y - y), progress };
}
function prepareClearBestPaths(
  actors: AnimatedActor[],
  ballStart: Point,
  setup: AnimationStep[],
  rawSteps: AnimationStep[],
) {
  const hasEarlyBlueKick = rawSteps.some(
      (item) =>
        item.startTime < 550 &&
        item.actorId &&
        actors.find((actor) => actor.id === item.actorId)?.team === "blue" &&
        ["pass", "cross", "clear", "shoot"].includes(item.action),
    ),
    steps = rawSteps.map((item) => ({
      ...item,
      startTime: item.startTime + (hasEarlyBlueKick ? 700 : 0),
    })),
    frame = finalFrame(actors, ballStart, setup),
    positions = Object.fromEntries(
      Object.entries(frame.actors).map(([id, value]) => [
        id,
        { ...value.position },
      ]),
    );
  let ball = { ...frame.ball };
  const openings: AnimationStep[] = [];
  for (const item of [...steps].sort((a, b) => a.startTime - b.startTime)) {
    const kicker = item.actorId
      ? actors.find((actor) => actor.id === item.actorId)
      : undefined;
    if (
      kicker?.team === "blue" &&
      item.to &&
      ["pass", "cross", "clear", "shoot"].includes(item.action)
    ) {
      const from = item.from ?? ball,
        to = item.to,
        dx = to.x - from.x,
        dy = to.y - from.y,
        length = Math.max(1, Math.hypot(dx, dy)),
        perpendicular = p(-dy / length, dx / length);
      actors
        .filter(
          (actor) =>
            actor.team === "red" &&
            !(item.action === "shoot" && actor.goalkeeper),
        )
        .forEach((actor, actorIndex) => {
          const lane = distanceFromLane(
            positions[actor.id] ?? actor.start,
            from,
            to,
          );
          if (
            lane.progress > 0.14 &&
            lane.progress < 0.9 &&
            lane.distance < 3.4
          ) {
            const current = positions[actor.id] ?? actor.start,
              side =
                (current.x - from.x) * perpendicular.x +
                  (current.y - from.y) * perpendicular.y ||
                (actorIndex % 2) * 2 - 1,
              destination = clampPoint(
                p(
                  current.x + perpendicular.x * 11.5 * Math.sign(side),
                  current.y + perpendicular.y * 11.5 * Math.sign(side),
                ),
              );
            openings.push(
              step(
                Math.max(0, item.startTime - 100),
                650,
                "defend",
                actor.id,
                current,
                destination,
              ),
            );
            steps
              .filter(
                (next) =>
                  next.actorId === actor.id &&
                  next.startTime >= item.startTime - 200 &&
                  next.startTime <= item.startTime + 100,
              )
              .forEach((next) => {
                next.startTime = item.startTime + item.duration + 120;
              });
            positions[actor.id] = destination;
          }
        });
    }
    if (
      item.actorId &&
      item.to &&
      ![
        "pass",
        "shoot",
        "cross",
        "clear",
        "parry",
        "block",
        "celebrate",
        "react",
      ].includes(item.action)
    )
      positions[item.actorId] = { ...item.to };
    if (
      item.to &&
      [
        "pass",
        "shoot",
        "dribble",
        "receive",
        "cross",
        "clear",
        "catch",
        "parry",
        "block",
      ].includes(item.action)
    )
      ball = { ...item.to };
  }
  return [...steps, ...openings];
}

const coachRepairIds = new Set(
  `WNG-02 WNG-05 WNG-06 WNG-07 WNG-08 STR-02 STR-04 STR-08 FB-02 FB-03 FB-04 FB-05 FB-06 CB-02 CB-04 CB-05 CB-06 TW-06 TW-09 DM-04 DM-05 WNG-09 WNG-10 WNG-11 WNG-12 WNG-13 WNG-14 WNG-15 WNG-18 WNG-22 WNG-23 WNG-26 WNG-28 WNG-29 WNG-30 STR-09 STR-10 STR-11 STR-12 STR-13 STR-14 STR-15 STR-17 STR-21 STR-24 STR-26 STR-28 STR-29 STR-30 CM-07 CM-09 CM-11 CM-12 CM-18 CM-19 CM-20 CM-21 CM-23 CM-24 CM-25 CM-29 CM-30 AM-07 AM-08 AM-12 AM-14 AM-17 AM-18 AM-21 AM-24 AM-26 AM-27 AM-28 DM-03 DM-09 DM-11 DM-14 DM-16 DM-17 DM-18 DM-19 DM-20 DM-21 DM-24 DM-25 DM-28 DM-29 DM-30 FB-07 FB-08 FB-09 FB-11 FB-13 FB-19 FB-20 FB-21 FB-22 FB-24 FB-25 FB-26 FB-29 FB-30 CB-01 CB-03 CB-09 CB-11 CB-12 CB-13 CB-15 CB-18 CB-19 CB-20 CB-22 CB-23 CB-24 CB-26 CB-27 CB-28 GK-01 GK-08 GK-09 GK-13 GK-17 GK-25 GK-26 GK-28 GK-30 TW-08`.split(
    " ",
  ),
);

function coachProofAnimation(
  row: InventoryRow,
  index: number,
  l: ReturnType<typeof layout>,
  quality: "good" | "poor",
  label: string,
  raw: AnimationStep[],
): AnimationStep[] {
  if (
    quality !== "good" ||
    label !== metadata[row.id]?.goodLabel ||
    !coachRepairIds.has(row.id)
  )
    return raw;
  const skill = skillIdFor(row),
    { nolan, carrier, target } = l,
    safeY = (value: number) => Math.max(10, Math.min(54, value)),
    side = index % 2 ? 1 : -1,
    redGoal = p(97, 32);

  if (["A01", "A03"].includes(skill))
    return [
      step(0, 500, "scan", "nolan", nolan, nolan),
      step(450, 550, "turn", "nolan", nolan, p(nolan.x + 2, nolan.y)),
      ...raw.map((item) => ({ ...item, startTime: item.startTime + 950 })),
    ];

  if (skill === "A04") {
    const red1Start = l.actors.find((item) => item.id === "red1")!.start,
      awayFromPressure = red1Start.y <= nolan.y ? 1 : -1,
      pressure =
        row.id === "FB-08"
          ? p(nolan.x + 6, safeY(nolan.y + 15))
          : p(nolan.x + 4, safeY(nolan.y - awayFromPressure * 5)),
      touch =
        row.id === "FB-08"
          ? p(Math.min(86, nolan.x + 18), 10)
          : p(
              Math.min(86, nolan.x + 5),
              safeY(nolan.y + awayFromPressure * 12),
            );
    return [
      step(0, 750, "pass", "blue1", carrier, nolan),
      step(650, 400, "receive", "nolan", nolan, nolan),
      step(450, 1100, "defend", "red1", undefined, pressure),
      step(1000, 900, "dribble", "nolan", nolan, touch),
      step(1850, 800, "pass", "nolan", touch, target),
      step(2600, 450, "receive", "blue2", target, target),
    ];
  }

  if (skill === "A05" && ["WNG-12", "WNG-18"].includes(row.id)) {
    const outside = p(Math.min(84, nolan.x + 16), nolan.y < 32 ? 10 : 54),
      inside = p(Math.min(82, nolan.x + 14), nolan.y < 32 ? 30 : 34);
    if (row.id === "WNG-12")
      return [
        step(0, 700, "pass", "blue1", carrier, nolan),
        step(650, 400, "receive", "nolan", nolan, nolan),
        step(500, 1500, "run", "blue2", target, outside),
        step(
          650,
          1350,
          "defend",
          "red1",
          undefined,
          p(outside.x - 5, outside.y),
        ),
        step(1000, 1300, "dribble", "nolan", nolan, inside),
        step(2250, 800, "pass", "nolan", inside, p(84, 32)),
      ];
    return [
      step(0, 1400, "run", "nolan", nolan, inside),
      step(0, 1400, "run", "blue2", target, outside),
      step(250, 1250, "defend", "red1", undefined, p(outside.x - 5, outside.y)),
      step(1100, 900, "pass", "blue1", carrier, outside),
      step(1900, 400, "receive", "blue2", outside, outside),
      step(2300, 900, "dribble", "blue2", outside, p(86, outside.y)),
      step(2500, 800, "run", "nolan", inside, p(84, 32)),
    ];
  }

  if (skill === "A06" && row.id === "WNG-30") {
    const check = p(Math.max(18, nolan.x - 8), safeY(nolan.y + side * 7));
    return [
      step(0, 1100, "run", "nolan", nolan, check),
      step(150, 1100, "defend", "red1", undefined, p(check.x + 6, check.y)),
      step(950, 700, "pass", "blue1", carrier, check),
      step(1550, 400, "receive", "nolan", check, check),
      step(1850, 750, "pass", "nolan", check, carrier),
      step(2500, 400, "receive", "blue1", carrier, carrier),
    ];
  }

  if (skill === "A02") {
    const escape = p(nolan.x - 8, safeY(nolan.y + side * 12));
    return [
      step(0, 1200, "run", "nolan", nolan, escape),
      step(150, 1200, "defend", "red1", undefined, p(nolan.x + 4, nolan.y)),
      step(1050, 850, "pass", "blue1", carrier, escape),
      step(1800, 450, "receive", "nolan", escape, escape),
      step(2250, 850, "pass", "nolan", escape, target),
      step(3050, 450, "receive", "blue2", target, target),
    ];
  }

  if (skill === "A07") {
    // Stay a playable distance behind the ball without collapsing onto the
    // touchline/goal-area boundary, where geometry repair can separate Tom
    // from the pass endpoint.
    const support = p(Math.max(12, nolan.x - 8), safeY(nolan.y + side * 7));
    return [
      step(0, 1200, "run", "nolan", nolan, support),
      step(250, 1000, "defend", "red1", undefined, p(carrier.x + 5, carrier.y)),
      step(1050, 800, "pass", "blue1", carrier, support),
      step(1750, 450, "receive", "nolan", support, support),
      step(2200, 850, "pass", "nolan", support, target),
      step(3000, 450, "receive", "blue2", target, target),
    ];
  }

  if (["A09", "A21", "A22"].includes(skill)) {
    const runTo =
      skill === "A21"
        ? p(82, nolan.y < 32 ? 50 : 14)
        : p(
            skill === "A22" ? 78 : Math.min(86, nolan.x + 17),
            safeY(nolan.y + side * 8),
          );
    return [
      step(0, 1400, "run", "nolan", nolan, runTo),
      step(
        250,
        1300,
        "defend",
        "red1",
        undefined,
        p(runTo.x - 5, runTo.y + side * 5),
      ),
      step(
        950,
        1000,
        skill === "A21" ? "cross" : "pass",
        "blue1",
        carrier,
        runTo,
      ),
      step(1850, 450, "receive", "nolan", runTo, runTo),
      step(2350, 750, "shoot", "nolan", runTo, redGoal),
      step(3150, 450, "celebrate", "blue2", undefined, undefined, "happy"),
    ];
  }

  if (skill === "A10") {
    const protect = p(nolan.x + 2, nolan.y);
    return [
      step(0, 800, "pass", "blue1", carrier, nolan),
      step(700, 450, "receive", "nolan", nolan, nolan),
      step(850, 1500, "defend", "red1", undefined, p(nolan.x + 5, nolan.y)),
      step(1100, 1200, "shield", "nolan", nolan, protect),
      step(2250, 850, "pass", "nolan", protect, target),
      step(3050, 450, "receive", "blue2", target, target),
    ];
  }

  if (["A11", "A12"].includes(skill)) {
    const carryTo = p(Math.min(82, nolan.x + 15), safeY(nolan.y + side * 9));
    return [
      step(0, 700, "pass", "blue1", carrier, nolan),
      step(650, 400, "receive", "nolan", nolan, nolan),
      step(1000, 1400, "dribble", "nolan", nolan, carryTo),
      step(
        1100,
        1300,
        "defend",
        "red1",
        undefined,
        p(carryTo.x + 3, carryTo.y + side * 4),
      ),
      step(2350, 800, "pass", "nolan", carryTo, target),
      step(3100, 450, "receive", "blue2", target, target),
    ];
  }

  if (skill === "A13") {
    const returnTo = p(Math.min(86, nolan.x + 17), safeY(nolan.y + side * 7));
    return [
      step(0, 650, "pass", "blue1", carrier, nolan),
      step(600, 400, "receive", "nolan", nolan, nolan),
      step(1000, 650, "pass", "nolan", nolan, target),
      step(1150, 1300, "run", "nolan", nolan, returnTo),
      step(1600, 400, "receive", "blue2", target, target),
      step(2000, 750, "pass", "blue2", target, returnTo),
      step(2650, 400, "receive", "nolan", returnTo, returnTo),
      step(3100, 700, "shoot", "nolan", returnTo, redGoal),
    ];
  }

  if (["A17", "A18"].includes(skill)) {
    const outsideY = nolan.y < 32 ? 10 : 54,
      insideY = nolan.y < 32 ? 27 : 37,
      runTo = p(
        Math.min(86, nolan.x + 18),
        skill === "A17" ? outsideY : insideY,
      );
    return [
      step(0, 1450, "run", "nolan", nolan, runTo),
      step(
        150,
        1300,
        "dribble",
        "blue2",
        target,
        p(target.x + 8, skill === "A17" ? insideY : outsideY),
      ),
      step(
        450,
        1200,
        "defend",
        "red1",
        undefined,
        p(runTo.x - 5, runTo.y + side * 5),
      ),
      step(
        1400,
        850,
        "pass",
        "blue2",
        p(target.x + 8, skill === "A17" ? insideY : outsideY),
        runTo,
      ),
      step(2150, 400, "receive", "nolan", runTo, runTo),
      step(2550, 850, "cross", "nolan", runTo, p(82, 32)),
      step(3350, 650, "shoot", "blue1", p(82, 32), redGoal),
    ];
  }

  if (skill === "A19") {
    const crossFrom = p(Math.max(70, nolan.x + 11), nolan.y < 32 ? 10 : 54),
      runner = p(82, 32);
    return [
      step(0, 700, "pass", "blue1", carrier, nolan),
      step(650, 400, "receive", "nolan", nolan, nolan),
      step(1000, 1100, "dribble", "nolan", nolan, crossFrom),
      step(650, 1500, "run", "blue2", target, runner),
      step(
        900,
        1300,
        "defend",
        "red1",
        undefined,
        p(crossFrom.x - 5, crossFrom.y + side * 6),
      ),
      step(2050, 900, "cross", "nolan", crossFrom, runner),
      step(2900, 400, "receive", "blue2", runner, runner),
      step(3300, 650, "shoot", "blue2", runner, redGoal),
    ];
  }

  if (skill === "A24") {
    const rebound = p(78, safeY(32 + side * 9));
    return [
      step(0, 800, "shoot", "blue1", carrier, redGoal),
      step(500, 700, "parry", "redGK", p(92, 32), rebound),
      step(650, 1500, "run", "nolan", nolan, rebound),
      step(1750, 400, "receive", "nolan", rebound, rebound),
      step(2200, 700, "shoot", "nolan", rebound, redGoal),
      step(3000, 450, "celebrate", "blue2", undefined, undefined, "happy"),
    ];
  }

  if (skill === "A23") {
    const finishAt = p(80, safeY(32 + side * 6)),
      keeperRush = p(84, 32);
    return [
      step(0, 800, "pass", "blue1", carrier, nolan),
      step(700, 400, "receive", "nolan", nolan, nolan),
      step(850, 1200, "run", "redGK", p(92, 32), keeperRush),
      step(1050, 1000, "dribble", "nolan", nolan, finishAt),
      step(2050, 800, "shoot", "nolan", finishAt, redGoal),
      step(2900, 450, "celebrate", "blue2", undefined, undefined, "happy"),
    ];
  }

  if (skill === "A25") {
    const fakeLane = p(nolan.x + 8, safeY(nolan.y + side * 12)),
      release = p(Math.min(84, nolan.x + 22), safeY(nolan.y - side * 12));
    return [
      step(0, 700, "pass", "blue1", carrier, nolan),
      step(650, 400, "receive", "nolan", nolan, nolan),
      step(950, 500, "scan", "nolan", nolan, fakeLane),
      step(1000, 1000, "defend", "red1", undefined, fakeLane),
      step(1700, 950, "pass", "nolan", nolan, release),
      step(2550, 450, "receive", "blue2", release, release),
      step(2950, 750, "dribble", "blue2", release, p(88, release.y)),
    ];
  }

  if (skill === "A26") {
    const receiver = p(Math.min(78, nolan.x + 22), safeY(nolan.y + side * 9));
    return [
      step(0, 650, "pass", "blue1", carrier, nolan),
      step(600, 400, "receive", "nolan", nolan, nolan),
      step(850, 700, "scan", "nolan", nolan, p(nolan.x + 2, nolan.y)),
      step(1450, 1000, "pass", "nolan", p(nolan.x + 2, nolan.y), receiver),
      step(2350, 450, "receive", "blue2", receiver, receiver),
      step(
        2750,
        1000,
        "dribble",
        "blue2",
        receiver,
        p(Math.min(88, receiver.x + 10), receiver.y),
      ),
    ];
  }

  if (skill === "A27") {
    const pinAt = p(74, 32),
      betweenLines = p(64, safeY(32 + side * 10));
    return [
      step(0, 1200, "run", "nolan", nolan, pinAt),
      step(150, 1200, "defend", "red1", undefined, p(pinAt.x + 4, pinAt.y)),
      step(900, 950, "pass", "blue1", carrier, betweenLines),
      step(1750, 450, "receive", "blue2", betweenLines, betweenLines),
      step(2100, 1000, "dribble", "blue2", betweenLines, p(78, betweenLines.y)),
      step(2350, 900, "defend", "red2", undefined, p(82, betweenLines.y)),
    ];
  }

  if (skill === "D01") {
    const pressAt = p(Math.max(12, carrier.x - 4), safeY(carrier.y + side * 5)),
      forcedBack = p(Math.min(88, carrier.x + 14), safeY(carrier.y - side * 7));
    return [
      step(0, 900, "dribble", "redBall", carrier, p(carrier.x - 3, carrier.y)),
      step(100, 1200, "press", "nolan", nolan, pressAt),
      step(
        1050,
        900,
        "pass",
        "redBall",
        p(carrier.x - 3, carrier.y),
        forcedBack,
      ),
      step(
        1150,
        1000,
        "run",
        "blue1",
        undefined,
        p(forcedBack.x - 6, forcedBack.y),
      ),
      step(2050, 500, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }

  if (skill === "D03") {
    const blue1Start = l.actors.find((item) => item.id === "blue1")!.start,
      danger = p(Math.max(18, carrier.x - 10), safeY(carrier.y + side * 4)),
      pressure = p(Math.max(12, danger.x - 3), safeY(danger.y + side * 5)),
      cover = p(Math.max(9, danger.x - 10), safeY(danger.y - side * 7)),
      escape = p(48, side > 0 ? 52 : 12);
    return [
      step(0, 1050, "dribble", "redBall", carrier, danger),
      step(150, 1200, "press", "blue1", blue1Start, pressure),
      step(250, 1250, "defend", "nolan", nolan, cover),
      step(1250, 850, "pass", "redBall", danger, p(cover.x + 2, cover.y)),
      step(1800, 500, "block", "nolan", cover, p(cover.x + 2, cover.y)),
      step(2250, 850, "clear", "nolan", p(cover.x + 2, cover.y), escape),
    ];
  }

  if (skill === "D04") {
    const blue1Start = l.actors.find((item) => item.id === "blue1")!.start,
      weakY = carrier.y < 32 ? 50 : 14,
      switchTo = p(Math.max(20, carrier.x - 6), weakY),
      balance = p(Math.max(10, switchTo.x - 8), weakY < 32 ? 24 : 40);
    return [
      step(0, 1100, "press", "blue1", blue1Start, p(carrier.x - 3, carrier.y)),
      step(150, 1250, "defend", "nolan", nolan, balance),
      step(950, 950, "pass", "redBall", carrier, switchTo),
      step(1900, 900, "run", "red2", undefined, switchTo),
      step(2100, 550, "block", "nolan", balance, balance),
    ];
  }

  if (skill === "D07") {
    const attacker = p(
        Math.max(18, carrier.x - 13),
        safeY(carrier.y + side * 5),
      ),
      goalSide = p(Math.max(9, attacker.x - 6), attacker.y);
    return [
      step(0, 1300, "dribble", "redBall", carrier, attacker),
      step(100, 1400, "defend", "nolan", nolan, goalSide),
      step(1350, 750, "shoot", "redBall", attacker, p(3, 32)),
      step(1600, 550, "block", "nolan", goalSide, goalSide),
      step(2150, 800, "clear", "blue1", goalSide, p(46, side > 0 ? 52 : 12)),
    ];
  }

  if (skill === "D06") {
    const runner = p(Math.max(14, nolan.x - 7), safeY(nolan.y + side * 11)),
      goalSide = p(runner.x - 5, runner.y);
    return [
      step(0, 1400, "run", "red2", undefined, runner),
      step(200, 1500, "run", "nolan", nolan, goalSide),
      step(900, 850, "pass", "redBall", carrier, runner),
      step(1650, 500, "block", "nolan", goalSide, goalSide),
      step(2150, 850, "clear", "blue1", goalSide, p(46, side > 0 ? 52 : 12)),
      step(3050, 450, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }

  if (["D09", "D10"].includes(skill)) {
    const blockAt = p(Math.max(12, nolan.x + 7), safeY(nolan.y + side * 5));
    return [
      step(0, 1200, "dribble", "redBall", carrier, blockAt),
      step(250, 1200, "defend", "nolan", nolan, blockAt),
      step(
        1250,
        750,
        skill === "D09" ? "cross" : "shoot",
        "redBall",
        blockAt,
        p(3, 32),
      ),
      step(1550, 550, "block", "nolan", blockAt, blockAt),
      step(2100, 850, "clear", "blue1", blockAt, p(44, side > 0 ? 52 : 12)),
      step(3000, 450, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }

  if (["D12", "D13"].includes(skill)) {
    const dx = skill === "D12" ? 9 : -9,
      blue1Start = l.actors.find((item) => item.id === "blue1")!.start,
      blue2Start = l.actors.find((item) => item.id === "blue2")!.start,
      moveWithLine = (start: Point, laneOffset = 0) =>
        p(
          Math.max(8, Math.min(88, start.x + (row.id === "DM-25" ? 14 : dx))),
          safeY(start.y + laneOffset),
        );
    return [
      step(
        0,
        850,
        "pass",
        "redBall",
        carrier,
        p(carrier.x + (skill === "D12" ? 8 : -6), carrier.y),
      ),
      step(350, 1200, "defend", "nolan", nolan, p(nolan.x + dx, nolan.y)),
      step(
        450,
        1200,
        "defend",
        "blue1",
        blue1Start,
        moveWithLine(blue1Start, row.id === "DM-25" ? 5 : 0),
      ),
      step(
        550,
        1200,
        "defend",
        "blue2",
        blue2Start,
        moveWithLine(blue2Start, row.id === "DM-25" ? -3 : 0),
      ),
      step(
        1900,
        900,
        "pass",
        "redBall",
        undefined,
        p(Math.max(8, nolan.x - 5), nolan.y),
      ),
      step(2650, 550, "block", "nolan", undefined, p(nolan.x + dx, nolan.y)),
    ];
  }

  if (skill === "D15") {
    const nearPost = p(14, side > 0 ? 40 : 24),
      protect = p(10, nearPost.y),
      red2Start = l.actors.find((item) => item.id === "red2")!.start;
    return [
      step(0, 1400, "run", "red2", red2Start, nearPost),
      step(150, 1400, "defend", "nolan", nolan, protect),
      step(950, 950, "cross", "redBall", carrier, nearPost),
      step(1650, 550, "block", "nolan", protect, nearPost),
      step(2200, 850, "clear", "nolan", nearPost, p(46, side > 0 ? 52 : 12)),
    ];
  }

  if (["D16", "D17"].includes(skill)) {
    const protect = p(
      Math.max(12, nolan.x + 3),
      skill === "D17" ? 32 : safeY(nolan.y + side * 9),
    );
    return [
      step(0, 1400, "run", "red2", undefined, protect),
      step(200, 1500, "defend", "nolan", nolan, p(protect.x - 4, protect.y)),
      step(950, 950, "cross", "redBall", carrier, protect),
      step(1700, 550, "block", "nolan", p(protect.x - 4, protect.y), protect),
      step(2200, 850, "clear", "nolan", protect, p(45, side > 0 ? 52 : 12)),
      step(3100, 450, "celebrate", "blue1", undefined, undefined, "happy"),
    ];
  }

  if (skill === "D18") {
    const secondBall = p(Math.max(16, nolan.x + 4), safeY(nolan.y + side * 10));
    return [
      step(0, 900, "cross", "redBall", carrier, p(nolan.x - 3, 32)),
      step(700, 700, "clear", "blue1", p(nolan.x - 3, 32), secondBall),
      step(650, 1400, "run", "nolan", nolan, secondBall),
      step(
        900,
        1300,
        "run",
        "red2",
        undefined,
        p(secondBall.x + 5, secondBall.y),
      ),
      step(1950, 450, "receive", "nolan", secondBall, secondBall),
      step(2400, 850, "pass", "nolan", secondBall, p(49, side > 0 ? 49 : 15)),
      step(3200, 400, "receive", "blue2", undefined, p(49, side > 0 ? 49 : 15)),
    ];
  }

  if (skill === "D19") {
    const danger = p(Math.max(10, nolan.x + 4), nolan.y),
      wide = p(Math.min(62, danger.x + 26), side > 0 ? 52 : 12);
    return [
      step(0, 900, "pass", "redBall", carrier, danger),
      step(300, 1100, "defend", "nolan", nolan, danger),
      step(1050, 850, "clear", "nolan", danger, wide),
      step(1850, 1200, "run", "blue1", undefined, p(wide.x - 5, wide.y)),
      step(2000, 1200, "defend", "blue2", undefined, p(nolan.x - 7, 32)),
      step(3150, 450, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }

  if (skill === "T01") {
    const top = p(70, 13),
      center = p(72, 32),
      bottom = p(70, 51);
    return [
      step(0, 1500, "run", "nolan", nolan, nolan.y < 32 ? top : bottom),
      step(0, 1500, "run", "blue1", carrier, center),
      step(0, 1500, "run", "blue2", target, nolan.y < 32 ? bottom : top),
      step(950, 900, "pass", "blue1", center, nolan.y < 32 ? top : bottom),
      step(
        1750,
        400,
        "receive",
        "nolan",
        undefined,
        nolan.y < 32 ? top : bottom,
      ),
      step(2200, 800, "pass", "nolan", undefined, center),
      step(2950, 650, "shoot", "blue1", center, redGoal),
    ];
  }

  if (skill === "T02") {
    const recover = p(Math.max(10, nolan.x - 17), safeY(32 + side * 5));
    return [
      step(0, 1500, "run", "nolan", nolan, recover),
      step(
        100,
        1700,
        "dribble",
        "redBall",
        carrier,
        p(carrier.x - 12, carrier.y),
      ),
      step(
        450,
        1500,
        "run",
        "blue1",
        undefined,
        p(recover.x - 2, recover.y + 10),
      ),
      step(
        1500,
        750,
        "pass",
        "redBall",
        undefined,
        p(recover.x + 3, recover.y),
      ),
      step(2050, 550, "block", "nolan", recover, p(recover.x + 3, recover.y)),
      step(2650, 800, "clear", "blue1", undefined, p(45, side > 0 ? 52 : 12)),
    ];
  }

  if (["T04", "T05"].includes(skill)) {
    const reset = p(Math.max(12, carrier.x - 8), safeY(carrier.y + side * 7));
    return [
      step(0, 700, "scan", "nolan", nolan, nolan),
      step(
        250,
        1200,
        skill === "T05" ? "shield" : "defend",
        "nolan",
        nolan,
        nolan,
      ),
      step(650, 850, "pass", "blue1", carrier, reset),
      step(1450, 400, "receive", "blue2", reset, reset),
      step(1850, 850, "pass", "blue2", reset, carrier),
      step(2650, 400, "receive", "blue1", carrier, carrier),
      step(3100, 450, "celebrate", "nolan", undefined, undefined, "happy"),
    ];
  }

  if (skill === "G01") {
    const setAt = p(10, 32),
      shotFrom = p(26, safeY(32 + side * 8)),
      saveAt = p(7, side > 0 ? 39 : 25);
    return [
      step(0, 650, "set", "nolan", nolan, setAt),
      step(150, 1200, "dribble", "redBall", carrier, shotFrom),
      step(1300, 750, "shoot", "redBall", shotFrom, p(3, saveAt.y)),
      step(1450, 700, "dive", "nolan", setAt, saveAt),
      step(1950, 450, "block", "nolan", saveAt, saveAt),
      step(2450, 800, "clear", "blue1", saveAt, p(42, side > 0 ? 52 : 12)),
    ];
  }

  if (skill === "G06") {
    const setAt = p(11, 32),
      shotFrom = p(18, safeY(32 + side * 5)),
      saveAt = p(8, shotFrom.y);
    return [
      step(0, 1200, "dribble", "redBall", carrier, shotFrom),
      step(300, 650, "set", "nolan", nolan, setAt),
      step(1300, 700, "shoot", "redBall", shotFrom, p(3, shotFrom.y)),
      step(1450, 650, "dive", "nolan", setAt, saveAt),
      step(1950, 450, "catch", "nolan", saveAt, saveAt),
    ];
  }

  if (skill === "G07") {
    const claimAt = p(14, safeY(32 + side * 4)),
      outlet = p(31, side > 0 ? 50 : 14);
    return [
      step(0, 1100, "cross", "redBall", carrier, claimAt),
      step(100, 500, "set", "nolan", nolan, nolan),
      step(250, 1250, "run", "red2", undefined, p(claimAt.x + 5, claimAt.y)),
      step(350, 1100, "run", "nolan", nolan, claimAt),
      step(1350, 450, "catch", "nolan", claimAt, claimAt),
      step(1950, 850, "pass", "nolan", claimAt, outlet),
      step(2700, 450, "receive", "blue2", outlet, outlet),
    ];
  }

  if (skill === "G08") {
    const crowd = p(14, 32),
      wide = p(22, side > 0 ? 52 : 12);
    return [
      step(0, 1100, "cross", "redBall", carrier, crowd),
      step(100, 1200, "run", "red2", undefined, crowd),
      step(250, 1100, "run", "nolan", nolan, p(12, 32)),
      step(1150, 650, "parry", "nolan", p(12, 32), wide),
      step(1850, 900, "run", "blue1", undefined, p(wide.x - 4, wide.y)),
    ];
  }

  if (skill === "G09") {
    const scanAt = p(nolan.x + 1, nolan.y + side),
      outlet = p(Math.max(27, target.x), side > 0 ? 50 : 14);
    return [
      step(0, 450, "catch", "nolan", nolan, nolan),
      step(500, 600, "scan", "nolan", nolan, scanAt),
      step(1050, 950, "pass", "nolan", scanAt, outlet),
      step(1900, 450, "receive", "blue2", outlet, outlet),
      step(2300, 900, "dribble", "blue2", outlet, p(44, outlet.y)),
      step(1200, 1000, "press", "red1", undefined, p(outlet.x + 8, 32)),
    ];
  }

  if (skill === "G12") {
    const unreachable = p(24, side > 0 ? 49 : 15),
      saveAt = p(7, side > 0 ? 38 : 26);
    return [
      step(0, 1100, "cross", "redBall", carrier, unreachable),
      step(150, 650, "set", "nolan", nolan, p(8, 32)),
      step(950, 400, "receive", "red2", unreachable, unreachable),
      step(1400, 750, "shoot", "red2", unreachable, p(3, saveAt.y)),
      step(1550, 700, "dive", "nolan", p(8, 32), saveAt),
      step(2050, 450, "catch", "nolan", saveAt, saveAt),
    ];
  }

  if (skill === "G13") {
    const goalLine = p(8, 32),
      saveAt = p(7, side > 0 ? 38 : 26),
      shotFrom = p(26, safeY(32 + side * 8));
    return [
      step(0, 1300, "run", "nolan", nolan, goalLine),
      step(100, 1200, "dribble", "redBall", carrier, shotFrom),
      step(1250, 450, "set", "nolan", goalLine, goalLine),
      step(1750, 750, "shoot", "redBall", shotFrom, p(3, saveAt.y)),
      step(1900, 650, "dive", "nolan", goalLine, saveAt),
      step(2350, 450, "block", "nolan", saveAt, saveAt),
    ];
  }

  return raw;
}

function makeScene(row: InventoryRow, index: number): AnimatedScenario {
  const meta = metadata[row.id];
  if (!meta) throw new Error(`Missing scene metadata for ${row.id}`);
  const l = layout(row, index),
    redStart = l.actors.find((item) => item.id === "red1")?.start;
  const activeSetup: AnimationStep[] = l.defending
    ? [
        step(
          200,
          2200,
          "dribble",
          "redBall",
          p(l.carrier.x + 10, l.carrier.y),
          l.carrier,
        ),
        step(
          700,
          1800,
          "run",
          "red2",
          p(l.carrier.x + 8, 50),
          p(l.carrier.x - 8, 42),
        ),
        step(1100, 1700, "defend", "blue1", p(21, 45), p(24, 40)),
        step(2800, 500, "react", "nolan", undefined, undefined, "surprised"),
      ]
    : [
        step(
          200,
          2200,
          "dribble",
          "blue1",
          clampPoint(p(l.carrier.x - 10, l.carrier.y + 2)),
          l.carrier,
        ),
        step(
          700,
          1800,
          "defend",
          "red1",
          redStart ? clampPoint(p(redStart.x + 7, redStart.y)) : p(70, 34),
          redStart ?? p(62, 34),
        ),
        step(
          1100,
          1700,
          "run",
          "blue2",
          clampPoint(p(l.target.x - 8, l.target.y)),
          l.target,
        ),
        step(2800, 500, "scan", "nolan", l.nolan, l.nolan),
      ];
  const setup = repairAnimationGeometry(l.actors, l.carrier, [
    ...activeSetup,
    ...supportingSetupSteps(l.actors, l.defending),
  ]);
  const buildSteps = (
    label: string,
    quality: "good" | "poor",
    raw: AnimationStep[],
  ) => {
    const semantic = ensurePhoneReadableSteps(
      label,
      establishTomPossession(
        l,
        coachProofAnimation(
          row,
          index,
          l,
          quality,
          label,
          // Individually authored timelines already prove their named skill;
          // the generic option-intent rewriter would collapse them back into
          // the shared templates this review removed.
          bespokeAnimationIds.has(row.id)
            ? raw
            : enforceOptionResult(label, quality, l, raw),
        ),
      ),
      l,
    );
    const reactions = [
      ...semantic,
      ...supportingReactionSteps(l.actors, l.defending, quality),
    ];
    if (quality === "poor")
      return ensurePhoneReadableSteps(
        label,
        repairAnimationGeometry(l.actors, l.carrier, reactions, setup),
        l,
      );
    const opened = prepareClearBestPaths(l.actors, l.carrier, setup, reactions);
    const cleared = prepareClearBestPaths(
      l.actors,
      l.carrier,
      setup,
      repairAnimationGeometry(l.actors, l.carrier, opened, setup),
    );
    return ensurePhoneReadableSteps(
      label,
      repairAnimationGeometry(l.actors, l.carrier, cleared, setup),
      l,
    );
  };
  let goodSteps = buildSteps(
    meta.goodLabel,
    "good",
    goodAnimation(row, index, l),
  );
  let poorSteps = buildSteps(
    meta.poorLabel,
    "poor",
    poorAnimation(row, index, l),
  );
  let goodChoice = alignChoicePreview(
    semanticChoice(
      "a",
      meta.goodLabel,
      neutralChoiceIcon(meta.goodLabel),
      "good",
      l,
      goodSteps,
      poorSteps,
    ),
    goodSteps,
    l,
  );
  let poorChoice = alignChoicePreview(
    semanticChoice(
      "c",
      meta.poorLabel,
      neutralChoiceIcon(meta.poorLabel),
      "poor",
      l,
      poorSteps,
      goodSteps,
    ),
    poorSteps,
    l,
  );
  ({ choice: goodChoice, steps: goodSteps } = synchronizeReadableChoice(
    goodChoice,
    goodSteps,
    l,
  ));
  ({ choice: poorChoice, steps: poorSteps } = synchronizeReadableChoice(
    poorChoice,
    poorSteps,
    l,
  ));
  if (visuallySameOnPhone(goodChoice, poorChoice)) {
    poorSteps = repairAnimationGeometry(
      l.actors,
      l.carrier,
      contrastSteps(poorSteps, goodChoice, l),
      setup,
    );
    poorChoice = alignChoicePreview(
      semanticChoice(
        "c",
        meta.poorLabel,
        neutralChoiceIcon(meta.poorLabel),
        "poor",
        l,
        poorSteps,
        goodSteps,
      ),
      poorSteps,
      l,
    );
    goodChoice = alignChoicePreview(
      semanticChoice(
        "a",
        meta.goodLabel,
        neutralChoiceIcon(meta.goodLabel),
        "good",
        l,
        goodSteps,
        poorSteps,
      ),
      goodSteps,
      l,
    );
    ({ choice: goodChoice, steps: goodSteps } = synchronizeReadableChoice(
      goodChoice,
      goodSteps,
      l,
    ));
    ({ choice: poorChoice, steps: poorSteps } = synchronizeReadableChoice(
      poorChoice,
      poorSteps,
      l,
    ));
  }
  goodSteps = repairAnimationGeometry(
    l.actors,
    l.carrier,
    prepareClearBestPaths(l.actors, l.carrier, setup, goodSteps),
    setup,
  );
  goodChoice = alignChoicePreview(
    semanticChoice(
      "a",
      meta.goodLabel,
      neutralChoiceIcon(meta.goodLabel),
      "good",
      l,
      goodSteps,
      poorSteps,
    ),
    goodSteps,
    l,
  );
  ({ choice: goodChoice, steps: goodSteps } = synchronizeReadableChoice(
    goodChoice,
    goodSteps,
    l,
  ));
  goodSteps = repairAnimationGeometry(l.actors, l.carrier, goodSteps, setup);
  if (row.id === "TW-03")
    goodSteps = appendSafeExit("red2", goodSteps, l, setup);
  const alternateLabel = alternateLabels[row.id];
  let alternateSteps = alternateLabel
    ? buildSteps(alternateLabel, "good", alternateAnimation(row, l))
    : undefined;
  let alternateChoice =
    alternateSteps && alternateLabel
      ? alignChoicePreview(
          semanticChoice(
            "b",
            alternateLabel,
            neutralChoiceIcon(alternateLabel),
            "good",
            l,
            alternateSteps,
            goodSteps,
          ),
          alternateSteps,
          l,
        )
      : undefined;
  if (alternateSteps && alternateChoice)
    ({ choice: alternateChoice, steps: alternateSteps } =
      synchronizeReadableChoice(alternateChoice, alternateSteps, l));
  if (
    alternateSteps &&
    alternateChoice &&
    (visuallySameOnPhone(goodChoice, alternateChoice) ||
      visuallySameOnPhone(poorChoice, alternateChoice))
  ) {
    alternateSteps = prepareClearBestPaths(
      l.actors,
      l.carrier,
      setup,
      repairAnimationGeometry(
        l.actors,
        l.carrier,
        contrastSteps(alternateSteps, goodChoice, l, true),
        setup,
      ),
    );
    alternateChoice = alignChoicePreview(
      semanticChoice(
        "b",
        alternateLabel!,
        neutralChoiceIcon(alternateLabel!),
        "good",
        l,
        alternateSteps,
        goodSteps,
      ),
      alternateSteps,
      l,
    );
  }
  // Last match-logic pass: every shot must travel toward the opponent goal.
  // Passing lanes and receiver visibility remain guarded by the spatial audit.
  const tacticalScene = {
    actors: l.actors,
    ballStart: l.carrier,
    setupAnimation: setup,
  };
  goodSteps = repairTacticalTrajectory(tacticalScene, goodSteps);
  poorSteps = repairTacticalTrajectory(tacticalScene, poorSteps);
  if (alternateSteps)
    alternateSteps = repairTacticalTrajectory(tacticalScene, alternateSteps);
  // The final tactical-direction pass can change a ball endpoint. Re-run the
  // body-spacing repair afterwards so a late consequence never leaves Tom
  // hidden behind an opponent in the frame the child sees.
  goodSteps = repairAnimationGeometry(l.actors, l.carrier, goodSteps, setup);
  poorSteps = repairAnimationGeometry(l.actors, l.carrier, poorSteps, setup);
  if (alternateSteps)
    alternateSteps = repairAnimationGeometry(
      l.actors,
      l.carrier,
      alternateSteps,
      setup,
    );
  goodChoice = alignChoicePreview(
    semanticChoice(
      "a",
      meta.goodLabel,
      neutralChoiceIcon(meta.goodLabel),
      "good",
      l,
      goodSteps,
      poorSteps,
    ),
    goodSteps,
    l,
  );
  poorChoice = alignChoicePreview(
    semanticChoice(
      "c",
      meta.poorLabel,
      neutralChoiceIcon(meta.poorLabel),
      "poor",
      l,
      poorSteps,
      goodSteps,
    ),
    poorSteps,
    l,
  );
  if (alternateSteps && alternateLabel)
    alternateChoice = alignChoicePreview(
      semanticChoice(
        "b",
        alternateLabel,
        neutralChoiceIcon(alternateLabel),
        "good",
        l,
        alternateSteps,
        goodSteps,
      ),
      alternateSteps,
      l,
    );
  ({ choice: goodChoice, steps: goodSteps } = synchronizeReadableChoice(
    goodChoice,
    goodSteps,
    l,
  ));
  ({ choice: poorChoice, steps: poorSteps } = synchronizeReadableChoice(
    poorChoice,
    poorSteps,
    l,
  ));
  if (alternateChoice && alternateSteps)
    ({ choice: alternateChoice, steps: alternateSteps } =
      synchronizeReadableChoice(alternateChoice, alternateSteps, l));
  goodChoice = {
    ...goodChoice,
    predictionLabel: predictionLabel(row, "good", l.defending),
  };
  poorChoice = {
    ...poorChoice,
    predictionLabel: predictionLabel(row, "poor", l.defending),
  };
  if (alternateChoice)
    alternateChoice = {
      ...alternateChoice,
      predictionLabel: predictionLabel(row, "alternate", l.defending),
    };
  const choices = [
    goodChoice,
    ...(alternateChoice ? [alternateChoice] : []),
    poorChoice,
  ];
  const results = [
    result("a", "best", row.good, row.decision, row.good, goodSteps),
    ...(alternateSteps
      ? [
          result(
            "b",
            "good",
            `Good option. ${row.good}`,
            row.decision,
            "The team also stays safe with this choice.",
            alternateSteps,
          ),
        ]
      : []),
    result(
      "c",
      "poor",
      row.poor,
      `Try this instead: ${row.decision}`,
      row.poor,
      poorSteps,
    ),
  ];
  return {
    id: row.id,
    title: meta.title,
    category: categoryFor(row.id),
    role: row.role,
    stage: (1 + Math.floor((index % 8) / 3)) as SceneStage,
    formalConcept: row.decision,
    skillId: skillIdFor(row),
    visibleCue: row.trigger,
    playerDuty: row.decision,
    introNarration: `Watch. ${row.trigger}`,
    prompt: "What should Nolan do?",
    pauseTime: 3800,
    activeArea: l.activeArea,
    ballStart: l.carrier,
    actors: l.actors,
    setupAnimation: setup,
    choices,
    results,
  };
}

export const animatedScenarios = rows.map(makeScene);
const packInfo: Record<SceneCategory, Omit<ScenePack, "id" | "scenes">> = {
  winger: {
    name: "Winger Games",
    icon: "🪽",
    color: "#11a968",
    description: "Width, crossing, back-post runs, and tracking.",
  },
  striker: {
    name: "Striker Games",
    icon: "🎯",
    color: "#f97316",
    description: "Finishing, movement, hold-up play, rebounds, and pressing.",
  },
  "central-midfielder": {
    name: "Midfielder Games",
    icon: "🧭",
    color: "#8b5cf6",
    description: "Scan, switch, control tempo, support, and cover.",
  },
  "attacking-midfielder": {
    name: "Attacking Midfielder Games",
    icon: "🪄",
    color: "#d946a8",
    description: "Find pockets, turn, create chances, and counterpress.",
  },
  "defensive-midfielder": {
    name: "Defensive Midfielder Games",
    icon: "🚧",
    color: "#64748b",
    description: "Screen, cover, track runners, build, and delay counters.",
  },
  fullback: {
    name: "Fullback Games",
    icon: "🏃",
    color: "#0ea5a0",
    description: "Defend wide, overlap, underlap, and recover.",
  },
  "center-defender": {
    name: "Center Defender Games",
    icon: "🛡️",
    color: "#2583da",
    description: "Position, cover, control the line, and manage danger.",
  },
  goalkeeper: {
    name: "Goalkeeper Games",
    icon: "🧤",
    color: "#e2a600",
    description: "Set angles, sweep, parry, and distribute.",
  },
  teamwork: {
    name: "Teamwork Games",
    icon: "🤝",
    color: "#db4c8b",
    description: "Use space, combine, transition, and protect together.",
  },
};
export const scenePacks: ScenePack[] = (
  Object.keys(packInfo) as SceneCategory[]
).map((id) => ({
  id,
  ...packInfo[id],
  scenes: animatedScenarios.filter((scene) => scene.category === id),
}));
export const sceneById = (id: string) =>
  animatedScenarios.find((scene) => scene.id === id);
/**
 * First Lessons: a hand-picked starter path for a child who chases the ball
 * everywhere. Order matters — spread out, learn who presses, look up before
 * touching, then the two simplest combinations.
 */
export const starterSceneIds = [
  "TW-01", // spread out — don't share one lane
  "WNG-01", // hold width instead of crowding the ball
  "TW-08", // one presses, the others cover and balance
  "TW-07", // defend a 2v1 by delaying, not diving
  "CM-01", // scan before the ball arrives
  "CM-04", // stay behind the ball as the safe outlet
  "TW-03", // wall pass: pass and run
  "TW-02", // support triangle, never a straight line
];
export const starterScenes = starterSceneIds.map((id) => sceneById(id)!);
export const packById = (id: string) =>
  scenePacks.find((pack) => pack.id === id);
