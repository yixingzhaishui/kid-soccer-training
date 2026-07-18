import type { AnimatedScenario, AnimationStep, Point } from "../types/soccer";

export type CoachFailure = {
  code:
    | "SWITCH_STAYS_CROWDED"
    | "CUTBACK_NOT_BACKWARD"
    | "DELAY_DIVES_OR_KICKS"
    | "SCREEN_LEAVES_PASS_LANE"
    | "TACKLE_HAS_NO_EXPOSED_TOUCH"
    | "PARRY_STAYS_CENTRAL"
    | "DISTRIBUTION_NOT_FORWARD"
    | "SKILL_PROOF_MISSING";
  message: string;
};

const distanceToLane = (point: Point, from: Point, to: Point) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.max(1, dx * dx + dy * dy);
  const progress = Math.max(
    0,
    Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / length),
  );
  return Math.hypot(
    point.x - (from.x + progress * dx),
    point.y - (from.y + progress * dy),
  );
};

const bestResult = (scene: AnimatedScenario) =>
  scene.results.find((result) => result.quality === "best");
const actorTeam = (scene: AnimatedScenario, step: AnimationStep) =>
  scene.actors.find((actor) => actor.id === step.actorId)?.team;

/** Coach-level tactical gates. These judge the named football duty, not merely
 * whether an animation is valid SVG or has different-looking arrows. */
export function coachFailures(scene: AnimatedScenario): CoachFailure[] {
  const best = bestResult(scene);
  if (!best) return [];
  const steps = [...best.animationSteps].sort(
    (a, b) => a.startTime - b.startTime,
  );
  const failures: CoachFailure[] = [];
  const tom = scene.actors.find((actor) => actor.id === "nolan")!;
  const tomSteps = steps.filter((step) => step.actorId === "nolan");
  const blueSteps = steps.filter((step) => actorTeam(scene, step) === "blue");
  const redSteps = steps.filter((step) => actorTeam(scene, step) === "red");
  const travel = (step: AnimationStep) => {
    const from =
      step.from ??
      scene.actors.find((actor) => actor.id === step.actorId)?.start;
    return from && step.to
      ? Math.hypot(step.to.x - from.x, step.to.y - from.y)
      : 0;
  };
  const proof = (condition: boolean, message: string) => {
    if (!condition) failures.push({ code: "SKILL_PROOF_MISSING", message });
  };

  if (scene.skillId === "A01" || scene.skillId === "A03") {
    const scan = tomSteps.find((step) =>
      ["scan", "turn"].includes(step.action),
    );
    const receive = tomSteps.find((step) => step.action === "receive");
    proof(
      Boolean(scan && receive && scan.startTime < receive.startTime),
      `${scene.skillId} requires Tom to scan or open his body before receiving`,
    );
  }

  if (scene.skillId === "A02") {
    const escape = tomSteps.find(
      (step) => ["run", "walk"].includes(step.action) && travel(step) >= 6,
    );
    const delivery = blueSteps.find(
      (step) =>
        step.to &&
        escape?.to &&
        ["pass", "cross"].includes(step.action) &&
        Math.hypot(step.to.x - escape.to.x, step.to.y - escape.to.y) < 5,
    );
    proof(
      Boolean(escape && delivery),
      "A02 requires Tom to leave the cover shadow before the pass arrives",
    );
  }

  if (scene.skillId === "A04") {
    const receive = tomSteps.find((step) => step.action === "receive");
    const firstTouch = tomSteps.find(
      (step) =>
        ["turn", "dribble"].includes(step.action) &&
        step.startTime >= (receive?.startTime ?? Number.MAX_SAFE_INTEGER) &&
        travel(step) >= 5,
    );
    const pressure = redSteps.find(
      (step) =>
        step.actorId === "red1" &&
        ["defend", "press", "run"].includes(step.action) &&
        travel(step) >= 2,
    );
    const escapesPressure = Boolean(
      firstTouch?.from &&
      firstTouch.to &&
      pressure?.to &&
      Math.hypot(
        firstTouch.to.x - pressure.to.x,
        firstTouch.to.y - pressure.to.y,
      ) >
        Math.hypot(
          firstTouch.from.x - pressure.to.x,
          firstTouch.from.y - pressure.to.y,
        ),
    );
    proof(
      Boolean(receive && firstTouch && pressure && escapesPressure),
      "A04 first touch must visibly move away from the closing defender",
    );
  }

  if (["A05", "A06"].includes(scene.skillId)) {
    const tomMove = tomSteps.find((step) => travel(step) >= 6);
    const teammateMove = blueSteps.find(
      (step) => step.actorId !== "nolan" && travel(step) >= 6,
    );
    proof(
      Boolean(tomMove && teammateMove),
      `${scene.skillId} requires Tom and a teammate to create a visible support shape`,
    );
  }

  if (scene.skillId === "A07") {
    const drops = tomSteps.some(
      (step) => step.to && step.to.x <= tom.start.x - 5,
    );
    const resets = tomSteps.some(
      (step) =>
        step.from &&
        step.to &&
        step.action === "pass" &&
        step.to.x <= step.from.x - 5,
    );
    proof(drops || resets, "A07 must create a real option behind the ball");
  }

  if (scene.skillId === "A08") {
    const holdsWidth = tomSteps.some(
      (step) => step.to && (step.to.y <= 16 || step.to.y >= 48),
    );
    proof(
      holdsWidth || tom.start.y <= 16 || tom.start.y >= 48,
      "A08 must keep Tom in a visible touchline lane",
    );
  }

  if (["A09", "A21", "A22"].includes(scene.skillId)) {
    const forwardRun = tomSteps.find((step) => {
      if (!step.from || !step.to || step.action !== "run") return false;
      // Finishing runs can attack a near/far-post lane diagonally. A09 and
      // A21 still require clear forward penetration; A22 requires a decisive
      // change of lane into the finish rather than one fixed compass bearing.
      return scene.skillId === "A22"
        ? travel(step) >= 10
        : step.to.x >= step.from.x + 8;
    });
    const delivery = blueSteps.find(
      (step) =>
        step.to &&
        forwardRun?.to &&
        ["pass", "cross"].includes(step.action) &&
        Math.hypot(step.to.x - forwardRun.to.x, step.to.y - forwardRun.to.y) <
          6,
    );
    proof(
      Boolean(forwardRun && delivery),
      `${scene.skillId} requires a timed forward run into the delivered ball`,
    );
  }

  if (scene.skillId === "A10")
    proof(
      tomSteps.some((step) => step.action === "shield"),
      "A10 must visibly put Tom's body between opponent and ball",
    );

  if (["A11", "A12"].includes(scene.skillId)) {
    const carry = tomSteps.find(
      (step) => step.action === "dribble" && travel(step) >= 6,
    );
    const defender = redSteps.find(
      (step) => ["defend", "press"].includes(step.action) && travel(step) >= 4,
    );
    proof(
      Boolean(carry && defender),
      `${scene.skillId} must show Tom carrying and a defender reacting`,
    );
  }

  if (scene.skillId === "A13") {
    const pass = tomSteps.find((step) => step.action === "pass");
    const run = tomSteps.find(
      (step) =>
        step.action === "run" && step.startTime >= (pass?.startTime ?? 1e9),
    );
    const returnBall = tomSteps.find(
      (step) =>
        step.action === "receive" && step.startTime >= (run?.startTime ?? 1e9),
    );
    proof(
      Boolean(pass && run && returnBall),
      "A13 wall pass must show pass, immediate run, and return receive",
    );
  }

  if (scene.skillId === "A14") {
    const bluePasses = blueSteps.filter((step) => step.action === "pass");
    const thirdRun = tomSteps.find(
      (step) => step.action === "run" && travel(step) >= 8,
    );
    proof(
      bluePasses.length >= 2 && Boolean(thirdRun),
      "A14 needs a layoff/second pass and a visible third-player run",
    );
  }

  if (scene.skillId === "A16") {
    const connectedPossession =
      blueSteps.filter((step) => step.action === "pass").length >= 2 &&
      new Set(
        blueSteps
          .filter((step) => travel(step) >= 5)
          .map((step) => step.actorId),
      ).size >= 2 &&
      !tomSteps.some((step) => ["shoot", "cross"].includes(step.action));
    const quickExploit = steps.some(
      (step) =>
        actorTeam(scene, step) === "blue" &&
        step.from &&
        step.to &&
        ["pass", "dribble"].includes(step.action) &&
        step.to.x >= step.from.x + 15 &&
        step.startTime <= 1800,
    );
    proof(
      connectedPossession || quickExploit,
      "A16 must visibly reconnect the team or exploit space before Red recovers",
    );
  }

  if (["A17", "A18"].includes(scene.skillId)) {
    const run = tomSteps.find(
      (step) =>
        step.action === "run" && step.from && step.to && travel(step) >= 8,
    );
    const correctLane =
      scene.skillId === "A17"
        ? Boolean(run?.to && (run.to.y <= 16 || run.to.y >= 48))
        : Boolean(
            run?.to &&
            run.to.y >= 18 &&
            run.to.y <= 46 &&
            run.to.x >= run.from!.x + 8,
          );
    proof(
      correctLane,
      `${scene.skillId} run uses the wrong outside/inside lane`,
    );
  }

  if (scene.skillId === "A19")
    proof(
      tomSteps.some(
        (step) => step.action === "cross" && step.from && step.from.x >= 60,
      ),
      "A19 must show Tom delivering an early cross from a wide advanced area",
    );

  if (scene.skillId === "A24") {
    const shot = steps.find((step) => step.action === "shoot");
    const reaction = tomSteps.find(
      (step) =>
        ["run", "receive", "shoot"].includes(step.action) &&
        step.startTime >= (shot?.startTime ?? 1e9),
    );
    proof(Boolean(shot && reaction), "A24 Tom must react after the first shot");
  }

  if (scene.skillId === "A23") {
    const directFinish = tomSteps.some(
      (step) =>
        step.action === "shoot" &&
        step.to &&
        step.to.x >= 94 &&
        travel(step) >= 8,
    );
    const square = tomSteps.find(
      (step) =>
        step.action === "pass" &&
        step.from &&
        step.to &&
        Math.abs(step.to.y - step.from.y) >= 7,
    );
    const teammateFinish = blueSteps.some(
      (step) =>
        step.actorId !== "nolan" &&
        step.action === "shoot" &&
        step.startTime > (square?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    proof(
      directFinish || Boolean(square && teammateFinish),
      "A23 must show either a clear finish or a square pass to a better finish",
    );
  }

  if (scene.skillId === "A25") {
    const pass = tomSteps.find(
      (step) =>
        step.action === "pass" && step.from && step.to && travel(step) >= 10,
    );
    const shiftedDefender = redSteps.find(
      (step) =>
        step.to &&
        travel(step) >= 4 &&
        step.startTime < (pass?.startTime ?? -1),
    );
    proof(
      Boolean(
        pass?.from &&
        pass.to &&
        shiftedDefender?.to &&
        distanceToLane(shiftedDefender.to, pass.from, pass.to) >= 4,
      ),
      "A25 must move the defender with the disguise before releasing into the new lane",
    );
  }

  if (scene.skillId === "A26")
    proof(
      tomSteps.some(
        (step) =>
          step.action === "pass" &&
          step.from &&
          step.to &&
          step.to.x >= step.from.x + 10,
      ) && blueSteps.some((step) => step.action === "receive"),
      "A26 line-breaking pass must travel forward to a visible Blue receiver",
    );

  if (scene.skillId === "A27") {
    const pin = tomSteps.find(
      (step) =>
        ["run", "shield"].includes(step.action) && step.to && step.to.x >= 68,
    );
    const heldDefender = redSteps.find(
      (step) =>
        ["defend", "run"].includes(step.action) &&
        step.to &&
        pin?.to &&
        Math.hypot(step.to.x - pin.to.x, step.to.y - pin.to.y) <= 12,
    );
    const teammateReceive = blueSteps.find(
      (step) =>
        step.actorId !== "nolan" &&
        step.action === "receive" &&
        step.startTime >= (heldDefender?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    proof(
      Boolean(pin && heldDefender && teammateReceive),
      "A27 must pin the center defender so a teammate can receive between the lines",
    );
  }

  if (scene.skillId === "D02")
    proof(
      tomSteps.some((step) => step.action === "press" && travel(step) >= 6) &&
        redSteps.some(
          (step) =>
            step.action === "pass" &&
            step.from &&
            step.to &&
            step.to.x >= step.from.x,
        ),
      "D02 must curve the press and force Red away from Blue's goal",
    );

  if (scene.skillId === "D01") {
    const press = tomSteps.find(
      (step) => step.action === "press" && travel(step) >= 6,
    );
    const forcedBack = redSteps.find(
      (step) =>
        step.action === "pass" &&
        step.from &&
        step.to &&
        step.to.x >= step.from.x + 4 &&
        step.startTime >= (press?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    proof(
      Boolean(press && forcedBack),
      "D01 controlled pressure must force Red backward, away from Blue's goal",
    );
  }

  if (scene.skillId === "D03") {
    const teammatePressure = blueSteps.find(
      (step) =>
        step.actorId !== "nolan" &&
        ["press", "defend"].includes(step.action) &&
        travel(step) >= 4,
    );
    const cover = tomSteps.find(
      (step) =>
        ["run", "defend", "block"].includes(step.action) && travel(step) >= 5,
    );
    proof(
      Boolean(teammatePressure && cover),
      "D03 must show one teammate pressure while Tom protects the space behind",
    );
  }

  if (scene.skillId === "D04") {
    const switchAttempt = redSteps.find(
      (step) =>
        step.from &&
        step.to &&
        step.action === "pass" &&
        Math.abs(step.to.y - step.from.y) >= 12,
    );
    const balances = tomSteps.find(
      (step) =>
        ["run", "defend", "block"].includes(step.action) && travel(step) >= 5,
    );
    proof(
      Boolean(switchAttempt && balances),
      "D04 must show the weak-side danger and Tom balancing against the switch",
    );
  }

  if (scene.skillId === "D06")
    proof(
      tomSteps.some((step) => ["run", "defend"].includes(step.action)) &&
        redSteps.some((step) => step.action === "run" && travel(step) >= 6),
      "D06 must show both the tracked runner and Tom moving goal-side",
    );

  if (scene.skillId === "D07") {
    const attacker = redSteps.find(
      (step) => ["run", "dribble"].includes(step.action) && travel(step) >= 5,
    );
    const recovery = tomSteps.find(
      (step) =>
        step.to &&
        ["run", "defend"].includes(step.action) &&
        attacker?.to &&
        step.to.x <= attacker.to.x - 3,
    );
    proof(
      Boolean(attacker && recovery),
      "D07 Tom must recover between the attacker and Blue's goal",
    );
  }

  if (scene.skillId === "D08") {
    const outsideCarry = redSteps.find(
      (step) =>
        step.from &&
        step.to &&
        ["dribble", "turn"].includes(step.action) &&
        Math.abs(step.to.y - 32) >= Math.abs(step.from.y - 32) + 3,
    );
    proof(
      Boolean(
        outsideCarry &&
        tomSteps.some((step) => ["defend", "block"].includes(step.action)),
      ),
      "D08 must guide the attacker toward the touchline, not toward the middle",
    );
  }

  if (scene.skillId === "D09" || scene.skillId === "D10")
    proof(
      steps.some((step) =>
        scene.skillId === "D09"
          ? step.action === "cross"
          : step.action === "shoot",
      ) && tomSteps.some((step) => step.action === "block"),
      `${scene.skillId} must visibly block the attempted cross or shot`,
    );

  if (["D12", "D13"].includes(scene.skillId)) {
    const synchronized = blueSteps.filter(
      (step) =>
        step.from &&
        step.to &&
        ["run", "defend"].includes(step.action) &&
        (scene.skillId === "D12"
          ? step.to.x >= step.from.x + 3
          : step.to.x <= step.from.x - 3),
    );
    proof(
      new Set(synchronized.map((step) => step.actorId)).size >= 3,
      `${scene.skillId} requires at least three Blue players to move together`,
    );
  }

  if (scene.skillId === "D14") {
    const runner = redSteps.find(
      (step) => step.action === "run" && travel(step) >= 6,
    );
    const exchangingDefenders = new Set(
      blueSteps
        .filter(
          (step) =>
            ["run", "defend"].includes(step.action) && travel(step) >= 5,
        )
        .map((step) => step.actorId),
    );
    proof(
      Boolean(runner && exchangingDefenders.size >= 2),
      "D14 must show the runner continue while two Blue defenders exchange responsibility",
    );
  }

  if (scene.skillId === "D15") {
    const nearPostCross = redSteps.find(
      (step) => step.action === "cross" && step.to && step.to.x <= 18,
    );
    const protection = tomSteps.find((step) =>
      ["block", "clear"].includes(step.action),
    );
    proof(
      Boolean(nearPostCross && protection),
      "D15 must show the near-post cross and Tom protecting in front of the runner",
    );
  }

  if (["D16", "D17"].includes(scene.skillId))
    proof(
      redSteps.some((step) => step.action === "cross") &&
        tomSteps.some((step) => ["block", "clear"].includes(step.action)),
      `${scene.skillId} must show the cross and Tom protecting its target zone`,
    );

  if (scene.skillId === "D18")
    proof(
      steps.some((step) => ["clear", "cross"].includes(step.action)) &&
        tomSteps.some((step) =>
          ["run", "receive", "block"].includes(step.action),
        ),
      "D18 must show a first duel/clearance and Tom attacking the second ball",
    );

  if (scene.skillId === "D19")
    proof(
      tomSteps.some(
        (step) =>
          step.action === "clear" &&
          step.from &&
          step.to &&
          step.to.x >= step.from.x + 8,
      ),
      "D19 Blue clearance must travel away from its own goal and out of danger",
    );

  if (scene.skillId === "T01") {
    const lanes = new Set(
      blueSteps
        .filter((step) => step.action === "run" && step.to)
        .map((step) =>
          step.to!.y < 23 ? "top" : step.to!.y > 41 ? "bottom" : "center",
        ),
    );
    proof(lanes.size >= 3, "T01 counterattack must fill all three lanes");
  }

  if (scene.skillId === "T02")
    proof(
      tomSteps.some(
        (step) =>
          step.from &&
          step.to &&
          step.action === "run" &&
          step.to.x <= step.from.x - 8,
      ),
      "T02 requires Tom to sprint back through the inside route",
    );

  if (scene.skillId === "T03")
    proof(
      tomSteps.some((step) => step.action === "press") &&
        steps.some((step) => step.action === "block"),
      "T03 counterpress must close the first outlet or win the second ball",
    );

  if (["T04", "T05"].includes(scene.skillId))
    proof(
      !tomSteps.some((step) => ["shoot", "cross"].includes(step.action)) &&
        blueSteps.some((step) => step.action === "pass"),
      `${scene.skillId} must protect team shape through a safe pass, not force the attack`,
    );

  if (scene.skillId === "A15") {
    const switchPass = steps.find(
      (step) =>
        step.to &&
        step.from &&
        actorTeam(scene, step) === "blue" &&
        ["pass", "cross"].includes(step.action) &&
        Math.abs(step.to.y - step.from.y) >= 18,
    );
    if (!switchPass)
      failures.push({
        code: "SWITCH_STAYS_CROWDED",
        message: "best switch never moves the ball to a clearly different lane",
      });
  }

  if (scene.skillId === "A20") {
    const cutback = steps.find(
      (step) =>
        step.actorId === "nolan" &&
        step.from &&
        step.to &&
        ["pass", "cross"].includes(step.action) &&
        step.from.x >= 78 &&
        step.to.x <= step.from.x - 5,
    );
    if (!cutback)
      failures.push({
        code: "CUTBACK_NOT_BACKWARD",
        message: "best cutback does not travel backward from the end line",
      });
  }

  if (scene.skillId === "D11") {
    const tomDefends = steps.some(
      (step) => step.actorId === "nolan" && step.action === "defend",
    );
    const tomKicks = steps.some(
      (step) =>
        step.actorId === "nolan" &&
        ["pass", "cross", "clear", "shoot"].includes(step.action),
    );
    const blueRecovery = new Set(
      steps
        .filter(
          (step) =>
            step.actorId &&
            actorTeam(scene, step) === "blue" &&
            step.actorId !== "nolan" &&
            ["run", "defend"].includes(step.action),
        )
        .map((step) => step.actorId),
    ).size;
    if (!tomDefends || tomKicks || blueRecovery < 2)
      failures.push({
        code: "DELAY_DIVES_OR_KICKS",
        message:
          "delay must keep Tom goal-side while at least two teammates recover",
      });
  }

  if (scene.skillId === "D05") {
    const redPass = steps.find(
      (step) =>
        step.from &&
        step.to &&
        actorTeam(scene, step) === "red" &&
        step.action === "pass",
    );
    const tomBlock = steps.find(
      (step) =>
        step.actorId === "nolan" &&
        step.to &&
        ["defend", "block"].includes(step.action),
    );
    if (
      !redPass ||
      !tomBlock?.to ||
      distanceToLane(tomBlock.to, redPass.from!, redPass.to!) > 6
    )
      failures.push({
        code: "SCREEN_LEAVES_PASS_LANE",
        message: "screen does not visibly occupy the passer-to-target lane",
      });
  }

  if (scene.skillId === "D20") {
    const exposedTouch = steps.find(
      (step) =>
        actorTeam(scene, step) === "red" &&
        step.action === "dribble" &&
        step.from &&
        step.to &&
        Math.hypot(step.to.x - step.from.x, step.to.y - step.from.y) >= 5,
    );
    const tackle = steps.find(
      (step) =>
        step.actorId === "nolan" &&
        ["block", "defend"].includes(step.action) &&
        step.startTime >= (exposedTouch?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    if (!exposedTouch || !tackle)
      failures.push({
        code: "TACKLE_HAS_NO_EXPOSED_TOUCH",
        message: "best tackle is not triggered by a visible heavy touch",
      });
  }

  if (scene.skillId === "G03") {
    const parry = steps.find(
      (step) => step.actorId === "nolan" && step.action === "parry" && step.to,
    );
    if (!parry?.to || (parry.to.y > 20 && parry.to.y < 44))
      failures.push({
        code: "PARRY_STAYS_CENTRAL",
        message: "safe parry does not leave the central rebound corridor",
      });
  }

  if (scene.skillId === "G01") {
    const set = tomSteps.find((step) => step.action === "set");
    const shot = redSteps.find((step) => step.action === "shoot");
    const save = tomSteps.find(
      (step) =>
        ["dive", "block", "catch", "parry"].includes(step.action) &&
        step.startTime >= (shot?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    proof(
      Boolean(set && shot && save && set.startTime < shot.startTime),
      "G01 must show a balanced set before the shot and a save after the strike",
    );
  }

  if (scene.skillId === "G02") {
    const shot = redSteps.find((step) => step.action === "shoot");
    const catchStep = tomSteps.find(
      (step) =>
        step.action === "catch" &&
        step.startTime >= (shot?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    proof(
      Boolean(shot && catchStep) &&
        !tomSteps.some((step) => step.action === "parry"),
      "G02 must end a holdable shot with a clean catch, not a central parry",
    );
  }

  if (scene.skillId === "G04") {
    const looseTouch = redSteps.find(
      (step) => step.action === "dribble" && travel(step) >= 5,
    );
    const attackBall = tomSteps.find(
      (step) =>
        ["run", "dive"].includes(step.action) &&
        travel(step) >= 10 &&
        step.startTime <= (looseTouch?.startTime ?? -1) + 900,
    );
    const secure = tomSteps.find(
      (step) =>
        ["catch", "clear"].includes(step.action) &&
        step.startTime >= (attackBall?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    proof(
      Boolean(looseTouch && attackBall && secure),
      "G04 must attack the striker's loose touch and secure the ball before the shot",
    );
  }

  if (scene.skillId === "G05") {
    const throughBall = redSteps.find((step) =>
      ["pass", "dribble"].includes(step.action),
    );
    const sweep = tomSteps.find(
      (step) => ["run", "dive"].includes(step.action) && travel(step) >= 12,
    );
    const secure = tomSteps.find(
      (step) =>
        ["catch", "clear"].includes(step.action) &&
        step.startTime >= (sweep?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    const redShotBeforeSecure = redSteps.some(
      (step) =>
        step.action === "shoot" &&
        step.startTime < (secure?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    proof(
      Boolean(throughBall && sweep && secure) && !redShotBeforeSecure,
      "G05 must arrive decisively before the striker can shoot",
    );
  }

  if (scene.skillId === "G06") {
    const shot = redSteps.find((step) => step.action === "shoot");
    const setBefore = tomSteps.find(
      (step) =>
        step.action === "set" && step.startTime < (shot?.startTime ?? -1),
    );
    const earlyFall = tomSteps.some(
      (step) =>
        ["dive", "parry"].includes(step.action) &&
        step.startTime < (shot?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    const saveAfter = tomSteps.find(
      (step) =>
        ["dive", "block", "catch", "parry"].includes(step.action) &&
        step.startTime >= (shot?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    proof(
      Boolean(shot && setBefore && saveAfter) && !earlyFall,
      "G06 must stay big and balanced until the striker shoots",
    );
  }

  if (scene.skillId === "G07") {
    const cross = redSteps.find((step) => step.action === "cross");
    const claimMove = tomSteps.find(
      (step) =>
        step.action === "run" &&
        travel(step) >= 8 &&
        step.startTime >= (cross?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    const claim = tomSteps.find(
      (step) =>
        step.action === "catch" &&
        step.startTime >= (claimMove?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    proof(
      Boolean(cross && claimMove && claim),
      "G07 must show Nolan move through a reachable path and catch the cross",
    );
  }

  if (scene.skillId === "G08") {
    const cross = redSteps.find((step) => step.action === "cross");
    const punch = tomSteps.find(
      (step) =>
        step.action === "parry" &&
        step.to &&
        (step.to.y <= 18 || step.to.y >= 46) &&
        step.startTime >= (cross?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    proof(
      Boolean(cross && punch),
      "G08 must punch the crowded cross wide beyond the central scoring area",
    );
  }

  if (scene.skillId === "G09") {
    const distribution = steps.find(
      (step) =>
        step.actorId === "nolan" &&
        step.action === "pass" &&
        step.from &&
        step.to,
    );
    if (!distribution?.to || distribution.to.x <= distribution.from!.x + 10)
      failures.push({
        code: "DISTRIBUTION_NOT_FORWARD",
        message: "goalkeeper distribution does not start a forward attack",
      });
  }

  if (scene.skillId === "G10") {
    const scan = tomSteps.find((step) => step.action === "scan");
    const danger = redSteps.find((step) =>
      ["cross", "shoot"].includes(step.action),
    );
    const organized = new Set(
      blueSteps
        .filter(
          (step) =>
            step.actorId !== "nolan" &&
            ["run", "defend"].includes(step.action) &&
            travel(step) >= 4 &&
            step.startTime < (danger?.startTime ?? Number.MAX_SAFE_INTEGER),
        )
        .map((step) => step.actorId),
    );
    proof(
      Boolean(scan && danger && organized.size >= 2),
      "G10 must organize at least two defenders before the set-piece delivery",
    );
  }

  if (scene.skillId === "G11") {
    const firstShot = redSteps.find((step) => step.action === "shoot");
    const firstSave = tomSteps.find(
      (step) =>
        ["parry", "block"].includes(step.action) &&
        step.startTime >= (firstShot?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    const reset = tomSteps.find(
      (step) =>
        step.action === "set" &&
        step.startTime >= (firstSave?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    const secondShot = redSteps.find(
      (step) =>
        step.action === "shoot" &&
        step.startTime > (firstShot?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    const secondSave = tomSteps.find(
      (step) =>
        ["dive", "block", "catch"].includes(step.action) &&
        step.startTime >= (secondShot?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    proof(
      Boolean(firstShot && firstSave && reset && secondShot && secondSave),
      "G11 must show first save, feet reset, second shot, and second save",
    );
  }

  if (scene.skillId === "G12") {
    const cross = redSteps.find((step) => step.action === "cross");
    const set = tomSteps.find(
      (step) =>
        step.action === "set" &&
        step.startTime <= (cross?.startTime ?? Number.MAX_SAFE_INTEGER) + 1200,
    );
    const recklessClaim = tomSteps.some(
      (step) =>
        step.action === "run" &&
        step.to &&
        step.to.x >= 20 &&
        step.startTime <= (cross?.startTime ?? -1) + 1200,
    );
    const secondAction = tomSteps.find(
      (step) =>
        ["catch", "block", "clear"].includes(step.action) &&
        step.startTime >= (cross?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    proof(
      Boolean(cross && set && secondAction) && !recklessClaim,
      "G12 must hold position on the unreachable cross and control the second action",
    );
  }

  if (scene.skillId === "G13") {
    const recovery = tomSteps.find(
      (step) =>
        step.action === "run" &&
        step.from &&
        step.to &&
        step.to.x <= 9 &&
        travel(step) >= 10,
    );
    const set = tomSteps.find(
      (step) =>
        step.action === "set" &&
        step.startTime >= (recovery?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    const shot = redSteps.find(
      (step) =>
        step.action === "shoot" &&
        step.startTime >= (set?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    const save = tomSteps.find(
      (step) =>
        ["dive", "block", "catch"].includes(step.action) &&
        step.startTime >= (shot?.startTime ?? Number.MAX_SAFE_INTEGER),
    );
    proof(
      Boolean(recovery && set && shot && save),
      "G13 must recover on the shortest line and make the next goal-line action",
    );
  }

  return failures;
}
