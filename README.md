# Nolan Soccer Tactics Trainer

An animation-first children’s soccer game built with React, TypeScript, Vite, and normalized SVG field coordinates. Children watch cartoon players, make a large visual choice, see its animated team consequence, hear a short explanation, replay it, and compare choices side by side.

## Completed curriculum

The first release is driven by the reviewed [scenario inventory](./SCENARIO_INVENTORY.md) and contains exactly 50 role-specific scenes:

- 8 winger scenes covering width, 1v1 body position, early crossing, cutbacks, back-post runs, short/behind movement, tracking, and counterattack width;
- 8 striker scenes covering box runs, checking, running behind, hold-up play, shoot/pass decisions, rebounds, pressing, and offside timing;
- 8 central-midfielder scenes covering scanning, pressure reads, switching, support, third-player runs, tempo, coverage, and late arrival;
- 6 fullback scenes covering outside positioning, cross prevention, overlaps, underlaps, rest defense, and recovery;
- 6 center-defender scenes covering goal-side positioning, stepping/dropping, partner coverage, danger clearance, crosses, and line control;
- 4 goalkeeper scenes with goalkeeper-specific angle setting, sweeping, diving, catching, parrying, clearing, and open-side distribution;
- 10 teamwork scenes covering spacing, triangles, wall passes, third-player play, switches, attacking and defending 2v1s, pressure/cover/balance, counterattack width, and protecting a lead.

Every inventory row has a unique trigger and decision. Tests reject duplicate trigger/decision signatures and duplicate animation layouts. Each role pack contains a scene with two acceptable choices.

## Application features

- three-to-five-second setup animations before choices;
- two or three animated visual choices;
- distinct consequence timelines and child-friendly feedback;
- cartoon human players and a large animated ball;
- clearly labeled blue and red goals with opponent-goal shot validation;
- immediate “Choose again,” replay, side-by-side comparison, speech synthesis, and saved local progress;
- press-and-hold Parent Mode with progress by role and coaching concepts;
- responsive phone and landscape layouts with reduced-motion support;
- no backend, login, database, paid API, Canvas, or game engine.

Scenario content comes from `SCENARIO_INVENTORY.md`; animation metadata and choreography are in `src/lessons/index.ts`. Shared React components and the SVG timeline engine render every scene without role-specific answers in the UI.

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
npm test
npm run test:e2e
```

Playwright runs in desktop Chromium, iPhone-sized Chromium, and iPhone-sized WebKit. Additional commands:

```bash
npm run test:watch
npm run test:e2e:ui
npm run preview
```

## Completion status

The 50-scene first release in `NOLAN_SOCCER_TRAINER_ROLE_SPEC.md` is implemented. The six attacking-midfielder concepts and three additional goalkeeper concepts listed in that document are later-release curriculum because they are not included in its 50-scene first-release counts.
