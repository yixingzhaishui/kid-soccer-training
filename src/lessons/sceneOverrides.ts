/**
 * Case-by-case review overrides (2026-07-18 similarity pass).
 *
 * The expansion generator produced template text that repeated across scenes
 * inside the same role pack, and a few triggers that were tactically wrong
 * (for example a goalkeeper "wall" scene that gave the set piece to Blue).
 * Every entry below was written individually for its scene. A field that is
 * omitted keeps the generated value.
 *
 * Wording caution: `dutyFamily` and `skillIdFor` classify a scene from
 * `${decision} ${trigger}`. Trigger sentences below deliberately avoid
 * introducing keywords that would reclassify the scene (press, corner,
 * cross, header, turnover, and so on) unless the scene already belongs to
 * that family through its decision title.
 */
export type SceneOverride = {
  /** Replaces the "Unique game trigger" — feeds visibleCue and introNarration. */
  trigger?: string;
  /** Replaces the good-consequence narration and team effect. */
  good?: string;
  /** Replaces the poor-consequence narration and team effect. */
  poor?: string;
  /** Replaces the scene title and formal concept (rare — only wrong titles). */
  title?: string;
  goodLabel?: string;
  poorLabel?: string;
  icon?: string;
};

export const sceneOverrides: Record<string, SceneOverride> = {
  // ── Winger ────────────────────────────────────────────────────────────────
  "WNG-12": {
    trigger:
      "Nolan has the ball wide while his fullback sprints outside him as a decoy.",
    good: "Nolan lets the decoy pull the marker wide, then slips inside into the space the fullback opened.",
    poor: "Nolan releases the ball too early into the crowded outside lane and the decoy is wasted.",
  },
  "WNG-16": {
    trigger:
      "Nolan is alone against two defenders on the flank while his fullback is still catching up.",
    good: "Nolan keeps the ball moving slowly near the touchline until the fullback arrives and the 2v2 becomes fair.",
    poor: "Nolan dribbles at both defenders alone; the second one takes the ball and red breaks the other way.",
  },
  "WNG-17": {
    trigger:
      "The last red center back stands alone with open grass on both sides as Nolan dribbles at him.",
    good: "Nolan drives straight at the isolated defender, makes him plant his feet, and slips past the exposed side.",
    poor: "Nolan slows down and waits; two more red shirts recover and the 1v1 chance is gone.",
  },
  "WNG-18": {
    trigger:
      "Blue's number ten drifts wide into Nolan's lane, so two blue players briefly share one channel.",
    good: "Nolan rotates inside as the ten goes wide; both markers are dragged out of position and blue keeps two lanes filled.",
    poor: "Nolan stays put; two blue shirts crowd one lane and one red defender covers them both.",
  },
  "WNG-23": {
    trigger:
      "Red wins the ball and breaks; the inside path back to Nolan's own box is shorter than the touchline path.",
    good: "Nolan sprints the inside lane and gets goal-side before the red winger can turn toward the box.",
    poor: "Nolan jogs back along the touchline; the red winger cuts inside through the lane Nolan ignored.",
  },
  "WNG-24": {
    trigger:
      "Blue wins a corner; the taker needs a short option and Nolan is the nearest player outside the box.",
    good: "Nolan shows short, gives the taker a safe pass, and the corner restarts with a better angle.",
    poor: "Nolan crowds into the box with everyone else; the corner is cleared and nobody collects the loose ball.",
  },
  "WNG-26": {
    trigger:
      "Nolan holds the ball wide while his fullback overlaps at full speed outside him.",
    good: "Nolan releases the pass into the fullback's path at the perfect moment for a free delivery.",
    poor: "Nolan keeps dribbling; the overlap dies, the defender recovers, and the wide 2v1 is wasted.",
  },
  "WNG-27": {
    trigger:
      "Blue leads by one in the last minutes and Nolan protects the ball near the attacking flag.",
    good: "Nolan shields the ball by the flag, wins a throw-in, and the clock keeps running for blue.",
    poor: "Nolan tries to beat two defenders; red takes the ball and starts a dangerous late counter.",
  },
  "WNG-28": {
    trigger:
      "The fullback marking Nolan has chased all game and now stands flat-footed as Nolan takes the ball with room to dribble at him.",
    good: "Nolan attacks the tired legs at speed and is past before the defender can turn.",
    poor: "Nolan passes backward and lets the tired defender rest; the easy chance to beat him is gone.",
  },
  "WNG-29": {
    trigger:
      "Two red players trap Nolan on the touchline, and the supporting midfielder offers a bounce pass to escape.",
    good: "Nolan plays the one-two off the supporting midfielder and bursts out of the trap into open grass.",
    poor: "Nolan tries to dribble between the two shirts; they squeeze him out and win a red throw-in.",
  },

  // ── Striker ───────────────────────────────────────────────────────────────
  "STR-10": {
    trigger:
      "The winger shapes to deliver while Nolan stands touch-tight in front of the last red defender.",
    good: "Nolan leans on the defender and keeps him pinned, so the space behind stays open for the winger's ball.",
    poor: "Nolan drifts off the defender; the defender steps forward freely and squeezes the space away.",
  },
  "STR-11": {
    trigger:
      "Nolan waits on the last defender's shoulder as the passer lifts his head, ready to run behind.",
    good: "Nolan spins off the blind side exactly as the pass is struck and races clear on goal.",
    poor: "Nolan spins before the passer is ready; the flag goes up and the move dies offside.",
  },
  "STR-12": {
    trigger:
      "A low cross fizzes toward the near post while a teammate arrives unmarked just behind Nolan.",
    good: "Nolan opens his legs and lets the ball run through; the teammate behind him sweeps it home.",
    poor: "Nolan stabs at the ball from an impossible angle and the goalkeeper smothers it easily.",
  },
  "STR-14": {
    trigger:
      "The pull-back arrives at Nolan inside the box: one red shirt slides in, but there is a heartbeat of space for a first touch.",
    good: "Nolan sees the sliding defender and picks the one-touch finish before the gap closes.",
    poor: "Nolan takes an extra touch to be safe; the sliding defender reaches the ball first.",
  },
  "STR-17": {
    trigger:
      "A cross hangs in the air toward the penalty area while Nolan judges his jump from the edge of the six-yard box.",
    good: "Nolan waits half a second, meets the drop at the top of his jump, and heads down toward the corner.",
    poor: "Nolan jumps early, the ball floats over him, and a defender nods it clear.",
  },
  "STR-18": {
    trigger:
      "The winger reaches the goal line and every red defender collapses toward the six-yard box, leaving the middle of the box empty.",
    good: "Nolan holds his run at the penalty mark, receives the cutback in space, and strikes first time.",
    poor: "Nolan sprints into the crowded six-yard box; the cutback rolls behind him to a red defender.",
  },
  "STR-19": {
    trigger:
      "Blue's midfielder wants to strike from the top of the box, but the red shirt on Nolan stands in the strike lane.",
    good: "Nolan sprints away toward the flank, towing his marker with him, and the shooting lane opens.",
    poor: "Nolan stands still and so does his marker; the lane stays blocked and the move stalls.",
  },
  "STR-20": {
    trigger:
      "Blue's winger wants the middle, but both red center backs hold their ground; someone must pull one away as Nolan runs wide.",
    good: "Nolan's wide run drags a central defender with him and the winger drives into the gap.",
    poor: "Nolan stays central where he is easy to mark and both defenders keep the middle shut.",
  },
  "STR-22": {
    trigger:
      "The pass arrives with Nolan's back to goal and a red shirt pushing hard into his back.",
    good: "Nolan plants his body, shields through the contact, and the referee awards blue a free kick in a useful spot.",
    poor: "Nolan tries to spin through the defender's chest; he loses the ball and no whistle comes.",
  },
  "STR-25": {
    trigger:
      "Red's deepest midfielder drops for the ball so red can restart their attack through the middle.",
    good: "Nolan stands in the passing lane to the pivot; red must go sideways and blue's defense stays set.",
    poor: "Nolan chases the ball instead of the lane; the pivot receives behind him and red plays through.",
  },
  "STR-29": {
    trigger:
      "Blue's first ball into the box is cleared, but the winger collects it wide and shapes to deliver again.",
    good: "Nolan resets his feet and attacks the second delivery at the far post ahead of his marker.",
    poor: "Nolan switches off after the clearance; the second ball lands exactly where he had been standing.",
  },

  // ── Central midfielder ────────────────────────────────────────────────────
  "CM-09": {
    trigger:
      "Red's striker chases blue's center back, and the pocket of space behind that chase is open for Nolan.",
    good: "Nolan slides into the pocket behind the first chaser and receives facing forward.",
    poor: "Nolan stays hidden behind the striker; the center back has no option and kicks long.",
  },
  "CM-10": {
    trigger:
      "Nolan takes the ball facing forward and no red shirt stands between him and their last line.",
    good: "Nolan carries through the empty midfield, forcing a defender to step out and freeing a teammate.",
    poor: "Nolan passes sideways immediately and the free grass in front of him is wasted.",
  },
  "CM-11": {
    trigger:
      "Nolan has the ball with time; a red midfielder starts toward him while a far teammate waits unmarked.",
    good: "Nolan keeps the ball one beat longer, draws the defender in, then releases the unmarked teammate.",
    poor: "Nolan passes before anyone is drawn in; the defender simply shifts across and nothing opens.",
  },
  "CM-16": {
    trigger:
      "Blue's winger and fullback battle a crowd on the touchline and need a third shirt to tip the numbers.",
    good: "Nolan joins the touchline triangle, takes a return ball, and blue outnumbers red in the wide zone.",
    poor: "Nolan watches from the middle; the wide pair stays 2v3 and red squeezes the ball out of play.",
  },
  "CM-17": {
    trigger:
      "Blue's winger and fullback both go forward on the right; someone must stay behind the ball.",
    good: "Nolan balances behind the attack, ready to collect a loose ball or stop the first counter pass.",
    poor: "Nolan joins the attack too; when the ball breaks, red counters through the space all three left.",
  },
  "CM-18": {
    trigger:
      "The striker checks toward Nolan asking for the ball to feet, with a red defender tight behind him.",
    good: "Nolan zips a firm pass into the striker's feet so he can lay it off before the defender bites.",
    poor: "Nolan floats a soft pass; the defender steps around the striker and takes it.",
  },
  "CM-21": {
    trigger:
      "Blue loses the ball high up; red looks for one quick ball through the middle to break out.",
    good: "Nolan sprints into the central lane first and red's quick forward ball has nowhere to go.",
    poor: "Nolan chases the ball carrier sideways; the middle opens and red plays straight through it.",
  },
  "CM-26": {
    trigger:
      "Red wins the ball and their striker waits in the middle for the first forward ball of the counter.",
    good: "Nolan screens the lane to the striker, the counter pass is blocked, and blue's defense resets.",
    poor: "Nolan sprints at the carrier and flies past; the first pass releases the striker behind him.",
  },
  "CM-27": {
    trigger:
      "Blue leads by one goal in the final minute; red chases everywhere and blue's tired legs need the ball to rest.",
    good: "Nolan calmly recycles the ball backward and sideways; red never touches it and the whistle comes.",
    poor: "Nolan forces a hopeful ball forward; red collects it and gets one last attack at blue's goal.",
  },
  "CM-28": {
    trigger:
      "Three red defenders backpedal toward their own goal as Nolan brings the ball forward with runners wide.",
    good: "Nolan plays forward at once, before the retreating line can set, and blue attacks 3v3.",
    poor: "Nolan slows and takes extra touches; the backpedaling line sets itself and the moment is gone.",
  },
  "CM-29": {
    trigger:
      "Blue's winger is stuck on the touchline with two defenders in front and no way forward.",
    good: "Nolan offers behind the trapped winger, takes the escape pass, and blue keeps the ball to attack again.",
    poor: "Nolan hides behind a red shirt where the winger cannot see him; the winger loses the ball in the corner.",
  },

  // ── Attacking midfielder ──────────────────────────────────────────────────
  "AM-08": {
    trigger:
      "Red's holding midfielder shadows Nolan in the center; the half-space near the touchline is empty.",
    good: "Nolan drifts sideways out of the shadow and receives in the half-space, facing the goal.",
    poor: "Nolan stays in the holding midfielder's pocket and every pass toward him is cut out.",
  },
  "AM-10": {
    trigger:
      "Nolan dribbles across the edge of the box while the winger sprints behind the defense the opposite way.",
    good: "Nolan hides the pass with his body and slips the reverse ball into the winger's run.",
    poor: "Nolan telegraphs the obvious pass forward and the defender steps across to cut it out.",
  },
  "AM-13": {
    trigger:
      "No red player steps out to Nolan; their whole back four keeps dropping as he takes the ball forward.",
    good: "Nolan carries at the retreating line until one defender finally jumps, then uses the space he leaves.",
    poor: "Nolan stops thirty meters out and passes sideways; the back four is never made to choose.",
  },
  "AM-14": {
    trigger:
      "Two red defenders split the space in front of Nolan; only a dribble straight at one will make him commit.",
    good: "Nolan attacks one defender, makes him plant, and releases the teammate the defender left behind.",
    poor: "Nolan passes early before anyone commits; both defenders stay balanced and the lane never opens.",
  },
  "AM-15": {
    trigger:
      "Blue's winger takes on his fullback; a second blue shirt arriving in the box would give red too many runners to handle.",
    good: "Nolan arrives in the box as the extra runner and red's defenders cannot pick everyone up.",
    poor: "Nolan watches from outside the box; red defends the winger's delivery with numbers to spare.",
  },
  "AM-16": {
    trigger:
      "The ball goes wide and every runner crashes toward the goal, leaving the middle of the box empty.",
    good: "Nolan arrives late into the empty middle and meets the ball with time to pick his finish.",
    poor: "Nolan sprints in with the first wave and is swallowed by the crowd before the ball arrives.",
  },
  "AM-17": {
    trigger:
      "Blue's fullback bursts past Nolan on the outside in a one-two shape while the red shirt watches only the ball.",
    good: "Nolan plays into the overlap at the exact moment the fullback breaks free, and blue is behind the defense.",
    poor: "Nolan holds the ball too long; the fullback runs offside and the overlap is wasted.",
  },
  "AM-18": {
    trigger:
      "Blue's fullback darts inside, between the red winger and his own fullback, asking for the ball in the channel.",
    good: "Nolan threads the ball into the underlap and blue attacks the inside channel behind red's midfield.",
    poor: "Nolan plays the safe outside ball instead; red shows the winger down the line and the danger fades.",
  },
  "AM-19": {
    trigger:
      "Every forward lane into the box is filled with red shirts; the attack has ground to a halt.",
    good: "Nolan recycles the ball back and around; blue keeps possession and attacks again from a new side.",
    poor: "Nolan forces the ball into the wall of defenders and red breaks with the rebound.",
  },
  "AM-22": {
    trigger:
      "Red's deepest midfielder drops toward his own goal, asking for the ball to restart their attack.",
    good: "Nolan curves his run so the pivot cannot receive, and red's restart is forced long and loose.",
    poor: "Nolan stands off; the pivot receives, turns, and plays red through blue's first line.",
  },
  "AM-24": {
    trigger:
      "Red breaks forward and their number six carries the ball while Nolan is still on the wrong side of it.",
    good: "Nolan sprints back goal-side of the six and forces the counter sideways until blue's shape recovers.",
    poor: "Nolan trots back watching the ball; the six carries through the gap Nolan never closed.",
  },
  "AM-25": {
    trigger:
      "Blue loses the ball at the box edge; red wants one quick forward ball to launch the break.",
    good: "Nolan blocks the very first forward lane; red must go backward and blue's defense gets home.",
    poor: "Nolan turns and jogs; red's first pass slips straight past him and the counter is on.",
  },
  "AM-26": {
    trigger:
      "A long ball drops between the lines and its second bounce will land loose somewhere in midfield.",
    good: "Nolan judges the drop early, arrives first, and blue turns the loose ball into an attack.",
    poor: "Nolan waits to see where it lands; a red shirt arrives at full speed and takes it away.",
  },
  "AM-27": {
    trigger:
      "Blue is ahead; Nolan takes the ball near the box with two defenders closing and nothing safe ahead.",
    good: "Nolan protects the ball with his body and works it back to a free teammate; blue keeps its lead calmly.",
    poor: "Nolan forces a dribble between the two closing defenders and gifts red the ball with blue's defense unset.",
  },
  "AM-28": {
    trigger:
      "The ball comes to Nolan between the lines with a red defender charging into his back.",
    good: "Nolan takes the ball across the defender's charge; the contact is a clear foul and blue gets a dangerous free kick.",
    poor: "Nolan jumps out of the contact and loses the ball cleanly; play waves on and red counters.",
  },
  "AM-30": {
    trigger:
      "The striker wants the ball to feet in the middle, but the red shirt guarding him is also reading Nolan's path, so Nolan shapes a decoy run toward the far edge of the box.",
    good: "Nolan sprints a loud decoy run to the far side, towing the defender away, and the striker receives alone.",
    poor: "Nolan stands and watches; the striker stays smothered and the forced pass into him is cut out.",
  },

  // ── Defensive midfielder ──────────────────────────────────────────────────
  "DM-08": {
    trigger:
      "The goalkeeper has the ball while a red striker stands between blue's two center backs.",
    good: "Nolan drops to an angle the goalkeeper can reach, receives, and blue builds through the middle.",
    poor: "Nolan hides behind the striker where no pass can arrive; the goalkeeper is forced to kick long.",
  },
  "DM-11": {
    trigger:
      "A red midfielder sprints at Nolan's back as the ball travels toward him, and the striker shows for a one-touch return.",
    good: "Nolan bounces the ball first time off the striker and spins away from the chaser to receive it back in space.",
    poor: "Nolan tries to turn with the ball and the chasing midfielder takes it off his heels.",
  },
  "DM-12": {
    trigger:
      "Red's midfield shifts to the ball side and leaves a corridor of open grass in front of Nolan.",
    good: "Nolan carries into the free lane, makes a defender step to him, and slips the ball on.",
    poor: "Nolan plays a slow sideways ball; the corridor closes and red's shape resets.",
  },
  "DM-14": {
    trigger:
      "Blue's center back charges out to challenge, leaving the space behind him unguarded.",
    good: "Nolan drops into the hole behind his center back so nothing can be played in behind the charge.",
    poor: "Nolan watches the challenge; the flick over the top lands exactly where the center back had been.",
  },
  "DM-15": {
    trigger:
      "Red's number ten lurks between blue's lines, asking for the ball through the middle.",
    good: "Nolan positions on the passing line to the ten; every central ball is blocked or forced wide.",
    poor: "Nolan follows the ball to the flank; the ten receives between the lines and turns at the defense.",
  },
  "DM-16": {
    trigger:
      "The ball breaks to a red midfielder striding onto it at the top of blue's box.",
    good: "Nolan closes the strike zone with quick, balanced steps and the effort is charged down.",
    poor: "Nolan rushes and dives past the ball; the red midfielder cuts inside and gets his strike away.",
  },
  "DM-18": {
    trigger:
      "A high clearance climbs over midfield and its landing spot is still nobody's ball.",
    good: "Nolan backpedals to the landing zone before it drops and blue starts a new attack.",
    poor: "Nolan ball-watches the flight; a red shirt reads the drop first and collects behind him.",
  },
  "DM-19": {
    trigger:
      "Red's extra midfielder starts a late sprint from deep while the ball is still out wide.",
    good: "Nolan spots the late run early, tracks it goal-side, and cuts out the ball to the penalty spot.",
    poor: "Nolan watches the wide ball; the late runner arrives unmarked at the penalty spot behind him.",
  },
  "DM-23": {
    trigger:
      "Red wins the ball and drives straight through the middle while blue's defenders are split wide.",
    good: "Nolan sprints into the ball-to-goal line and delays the carrier until blue's defense closes around him.",
    poor: "Nolan chases from behind without ever blocking the middle; the carrier runs the central lane untouched.",
  },
  "DM-24": {
    trigger:
      "Red works the ball toward the arc, where their midfielder loves to strike from distance.",
    good: "Nolan holds the edge of the box and blocks the strike lane without diving past the ball.",
    poor: "Nolan lunges at the first fake; the shooter shifts the ball and the lane to goal is open.",
  },
  "DM-26": {
    trigger:
      "The red carrier runs at Nolan while protecting the ball; a tackle right now would be a guess.",
    good: "Nolan jockeys patiently until the carrier's touch runs long, then wins the ball cleanly.",
    poor: "Nolan dives in while the ball is glued to the carrier's boot and is left on the grass behind play.",
  },
  "DM-28": {
    trigger:
      "Blue's advanced number eight slips into a gap ahead of red's midfield and raises a hand for the ball.",
    good: "Nolan fizzes the pass into the eight's feet before the gap closes, and blue plays in red's half.",
    poor: "Nolan looks away to the safe sideways ball; the eight's gap closes and the chance to progress is lost.",
  },
  "DM-30": {
    trigger:
      "Blue has a throw-in deep in their own half and red players are hunting every shirt near the line.",
    good: "Nolan works free at a short angle, receives the throw, and plays blue calmly out of the trap.",
    poor: "Nolan stands marked; the throw is forced long down the line and red collects it.",
  },

  // ── Fullback ──────────────────────────────────────────────────────────────
  "FB-11": {
    trigger:
      "The defense drops deep and gives Nolan time out wide, while the striker waits between the center backs.",
    good: "Nolan delivers early from deep, before the box fills, and the striker attacks the ball on the move.",
    poor: "Nolan carries into the crowd first; by the time he delivers, the box is packed and the ball is blocked away.",
  },
  "FB-12": {
    trigger:
      "Nolan slips down to the end line as a teammate arrives late in the middle of the box behind the retreating defense.",
    good: "Nolan pulls the ball back from the end line and the late runner strikes it first time.",
    poor: "Nolan hangs a blind high ball toward nobody and the goalkeeper claims it comfortably.",
  },
  "FB-13": {
    trigger:
      "Blue's winger keeps the ball in front of Nolan; red's counter threat is waiting behind them both.",
    good: "Nolan supports ten meters behind at an angle, giving the winger an out-ball without leaving his post.",
    poor: "Nolan sprints past the winger into the wide lane he did not need; red's counter runs through Nolan's empty slot.",
  },
  "FB-14": {
    trigger:
      "Only one red defender guards the wide lane that Nolan and his winger both attack.",
    good: "Nolan joins the winger at speed, the 2v1 forces the defender to choose, and the free man goes through.",
    poor: "Nolan stays home; the winger faces the defender alone and the wide advantage never exists.",
  },
  "FB-15": {
    trigger:
      "The middle of the pitch stands empty; blue's midfielders have towed red's shirts wide, and Nolan can move inside.",
    good: "Nolan steps inside into midfield, gives blue an extra central passer, and the build-up breathes.",
    poor: "Nolan hugs the touchline out of habit; the free central grass is never used.",
  },
  "FB-16": {
    trigger:
      "Blue's winger cuts infield with the ball, and the touchline ahead of Nolan is suddenly empty.",
    good: "Nolan spots the rotation and fills the vacated touchline, giving the winger a wide out-ball.",
    poor: "Nolan stands and admires; the wide lane stays empty and the winger is boxed in centrally.",
  },
  "FB-17": {
    trigger:
      "Red's quickest winger takes the ball with space to run at Nolan and no cover behind him.",
    good: "Nolan gives ground at an angle, slows the winger near the line, and help arrives before the box.",
    poor: "Nolan dives into a sprint duel he cannot win and the winger knocks it past him toward goal.",
  },
  "FB-18": {
    trigger:
      "The red winger keeps chopping toward his stronger foot, aiming for the middle of the pitch.",
    good: "Nolan angles his body to wall off the inside; the winger is forced down the line onto his weak foot.",
    poor: "Nolan stands square; the winger cuts inside onto his favorite foot and curls at goal.",
  },
  "FB-19": {
    trigger:
      "The red fullback sprints past his own winger, and suddenly two attackers share Nolan's flank.",
    good: "Nolan passes the winger to a teammate and tracks the overlap, so both runners stay covered.",
    poor: "Nolan stares at the ball carrier; the overlapping fullback runs free behind him for the pull-back.",
  },
  "FB-20": {
    trigger:
      "The ball sits on red's wing; their far winger creeps toward the space behind blue's defense.",
    good: "Nolan drops to the back post early and heads the far-post delivery away in front of the sneaking winger.",
    poor: "Nolan holds a high line watching the ball; the delivery sails over him to the free man behind.",
  },
  "FB-21": {
    trigger:
      "The red winger reaches the goal line; the deadliest ball from there is the pull-back to the penalty mark.",
    good: "Nolan sinks into the cutback lane and the pull-back hits his shins instead of a red boot.",
    poor: "Nolan chases toward the goal line after the ball; the cutback rolls behind him to the arriving runner.",
  },
  "FB-22": {
    trigger:
      "Blue's center back is dragged out wide to the flank, and the heart of the defense stands open.",
    good: "Nolan tucks in and holds the central space until the center back can return to his post.",
    poor: "Nolan stays wide in his usual lane; red plays into the empty middle that nobody filled.",
  },
  "FB-23": {
    trigger:
      "A deep ball floats over everyone toward the far post, where Nolan waits with a red attacker arriving.",
    good: "Nolan attacks the drop first and heads it firmly away from the goalmouth.",
    poor: "Nolan waits underneath it flat-footed; the red attacker climbs above him at the far post.",
  },
  "FB-24": {
    trigger:
      "Blue's defense pushes up together while the red striker lingers near Nolan's shoulder.",
    good: "Nolan steps up in the same instant as the line and the lingering striker is caught offside.",
    poor: "Nolan hangs a stride behind his line and plays the striker onside all by himself.",
  },
  "FB-25": {
    trigger:
      "Blue's corner is punched clear and red springs forward while Nolan is still far up the pitch.",
    good: "Nolan sprints the recovery diagonal, reaches the red runner's lane, and slows the break until help arrives.",
    poor: "Nolan jogs straight back down the wing; the red counter cuts across the middle he never protected.",
  },
  "FB-26": {
    trigger:
      "A blocked delivery spins loose near blue's goal line, wide of the box, with a red attacker closing fast.",
    good: "Nolan gets there first and thumps the loose ball up the line, away from danger.",
    poor: "Nolan tries a delicate pass under pressure and gives the ball straight back beside his own box.",
  },
  "FB-27": {
    trigger:
      "Late in the game blue leads by one; Nolan takes the ball on the touchline with red hunting everywhere.",
    good: "Nolan keeps everything simple and safe — corner-flag side, easy passes — and the lead survives.",
    poor: "Nolan tries an adventurous ball across his own half; red intercepts it with the goal in sight.",
  },
  "FB-29": {
    trigger:
      "The long ball changes sides to blue's winger, and the inside channel opens as red slides over.",
    good: "Nolan underlaps into the inside channel while the defense is still shifting and receives between the lines.",
    poor: "Nolan overlaps into the same wide lane as the winger and red's shift covers them both at once.",
  },
  "FB-30": {
    trigger:
      "Red's defenders block every ball into the box; the winger turns and looks back toward Nolan.",
    good: "Nolan offers the reset, and blue recycles patiently to attack again from the other wing.",
    poor: "Nolan waves the winger on into the same wall of defenders and blue loses the ball for nothing.",
  },

  // ── Center defender ───────────────────────────────────────────────────────
  "CB-07": {
    trigger:
      "Red's striker chases Nolan's partner; on the far side, blue's fullback stands completely alone.",
    good: "Nolan receives and finds the free fullback, and blue escapes the chase with the ball.",
    poor: "Nolan hurries a ball back into the chased partner's feet and the striker pounces on it.",
  },
  "CB-08": {
    trigger:
      "Nobody steps toward Nolan after blue wins the ball; open grass invites him into midfield.",
    good: "Nolan carries forward until a red shirt must leave someone, then passes to the player left free.",
    poor: "Nolan stands still on the ball; red rests in shape and blue's advantage evaporates.",
  },
  "CB-10": {
    trigger:
      "Red crowds blue's left side; on the far right the winger stands alone with half a pitch of space.",
    good: "Nolan switches the ball across to the free winger, and blue attacks the empty side.",
    poor: "Nolan plays another short ball into the crowded left and red swallows it.",
  },
  "CB-11": {
    trigger:
      "Red's striker curves his chase to push Nolan toward the line, while blue's pivot drops into the open middle.",
    good: "Nolan slips the ball inside to the defensive midfielder and blue plays out through the middle.",
    poor: "Nolan follows the chase to the touchline and boots the ball out under pressure.",
  },
  "CB-12": {
    trigger:
      "Two red attackers trap Nolan near his own byline with every forward lane closed.",
    good: "Nolan uses the goalkeeper as the extra man; the ball goes back, around, and out the other side.",
    poor: "Nolan tries to dribble out of the trap beside his own goal and red steals it in the worst place.",
  },
  "CB-13": {
    trigger:
      "Red's keeper launches a long, direct ball toward the tall striker in front of Nolan.",
    good: "Nolan attacks the ball in the air first and heads it clear before the striker can set himself.",
    poor: "Nolan backs off to watch the bounce; the striker flicks it on and red runs in behind.",
  },
  "CB-14": {
    trigger:
      "The long punt drops toward Nolan and the red striker at the same instant.",
    good: "Nolan steps in front, wins the first contact, and directs the ball to a blue shirt.",
    poor: "Nolan hesitates half a step and the striker gets his body in first.",
  },
  "CB-17": {
    trigger:
      "One red attacker runs from Nolan's zone into his partner's; someone must track him without both following.",
    good: "Nolan shouts, passes the runner on to his partner, and holds his own post — every zone stays guarded.",
    poor: "Nolan follows the runner across the pitch and leaves his own zone gaping open.",
  },
  "CB-22": {
    trigger:
      "The red winger skips past blue's fullback down the flank, and nobody guards the space behind.",
    good: "Nolan slides across behind his beaten fullback and blocks the winger's path into the box.",
    poor: "Nolan holds the middle looking at his striker; the winger drives untouched into the space behind.",
  },
  "CB-23": {
    trigger:
      "The ball travels from side to side, and a gap keeps trying to grow between Nolan and his partner.",
    good: "Nolan shuffles with every pass, staying connected to his partner, and no ball fits between them.",
    poor: "Nolan drifts with the ball alone; the gap opens and red plays the through ball straight down it.",
  },
  "CB-24": {
    trigger:
      "The pass toward red's striker is soft and bouncing; Nolan can reach it first — if he goes now.",
    good: "Nolan steps in front of the striker, intercepts, and blue attacks with red still leaning the wrong way.",
    poor: "Nolan waits for the striker to control it, then challenges late and fouls him.",
  },
  "CB-25": {
    trigger:
      "The red midfielder lifts his head and shapes a long ball over blue's defense.",
    good: "Nolan drops two steps before the kick and swallows the long ball comfortably.",
    poor: "Nolan holds his line flat-footed as the ball is struck; the red runner races past him onto it.",
  },

  // ── Goalkeeper ────────────────────────────────────────────────────────────
  "GK-12": {
    trigger:
      "A red striker breaks through and takes a heavy touch inside Nolan's box.",
    good: "Nolan explodes off his line and smothers the ball at the striker's boots before he can steady himself.",
    poor: "Nolan freezes on his line; the striker steadies, picks his spot, and Nolan is left guessing.",
  },
  "GK-14": {
    trigger:
      "A ball over the top races toward the empty grass outside Nolan's penalty area.",
    good: "Nolan sprints out beyond his box and boots the ball clear before the chasing striker arrives.",
    poor: "Nolan hesitates on the edge of his area; the striker reaches the ball first with the goal empty.",
  },
  "GK-15": {
    trigger:
      "A rushed back pass rolls toward Nolan with the red striker sprinting after it — hands are not allowed.",
    good: "Nolan meets it early and sends it first time toward the open wide side, before the striker can close the angle.",
    poor: "Nolan takes a touch to control it; the striker slides in and the block ricochets toward goal.",
    poorLabel: "Take a touch first",
  },
  "GK-16": {
    trigger:
      "Two red forwards chase blue's defenders, leaving a corridor between them for a rolled ball.",
    good: "Nolan rolls the ball through the corridor to the midfielder, and both chasing forwards are cut out of the game.",
    poor: "Nolan plays the obvious short ball to a chased defender, who is robbed facing his own goal.",
  },
  "GK-17": {
    trigger:
      "Red's forwards stand in the middle of the pitch; both blue fullbacks wait wide with open grass ahead.",
    good: "Nolan clips the ball over the middle to the fullback's feet and blue builds around the block.",
    poor: "Nolan drives the ball down the middle where red is strongest and it comes straight back.",
  },
  "GK-18": {
    trigger:
      "Nolan catches the ball while red's whole team is still upfield and blue's winger is already sprinting.",
    good: "Nolan throws instantly into the winger's path and blue counters before red can turn around.",
    poor: "Nolan bounces the ball and waits; red jogs back into shape and the counter moment dies.",
  },
  "GK-19": {
    trigger:
      "Blue leads late in the game; there is no rush, and red badly wants Nolan to hurry.",
    good: "Nolan takes his full time, waves teammates into space, and releases only when the safe pass is certain.",
    poor: "Nolan rushes a quick kick to please the crowd; red wins it and attacks blue's tired defense.",
  },
  "GK-22": {
    trigger:
      "Red wins a free kick near the touchline; blue's defenders look back at Nolan for instructions.",
    good: "Nolan pushes the line out, matches every red runner to a marker, and the delivery is defended cleanly.",
    poor: "Nolan says nothing; a red runner arrives unmarked at the far post as the ball comes in.",
    poorLabel: "Stay silent",
    icon: "📣",
  },
  "GK-23": {
    title: "Set the Wall for a Central Free Kick",
    goodLabel: "Set the Wall for a Central Free Kick",
    trigger:
      "Red places the ball for a central free kick just outside the box; Nolan must set the wall before the whistle.",
    good: "Nolan counts three into the wall to cover the near half and takes the open half himself — the strike is saved.",
    poor: "Nolan leaves no wall; the shooter sees the whole goal and bends the free kick around Nolan's dive.",
    poorLabel: "Skip the wall",
    icon: "🧱",
  },
  "GK-24": {
    trigger:
      "Red's corner swings toward Nolan's near post, where bodies crowd together.",
    good: "Nolan claims the near-post delivery at its highest point and the danger dies in his gloves.",
    poor: "Nolan stays rooted on his line; the near-post flick glances across his goalmouth.",
  },
  "GK-25": {
    trigger:
      "The high ball drops into a forest of players in front of Nolan; a clean catch looks risky.",
    good: "Nolan drives through the crowd with two strong fists and punches the ball far and wide.",
    poor: "Nolan reaches to catch through the bodies, gets bumped, and drops the ball at a red boot.",
  },
  "GK-27": {
    trigger:
      "The delivery curls in toward Nolan's goal and keeps dipping under the bar.",
    good: "Nolan attacks the inswinger early, meeting it at its highest point before it dips behind him.",
    poor: "Nolan waits on the line as it dips; the ball drops under the bar into the six-yard scramble.",
  },
  "GK-29": {
    trigger:
      "Blue's fullback is trapped by the touchline and knocks the ball back toward Nolan's wide side — feet only.",
    good: "Nolan shifts across early, meets it with an open body, and passes to the free center back on the other side.",
    poor: "Nolan stays in the middle of his goal; the back pass rolls toward the empty wide space and a red shirt chases it down.",
  },
};

/* ── Second review pass (2026-07-19): the remaining 80 template-worded
 * scenes. Their animations already passed every gate; only the narration was
 * generic. Each entry below paints the concrete match moment for its scene.
 * The same wording caution applies: triggers avoid keywords that would
 * reclassify a scene's duty family or skill id. ── */
Object.assign(sceneOverrides, {
  // ── Winger (second pass) ─────────────────────────────────────────────────
  "WNG-09": {
    trigger:
      "The ball rolls to Nolan on the touchline as a red shirt sprints in from behind him; his next touch decides everything.",
    good: "Nolan's first touch pushes the ball down the line into space, and he is away before the chaser can plant his feet.",
    poor: "Nolan stops the ball dead under his feet; the chasing red shirt arrives and pins him against the line.",
  },
  "WNG-10": {
    trigger:
      "A firm ball comes across the grass to Nolan while the nearest red shirt closes from the inside.",
    good: "Nolan takes it on his back foot with an open body and sees the whole field at once.",
    poor: "Nolan traps it square with his back to the play and must guess what is behind him.",
  },
  "WNG-11": {
    trigger:
      "Nolan is caught with the ball in the tightest strip of grass by the touchline, red closing from two sides.",
    good: "Nolan puts his body between the red shirts and the ball, wins a calm second, and keeps blue in possession.",
    poor: "Nolan panics a poke down the line and the ball trickles out for a red throw.",
  },
  "WNG-13": {
    trigger:
      "Blue's fullback darts inside Nolan while the red shirt in front watches only the ball.",
    good: "Nolan feeds the underlapping run and sprints on for the return; the pair slice through the channel together.",
    poor: "Nolan holds the ball and lets the underlap die; the moment passes and red resets its shape.",
  },
  "WNG-14": {
    trigger:
      "Nolan wins half a yard on the wing as the red defense retreats toward its six-yard box.",
    good: "Nolan whips a low ball into the corridor between the defense and the keeper — the hardest ball in soccer to defend.",
    poor: "Nolan floats a slow, high ball to the middle and the tallest red shirt eats it up.",
  },
  "WNG-15": {
    trigger:
      "The near side is packed with bodies, but at the far post a blue shirt waits with nobody behind him.",
    good: "Nolan clips the delivery over everyone to the far post, where his teammate has the easiest touch of his life.",
    poor: "Nolan smashes the ball into the first red shirt at the near post and the chance dies there.",
  },
  "WNG-19": {
    trigger:
      "Nolan's wing is jammed with three red shirts; blue calmly plays back as the far wing empties.",
    good: "The ball travels back, across, and out to the other wing — blue attacks open grass instead of bodies.",
    poor: "Nolan demands another ball into the same jammed wing and red swallows it.",
  },
  "WNG-20": {
    trigger:
      "The red fullback takes a lazy touch as he controls the ball near his own line.",
    good: "Nolan presses the lazy touch at full speed, closes the easy exits, and red panics the ball away.",
    poor: "Nolan waits and lets the fullback lift his head; red plays out calmly straight past him.",
  },
  "WNG-21": {
    trigger:
      "Red wants to hack the ball clear down their favorite lane, straight through Nolan's wing.",
    good: "Nolan plants himself in the lane the clearance wants; the ball thuds into him and blue attacks again.",
    poor: "Nolan stands beside the lane instead of in it, and the clearance flies past into blue's half.",
  },
  "WNG-22": {
    trigger:
      "The ball sits on red's wing; Nolan's job flips — the space at blue's far post now belongs to him.",
    good: "Nolan sinks to the back post early and clears the ball that was aimed exactly there.",
    poor: "Nolan ball-watches at the edge of the box; the far-post delivery drops behind him for a free red strike.",
  },
  "WNG-25": {
    trigger:
      "Blue wins the ball and the field opens; Nolan has grass ahead and two red shirts backpedaling.",
    good: "Nolan carries at speed until one red shirt must step to him, then slips the ball to the man that shirt abandoned.",
    poor: "Nolan slows the counter to wait for help, and red's whole team gets back behind the ball.",
  },
  "WNG-30": {
    trigger:
      "Blue earns a quick throw deep in red's half while red is still sorting out its shape.",
    good: "Nolan takes it fast to the nearest free teammate and blue attacks before red is set.",
    poor: "Nolan waits with the ball in his hands, red organizes, and the quick advantage is thrown away.",
  },

  // ── Striker (second pass) ────────────────────────────────────────────────
  "STR-09": {
    trigger:
      "The last red shirt stares at the ball; the space over his far shoulder is invisible to him.",
    good: "Nolan ghosts onto the blind side and is gone before the red shirt knows which way he went.",
    poor: "Nolan stands where he can be seen, and the pass toward him is cut out comfortably.",
  },
  "STR-13": {
    trigger:
      "Blue reaches the goal line, and the ball is about to roll backward to the top of the six-yard box.",
    good: "Nolan meets the pullback in stride and sweeps it first time inside the post.",
    poor: "Nolan takes a settling touch, and a sliding red boot whips the ball off his laces.",
  },
  "STR-15": {
    trigger:
      "The red keeper sprints far off his line to smother Nolan's chance.",
    good: "Nolan lifts the ball gently over the sprinting keeper and watches it drop under the bar.",
    poor: "Nolan blasts it straight into the keeper's chest — the only place already covered.",
  },
  "STR-16": {
    trigger:
      "The ball breaks to Nolan's weaker side with red defenders racing back and the goal open for only a heartbeat.",
    good: "Nolan strikes with the weak foot immediately — a scruffy goal beats a perfect miss.",
    poor: "Nolan chops the ball onto his favorite foot; the extra second lets two red shirts slide in.",
  },
  "STR-21": {
    trigger:
      "The ball is zipped into Nolan's feet with a red shirt climbing up his back.",
    good: "One touch back to the midfielder, a spin off the contact, and Nolan takes the return facing goal.",
    poor: "Nolan tries to turn through the shirt on his back and the ball squirts loose to red.",
  },
  "STR-23": {
    trigger:
      "The red keeper takes a heavy touch with the ball at his feet and no easy way out.",
    good: "Nolan presses the heavy touch in a curve, shows the keeper one bad option, and the panicked kick flies out of play.",
    poor: "Nolan jogs in slow and straight; the keeper looks up and picks a pass around him.",
  },
  "STR-24": {
    trigger:
      "A red shirt in trouble turns toward his own goal — the back pass is coming.",
    good: "Nolan sprints on the turn, arrives as the back pass rolls, and steals it in front of an open goal.",
    poor: "Nolan reacts only after the keeper has the ball, and the stealing moment is gone.",
  },
  "STR-26": {
    trigger:
      "Red swings the ball in; the near-post space in front of the first red shirt belongs to Nolan.",
    good: "Nolan attacks the near post first and flicks the danger away before it reaches the middle.",
    poor: "Nolan watches the flight from behind; the red shirt in front glances it across the goalmouth.",
  },
  "STR-27": {
    trigger:
      "Blue is pinned deep; the moment the ball is won, the defense needs one target to aim at up the field.",
    good: "Nolan stays high and shows for the long ball; blue escapes the siege with a single pass.",
    poor: "Nolan drops deep to help defend, and when blue wins it there is nobody left to find.",
  },
  "STR-28": {
    trigger:
      "Blue thumps a long ball out of defense; it drops to Nolan with a red shirt tight on his back.",
    good: "Nolan cushions the drop, shields it with his frame, and blue's defense finally breathes.",
    poor: "Nolan lets it bounce; the shirt behind him nips in and red attacks blue's tired defense again.",
  },
  "STR-30": {
    trigger:
      "A blocked effort spins into the six-yard chaos with nobody in control of it.",
    good: "Nolan reacts first — one clean touch and the loose ball is in the net.",
    poor: "Nolan waits to see what happens, and a red boot hacks the chaos clear.",
  },

  // ── Central midfielder (second pass) ─────────────────────────────────────
  "CM-12": {
    trigger:
      "The straight lane to the striker is shut, but the striker's feet can relay the ball to a runner beyond him.",
    good: "Nolan plays into feet and the ball bounces 'around the corner' to the runner — two touches beat the wall.",
    poor: "Nolan forces the straight ball through the shut lane and it never arrives.",
  },
  "CM-13": {
    trigger:
      "Red hunts in a pack on one side while blue's far fullback stands in acres of grass.",
    good: "Nolan sends the ball across the field to the far fullback, and the red pack must chase all over again.",
    poor: "Nolan plays another short ball inside the pack and red's trap snaps shut.",
  },
  "CM-14": {
    trigger:
      "The attack has stalled; going backward for one pass is the fastest way to attack again.",
    good: "Nolan drops the ball back, blue keeps it, and the attack restarts on the other side with red stretched thin.",
    poor: "Nolan refuses to go backward and carries into three waiting red shirts.",
  },
  "CM-15": {
    trigger:
      "From where Nolan stands, every lane to a teammate is blocked by a red body.",
    good: "Three quick side-steps change the picture — a lane opens and the ball goes through it.",
    poor: "Nolan stays rooted to his spot and hits the same blocked lane again.",
  },
  "CM-19": {
    trigger:
      "Nolan plays the ball forward and the red midfield turns its heads to watch it fly.",
    good: "Nolan follows his own pass at a sprint and takes the return behind the ball-watchers.",
    poor: "Nolan admires his pass standing still, and the play leaves without him.",
  },
  "CM-20": {
    trigger:
      "The red shirts read Nolan's eyes; the runner gets free only if the pass looks like it is going somewhere else.",
    good: "Nolan opens his body to the wing, looks left, and slides the ball straight through the middle.",
    poor: "Nolan stares at his target the whole way and the red shirt steps into the lane early.",
  },
  "CM-22": {
    trigger:
      "Red's number eight starts a sprint from deep, aiming to appear where blue's defense is not looking.",
    good: "Nolan runs with the eight stride for stride and is goal-side when the ball tries to find him.",
    poor: "Nolan hands the runner to nobody, and the eight arrives alone in blue's box.",
  },
  "CM-23": {
    trigger:
      "Blue's fullback is left one against one with red's trickiest winger on the touchline.",
    good: "Nolan sprints across to double up; the winger now faces two shirts and a touchline.",
    poor: "Nolan holds the middle and watches; the winger beats his man and the danger floods inside.",
  },
  "CM-24": {
    trigger:
      "Two players rise for the long ball; whatever drops next belongs to whoever guessed the landing spot.",
    good: "Nolan judges the flick early and is standing on the landing spot before the ball comes down.",
    poor: "Nolan watches the duel instead of the space, and red collects the drop behind him.",
  },
  "CM-25": {
    trigger:
      "The ball is at red's goal-line side; their midfielder sneaks toward the middle of the box for the pull-back.",
    good: "Nolan follows the sneaking runner all the way, and the pull-back rolls harmlessly to a blue boot.",
    poor: "Nolan stares at the ball; the pull-back finds the sneak and red strikes from the heart of the box.",
  },
  "CM-30": {
    trigger:
      "Blue's first delivery is headed out, comes back to the wing, and a second delivery is being lined up.",
    good: "Nolan times a late burst into the box and meets the second delivery in full stride.",
    poor: "Nolan loiters in the box too early, picks up a shadow, and the moment finds him standing still.",
  },
});

Object.assign(sceneOverrides, {
  // ── Attacking midfielder (second pass) ───────────────────────────────────
  "AM-07": {
    trigger:
      "The ball travels to Nolan between the lines while a red shirt hurries in from his blind shoulder.",
    good: "A glance over the shoulder, a half-turned body — Nolan's first touch already faces red's goal.",
    poor: "Nolan takes it square without looking, and the blind-shoulder shirt swallows him whole.",
  },
  "AM-09": {
    trigger:
      "Everyone crowds the ball side; far away on the other wing, a quiet pocket of grass sits unguarded.",
    good: "Nolan slides into the weak-side pocket and receives with the whole crowded side behind him.",
    poor: "Nolan joins the crowd, and one more blue shirt makes the busy side even easier to defend.",
  },
  "AM-11": {
    trigger:
      "Blue's winger takes off behind red's fullback the instant Nolan's head comes up.",
    good: "Nolan slides the through ball into the sprint at the exact moment the winger crosses the last shoulder.",
    poor: "Nolan waits one beat too long; the winger is offside and the sprint was for nothing.",
  },
  "AM-12": {
    trigger:
      "Red's deepest shirt guards the lane into the striker — but only while he believes that is where the ball is going.",
    good: "Nolan fakes toward the wing, the guard leans, and the real ball zips into the striker's feet.",
    poor: "Nolan telegraphs the striker ball from the start, and the guard cuts out what he always knew was coming.",
  },
  "AM-20": {
    trigger:
      "The striker sets the ball back softly into Nolan's running path at the top of the box.",
    good: "One strike, first time, before the red wall can set — that is the whole point of the layoff.",
    poor: "Nolan takes a touch to make it perfect, and the window slams shut around the ball.",
  },
  "AM-21": {
    trigger:
      "A blue strike is beaten away by the keeper and the ball sits spinning in front of the goal.",
    good: "Nolan followed the strike the moment it left the boot — he reaches the spill first and taps in.",
    poor: "Nolan turns to celebrate a goal that has not happened, and a red boot clears the spill.",
  },
  "AM-23": {
    trigger:
      "Blue loses the ball and red's fullback gathers it near the touchline, facing his own end of the field.",
    good: "Nolan curves his sprint to trap the fullback against the line — nowhere to go, ball won back high.",
    poor: "Nolan charges straight at the ball, and the fullback escapes inside through the door Nolan left open.",
  },
  "AM-29": {
    trigger:
      "Red has shuffled its whole defense to Nolan's side of the field; the far winger waves alone.",
    good: "Nolan lifts the ball across to the lonely winger, and blue attacks one against one instead of one against four.",
    poor: "Nolan keeps playing into the shuffled defense, and red wins the ball with sheer numbers.",
  },

  // ── Defensive midfielder (second pass) ───────────────────────────────────
  "DM-07": {
    trigger:
      "Blue's two center backs split wide with the ball, and the space between them asks for a passer.",
    good: "Nolan drops into the split, receives facing the field, and blue builds calmly through him.",
    poor: "Nolan stays high behind the chasing striker where no pass can reach him, and the ball goes long.",
  },
  "DM-09": {
    trigger:
      "The ball comes into Nolan with red's first chaser arriving on his left ear.",
    good: "Nolan's first touch spins him away from the chaser's side, into the grass the chaser just left.",
    poor: "Nolan turns straight into the chaser, and the ball is gone before his second touch.",
  },
  "DM-10": {
    trigger:
      "As the deepest midfielder, Nolan sees what nobody else can: across the field, the entire far side is empty.",
    good: "One long diagonal from the base, and blue's winger receives with the field tilted the wrong way for red.",
    poor: "Nolan shovels another short ball into the crowded side, and the empty grass stays unused.",
  },
  "DM-13": {
    trigger:
      "Both blue fullbacks charge forward at once, leaving Nolan as the last midfielder on guard.",
    good: "Nolan plants himself in front of the defense; when the attack breaks down, the counter dies at his feet.",
    poor: "Nolan joins the charge too, and blue's whole middle becomes an open motorway for red.",
  },
  "DM-17": {
    trigger:
      "Red reaches the goal line; the deadliest ball now is the one rolled back toward the penalty mark.",
    good: "Nolan sinks into the cutback zone, and the rolled ball dies on his boot instead of a red one.",
    poor: "Nolan chases toward the goal line with everyone else, and the roll-back finds the empty middle.",
  },
  "DM-20": {
    trigger:
      "Blue's front players chase hard; someone must sit in the space directly behind their chase.",
    good: "Nolan shifts in behind the press, and when red escapes the first wave, he is the second wave.",
    poor: "Nolan joins the front chase, and red's escape pass sails into the space they all left together.",
  },
  "DM-21": {
    trigger:
      "The ball is on red's left; if danger comes, it will come through blue's unguarded far half-space.",
    good: "Nolan tilts across to balance the far side, and red's big diagonal lands on his chest.",
    poor: "Nolan hugs the ball side with everyone else, and red plays into the hole behind him.",
  },
  "DM-22": {
    trigger:
      "Red breaks down the wing with numbers while blue's defense is still sprinting home.",
    good: "Nolan angles his body, gives ground slowly, and buys the four seconds his teammates need.",
    poor: "Nolan dives into a wing tackle, misses, and the counter runs past a man on the grass.",
  },
  "DM-25": {
    trigger:
      "Blue's three midfielders have wandered into a crooked line with gaps a bus could pass through.",
    good: "Nolan calls and points until all three stand connected; the ball cannot pass through a straight chain.",
    poor: "Nolan says nothing, and red plays through the crooked gaps like open doors.",
  },
  "DM-27": {
    trigger:
      "Blue leads late; every risky forward ball now is a gift red is praying for.",
    good: "Nolan keeps the ball moving backward and sideways, safe pass after safe pass, and the clock does the scoring.",
    poor: "Nolan tries one heroic forward ball, red intercepts, and the lead is suddenly in danger.",
  },
  "DM-29": {
    trigger:
      "A blue teammate tries a brave ball forward; if it bounces off red, somebody must already be waiting.",
    good: "Nolan hangs behind the brave pass as insurance and collects the ricochet before red can turn.",
    poor: "Nolan sprints forward with everybody else, and the ricochet rolls into blue's naked half.",
  },

  // ── Fullback (second pass) ───────────────────────────────────────────────
  "FB-07": {
    trigger:
      "The keeper rolls the ball toward Nolan at the corner of the box while a red shirt starts his charge.",
    good: "Nolan opens his body before the ball arrives, and his first touch already points up the line.",
    poor: "Nolan takes it flat-footed facing his own goal, and the charging shirt is on him instantly.",
  },
  "FB-08": {
    trigger:
      "Red's striker chases blue's build-up; the escape door is the wide lane Nolan lives in.",
    good: "One crisp touch past the chaser's shoulder, and Nolan drives blue out of the trap along the line.",
    poor: "Nolan hesitates in the corner, and red's chase pins blue against its own goal.",
  },
  "FB-09": {
    trigger:
      "Nolan plays into the midfielder's feet — standing still would waste it, because space is opening on the opposite side of the red shirt.",
    good: "Pass, then go: Nolan darts up the line and takes the return in the space he just created.",
    poor: "Nolan passes and stands admiring; the return has nowhere useful to go and the attack suffocates.",
  },
  "FB-10": {
    trigger:
      "Red crowds blue's right side hard; the path across blue's own defense to the far side is open.",
    good: "The ball travels through the back line — right to left — and blue's far fullback strides into freedom.",
    poor: "Blue keeps banging the crowded right side until red simply takes the ball away.",
  },
  "FB-28": {
    trigger:
      "Blue survives a red attack; the instant the ball is won, the wing ahead of Nolan stands empty.",
    good: "Nolan sprints the empty wing, and the clearing pass finds him with the whole field turning.",
    poor: "Nolan rests for two seconds after the ball is won, and the empty wing fills back up.",
  },

  // ── Center defender (second pass) ────────────────────────────────────────
  "CB-09": {
    trigger:
      "Red's front line stands flat; one firm ball through a gap makes all of them useless at once.",
    good: "Nolan zips the pass between two red shirts into the midfielder beyond, and blue skips a whole line.",
    poor: "Nolan rolls the safe sideways ball, and the flat red line stays perfectly comfortable.",
  },
  "CB-15": {
    trigger:
      "The long red ball is challenged at midfield; the drop will land somewhere just behind the duel.",
    good: "Nolan steps to the landing spot early, and the second ball never becomes a red attack.",
    poor: "Nolan stands flat watching the duel, and red's runner swallows the drop behind him.",
  },
  "CB-16": {
    trigger:
      "Red's striker bends his sprint into the channel between Nolan and the fullback.",
    good: "Nolan runs the channel with the striker, goal-side all the way, and the through ball dies quietly.",
    poor: "Nolan assumes the fullback has him — without a word — and the striker splits them both.",
  },
  "CB-18": {
    trigger:
      "The ball sits wide; the red striker leans toward blue's near post, waiting for the darted delivery.",
    good: "Nolan steps in front, meets the low delivery first, and thumps it out of the danger zone.",
    poor: "Nolan stands behind the striker; the near-post ball reaches red first and flashes across goal.",
  },
  "CB-19": {
    trigger:
      "Red is at the goal line; the middle of the box behind blue's turning defense is the kill zone.",
    good: "Nolan retreats into the cutback zone, and the rolled ball is his before any red boot arrives.",
    poor: "Nolan follows the ball to the goal line, and the pull-back rolls into the space he abandoned.",
  },
  "CB-20": {
    trigger:
      "The ball squirts to a red midfielder measuring a strike from the top of blue's box.",
    good: "Nolan closes fast but stays on his feet, spreads big, and the strike thuds into his frame.",
    poor: "Nolan slides in early; the shooter shifts the ball once and strikes through where Nolan used to be.",
  },
  "CB-21": {
    trigger:
      "Red streams through the middle three against two while blue's midfield sprints back to help.",
    good: "Nolan backpedals in the carrier's path, never diving, and the extra seconds bring blue home.",
    poor: "Nolan lunges at the first touch, misses, and three red shirts play through two.",
  },
  "CB-26": {
    trigger:
      "The bouncing ball near blue's goal is too hot to control, and red is arriving fast.",
    good: "Nolan smashes it behind for a corner without apology — a restart is always better than a goal.",
    poor: "Nolan tries to play tidy soccer in his own six-yard box, and red steals the touch of its life.",
  },
  "CB-27": {
    trigger:
      "Play stops; red places the ball forty meters out, and blue's four defenders look sideways at Nolan.",
    good: "Nolan sets the line level with the deepest runner, arms out, all four stepping as one.",
    poor: "Nobody speaks; blue's line stands crooked, and a red runner strolls onside behind it.",
  },
  "CB-28": {
    trigger:
      "Nolan takes the ball as red's striker arrives snarling, with no forward option open yet.",
    good: "Nolan puts his body in the way, takes the bump, and keeps the ball until a teammate shows.",
    poor: "Nolan panics a kick into the striker's legs, and the ricochet falls anywhere it likes.",
  },
  "CB-29": {
    trigger:
      "Blue restarts near its own box; two teammates want the throw, one guarded, one truly free.",
    good: "Nolan throws to the truly free man, and blue keeps the ball without any drama.",
    poor: "Nolan throws to the guarded favorite, and red picks it off beside blue's box.",
  },
  "CB-30": {
    trigger:
      "Seconds left, blue ahead, and red throws every shirt forward one final time.",
    good: "Nolan keeps it ruthless and simple — long clearances, no fouls, no tricks — and the whistle finds blue in front.",
    poor: "Nolan tries fancy soccer in the final minute and hands red one last chance.",
  },

  // ── Goalkeeper (second pass) ─────────────────────────────────────────────
  "GK-08": {
    trigger:
      "The red striker cuts toward the near post with the ball on his laces.",
    good: "Nolan sets early on the near post, big and still, and the strike slams into his frame.",
    poor: "Nolan is still shuffling his feet when the strike comes, and the near post is a tunnel.",
  },
  "GK-09": {
    trigger:
      "The shooter opens his body — everything about the shape says far post.",
    good: "Nolan trusts the shape, shifts his set toward the far post, and the curler meets his glove.",
    poor: "Nolan guards the near post out of habit, and the far-post curler glides past him.",
  },
  "GK-10": {
    trigger:
      "A straight, low strike comes at Nolan through clean grass — no deflection, no screen.",
    good: "Nolan gets his whole body behind it and swallows the ball dead — no spill, no red follow-up.",
    poor: "Nolan pats it back into play, and the red striker feasts on the spill.",
  },
  "GK-11": {
    trigger:
      "The strike climbs toward Nolan's bar, too high to hold and too close to ignore.",
    good: "Nolan backpedals and tips it over the bar — concede the restart, never the middle.",
    poor: "Nolan slaps it straight up in the air, and it drops into his own six-yard scramble.",
  },
  "GK-13": {
    trigger:
      "The red striker is through alone; the goal belongs to whoever stays braver for longer.",
    good: "Nolan waits, waits, then spreads huge at the very last step — the strike hits his shape.",
    poor: "Nolan guesses early and slides; the striker steps around the guess into an open net.",
  },
  "GK-20": {
    trigger:
      "Red's chasers have camped on Nolan's usual short side; the far side stands forgotten.",
    good: "Nolan changes the side of his delivery, and blue starts the attack where red is not.",
    poor: "Nolan feeds the camped side one more time, and the chasers win it dangerously close to goal.",
  },
  "GK-21": {
    trigger:
      "The danger has passed, but blue's defense is still parked deep inside its own box.",
    good: "Nolan calls the line up the field, and the whole team breathes twenty meters higher.",
    poor: "Nolan says nothing, and blue defends the edge of its own box for the rest of the half.",
  },
  "GK-26": {
    trigger:
      "The delivery bends away from Nolan's goal, drifting out of any reasonable reach.",
    good: "Nolan stays home, holds his ground, and owns whatever happens after the swing.",
    poor: "Nolan chases an outswinger he can never reach, and the goal stands empty behind him.",
  },
  "GK-28": {
    trigger:
      "Nolan is stranded far from home when red wins the ball and looks up at his empty goal.",
    good: "Nolan turns and sprints the shortest line home, sets his feet, and makes the save that should not exist.",
    poor: "Nolan backpedals slowly while watching the ball, and arrives one step after the strike.",
  },
  "GK-30": {
    trigger:
      "Last minute, blue ahead, and red hangs one final high ball into Nolan's crowded box.",
    good: "Nolan rises through the crowd and claims the last ball with both hands — and the game with it.",
    poor: "Nolan stays on his line hoping; the ball drops into the crowd and red gets one final swing.",
  },
});

/**
 * Scenes whose good/poor animations are individually authored in
 * `dutyGoodAnimation` / `dutyPoorAnimation`. These bypass the generic
 * option-intent rewriter so the hand-built timelines survive intact.
 */
export const bespokeAnimationIds = new Set([
  "AM-30",
  "STR-12",
  "STR-17",
  "STR-18",
  "STR-29",
  "CM-16",
  "CM-27",
  "CM-28",
  "DM-19",
  "DM-23",
  "CB-22",
  "FB-25",
  "GK-12",
  "GK-15",
  "GK-16",
  "GK-18",
  "GK-19",
  "GK-22",
  "GK-23",
  "GK-27",
  "GK-29",
]);
