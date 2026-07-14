# Nolan Soccer Tactics Trainer — Role-Specific Animated Scenario Specification

## 1. Core rule

Each role must teach different soccer problems. Do not reuse the same scene and only rename the role.

Every scene must differ in:
- game situation
- decision
- teammate need
- mistake
- visible consequence
- field location

Each scene:
1. Plays 3–5 seconds.
2. Pauses.
3. Shows 2–3 visual choices.
4. Plays a different 3–6 second consequence for each choice.
5. Explains the result in one short sentence.
6. Allows replay and comparison.

Use cartoon players, not points.

## 2. Winger scenarios

1. Stay wide to receive.
2. Beat the fullback outside or inside depending on body position.
3. Cross early or keep dribbling.
4. Cut back from the end line instead of crossing blindly.
5. Make a back-post run when the ball is on the opposite wing.
6. Come short or run behind the defender.
7. Track the opposing fullback during defense.
8. Sprint wide during a counterattack.

## 3. Striker scenarios

1. Near-post or far-post run.
2. Check toward the ball.
3. Run behind the defensive line.
4. Hold up the ball with back to goal.
5. Shoot or pass to an open teammate.
6. React to a rebound.
7. Press a center back while blocking one passing side.
8. Time a run to stay onside.

## 4. Central midfielder scenarios

1. Scan before receiving.
2. Turn or play back depending on pressure.
3. Switch play from crowded side to open side.
4. Support behind the ball.
5. Move for the third-player pass.
6. Slow the game or play quickly.
7. Cover for an overlapping fullback.
8. Arrive late at the top of the box.

## 5. Attacking midfielder scenarios

1. Find space between midfield and defense.
2. Turn between the lines.
3. Play a through pass into a striker's run.
4. Complete a one-two near the box.
5. Shoot from the edge or recycle possession.
6. Press immediately after losing the ball.

## 6. Fullback scenarios

1. Show winger outside.
2. Close down early to stop a cross.
3. Overlap outside the winger.
4. Underlap into the inside channel.
5. Recognize when not to go forward.
6. Recover after losing the ball.
7. Track the far-post attacker on an opposite-side cross.

## 7. Center defender scenarios

1. Stay goal-side of the striker.
2. Step or drop depending on pressure on the ball.
3. Cover a partner who steps forward.
4. Clear or pass depending on danger.
5. Track a striker during a cross.
6. Play out through an open fullback.
7. Hold the defensive line together.

## 8. Goalkeeper scenarios

1. Set the angle before a shot.
2. Come for a through ball.
3. Catch or parry safely.
4. Distribute to the open side.
5. Organize an unmarked attacker at a corner.
6. Stay or come for a cross.
7. Recover a rebound.

## 9. Teamwork scenarios

1. Avoid two teammates using the same space.
2. Form a support triangle.
3. Wall pass.
4. Third-player run.
5. Switch away from a crowded side.
6. Attack a 2v1.
7. Defend a 2v1.
8. Pressure, cover, and balance.
9. Counterattack with width.
10. Keep possession while protecting a lead.

## 10. Diversity requirements

For each role:
- no more than two scenes may teach the same main idea
- no cloned layouts with changed labels
- every scene must have a different game trigger
- every scene must have a different failure consequence
- at least one attack scene
- at least one defense scene
- at least one transition scene
- at least one teamwork scene
- at least one scene with two acceptable choices

Do not reuse “defender takes the ball” as the standard failure result.

## 11. First release

Implement 50 polished animated scenes:
- 8 winger
- 8 striker
- 8 central midfielder
- 6 fullback
- 6 center defender
- 4 goalkeeper
- 10 teamwork

Before coding, Codex must create a scenario inventory table with:
- scenario ID
- role
- game trigger
- main decision
- good consequence
- poor consequence
- animation assets needed

Reject duplicate concepts before implementation.
