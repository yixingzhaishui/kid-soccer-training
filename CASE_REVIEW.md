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
| Approved | The seven checks above were inspected and passed. |
| Rejected | The generic case must be replaced by a role/phase-specific scene. |

## Review order

The review proceeds role by role, beginning with defensive midfielder because
the reported errors are in that pack. Each update records the exact repair and
the test that prevents regression.

### Defensive midfielder — 30 cases

| ID | Teaching action | Current status | Review evidence / repair |
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
| DM-26 | The tackle had no visible heavy-touch trigger. | Added controlled jockey, exposed touch, timed ball win, and safe outlet. | Repairing — automated gates pass |
| FB-12 | “Cutback” traveled forward into the box. | Tom now reaches the end line and passes backward to a late runner. | Repairing — automated gates pass |
| TW-05 | “Recycle and switch” only recycled backward. | Ball now returns to support and then crosses into the weak-side lane. | Repairing — automated gates pass |
| AM-09 | Weak-side pocket stayed in the same lane. | Tom moves away from the marker into the opposite half-space before receiving. | Repairing — automated gates pass |
| CB-07 | Open-fullback pass stayed too central. | Center back scans and passes diagonally to a clearly wide fullback. | Repairing — automated gates pass |
| GK-02 | Sweeper-keeper scene was misclassified as distribution. | Core goalkeeper skills are now assigned explicitly; GK-02 is G05 Sweep. | Repairing — automated gates pass |

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
