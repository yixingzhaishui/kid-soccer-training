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
| DM-01 | Screen the striker | Pending | Verify screen blocks ball-to-striker lane without chasing carrier. |
| DM-02 | Escape the press | Pending | Verify open body/pass lane and not a blind turn. |
| DM-03 | Cover inside | Pending | Verify Tom covers partner and center, not the ball. |
| DM-04 | Track the runner | Pending | Verify goal-side tracking and return-pass denial. |
| DM-05 | Break the line | Pending | Verify forward pass reaches a teammate, not a defender. |
| DM-06 | Delay the counter | Repairing | Rebuilt as jockey + recovery; needs final individual visual sign-off. |
| DM-07 | Drop between center backs | Repairing | Rebuild required: controlled build angle, then forward progression. |
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
| DM-26 | Choose when to tackle | Pending | Verify tackle occurs only after exposed touch. |
| DM-27 | Recycle while protecting lead | Pending | Verify safe possession and no blind forward pass. |
| DM-28 | Find advanced eight | Pending | Verify forward receiver is open and facing play. |
| DM-29 | Support behind risky pass | Pending | Verify reset angle remains available. |
| DM-30 | Safe throw-in option | Pending | Verify visible support and secure next pass. |

## Automated evidence currently required for every case

- full 7v7 player count and in-bounds normalized coordinates;
- shot direction and own-goal-end rejection;
- phone-size path contrast;
- player-body overlap / hidden receiver rejection;
- blocked helpful pass rejection;
- active teammate and opponent movement;
- choice preview/consequence alignment.

These are gates, not approval. The individual review rows above are the source
of truth for tactical approval.
