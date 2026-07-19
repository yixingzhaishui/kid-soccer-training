# Case-by-Case Tactical Review

This is the approval ledger for the 250 playable scenes. It deliberately
separates automated evidence from a tactical decision. A green automated test
does **not** mean that a soccer case is approved.

## Approval standard for every case

Before a case can be marked `Approved`, verify all of the following from the
actual animation timeline and phone-size option previews.

1. **Possession:** the displayed ball is with the stated carrier before every
   kick, receive, dribble, block, catch, or interception.
2. **Direction:** Blue attacks the red goal on the right; Red attacks the blue
   goal on the left. A backward pass is allowed only when it is a named safe
   reset and it stays on the field.
3. **Role duty:** Tom's route teaches the named role action. It must not be a
   generic run that contradicts the phase of play.
4. **Passing lane:** a helpful pass reaches a visible teammate through an open
   lane. A poor pass that enters pressure must visibly end in a block or
   interception.
5. **Opponent response:** opponents move to pressure, cover, recover, mark,
   intercept, or attack a realistic target; they do not stand still.
6. **Consequence:** each option changes what the team can do next. The best
   option must create/protect a real advantage; the poor option must show the
   specific tactical cost.
7. **Phone preview:** the option card shows Tom's actual route and ball path,
   with a clearly different endpoint/direction from every other option.
8. **Named-skill proof:** the animation must visibly prove the exact coaching
   principle. A switch must reach a different lane; a cutback must travel
   backward from the end line; a screen must occupy the passer-to-target lane;
   a tackle must follow an exposed touch; delay must allow teammates to recover.

## Status meanings

| Status | Meaning |
|---|---|
| Pending | Not individually reviewed. It must not be described as tactically approved. |
| Repairing | A concrete contradiction has been found and the case is being rebuilt. |
| Coach-verified | The title-to-skill mapping was checked individually and the actual timeline passed all named-skill, possession, direction, reaction, phone, and consequence gates. |
| Approved | Coach-verified plus an individual manual replay and visual sign-off. |
| Rejected | The generic case must be replaced by a role/phase-specific scene. |

## Review order

The review proceeds role by role, beginning with defensive midfielder because
the reported errors are in that pack. Each update records the exact repair and
the test that prevents regression.

### Historical defensive-midfielder baseline — superseded

This table records the state before the 2026-07-18 full-curriculum pass. Its
`Pending` and `Repairing` cells are historical findings, not current status.
The authoritative current status for all 250 cases is the full ledger below.

| ID | Teaching action | Status before full pass | Review evidence / repair |
|---|---|---|---|
| DM-01 | Screen the striker | Approved | Rebuilt with the opposing attacking midfielder carrying, the striker checking between lines, and Tom moving into the exact passer-to-striker lane. Correct and poor routes are visibly different at 390×844; the correct consequence blocks the central pass and clears wide. |
| DM-02 | Escape the press | Pending | Verify open body/pass lane and not a blind turn. |
| DM-03 | Cover inside | Pending | Verify Tom covers partner and center, not the ball. |
| DM-04 | Track the runner | Pending | Verify goal-side tracking and return-pass denial. |
| DM-05 | Break the line | Pending | Verify forward pass reaches a teammate, not a defender. |
| DM-06 | Delay the counter | Repairing | Rebuilt as jockey + recovery; needs final individual visual sign-off. |
| DM-07 | Drop between center backs | Repairing | Rebuilt as a 7v7 split-centre-back build-out: Tom drops from ahead of the ball into the split, receives ball-side of the striker, then plays forward/right to the fullback. Individual visual and mobile sign-off is next. |
| DM-08 | Show for the goalkeeper | Pending | Verify a safe outlet ahead of the goalkeeper, then progress. |
| DM-09 | Turn away from first presser | Pending | Verify first touch is away from pressure. |
| DM-10 | Switch from the base | Pending | Verify pass crosses to open side, not toward own goal. |
| DM-11 | Break pressure with a bounce pass | Pending | Verify return lane and third-player escape. |
| DM-12 | Carry into free lane | Pending | Verify dribble enters open grass and commits a defender. |
| DM-13 | Hold position during both overlaps | Pending | Verify rest-defense cover remains central. |
| DM-14 | Cover center back who steps | Pending | Verify Tom protects space behind partner. |
| DM-15 | Screen the number ten | Pending | Verify passer-to-ten line is blocked. |
| DM-16 | Close top of box | Pending | Verify shot lane is blocked without diving past ball. |
| DM-17 | Protect cutback zone | Pending | Verify penalty-spot lane is guarded. |
| DM-18 | Win second ball | Pending | Verify landing zone is read before the opponent. |
| DM-19 | Track late midfield runner | Pending | Verify runner stays goal-side. |
| DM-20 | Shift behind press | Pending | Verify cover is behind pressure, not beside it. |
| DM-21 | Cover opposite half-space | Pending | Verify weak-side balance. |
| DM-22 | Delay wide counter | Pending | Verify jockey route and recovering teammates. |
| DM-23 | Stop central counter | Pending | Verify ball-to-goal lane is protected. |
| DM-24 | Defend box edge | Pending | Verify controlled shot block. |
| DM-25 | Organize midfield line | Pending | Verify connected line movement. |
| DM-26 | Choose when to tackle | Repairing | Rebuilt so Tom jockeys first, the red carrier takes a visible heavy touch, and only then does Tom win the ball. Automated coach gate passes; phone visual sign-off remains. |
| DM-27 | Recycle while protecting lead | Pending | Verify safe possession and no blind forward pass. |
| DM-28 | Find advanced eight | Pending | Verify forward receiver is open and facing play. |
| DM-29 | Support behind risky pass | Pending | Verify reset angle remains available. |
| DM-30 | Safe throw-in option | Pending | Verify visible support and secure next pass. |

## Automated evidence currently required for every case

- full 7v7 player count and in-bounds normalized coordinates;
- visible possession delivery before Tom dribbles, shields, passes, crosses,
  clears, or shoots in an attacking scene;
- shot direction and own-goal-end rejection;
- phone-size path contrast;
- player-body overlap / hidden receiver rejection;
- blocked helpful pass rejection;
- active teammate and opponent movement;
- choice preview/consequence alignment.

## Coach-level remediation batch — 2026-07-18

The upgraded audit initially rejected seven cases that the old 100-point
system incorrectly allowed. The scoring system now caps any case with a named
skill contradiction below the required score.

| Scenario | Finding | Repair | Status |
|---|---|---|---|
| DM-01 | Tom chased instead of screening the striker lane. | Authored a new 7v7 screen: striker checks, Tom occupies the lane, central pass is blocked and cleared wide. | Approved after phone visual review |
| DM-26 | The tackle had no visible heavy-touch trigger. | Added controlled jockey, exposed touch, timed ball win, and safe outlet. | Coach-verified |
| FB-12 | “Cutback” traveled forward into the box. | Tom now reaches the end line and passes backward to a late runner. | Coach-verified |
| TW-05 | “Recycle and switch” only recycled backward. | Ball now returns to support and then crosses into the weak-side lane. | Coach-verified |
| AM-09 | Weak-side pocket stayed in the same lane. | Tom moves away from the marker into the opposite half-space before receiving. | Coach-verified |
| CB-07 | Open-fullback pass stayed too central. | Center back scans and passes diagonally to a clearly wide fullback. | Coach-verified |
| GK-02 | Sweeper-keeper scene was misclassified as distribution. | Core goalkeeper skills are now assigned explicitly; GK-02 is G05 Sweep. | Coach-verified |

### New hard coaching gates

- `A15`: a switch must move the ball at least 18 normalized units into a
  clearly different lane;
- `A20`: a cutback must begin near the end line and travel at least five units
  backward;
- `D05`: a screen must finish within six units of the actual passing lane;
- `D11`: Tom must defend without kicking while at least two teammates recover;
- `D20`: a tackle must follow a visible exposed touch;
- `G03`: a parry must leave the central rebound corridor;
- `G09`: goalkeeper distribution must start a forward attack.

These are gates, not approval. The individual review rows above are the source
of truth for tactical approval.

## Similarity and realism remediation batch — 2026-07-18 (second pass)

A quantized visual audit (`npm run audit:similarity`) compared what the child
actually watches — Tom's route plus every ball flight — across all scenes in
each role pack, plus token-level narration overlap. It found 66 high-similarity
pairs, seven groups of scenes whose choice animations were exactly identical
(CM-06/27, STR-12/18, STR-17/29, CM-16/28, GK-12/14, GK-15/19/29, GK-16/18),
and template intro text repeated inside packs.

Repairs, each reviewed individually:

- **Hand-written scene text.** 100+ expansion scenes received individually
  written triggers and good/poor consequences in
  `src/lessons/sceneOverrides.ts`, replacing rotating template sentences.
- **Individually authored animations.** 21 scenes now have bespoke good and
  poor timelines (STR-12/17/18/29, CM-16/27/28, AM-30, DM-19/23, CB-22,
  FB-25, GK-12/15/16/18/19/22/23/27/29) that prove their named skill
  distinctly. These bypass the generic option-intent rewriter.
- **Tactical corrections.**
  - GK-22/GK-23 set-piece organization previously gave the set piece to
    Blue; a keeper organizes a wall or line when **Red** has the kick. Both
    triggers now start from a red free kick, and GK-23 was retitled from
    "Build the Corner-Kick Wall" (walls are not built for corners) to
    "Set the Wall for a Central Free Kick".
  - GK-15/GK-29 teach back-pass play; the ball now visibly starts with the
    blue defender who plays it back, and Tom plays it with his feet only —
    the old template caught a back pass with his hands, which is illegal.
  - STR-12 teaches the dummy; Tom now visibly lets the ball run through to
    the teammate behind instead of touching it.
  - FB-25 recovers after an attacking corner; Tom now starts high up the
    pitch and sprints the inside recovery diagonal.
- **Regression gate.** `tests/similarity.test.ts` fails the build if two
  scenes in one pack ever collapse to the same quantized visual play again,
  or if any intro or consequence text is cloned verbatim.

After the batch: 0 identical animation groups, 0 cloned intros, and one
remaining 0.64-similarity pair (WNG-13/WNG-29 — both wall-pass scenes with
distinct triggers, text, and endpoints), with all named-skill, possession,
tactical, spatial, and 100-point quality gates passing.

## Narration completion pass — 2026-07-19 (third pass)

The second pass rewrote the 102 scenes flagged by the similarity audit, which
left 80 expansion scenes whose animations passed every gate but whose
narration still came from the rotating sentence templates. This pass
hand-wrote the trigger and both consequence lines for all 80 (listed in the
"second pass" sections of `src/lessons/sceneOverrides.ts`), so every one of
the 250 scenes now has individually written, scene-specific text.

Verification after the pass: template-intro count 0/250; skill-id map
byte-identical to the pre-pass baseline (six trigger sentences were reworded
during review because a first draft collided with a duty-family or skill
keyword); all named-skill, spatial, tactical, possession, and 100-point
quality gates green with a curriculum average of 100; similarity audit
unchanged (0 identical animation groups, 0 cloned narrations, one accepted
0.64 pair WNG-13/WNG-29).

## Full curriculum coach-contract ledger — 2026-07-18

`Coach-verified` means the story title and primary skill were checked one by one, and the actual normalized timeline passed the named-skill, possession, direction, open-lane, moving-opponent, distinct-option, consequence, and 390px phone gates. It does not claim independent licensed-coach certification.

Final engineering evidence: 43/43 Vitest curriculum tests, production build,
format check, empty full-scene audit failure list, and 36/36 Playwright tests
on desktop Chromium, iPhone Chromium, and iPhone WebKit.

| ID | Role | Story | Skill | Score | Status |
|---|---|---|---:|---:|---|
| WNG-01 | Winger | Stay Wide | A08 | 100/100 | Coach-verified |
| WNG-02 | Winger | Read the Fullback | A12 | 100/100 | Coach-verified |
| WNG-03 | Winger | Cross Early | A19 | 100/100 | Coach-verified |
| WNG-04 | Winger | End-Line Cutback | A20 | 100/100 | Coach-verified |
| WNG-05 | Winger | Back-Post Run | A21 | 100/100 | Coach-verified |
| WNG-06 | Winger | Short or Behind | A02 | 100/100 | Coach-verified |
| WNG-07 | Winger | Track the Overlap | D06 | 100/100 | Coach-verified |
| WNG-08 | Winger | Counter With Width | T01 | 100/100 | Coach-verified |
| STR-01 | Striker | Near or Far Post | A22 | 100/100 | Coach-verified |
| STR-02 | Striker | Check to the Ball | A02 | 100/100 | Coach-verified |
| STR-03 | Striker | Run Behind | A09 | 100/100 | Coach-verified |
| STR-04 | Striker | Hold It Up | A10 | 100/100 | Coach-verified |
| STR-05 | Striker | Shoot or Square | A23 | 100/100 | Coach-verified |
| STR-06 | Striker | Follow the Rebound | A24 | 100/100 | Coach-verified |
| STR-07 | Striker | Curve the Press | D02 | 100/100 | Coach-verified |
| STR-08 | Striker | Stay Onside | A09 | 100/100 | Coach-verified |
| CM-01 | Central midfielder | Scan First | A01 | 100/100 | Coach-verified |
| CM-02 | Central midfielder | Turn or Play Back | A03 | 100/100 | Coach-verified |
| CM-03 | Central midfielder | Switch the Play | A15 | 100/100 | Coach-verified |
| CM-04 | Central midfielder | Support Behind | A07 | 100/100 | Coach-verified |
| CM-05 | Central midfielder | Third-Player Run | A14 | 100/100 | Coach-verified |
| CM-06 | Central midfielder | Control the Tempo | A16 | 100/100 | Coach-verified |
| CM-07 | Central midfielder | Cover the Fullback | D03 | 100/100 | Coach-verified |
| CM-08 | Central midfielder | Arrive Late | A22 | 100/100 | Coach-verified |
| FB-01 | Fullback | Show Outside | D08 | 100/100 | Coach-verified |
| FB-02 | Fullback | Stop the Cross | D09 | 100/100 | Coach-verified |
| FB-03 | Fullback | Overlap | A17 | 100/100 | Coach-verified |
| FB-04 | Fullback | Underlap | A18 | 100/100 | Coach-verified |
| FB-05 | Fullback | Know When to Hold | T04 | 100/100 | Coach-verified |
| FB-06 | Fullback | Recover Inside | T02 | 100/100 | Coach-verified |
| CB-01 | Center defender | Stay Goal-Side | D07 | 100/100 | Coach-verified |
| CB-02 | Center defender | Step or Drop | D13 | 100/100 | Coach-verified |
| CB-03 | Center defender | Cover the Partner | D03 | 100/100 | Coach-verified |
| CB-04 | Center defender | Clear the Danger | D19 | 100/100 | Coach-verified |
| CB-05 | Center defender | Track the Cross | D16 | 100/100 | Coach-verified |
| CB-06 | Center defender | Hold the Line | D12 | 100/100 | Coach-verified |
| GK-01 | Goalkeeper | Set the Angle | G01 | 100/100 | Coach-verified |
| GK-02 | Goalkeeper | Sweep the Through Ball | G05 | 100/100 | Coach-verified |
| GK-03 | Goalkeeper | Parry Safely | G03 | 100/100 | Coach-verified |
| GK-04 | Goalkeeper | Open-Side Distribution | G09 | 100/100 | Coach-verified |
| TW-01 | Teamwork | Share the Space | A05 | 100/100 | Coach-verified |
| TW-02 | Teamwork | Support Triangle | A06 | 100/100 | Coach-verified |
| TW-03 | Teamwork | Wall Pass | A13 | 100/100 | Coach-verified |
| TW-04 | Teamwork | Third-Player Team Run | A14 | 100/100 | Coach-verified |
| TW-05 | Teamwork | Team Switch | A15 | 100/100 | Coach-verified |
| TW-06 | Teamwork | Attack a 2v1 | A11 | 100/100 | Coach-verified |
| TW-07 | Teamwork | Defend a 2v1 | D11 | 100/100 | Coach-verified |
| TW-08 | Teamwork | Pressure Cover Balance | D04 | 100/100 | Coach-verified |
| TW-09 | Teamwork | Three-Lane Counter | T01 | 100/100 | Coach-verified |
| TW-10 | Teamwork | Protect the Lead | T05 | 100/100 | Coach-verified |
| AM-01 | Attacking midfielder | Find the Pocket | A02 | 100/100 | Coach-verified |
| AM-02 | Attacking midfielder | Turn Between Lines | A03 | 100/100 | Coach-verified |
| AM-03 | Attacking midfielder | Play the Runner | A26 | 100/100 | Coach-verified |
| AM-04 | Attacking midfielder | One-Two Near Goal | A13 | 100/100 | Coach-verified |
| AM-05 | Attacking midfielder | Edge of the Box | A23 | 100/100 | Coach-verified |
| AM-06 | Attacking midfielder | Win It Back | T03 | 100/100 | Coach-verified |
| DM-01 | Defensive midfielder | Screen the Striker | D05 | 100/100 | Coach-verified |
| DM-02 | Defensive midfielder | Escape the Press | A03 | 100/100 | Coach-verified |
| DM-03 | Defensive midfielder | Cover Inside | D03 | 100/100 | Coach-verified |
| DM-04 | Defensive midfielder | Track the Runner | D06 | 100/100 | Coach-verified |
| DM-05 | Defensive midfielder | Break the Line | A26 | 100/100 | Coach-verified |
| DM-06 | Defensive midfielder | Delay the Counter | D11 | 100/100 | Coach-verified |
| GK-05 | Goalkeeper | Organize the Corner | G10 | 100/100 | Coach-verified |
| GK-06 | Goalkeeper | Claim the Cross | G07 | 100/100 | Coach-verified |
| GK-07 | Goalkeeper | Make the Second Save | G11 | 100/100 | Coach-verified |
| WNG-09 | Winger | First Touch Down Line | A04 | 100/100 | Coach-verified |
| WNG-10 | Winger | Receive on the Back Foot | A03 | 100/100 | Coach-verified |
| WNG-11 | Winger | Protect Near Touchline | A10 | 100/100 | Coach-verified |
| WNG-12 | Winger | Use the Overlap Decoy | A05 | 100/100 | Coach-verified |
| WNG-13 | Winger | Combine With an Underlap | A13 | 100/100 | Coach-verified |
| WNG-14 | Winger | Cross Low Behind Defense | A19 | 100/100 | Coach-verified |
| WNG-15 | Winger | Clip the Far-Post Cross | A19 | 100/100 | Coach-verified |
| WNG-16 | Winger | Delay Until Support Arrives | A06 | 100/100 | Coach-verified |
| WNG-17 | Winger | Attack an Isolated Center Back | A12 | 100/100 | Coach-verified |
| WNG-18 | Winger | Rotate With Number Ten | A05 | 100/100 | Coach-verified |
| WNG-19 | Winger | Change Wings After Recycle | A15 | 100/100 | Coach-verified |
| WNG-20 | Winger | Press the Opposing Fullback | D01 | 100/100 | Coach-verified |
| WNG-21 | Winger | Block the Clearance Lane | D05 | 100/100 | Coach-verified |
| WNG-22 | Winger | Defend the Back Post | D16 | 100/100 | Coach-verified |
| WNG-23 | Winger | Recover Through the Inside Lane | T02 | 100/100 | Coach-verified |
| WNG-24 | Winger | Become the Corner-Kick Outlet | A06 | 100/100 | Coach-verified |
| WNG-25 | Winger | Carry the Counter to Commit | T01 | 100/100 | Coach-verified |
| WNG-26 | Winger | Release the Overlapping Fullback | A17 | 100/100 | Coach-verified |
| WNG-27 | Winger | Protect a Lead by the Corner | T05 | 100/100 | Coach-verified |
| WNG-28 | Winger | Attack a Tired Defender | A12 | 100/100 | Coach-verified |
| WNG-29 | Winger | Escape a Double Team | A12 | 100/100 | Coach-verified |
| WNG-30 | Winger | Win and Use the Throw-In | A06 | 100/100 | Coach-verified |
| STR-09 | Striker | Move on the Blind Side | A09 | 100/100 | Coach-verified |
| STR-10 | Striker | Pin the Center Defender | A27 | 100/100 | Coach-verified |
| STR-11 | Striker | Spin Off the Shoulder | A09 | 100/100 | Coach-verified |
| STR-12 | Striker | Dummy the Near-Post Cross | A05 | 100/100 | Coach-verified |
| STR-13 | Striker | Finish the Pullback | A22 | 100/100 | Coach-verified |
| STR-14 | Striker | Choose One Touch or Control | A04 | 100/100 | Coach-verified |
| STR-15 | Striker | Chip the Rushing Goalkeeper | A23 | 100/100 | Coach-verified |
| STR-16 | Striker | Finish With the Weak Foot | A22 | 100/100 | Coach-verified |
| STR-17 | Striker | Time the Header | A22 | 100/100 | Coach-verified |
| STR-18 | Striker | Attack the Cutback Zone | A22 | 100/100 | Coach-verified |
| STR-19 | Striker | Clear Space for a Teammate | A05 | 100/100 | Coach-verified |
| STR-20 | Striker | Drag a Center Back Wide | A05 | 100/100 | Coach-verified |
| STR-21 | Striker | Bounce Pass Under Contact | A13 | 100/100 | Coach-verified |
| STR-22 | Striker | Shield and Win the Foul | A10 | 100/100 | Coach-verified |
| STR-23 | Striker | Press the Goalkeeper | D01 | 100/100 | Coach-verified |
| STR-24 | Striker | Jump on a Back-Pass Trigger | D01 | 100/100 | Coach-verified |
| STR-25 | Striker | Screen the Holding Midfielder | D05 | 100/100 | Coach-verified |
| STR-26 | Striker | Defend the Near Post at a Corner | D15 | 100/100 | Coach-verified |
| STR-27 | Striker | Become the Counterattack Outlet | A06 | 100/100 | Coach-verified |
| STR-28 | Striker | Secure a Direct Clearance | A10 | 100/100 | Coach-verified |
| STR-29 | Striker | Attack the Second Cross | A22 | 100/100 | Coach-verified |
| STR-30 | Striker | React to a Loose Box Ball | A24 | 100/100 | Coach-verified |
| CM-09 | Central midfielder | Receive Behind the First Press | A02 | 100/100 | Coach-verified |
| CM-10 | Central midfielder | Carry Through an Open Midfield | A11 | 100/100 | Coach-verified |
| CM-11 | Central midfielder | Draw Pressure Before Passing | A11 | 100/100 | Coach-verified |
| CM-12 | Central midfielder | Play Around the Corner | A13 | 100/100 | Coach-verified |
| CM-13 | Central midfielder | Find the Opposite Fullback | A15 | 100/100 | Coach-verified |
| CM-14 | Central midfielder | Recycle Through the Center Back | A07 | 100/100 | Coach-verified |
| CM-15 | Central midfielder | Change the Passing Angle | A05 | 100/100 | Coach-verified |
| CM-16 | Central midfielder | Support a Wide Overload | A06 | 100/100 | Coach-verified |
| CM-17 | Central midfielder | Balance an Attacking Triangle | A06 | 100/100 | Coach-verified |
| CM-18 | Central midfielder | Play Into the Striker Feet | A26 | 100/100 | Coach-verified |
| CM-19 | Central midfielder | Follow the Pass Into Space | A09 | 100/100 | Coach-verified |
| CM-20 | Central midfielder | Disguise the Forward Pass | A25 | 100/100 | Coach-verified |
| CM-21 | Central midfielder | Protect the Center After Turnover | T04 | 100/100 | Coach-verified |
| CM-22 | Central midfielder | Track an Opposing Number Eight | D06 | 100/100 | Coach-verified |
| CM-23 | Central midfielder | Double the Wide Ball | D03 | 100/100 | Coach-verified |
| CM-24 | Central midfielder | Collect the Second Ball | D18 | 100/100 | Coach-verified |
| CM-25 | Central midfielder | Stop the Cutback Runner | D17 | 100/100 | Coach-verified |
| CM-26 | Central midfielder | Screen the Counter Pass | D05 | 100/100 | Coach-verified |
| CM-27 | Central midfielder | Manage the Final Minute | T05 | 100/100 | Coach-verified |
| CM-28 | Central midfielder | Speed Up Against a Backpedaling Line | A16 | 100/100 | Coach-verified |
| CM-29 | Central midfielder | Offer Behind a Trapped Winger | A02 | 100/100 | Coach-verified |
| CM-30 | Central midfielder | Arrive for the Recycled Cross | A22 | 100/100 | Coach-verified |
| AM-07 | Attacking midfielder | Receive on the Half Turn | A03 | 100/100 | Coach-verified |
| AM-08 | Attacking midfielder | Drift Away From the Holding Midfielder | A02 | 100/100 | Coach-verified |
| AM-09 | Attacking midfielder | Find the Weak-Side Pocket | A15 | 100/100 | Coach-verified |
| AM-10 | Attacking midfielder | Slip a Reverse Pass | A25 | 100/100 | Coach-verified |
| AM-11 | Attacking midfielder | Play the Wide Runner Through | A26 | 100/100 | Coach-verified |
| AM-12 | Attacking midfielder | Disguise the Striker Pass | A25 | 100/100 | Coach-verified |
| AM-13 | Attacking midfielder | Carry at the Back Four | A11 | 100/100 | Coach-verified |
| AM-14 | Attacking midfielder | Commit a Defender Then Release | A11 | 100/100 | Coach-verified |
| AM-15 | Attacking midfielder | Create the Box Overload | A05 | 100/100 | Coach-verified |
| AM-16 | Attacking midfielder | Attack the Penalty Spot Late | A22 | 100/100 | Coach-verified |
| AM-17 | Attacking midfielder | Combine With the Overlap | A17 | 100/100 | Coach-verified |
| AM-18 | Attacking midfielder | Use the Underlapping Runner | A18 | 100/100 | Coach-verified |
| AM-19 | Attacking midfielder | Recycle a Blocked Attack | A07 | 100/100 | Coach-verified |
| AM-20 | Attacking midfielder | Shoot After a Layoff | A23 | 100/100 | Coach-verified |
| AM-21 | Attacking midfielder | Follow a Saved Shot | A24 | 100/100 | Coach-verified |
| AM-22 | Attacking midfielder | Press the Opponent Pivot | D01 | 100/100 | Coach-verified |
| AM-23 | Attacking midfielder | Trap the Fullback After Turnover | T03 | 100/100 | Coach-verified |
| AM-24 | Attacking midfielder | Recover Goal-Side of Number Six | T02 | 100/100 | Coach-verified |
| AM-25 | Attacking midfielder | Block the First Counter Pass | D05 | 100/100 | Coach-verified |
| AM-26 | Attacking midfielder | Compete for the Second Ball | D18 | 100/100 | Coach-verified |
| AM-27 | Attacking midfielder | Protect Possession Near the Box | A10 | 100/100 | Coach-verified |
| AM-28 | Attacking midfielder | Draw a Foul Between Lines | A10 | 100/100 | Coach-verified |
| AM-29 | Attacking midfielder | Switch to the Opposite Winger | A15 | 100/100 | Coach-verified |
| AM-30 | Attacking midfielder | Create Space With a Decoy Run | A05 | 100/100 | Coach-verified |
| DM-07 | Defensive midfielder | Drop Between Center Backs | A07 | 100/100 | Coach-verified |
| DM-08 | Defensive midfielder | Show for the Goalkeeper | A06 | 100/100 | Coach-verified |
| DM-09 | Defensive midfielder | Turn Away From the First Presser | A04 | 100/100 | Coach-verified |
| DM-10 | Defensive midfielder | Switch From the Base | A15 | 100/100 | Coach-verified |
| DM-11 | Defensive midfielder | Break Pressure With a Bounce Pass | A13 | 100/100 | Coach-verified |
| DM-12 | Defensive midfielder | Carry Into the Free Lane | A11 | 100/100 | Coach-verified |
| DM-13 | Defensive midfielder | Hold Position During Both Overlaps | T04 | 100/100 | Coach-verified |
| DM-14 | Defensive midfielder | Cover the Center Back Who Steps | D03 | 100/100 | Coach-verified |
| DM-15 | Defensive midfielder | Screen the Number Ten | D05 | 100/100 | Coach-verified |
| DM-16 | Defensive midfielder | Close the Top of the Box | D10 | 100/100 | Coach-verified |
| DM-17 | Defensive midfielder | Protect the Cutback Zone | D17 | 100/100 | Coach-verified |
| DM-18 | Defensive midfielder | Win the Second Ball | D18 | 100/100 | Coach-verified |
| DM-19 | Defensive midfielder | Track the Late Midfield Runner | D06 | 100/100 | Coach-verified |
| DM-20 | Defensive midfielder | Shift Behind the Press | D03 | 100/100 | Coach-verified |
| DM-21 | Defensive midfielder | Cover the Opposite Half-Space | D04 | 100/100 | Coach-verified |
| DM-22 | Defensive midfielder | Delay a Wide Counter | D11 | 100/100 | Coach-verified |
| DM-23 | Defensive midfielder | Stop the Central Counter | D11 | 100/100 | Coach-verified |
| DM-24 | Defensive midfielder | Defend the Box Edge | D10 | 100/100 | Coach-verified |
| DM-25 | Defensive midfielder | Organize the Midfield Line | D12 | 100/100 | Coach-verified |
| DM-26 | Defensive midfielder | Choose When to Tackle | D20 | 100/100 | Coach-verified |
| DM-27 | Defensive midfielder | Recycle While Protecting a Lead | T05 | 100/100 | Coach-verified |
| DM-28 | Defensive midfielder | Find the Advanced Eight | A26 | 100/100 | Coach-verified |
| DM-29 | Defensive midfielder | Support Behind a Risky Pass | A07 | 100/100 | Coach-verified |
| DM-30 | Defensive midfielder | Become the Safe Throw-In Option | A06 | 100/100 | Coach-verified |
| FB-07 | Fullback | Receive From the Goalkeeper | A03 | 100/100 | Coach-verified |
| FB-08 | Fullback | Break the First Press Wide | A04 | 100/100 | Coach-verified |
| FB-09 | Fullback | Play Inside Then Move | A13 | 100/100 | Coach-verified |
| FB-10 | Fullback | Switch Through the Back Line | A15 | 100/100 | Coach-verified |
| FB-11 | Fullback | Cross From Deep | A19 | 100/100 | Coach-verified |
| FB-12 | Fullback | Cut Back From the End Line | A20 | 100/100 | Coach-verified |
| FB-13 | Fullback | Support Without Overlapping | A06 | 100/100 | Coach-verified |
| FB-14 | Fullback | Create a Wide Two Against One | A06 | 100/100 | Coach-verified |
| FB-15 | Fullback | Invert Into Midfield | A05 | 100/100 | Coach-verified |
| FB-16 | Fullback | Recognize the Winger Rotation | A05 | 100/100 | Coach-verified |
| FB-17 | Fullback | Delay the Fast Winger | D11 | 100/100 | Coach-verified |
| FB-18 | Fullback | Stop the Inside Cut | D08 | 100/100 | Coach-verified |
| FB-19 | Fullback | Track the Overlap | D06 | 100/100 | Coach-verified |
| FB-20 | Fullback | Defend the Back-Post Cross | D16 | 100/100 | Coach-verified |
| FB-21 | Fullback | Protect the Cutback | D17 | 100/100 | Coach-verified |
| FB-22 | Fullback | Cover the Center Back | D03 | 100/100 | Coach-verified |
| FB-23 | Fullback | Win the Far-Post Header | D16 | 100/100 | Coach-verified |
| FB-24 | Fullback | Step With the Defensive Line | D12 | 100/100 | Coach-verified |
| FB-25 | Fullback | Recover After a Set Piece | T02 | 100/100 | Coach-verified |
| FB-26 | Fullback | Clear the Loose Wide Ball | D19 | 100/100 | Coach-verified |
| FB-27 | Fullback | Manage a One-Goal Lead | T05 | 100/100 | Coach-verified |
| FB-28 | Fullback | Become the Counter Outlet | T01 | 100/100 | Coach-verified |
| FB-29 | Fullback | Underlap After a Switch | A18 | 100/100 | Coach-verified |
| FB-30 | Fullback | Recycle When the Cross Is Blocked | A07 | 100/100 | Coach-verified |
| CB-07 | Center defender | Play Through the Open Fullback | A15 | 100/100 | Coach-verified |
| CB-08 | Center defender | Carry Into Midfield | A11 | 100/100 | Coach-verified |
| CB-09 | Center defender | Break a Line With a Pass | A26 | 100/100 | Coach-verified |
| CB-10 | Center defender | Switch to the Weak Side | A15 | 100/100 | Coach-verified |
| CB-11 | Center defender | Find the Defensive Midfielder | A07 | 100/100 | Coach-verified |
| CB-12 | Center defender | Use the Goalkeeper to Escape | A07 | 100/100 | Coach-verified |
| CB-13 | Center defender | Defend a Direct Long Ball | D13 | 100/100 | Coach-verified |
| CB-14 | Center defender | Win the First Header | D18 | 100/100 | Coach-verified |
| CB-15 | Center defender | Collect the Second Ball | D18 | 100/100 | Coach-verified |
| CB-16 | Center defender | Track a Channel Run | D06 | 100/100 | Coach-verified |
| CB-17 | Center defender | Pass On a Crossing Runner | D14 | 100/100 | Coach-verified |
| CB-18 | Center defender | Defend the Near-Post Cross | D15 | 100/100 | Coach-verified |
| CB-19 | Center defender | Defend the Cutback Zone | D17 | 100/100 | Coach-verified |
| CB-20 | Center defender | Block the Edge-of-Box Shot | D10 | 100/100 | Coach-verified |
| CB-21 | Center defender | Delay the Central Counter | D11 | 100/100 | Coach-verified |
| CB-22 | Center defender | Cover Behind the Fullback | D03 | 100/100 | Coach-verified |
| CB-23 | Center defender | Stay Compact With the Partner | D03 | 100/100 | Coach-verified |
| CB-24 | Center defender | Step Into an Interception | D03 | 100/100 | Coach-verified |
| CB-25 | Center defender | Drop When the Passer Looks Up | D13 | 100/100 | Coach-verified |
| CB-26 | Center defender | Clear Behind for a Corner | D19 | 100/100 | Coach-verified |
| CB-27 | Center defender | Organize the Line at a Free Kick | D12 | 100/100 | Coach-verified |
| CB-28 | Center defender | Protect Possession Under Pressure | A10 | 100/100 | Coach-verified |
| CB-29 | Center defender | Choose the Safe Throw-In | A06 | 100/100 | Coach-verified |
| CB-30 | Center defender | Manage the Last Attack | T05 | 100/100 | Coach-verified |
| GK-08 | Goalkeeper | Set for a Near-Post Shot | G01 | 100/100 | Coach-verified |
| GK-09 | Goalkeeper | Set for a Far-Post Shot | G01 | 100/100 | Coach-verified |
| GK-10 | Goalkeeper | Hold a Clean Low Shot | G02 | 100/100 | Coach-verified |
| GK-11 | Goalkeeper | Tip a High Shot Over | G03 | 100/100 | Coach-verified |
| GK-12 | Goalkeeper | Smother at the Striker Feet | G04 | 100/100 | Coach-verified |
| GK-13 | Goalkeeper | Spread in a One Against One | G06 | 100/100 | Coach-verified |
| GK-14 | Goalkeeper | Sweep Outside the Box | G05 | 100/100 | Coach-verified |
| GK-15 | Goalkeeper | Clear a Back Pass Under Pressure | G09 | 100/100 | Coach-verified |
| GK-16 | Goalkeeper | Pass Through the First Line | G09 | 100/100 | Coach-verified |
| GK-17 | Goalkeeper | Clip the Ball to the Fullback | G09 | 100/100 | Coach-verified |
| GK-18 | Goalkeeper | Throw a Fast Counterattack | G09 | 100/100 | Coach-verified |
| GK-19 | Goalkeeper | Slow Distribution to Protect a Lead | G09 | 100/100 | Coach-verified |
| GK-20 | Goalkeeper | Switch Distribution After a Press | G09 | 100/100 | Coach-verified |
| GK-21 | Goalkeeper | Call the Defensive Line Up | G10 | 100/100 | Coach-verified |
| GK-22 | Goalkeeper | Organize a Wide Free Kick | G10 | 100/100 | Coach-verified |
| GK-23 | Goalkeeper | Set the Wall for a Central Free Kick | G10 | 100/100 | Coach-verified |
| GK-24 | Goalkeeper | Claim a Near-Post Corner | G07 | 100/100 | Coach-verified |
| GK-25 | Goalkeeper | Punch Through Crowded Traffic | G08 | 100/100 | Coach-verified |
| GK-26 | Goalkeeper | Stay for an Outswinging Cross | G12 | 100/100 | Coach-verified |
| GK-27 | Goalkeeper | Come for an Inswinging Cross | G07 | 100/100 | Coach-verified |
| GK-28 | Goalkeeper | Recover to the Goal Line | G13 | 100/100 | Coach-verified |
| GK-29 | Goalkeeper | Cover the Fullback Back Pass | G09 | 100/100 | Coach-verified |
| GK-30 | Goalkeeper | Manage the Final Aerial Ball | G07 | 100/100 | Coach-verified |
