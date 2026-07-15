# Nolan Soccer Tactics Trainer

Live application: [Kid Soccer Training](https://yixingzhaishui.github.io/kid-soccer-training/)

An animation-first children’s soccer game built with React, TypeScript, Vite, and normalized SVG field coordinates. Children watch cartoon players, make a large visual choice, see its animated team consequence, hear a short explanation, replay it, and compare choices side by side.

## Completed curriculum

The reviewed core [scenario inventory](./SCENARIO_INVENTORY.md) and real-match expansion now provide 250 playable stories:

- 30 winger scenes;
- 30 striker scenes;
- 30 central-midfielder scenes;
- 30 attacking-midfielder scenes;
- 30 defensive-midfielder scenes;
- 30 fullback scenes;
- 30 center-defender scenes;
- 30 goalkeeper scenes with goalkeeper-specific setting, sweeping, diving, catching, parrying, organizing, crossing, recovery, and distribution;
- 10 teamwork scenes covering spacing, triangles, wall passes, third-player play, switches, attacking and defending 2v1s, pressure/cover/balance, counterattack width, and protecting a lead.

Every scenario is mapped to an observable child skill, a visible match cue, a role duty, and a focused active area. The full teaching vocabulary and scenario approval rules are in [SOCCER_SKILL_MATRIX.md](./SOCCER_SKILL_MATRIX.md). Tests reject near-duplicates even when small coordinate changes would otherwise hide them. Each role pack contains a scene with two acceptable choices.

## Application features

- three-to-five-second setup animations before choices;
- two or three animated visual choices;
- large option previews that animate the active role along the first movement path where the choices actually differ;
- explicit option semantics for holding, scanning and body orientation, traveling, defending, and playing the ball;
- distinct consequence timelines and child-friendly feedback;
- cartoon human players and a large animated ball;
- complete 7-v-7 children’s match formations (one goalkeeper and six field players per team) with role-correct nearby teammates and opponents;
- off-ball teammates and opponents who react during the setup and every consequence instead of standing still;
- smaller off-ball formation players so the active decision stays readable;
- a highlighted active-play area showing where the current decision matters;
- clearly labeled blue and red goals with opponent-goal shot validation;
- immediate “Choose again,” replay, side-by-side comparison, speech synthesis, and saved local progress;
- a saved player-name setting used on the field and in coaching, with **Tom** as the default;
- saved strategy scoring: 3 points for the best choice, 2 for another safe choice, and 1 for a learning choice, capped at 3 per story;
- press-and-hold Parent Mode with progress by role and coaching concepts;
- a transparent option-centered 100-point design audit in Parent Mode with exact per-case failure reasons;
- responsive phone and landscape layouts with reduced-motion support;
- an enlarged 1120-pixel match field with near-edge-to-edge phone rendering;
- no backend, login, database, paid API, Canvas, or game engine.

Scenario content comes from `SCENARIO_INVENTORY.md`; animation metadata and choreography are in `src/lessons/index.ts`. Shared React components and the SVG timeline engine render every scene without role-specific answers in the UI.

Automated curriculum checks verify complete 7-v-7 teams, role-specific nearby players, normalized coordinates, Tom inside the highlighted decision area, concrete strategy alternatives, distinct consequences, moving opposition, and shots directed only toward the opponent goal. The design audit totals 100 points: match integrity 10, role-specific teaching 10, readable setup 10, option tactical meaning 15, visible option-path contrast 15, option consequence accuracy 20, active teammates/opponents 8, safe ball geometry 8, and child feedback 4. Hidden players, unreachable receivers, look-alike option routes, label/action contradictions, or blocked helpful ball paths are hard failures and cap a case at 95 until repaired.

The geometry repair keeps active bodies visually separated at decision and freeze frames, places a receiving player on the ball side of a nearby marker, moves markers goal-side instead of on top of the receiver, and reopens helpful passing and shooting lanes after team movement. SVG players are painted in field-depth order so a farther player cannot incorrectly cover a nearer player.

## Install and run

Requirements: Node.js 20 or newer and npm 10 or newer.

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Run all checks

Install browser runtimes once:

```bash
npx playwright install chromium webkit
```

Then run:

```bash
npm run build
npm test -- --run
npm run test:e2e
```

Playwright runs in desktop Chromium, iPhone-sized Chromium, and iPhone-sized WebKit. Additional commands:

```bash
npm run test:watch
npm run test:e2e:ui
npm run preview
```

## Completion status

Implemented: 30 playable scenarios for each of the eight positional roles, plus 10 teamwork stories; 61 mapped child skills; animated active opponents; option-centered design scoring with a visible score for every individual option; receiver, body-occlusion, trajectory, option-preview/consequence agreement, and goal-direction validation; scoring, saved progress, Parent Mode, speech, replay, re-choose, and side-by-side comparison. The automated suite currently contains 33 curriculum/unit tests and 33 browser tests across desktop Chromium, phone-sized Chromium, and phone-sized WebKit.

Remaining: the 250-story curriculum is data-driven and passes the automated football-consistency gates, but it has not been independently certified by a licensed youth coach. That human coaching review is the only outstanding curriculum-validation step; it is not represented as complete here.
