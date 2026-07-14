# Nolan Soccer Trainer — Role Scenario Inventory

Status: **duplicate review passed; approved for animation implementation**

This inventory is the implementation gate for the 50-scene first release in `NOLAN_SOCCER_TRAINER_ROLE_SPEC.md`. A scene may be implemented only from one row below. “Blue goal” and “red goal” are explicit animation assets; shots must terminate at the opponent’s labeled goal.

## Winger — 8 scenes

| Scenario ID | Role | Unique game trigger | Main decision | Good consequence | Poor consequence | Field location | Animation assets required |
|---|---|---|---|---|---|---|---|
| WNG-01 | Winger | Central midfielder carries forward while Nolan’s touchline lane is empty | Hold width to receive instead of crowding the ball | Diagonal forward pass reaches Nolan in space and the attack advances | Two blue players occupy one lane; one defender blocks both and forces a backward pass | Attacking half, touchline lane | Wide run, diagonal pass, receive, defender shuffle, backward reset |
| WNG-02 | Winger | Fullback approaches side-on with the outside foot forward | Attack inside or outside based on the defender’s body angle | Nolan takes the exposed side and breaks beyond the fullback | Nolan attacks the protected side and is steered harmlessly toward cover | Wide edge of attacking third | Defender body turn, inside/outside touches, acceleration, covering defender |
| WNG-03 | Winger | Striker gains a step on a center defender before the defense is set | Cross early instead of taking another dribble | Early cross arrives in front of the striker for a first-time finish | Extra touch lets the back line recover and block the late cross | Outer attacking third, before box | Early cross arc, striker sprint, late block, goal finish |
| WNG-04 | Winger | Nolan reaches the end line while a late runner arrives behind defenders | Cut the ball back instead of crossing blindly | Cutback rolls to the late runner for a clear shot | Blind lofted cross sails into the goalkeeper’s hands | End line inside penalty area | End-line dribble, cutback, late run, lofted cross, goalkeeper catch |
| WNG-05 | Winger | Opposite winger looks up to cross while the far-post defender watches the ball | Sprint to the back post instead of watching from outside | Nolan arrives unseen for a back-post tap-in | Cross travels through the scoring area with nobody arriving | Far-post side of penalty area | Opposite-wing cross, blind-side run, tap-in, ball rolls beyond post |
| WNG-06 | Winger | Fullback stands tight and high while the passer has time to look up | Come short or run behind based on defender distance | Correct movement creates either a safe link or a through-ball lane | Wrong movement leaves Nolan marked or caught offside | Wide seam between middle and final thirds | Check run, behind run, defender follow/drop, through pass, offside flag |
| WNG-07 | Winger | Possession turns over as the opposing fullback overlaps beyond Nolan | Track the overlapping fullback immediately | Nolan intercepts or blocks the overlap cross and starts recovery | Nolan stays high; opponents create a wide 2v1 and cross behind the defense | Defensive third, wide channel | Turnover, recovery sprint, overlap, block/interception, cross consequence |
| WNG-08 | Winger | Blue wins the ball centrally with two defenders narrow and retreating | Sprint into the empty wide counterattack lane | Wide outlet stretches defenders and Nolan receives facing goal | Nolan runs centrally into the striker’s lane; the counter stalls in traffic | Halfway line into attacking flank | Possession win, wide sprint, central collision/traffic, counter pass |

## Striker — 8 scenes

| Scenario ID | Role | Unique game trigger | Main decision | Good consequence | Poor consequence | Field location | Animation assets required |
|---|---|---|---|---|---|---|---|
| STR-01 | Striker | Winger shapes to cross while the center defender protects the far-post shoulder | Choose the open near-post run rather than following the defender | Nolan reaches the cross first and redirects it into the opponent goal | Nolan runs into the defender’s protected lane and the cross is cleared | Penalty area, near/far-post lanes | Cross, two curved runs, first-time finish, headed clearance |
| STR-02 | Striker | Midfielder is pressed with Nolan tightly marked from behind | Check toward the ball as a link outlet | Nolan receives, lays off, and releases the winger into the space he vacated | Nolan waits high; midfielder is forced into a hopeful long ball out of play | Central final third, top of box | Check run, shielded receive, layoff, winger release, long clearance |
| STR-03 | Striker | Ball carrier has time and the defensive line steps near halfway | Run behind the line rather than returning toward the ball | Through pass sends Nolan one-on-one with the opposing goalkeeper | Nolan comes into an occupied pocket and the defense steps up unchallenged | Central channel behind high line | High-line step, timed through pass, chase, goalkeeper approach |
| STR-04 | Striker | Direct pass arrives with Nolan’s back to goal and a defender leaning into him | Hold up and lay off instead of attempting a blind turn | Nolan shields the ball and sets an advancing midfielder | Blind turn makes the ball ricochet off the defender and out for an opponent throw | Top of penalty arc | Back-to-goal receive, shielding, contact, layoff, deflection to touch |
| STR-05 | Striker | Nolan receives at a narrow angle while a teammate is unmarked across goal | Pass across goal instead of shooting through the goalkeeper | Square pass creates an open-net finish | Narrow-angle shot is smothered and held by the opposing goalkeeper | Side of six-yard area | Angle close-down, square pass, teammate finish, goalkeeper smother |
| STR-06 | Striker | Opposing goalkeeper spills a driven shot into the six-yard area | React first to the rebound | Nolan follows the shot and scores the loose ball | Nolan celebrates early; defender reaches the rebound and clears wide | Six-yard rebound zone | Driven shot, goalkeeper spill, rebound physics, poacher sprint, emergency clearance |
| STR-07 | Striker | Opponent center back receives facing play with a fullback available to one side | Curve the press to block the fullback lane | Center back is forced into a rushed pass that blue intercepts | Straight press leaves the fullback free and the opponent escapes pressure | Opponent defensive third | Curved press, passing-lane body angle, rushed pass, side escape |
| STR-08 | Striker | Passer draws a foot back as the defensive line begins stepping out | Delay the run to remain onside | Nolan crosses the line after the kick and receives behind | Nolan leaves early; flag rises and the scoring move stops | Edge of final third, offside line | Wind-up cue, line step, delayed sprint, pass, assistant flag/freeze |

## Central midfielder — 8 scenes

| Scenario ID | Role | Unique game trigger | Main decision | Good consequence | Poor consequence | Field location | Animation assets required |
|---|---|---|---|---|---|---|---|
| CM-01 | Central midfielder | Fullback passes inward while an opponent approaches from Nolan’s blind shoulder | Scan before the ball arrives and take the first touch away from pressure | Nolan turns into the open half and carries forward | Blind first touch enters pressure and the ball squirts back toward blue’s goal | Central middle third | Shoulder scan/head turn, incoming pass, directional first touch, pressure contact |
| CM-02 | Central midfielder | Nolan receives facing his own goal with pressure tight on only one side | Turn through the free side or play back when both sides close | Correct read keeps possession and faces the team forward | Forced turn is trapped against the opponent and concedes a dangerous free kick | Center circle | Rear pressure indicators, turn, safe back-pass, trap, referee whistle |
| CM-03 | Central midfielder | Three opponents overload the ball-side touchline while the far winger stays open | Switch play away from the crowded side | Long switch reaches the winger with space to advance | Another short ball traps blue at the line and ends in a throw to red | Deep midfield, touchline-to-touchline | Scan, long aerial switch, winger receive, sideline trap, throw-in signal |
| CM-04 | Central midfielder | Center defender carries out while every forward begins running away | Stay behind the ball as a support outlet | Defender resets through Nolan and blue changes the point of attack | Nolan also runs forward; defender has no outlet and clears under pressure | Defensive-to-middle third | Support drop, back-pass, pivot turn, pressured clearance |
| CM-05 | Central midfielder | Striker checks and lays the ball to an attacking teammate | Make the third-player run beyond the receiver | Return pass finds Nolan breaking the line | Nolan watches his first pass; receiver is surrounded and must stop the move | Central attacking channel | Three-player sequence, layoff, third-man run, line-breaking return |
| CM-06 | Central midfielder | Blue leads late while teammates are spread after a broken attack | Slow the tempo long enough for the team to regain shape | Nolan shields and recycles; blue forms passing options and keeps the ball | Rushed forward ball returns possession and launches an opponent counter | Middle third, central safe zone | Match clock, shield/turn, regroup runs, recycle pass, counter launch |
| CM-07 | Central midfielder | Fullback overlaps and the winger’s pass is at risk of being intercepted | Cover the vacated fullback channel | Nolan collects the turnover lane and stops the counter before it starts | Nolan joins the attack; opponent runs freely through the empty wide channel | Middle third behind attacking fullback | Overlap, anticipation/cover run, interception, wide counter sprint |
| CM-08 | Central midfielder | A cross is headed out toward the top of the box | Arrive late rather than entering the box before the clearance | Nolan meets the dropping ball in space for a controlled shot | Early run is marked; the clearance flies over him and starts a central counter | Top of penalty arc | Cross clearance, delayed arrival, dropping-ball strike, bypass counter |

## Fullback — 6 scenes

| Scenario ID | Role | Unique game trigger | Main decision | Good consequence | Poor consequence | Field location | Animation assets required |
|---|---|---|---|---|---|---|---|
| FB-01 | Fullback | Opposing winger receives with their back near the touchline and no overlap | Angle the body to show the winger outside | Winger is forced toward the line and produces a weak cross | Inside lane opens and the winger cuts toward goal for a shot | Defensive corner channel | Defensive stance rotation, guided dribble, weak cross, inside cut and shot |
| FB-02 | Fullback | Winger takes a heavy touch while drawing back to cross | Close down early and block the delivery | Nolan reaches crossing distance and the ball deflects out | Hesitation allows a clean cross to an arriving striker | Defensive wide final third | Heavy touch, sprint close-down, block deflection, clean cross/header |
| FB-03 | Fullback | Blue winger holds the ball inside while the opposing fullback follows them | Overlap outside at speed | Nolan’s run pulls a defender and creates a free crossing lane | Nolan stays behind the winger, leaving a static 1v2 | Attacking touchline | Outside overlap, defender track choice, release pass, cross, stalled duel |
| FB-04 | Fullback | Blue winger stays wide and the inside channel opens after a midfielder presses outward | Underlap into the inside channel | Nolan receives between defenders and cuts the ball back | Nolan overlaps into the winger’s space; both are pinned on the touchline | Attacking half-space | Underlap curve, channel receive, cutback, duplicated-lane containment |
| FB-05 | Fullback | Opposite fullback is already high and the ball carrier takes an uncertain touch | Hold the defensive position instead of making a second overlap | Nolan is in place to delay the immediate counter | Both fullbacks go; a direct pass creates a two-attacker break against center backs | Halfway line, defensive rest shape | Opposite overlap, hold/check run, turnover, counter delay, 2v2 break |
| FB-06 | Fullback | Nolan’s overlap is followed by an intercepted pass inside | Recover diagonally toward goal-side space | Nolan delays the counter and blocks the cutback until help arrives | Straight, slow recovery leaves the inside cutback lane open for a shot | Attacking-to-defensive wide transition | Turnover, diagonal recovery sprint, delay stance, cutback and finish |

## Center defender — 6 scenes

| Scenario ID | Role | Unique game trigger | Main decision | Good consequence | Poor consequence | Field location | Animation assets required |
|---|---|---|---|---|---|---|---|
| CB-01 | Center defender | Striker moves between Nolan and the blue goal as a pass enters the box | Stay goal-side of the striker | Nolan steps across the striker and intercepts before the shot | Nolan follows from the wrong side and the striker finishes first time | Central penalty area | Goal-side shuffle, box pass, interception, first-time finish |
| CB-02 | Center defender | Opponent ball carrier lifts their head with no blue pressure on the ball | Drop with the runner instead of stepping | Nolan reaches the through ball and guides it to the goalkeeper | Nolan steps toward the ball; runner receives alone behind the line | Top of box and depth behind line | Pressure cue, step/drop choice, runner, through ball, goalkeeper collect |
| CB-03 | Center defender | Defensive partner steps forward to challenge a checking striker | Slide behind the partner to cover | Nolan collects the flick that escapes the challenge | Both defenders step; a second striker runs through the uncovered gap | Central defensive channel | Partner step, cover slide, flick/deflection, second-runner break |
| CB-04 | Center defender | A bouncing ball drops in the box with an opponent within two strides | Clear wide instead of attempting a central pass | Ball leaves the danger area for a throw while blue resets | Square pass is blocked back toward goal for an immediate opponent shot | Penalty area, danger zone | Bounce physics, wide clearance, reset, blocked square pass, emergency shot |
| CB-05 | Center defender | Opposite winger crosses while the striker drifts behind Nolan’s shoulder | Track the striker’s run rather than ball-watch | Nolan meets the runner and heads the cross away | Nolan watches the flight; striker separates and heads at goal | Far-post center-back zone | Cross arc, shoulder check, paired tracking, defensive/attacking headers |
| CB-06 | Center defender | Opponent plays backward and every defender has time to step | Raise and hold the defensive line together | Runner is caught offside and the defense wins the restart | Nolan drops alone, keeping the runner onside for a through pass | Defensive line across final third | Backward-pass cue, synchronized line step, lone drop, offside flag, through pass |

## Goalkeeper — 4 scenes

| Scenario ID | Role | Unique game trigger | Main decision | Good consequence | Poor consequence | Field location | Animation assets required |
|---|---|---|---|---|---|---|---|
| GK-01 | Goalkeeper | Striker carries diagonally into the box before shooting | Set early and narrow the shooting angle | Nolan’s balanced set position blocks the shot away from danger | Nolan stays on the goal line; the striker sees and scores into the far corner | Goal mouth and penalty spot channel | Goalkeeper shuffle/set, angle cone implied by movement, dive/block, opponent finish |
| GK-02 | Goalkeeper | Through ball rolls beyond the back line with the striker chasing | Come decisively as a sweeper | Nolan reaches the ball first and clears to the touchline | Nolan hesitates halfway; striker touches around and scores | Penalty-area edge | Goalkeeper charge, race, sliding collect/clear, hesitation, round-keeper finish |
| GK-03 | Goalkeeper | Hard skipping shot arrives through bodies on a wet surface | Parry wide rather than pushing the ball centrally | Nolan redirects the shot beyond the post for a corner | Central parry lands at an opponent’s feet for a rebound goal | Six-yard goalkeeping area | Skipping shot, goalkeeper dive, lateral parry, central spill, rebound finish |
| GK-04 | Goalkeeper | Nolan collects a cross as opponents press the center and blue winger opens wide | Distribute to the open side | Rolled throw/pass starts a safe wide attack | Central rollout is intercepted for an immediate shot at the blue goal | Goal area into defensive flank | Catch, scan, bowling distribution, wide receive, central interception, recovery dive |

## Teamwork — 10 scenes

| Scenario ID | Role | Unique game trigger | Main decision | Good consequence | Poor consequence | Field location | Animation assets required |
|---|---|---|---|---|---|---|---|
| TW-01 | Teamwork | Winger and fullback begin in the same touchline lane as the ball approaches | One player moves inside while the other keeps width | Two passing lanes appear and blue plays through the first defender | Both stay together; one defender covers both and the pass is returned | Attacking wide third | Coordinated split runs, two pass lanes, single-defender containment, reset |
| TW-02 | Teamwork | Center back has the ball against two pressers while three blue players are level | Form a staggered support triangle | Ball travels around the press through either of two acceptable passes | Straight-line support hides teammates behind pressers and forces a goal kick clearance | Defensive build-up third | Triangle movement, two valid passes, pressing pair, long goal kick |
| TW-03 | Teamwork | Ball carrier meets a defender with a teammate available beside and beyond | Play a wall pass and continue running | One-touch return releases the runner behind the defender | Receiver holds the ball; defender recovers and the original runner becomes offside | Attacking half-space | Pass-and-run, one-touch wall return, defender turn, delayed hold, offside line |
| TW-04 | Teamwork | Winger passes into a checking striker while a third teammate faces forward | Third player runs beyond before the layoff | Striker sets the ball into the third runner’s path for a chance | Passer watches; striker is isolated and forced to shield backward | Central final third | Three-player run timing, set pass, finish chance, isolation/shield |
| TW-05 | Teamwork | Throw-in side becomes overloaded by four opponents while the far side stays vacant | Recycle through two teammates to switch as a team | Coordinated switch creates a far-side 3v2 | Everyone follows the throw; far side remains empty and blue is forced back to its goalkeeper | Middle third after throw-in | Throw-in, two-pass recycle, team lateral shift, far-side receive, goalkeeper reset |
| TW-06 | Teamwork | Two attackers break against one defender with the ball carrier drawing the defender | Hold the pass until the defender commits, then square it | Defender cannot recover and the teammate finishes | Early pass lets the defender change direction and intercept near the box edge | Attacking 2v1 lane | Defender commitment, delayed square pass, finish, early-pass interception |
| TW-07 | Teamwork | Two opponents counter against Nolan with a teammate recovering behind | Delay at an angle that protects the passing lane | Nolan slows the carrier until help returns and blue doubles the ball | Nolan dives in; square pass removes him and creates a one-on-one | Defensive 2v1 channel | Jockey/delay, lane protection, recovery sprint, tackle miss, square pass |
| TW-08 | Teamwork | Opponent midfielder receives centrally with three blue players around the area | Nearest presses, second covers, third balances | Opponent is trapped into a backward pass with forward lanes closed | All three chase; one pass enters the abandoned opposite channel | Defensive middle third | Role-colored press/cover/balance movement, backward pass, gap exploitation |
| TW-09 | Teamwork | Blue wins a loose ball and launches a 3v2 counter with defenders narrow | Fill left, center, and right lanes | Width splits defenders and creates a central shot | Three attackers bunch centrally; one defender delays all three until recovery | Halfway to attacking box | Possession win, three-lane sprint, defender split, shot, central bunch/delay |
| TW-10 | Teamwork | Blue leads late and receives near the opponent corner with support behind | Shield in the corner or recycle safely instead of crossing | Blue protects possession while the clock runs | Blind cross reaches the goalkeeper, who immediately starts a counter | Attacking corner | Match clock, corner shield, safe recycle, blind cross, goalkeeper catch/counter throw |

## Duplicate-concept review

Review method: each row was compared on a signature of **trigger + decision + field location + visible failure**. Similar soccer vocabulary is allowed only when the player responsibility, geometry, and consequence differ materially.

| Potential collision | Review | Result |
|---|---|---|
| WNG-06 vs STR-02/STR-03 | Winger reads a fullback in a wide seam; striker scenes separately teach central link play and a run behind a high line. Layouts and failures differ. | Keep all |
| WNG-03 vs WNG-04 | Early cross occurs before the box against recovering defenders; cutback occurs after reaching the end line against a set goal area. | Keep both |
| WNG-07 vs FB-06 | Winger tracks an opponent overlap in the defensive third; fullback recovers goal-side after their own attacking overlap. | Keep both |
| CM-03 vs TW-05 | CM makes an individual long switch from a touchline trap; teamwork uses a throw-in trigger and a two-pass coordinated team shift. | Keep both |
| CM-05 vs TW-04 | CM is the third runner after a striker layoff; teamwork coordinates passer, checking striker, and third runner as a group. Failure animations differ. | Keep both |
| CM-07 vs FB-05 | Midfielder covers a particular overlapping fullback after a risky pass; fullback holds rest-defense because the opposite fullback is already high. | Keep both |
| FB-03 vs FB-04 | Overlap uses the outside lane when winger moves inside; underlap uses the inside lane when winger stays wide. Poor layouts are different. | Keep both |
| FB-02 vs WNG-07 | Fullback closes the ball to block a cross; winger tracks the off-ball overlapping runner. | Keep both |
| CB-02 vs CB-06 | One defender chooses depth because the ball is unpressured; the whole line steps after a backward pass. | Keep both |
| STR-01 vs CB-05 | Striker selects a scoring run; center defender tracks an opponent during an opposite-side cross. Opposite responsibilities and consequences. | Keep both |
| STR-05 vs TW-06 | Striker chooses a square pass from a narrow shooting angle inside the box; teamwork times the pass in an open-field 2v1. | Keep both |
| STR-06 vs GK-03 | Striker attacks an opponent spill; goalkeeper controls where a hard shot is parried. They are complementary viewpoints, not cloned scenes. | Keep both |
| WNG-08 vs TW-09 | Winger personally chooses the empty flank on a counter; teamwork coordinates three distinct counterattack lanes. | Keep both |
| CM-06 vs TW-10 | Midfielder slows tempo centrally so team shape reforms; teamwork protects a late lead at the opponent corner. | Keep both |

Rejected during review:

- A generic “pass or dribble” scene was rejected because it did not express a role-specific trigger.
- A second “defender takes the ball” failure was rejected in favor of distinct outcomes: blocked cross, forced throw, offside restart, free kick, goalkeeper catch, stalled attack, or dangerous counter.
- Center defender “play through the fullback” was excluded from the six-scene release because line control was required and would otherwise be missing.
- Goalkeeper corner organization, cross claiming, and second-save recovery remain valid later-release concepts; they were not renamed into the four first-release goalkeeper slots.

## Implementation gate

- [x] Exactly 50 first-release scenarios inventoried: 8 winger, 8 striker, 8 central midfielder, 6 fullback, 6 center defender, 4 goalkeeper, 10 teamwork.
- [x] Every scenario has a unique trigger.
- [x] Every scenario has a distinct decision/layout/consequence signature.
- [x] Every role uses role-specific responsibilities.
- [x] Shot direction is defined relative to the labeled opponent goal.
- [x] Duplicate review completed before animation implementation.

