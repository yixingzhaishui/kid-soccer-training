
# Nolan Soccer Tactics Trainer — Animation-First Specification

## 1. Core Idea

This app should feel like a short cartoon soccer game, not a tactics board.

Nolan should see:
- real cartoon players with bodies, faces, jerseys, and movement
- the ball moving between players
- teammates and opponents running
- a short game situation lasting several seconds
- two or three choices
- the result of each choice played out as an animation

The app must not teach mainly with dots, arrows, polygons, abstract zones, or tactical terminology.

The app teaches by showing:

1. What is happening
2. What Nolan can choose
3. What happens after each choice
4. Why one choice helps the team more

---

## 2. Scene Format

Each lesson is a short animated scene lasting about 8–15 seconds.

### Scene Structure

#### Part A: Watch

The scene plays automatically for 3–5 seconds.

Example:
- Nolan is playing left wing.
- His teammate dribbles in the middle.
- One defender follows the teammate.
- Another defender watches Nolan.
- Open space appears near the left sideline.

Narration:
- “Watch the game.”

#### Part B: Pause and Choose

The animation pauses.

Nolan sees 2–3 large choices with pictures.

Example:
- Stay wide
- Run to the ball
- Run beside the striker

The choices should be represented with:
- a small animation preview
- a simple icon
- 2–4 words maximum
- spoken audio

#### Part C: Play the Result

After Nolan chooses, the full result plays for 3–6 seconds.

Example for “Stay wide”:
- Nolan stays wide.
- The defender moves toward the ball.
- Nolan becomes open.
- His teammate passes to Nolan.
- Nolan receives the ball and runs toward goal.

Example for “Run to the ball”:
- Nolan runs into the middle.
- He stands next to his teammate.
- Two defenders close both players.
- The passing lane disappears.
- The teammate loses the ball.

#### Part D: Explain

The animation freezes at the important moment.

Narration:
- “Good. You stayed wide, so your teammate could pass to you.”

Or:
- “You went too close. Now both defenders can stop you.”

Then Nolan can:
- try another choice
- replay the scene
- continue

---

## 3. Player Design

Do not use circles as the primary representation.

Use simple cartoon people:
- head
- torso
- arms
- legs
- jersey
- shorts
- shoes
- visible running animation

Nolan should be easy to identify:
- blue jersey
- yellow outline
- name “Nolan”
- optional simple face
- small glow when it is his turn

Other players:
- blue teammates
- red opponents
- goalkeeper with different shirt
- visible numbers or role labels when useful

Players should:
- run
- turn
- stop
- pass
- shoot
- defend
- celebrate
- show simple reactions

Simple sprite animation or SVG body animation is acceptable.

---

## 4. Camera and Field View

Use a slightly angled top-down view, similar to a simple children’s soccer video game.

The field should show:
- grass
- sidelines
- penalty box
- goals
- players with visible bodies
- ball shadows
- movement trails only when necessary

Avoid making the field too tactical or diagram-like.

The camera may:
- follow the ball
- zoom slightly toward the important action
- freeze at the decision moment
- replay the result from the same view

---

## 5. Choice Preview

Before Nolan selects, each choice should show a tiny 1–2 second preview.

Example:

### Choice 1: Stay Wide
Preview:
- Nolan moves toward the sideline.

### Choice 2: Go to Ball
Preview:
- Nolan runs beside the teammate with the ball.

### Choice 3: Run Forward
Preview:
- Nolan runs behind the defender.

The preview must not reveal whether the choice is correct.

---

## 6. Show Consequences, Not Only Correctness

Every choice needs a visible result.

Do not only show:
- Correct
- Wrong
- Green zone
- Red zone

Instead, show what happens in the game.

Examples:

### Good choice result
- teammate can pass
- Nolan gets the ball
- team moves forward
- shot becomes possible
- defender is pulled away
- goalkeeper is protected

### Poor choice result
- passing lane closes
- two teammates crowd each other
- defender intercepts
- Nolan is too far away to help
- opponent attacks open space
- goalkeeper is left alone
- Nolan loses the ball

The learning comes from seeing the consequence.

---

## 7. Example Animated Scenarios

## Scenario 1: Stay Wide as a Winger

### Watch
- Teammate dribbles through the middle.
- Nolan starts on the left side.
- Defender follows the ball.

### Choices
1. Stay wide
2. Run to the ball
3. Run behind the teammate

### Result: Stay wide
- Defender moves inward.
- Nolan becomes open.
- Teammate passes left.
- Nolan receives and runs forward.

Narration:
- “Great. You stayed wide and became open.”

### Result: Run to the ball
- Nolan runs beside the teammate.
- Two blue players stand close together.
- One defender blocks both.
- Teammate cannot pass.
- Ball is lost.

Narration:
- “Too close. The defender can stop both of you.”

### Result: Run behind teammate
- Nolan hides behind the teammate.
- Passing lane is blocked.
- Play slows down.

Narration:
- “Your teammate cannot see you there.”

---

## Scenario 2: Pass or Dribble

### Watch
- Nolan receives the ball near midfield.
- One defender moves toward him.
- A teammate is open on the right.
- Open space is also ahead.

### Choices
1. Pass right
2. Dribble forward
3. Stop and wait

### Result: Pass right
- Nolan passes.
- Defender follows the ball.
- Teammate receives safely.
- Team keeps possession.

Narration:
- “Good pass. Your teammate was open.”

### Result: Dribble forward
- Nolan moves into space.
- Defender turns and chases.
- Nolan keeps control.
- Team moves forward.

Narration:
- “Good. The road was open.”

### Result: Stop and wait
- Defender reaches Nolan.
- Nolan is trapped.
- Ball is taken.

Narration:
- “Waiting gave the defender time.”

This scenario should teach that more than one choice can be good.

---

## Scenario 3: Run Back to Help

### Watch
- Nolan’s team loses the ball.
- Opponent starts running toward Nolan’s goal.
- Nolan is still high on the left.

### Choices
1. Run back
2. Stay near the other goal
3. Walk slowly

### Result: Run back
- Nolan sprints back.
- He covers the left side.
- Opponent cannot make an easy pass.
- Defender gets time to recover.

Narration:
- “Great. You came back and helped your team.”

### Result: Stay high
- Opponent attacks with one extra player.
- Nolan’s defender is outnumbered.
- Opponent shoots.

Narration:
- “Your team needed help behind you.”

### Result: Walk slowly
- Nolan arrives too late.
- Opponent reaches the goal area.

Narration:
- “Move quickly when your team loses the ball.”

---

## Scenario 4: Help the Goalkeeper

### Watch
- Opponent has the ball near the side.
- Another opponent waits in front of goal.
- Nolan runs back.

### Choices
1. Mark the open player
2. Stand beside goalkeeper
3. Chase the ball

### Result: Mark player
- Nolan stands between the open opponent and goal.
- Pass is blocked.
- Opponent must turn away.

Narration:
- “Great. You stopped the easy pass.”

### Result: Stand beside goalkeeper
- Nolan leaves the attacker open.
- Opponent passes across goal.
- Open player shoots.

Narration:
- “The goalie already protects the goal. Watch the open player.”

### Result: Chase ball
- Nolan joins another defender near the ball.
- The middle is empty.
- Opponent passes into the middle.

Narration:
- “Two players chased the ball. The middle became open.”

---

## Scenario 5: Pass and Move

### Watch
- Nolan has the ball.
- Teammate is in front.
- Defender blocks Nolan’s path.

### Choices
1. Pass and run
2. Pass and stop
3. Dribble into defender

### Result: Pass and run
- Nolan passes.
- He runs into open space.
- Teammate passes back.
- Nolan receives behind the defender.

Narration:
- “Excellent. You passed and moved.”

### Result: Pass and stop
- Nolan stays still.
- Defender watches him.
- Teammate has no return pass.

Narration:
- “After you pass, find a new space.”

### Result: Dribble into defender
- Defender takes the ball.

Narration:
- “The road was blocked.”

---

## Scenario 6: Striker Movement

### Watch
- Midfielder has the ball.
- Nolan plays striker.
- Defender stands close behind Nolan.

### Choices
1. Move toward the ball
2. Run behind defender
3. Stand still

### Result: Move toward ball
- Nolan checks toward the midfielder.
- Defender follows.
- Nolan receives safely.
- Winger runs into the space behind.

Narration:
- “Good. You came to help your teammate.”

### Result: Run behind
- Nolan runs behind the defender.
- Midfielder passes into space.
- Nolan reaches the ball near goal.

Narration:
- “Great run. You found space behind.”

### Result: Stand still
- Defender stays close.
- Nolan remains covered.
- Midfielder cannot pass.

Narration:
- “Move away from the defender.”

---

## Scenario 7: Midfielder Helping Both Sides

### Watch
- Left defender has the ball.
- Right side is open.
- Nolan is central midfielder.

### Choices
1. Move into the middle
2. Stand next to left defender
3. Run all the way forward

### Result: Move middle
- Nolan becomes a passing option.
- Defender passes to Nolan.
- Nolan turns and passes right.

Narration:
- “Great. You helped move the ball to the open side.”

### Result: Stand beside defender
- Both players are crowded.
- Opponent presses.
- Passing options disappear.

Narration:
- “Give your teammate more space.”

### Result: Run forward
- Defender has no nearby help.
- Opponent pressures and wins the ball.

Narration:
- “The defender needed someone close enough to help.”

---

## 8. Multiple Good Choices

Some scenes must include more than one good answer.

The app should explain the difference.

Example:
- Pass = safe choice
- Dribble = brave and useful choice
- Shoot = risky choice

Feedback:
- “That works.”
- “That was the safest choice.”
- “That was the best chance to attack.”
- “That choice was risky because the defender was close.”

Do not force one answer when two choices are reasonable.

---

## 9. Replay Comparison

After Nolan tries one choice, show a comparison screen.

Example layout:
- left side: “Your choice”
- right side: “Another choice”

Both animations play one after the other or side by side.

Example:
- Nolan runs to the ball
- Nolan stays wide

Then narrator says:
- “See the difference? Staying wide gives your teammate more space.”

This comparison mode is important for learning.

---

## 10. Lesson Progression

Each concept should use three stages.

### Stage 1: Watch and choose
The scene pauses and offers choices.

### Stage 2: Predict the result
Ask:
- “What will happen next?”

Nolan chooses:
- Teammate can pass
- Defender wins the ball
- Nolan becomes open

### Stage 3: Play without pause
The scene runs more naturally.
Nolan must choose within several seconds.

No harsh timer is needed for beginners.

---

## 11. Interaction Types

Use simple interactions:

- tap a choice card
- tap a teammate to pass
- tap open space to run
- tap the goal to shoot
- tap an opponent to mark
- tap replay
- tap “show another choice”

Avoid:
- precise dragging
- small touch targets
- complicated menus
- abstract arrows as the main teaching method

---

## 12. Animation Engine Requirements

Use:
- React
- TypeScript
- SVG or lightweight 2D sprites
- Framer Motion or CSS animation
- scene timeline system

Each scene should define:
- player starting positions
- movement path
- ball path
- camera behavior
- pause time
- available choices
- result animation for each choice
- narration
- final freeze frame
- explanation

Example data structure:

```ts
type AnimatedActor = {
  id: string;
  role: string;
  team: "blue" | "red";
  start: Point;
  facing: number;
  sprite: string;
};

type AnimationStep = {
  startTime: number;
  duration: number;
  actorId?: string;
  action:
    | "run"
    | "walk"
    | "turn"
    | "pass"
    | "shoot"
    | "receive"
    | "defend"
    | "celebrate"
    | "camera";
  from?: Point;
  to?: Point;
  targetId?: string;
};

type ChoiceResult = {
  choiceId: string;
  animationSteps: AnimationStep[];
  narration: string;
  explanation: string;
  quality: "best" | "good" | "poor";
  freezeFrameTime: number;
};

type AnimatedScenario = {
  id: string;
  title: string;
  role: string;
  introNarration: string;
  actors: AnimatedActor[];
  setupAnimation: AnimationStep[];
  pauseTime: number;
  choices: {
    id: string;
    label: string;
    spokenLabel: string;
    previewAnimation: AnimationStep[];
  }[];
  results: ChoiceResult[];
};
```

---

## 13. Minimum Content for First Release

The first working release should contain:

- 8 winger scenes
- 6 striker scenes
- 6 midfielder scenes
- 5 defender scenes
- 5 teamwork scenes
- 5 transition scenes

Total:
- at least 35 fully animated scenes

Every scene must include:
- setup animation
- 2–3 choices
- separate consequence animation for each choice
- narration
- replay
- comparison option

Do not create 165 shallow scenes before 35 good animated scenes are complete.

Quality is more important than quantity.

---

## 14. Child Language Rules

Use very short spoken phrases.

Good:
- “Stay wide.”
- “Run back.”
- “Pass and move.”
- “Help your teammate.”
- “The road is open.”
- “The defender is too close.”
- “Protect the middle.”

Avoid:
- “Maintain width.”
- “Create a passing lane.”
- “Provide defensive balance.”
- “Execute an overlapping run.”
- “Transition into a low block.”

Parent mode may show the formal tactical term.

---

## 15. Updated Acceptance Criteria

The app is complete only when:

- players look like cartoon people, not dots
- every lesson is shown as a moving soccer scene
- each scene runs for several seconds before Nolan chooses
- every choice has a different animated consequence
- poor choices visibly create a problem
- good choices visibly help the team
- Nolan can replay and compare choices
- some scenarios allow more than one good choice
- explanations use child-friendly language
- at least 35 high-quality animated scenarios are implemented
- the app works smoothly on mobile Safari and Chrome
- the app does not feel like a coach’s tactics board
