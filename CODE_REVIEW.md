# Code Review & Upgrade Comments — Kid Soccer Trainer

Reviewed: `src/` (App, timeline engine, SceneCanvas/ChoiceCard/ComparisonView, `lessons/index.ts` generator, optionSemantics/geometryRepair/spatialQuality, progress, Parent Mode), specs, and test layout. Focus: how well the app actually teaches kids soccer decisions, plus code health.

## Implementation status

Implemented after this review:

- neutral choice IDs and intent-based icons;
- deterministic shuffled card order, with a different order after “Choose again”;
- real Stage 2 prediction labels;
- a visible match-cue banner during the decision;
- a Practice Again pack and “needs another try” story markers;
- 0 points for a miss and a 1-point corrected-choice comeback reward;
- prominent comparison guidance and half-speed replay;
- an elapsed-time `requestAnimationFrame` animation clock with shortened reduced-motion timelines;
- younger/older soccer terminology;
- memoized curriculum auditing, a derived maximum score, and human-readable coaching concepts in Parent Mode;
- neutral-data, generated-language, and field-archetype regression gates;
- Prettier formatting across source and tests, enforced by CI;
- guards for missing choice results and comparison alternatives.

Still intentionally open: an independent human editorial pass over all 185 generated expansion stories, licensed youth-coach certification, multiple child profiles, full localization and voice selection, precomputed JSON scene output, and splitting the scenario generator into smaller modules.

---

## P0 — Learning-critical fixes (kids will learn the wrong thing)

### 1. The correct answer is always in the same position with a telltale icon
In `makeScene` (`src/lessons/index.ts`), choices are always built as `[goodChoice, alternateChoice?, poorChoice]`, and the poor choice **always** gets the `🤔` icon (alternate always gets `✅`). A child will pattern-match within 3–4 stories: *"first card = right, thinking-face = wrong"* — and stop reading the field entirely. This defeats the whole purpose of the app (reading game cues).

**Upgrade:** shuffle choice order per play (seeded by `sceneId + plays` so replays reshuffle), and give every choice a semantically neutral icon derived from its intent (run/pass/shoot/hold), never from its quality.

### 2. Stage-2 "prediction" labels are dead code
`AnimatedSceneScreen.tsx` has a `predictions` record keyed by ids like `wide`, `ball`, `behind`… but every generated choice id is `good` / `alternate` / `poor`, so `predictions[item.id]` is always `undefined` and silently falls back to the normal label. Stage 2 ("What happens next?") currently shows the same action labels as stage 1 — the prediction mechanic never fires. (Side effect: quality-revealing ids like `good` also leak into the DOM via `data-testid=role-path-good`.)

**Upgrade:** either add a real `predictionLabel` field per choice in the generator, or remove the prediction map. Rename choice ids to neutral ones (`a`/`b`/`c`).

### 3. The visible cue is never shown to the child
Every scenario carries `visibleCue` — the match trigger the child is supposed to *learn to spot* — but it's only displayed in Parent Mode. The child hears `introNarration` once during the setup animation, then chooses. Spotting the cue **is** the soccer skill (scanning/recognition); the answer is secondary.

**Upgrade:** during the choose phase, show a short cue banner ("👀 Look: the fullback stepped up!") and optionally highlight the cue actor with a pulse. Consider a "What did you see?" tap-the-cue micro-step before the choice on stage 2/3 scenes.

### 4. No adaptive practice — misses are never revisited
`recordResult` tracks `best/good/poor` per scene, but nothing consumes it: scene order is fixed inventory order, `stage` is `1+Math.floor((index%8)/3)` (position-based, not difficulty- or mastery-based), and there's no review queue. Kids grind forward linearly; a scene answered poorly is left behind with 1 point.

**Upgrade:**
- Add a "Practice again" pack built from scenes with `poor > 0` or `score < 3` (simple spaced repetition: resurface after 2–3 other scenes, then next session).
- Gate stage progression on mastery per `skillId` (the data model already has skill ids — use them).
- On the scene list, mark "needs another try" scenes so kids/parents can see them.

---

## P1 — Learning quality

### 5. ~190 of 250 scenes are template-generated and it shows
Only the 60 `reviewedCoreIds` scenes come from the hand-reviewed inventory. Expansion scenes assemble narration from `matchTrigger()` templates and recycle 8 good / 8 poor consequence sentences by modulo — text like *"Nolan reads clip the far-post cross at the right moment."* reads mechanical, and layouts come from one `positions` table per role with tiny jitter, so scenes within a pack feel near-identical on the field. Kids notice sameness fast; repetition without variation kills engagement and transfer.

**Upgrade:** treat the expansion scenes as drafts. Do a per-scene editorial pass (narration in real coach language, 2–3 sentence variety per consequence), and add 2–3 alternate layout archetypes per role so the same duty appears in visibly different field pictures. Fewer, better scenes beat 250 templated ones — consider shipping packs of 12–15 curated scenes per role.

### 6. Vocabulary is above the target age
7v7 formations imply roughly U9–U10, but labels include "counterpress", "underlap", "recycle", "holding midfielder", "half-space". Speech is en-US at rate 0.8 only.

**Upgrade:** add an age band setting (Younger / Older) that swaps label text ("Win it back fast!" vs "Counterpress now") — a simple `simpleLabel?:string` on choices. Let parents pick a speech voice and rate; add i18n scaffolding (all strings currently hardcoded in English across generator and UI, so this gets more expensive the longer it waits).

### 7. Poor-choice recovery could teach more
After a poor pick the child gets narration + "Choose again", which is good. But the replay runs at full speed, and the strongest teaching asset — `ComparisonView` — is opt-in behind a small button.

**Upgrade:** after a poor choice, auto-offer the comparison ("Want to see both side by side?") or make it the default next step; add a half-speed "Show me slowly" replay (scale step `startTime`/`duration` by 2). Also: on the *first* attempt of a scene, consider hiding scores entirely and only celebrating after mastery — reduces guess-fast-for-points behavior.

### 8. Scoring nit
Even a poor choice earns 1 point on first pick (`pointsForResult`). Kids optimize points; awarding for the miss weakens the signal. Suggest 0 for poor on first try, +1 "comeback star" when they re-choose correctly — rewards the learning loop itself. Also `score}/750` in Parent Mode is hardcoded; derive from `scenePacks` so it can't drift.

---

## P2 — Code health

### 9. Formatting: the codebase is written like minified output
Nearly every file is single-line-per-function with no spaces (`const[phase,setPhase]=useState...`). This makes diffs, reviews, and contributions painful for zero runtime benefit.

**Upgrade:** run Prettier once across `src/` and commit; add it to CI. This is a 30-minute change that pays back on every future edit.

### 10. `src/lessons/index.ts` is a 415-line god module
It parses markdown, holds the metadata table, builds layouts, generates good/poor/alternate animations, and runs a 5-pass repair pipeline (`enforceOptionResult` → `ensurePhoneReadableSteps` → `repairAnimationGeometry` → `prepareClearBestPaths` → `synchronizeReadableChoice`, several called 2–3× per scene) — for all 250 scenes at module load, on every app start.

**Upgrade:**
- Split into `metadata.ts`, `layout.ts`, `animations.ts`, `pipeline.ts`.
- Precompute: run the generator in a build script, emit `scenes.json`, and have the app load data only. Startup gets faster and — more importantly — generated output becomes reviewable/diffable, which directly supports item 5.
- Same for the Parent Mode audit: `scoreCurriculum(animatedScenarios)` runs on **every render** of `ParentModeScreen` (250 scenes × geometry scoring). Compute once at module level or memoize.

### 11. Animation engine: `setTimeout` + CSS transitions
`SceneCanvas` schedules one timeout per step. Background-tab throttling will desync `onComplete` from the visuals; there is no pause or speed control (blocks the "slow replay" upgrade); and "Reduce movement" only sets a CSS attribute — the child still waits the full ~4s timeline because `onComplete` uses unchanged durations.

**Upgrade:** drive the timeline from a single `requestAnimationFrame` clock with elapsed-time lookup. That gives pause/scrub/speed for free and makes reduced-motion actually shorten the wait (e.g., jump to freeze frames).

### 12. Robustness nits
- Non-null assertions that can throw on bad data: `scene.results.find(...)!` in `pick()`, `previewMove`'s `find(...)!`, `ComparisonView`'s trailing `!`. Guard and fall back gracefully — a data bug shouldn't white-screen a child mid-story.
- `personalizeText` replaces the literal name "Nolan" in prose; a child actually named Nolan is fine, but a teammate description containing "Nolan" pre-substitution would double-replace — fine today, fragile tomorrow. Prefer a `{name}` placeholder in source text.
- Progress is a single profile in `localStorage`; siblings sharing a device overwrite each other. Cheap win: profile picker keyed by child name.
- Parent Mode surfaces the internal 100-point design audit and raw skill ids ("A15"). That's developer QA, not parent coaching — map skill ids to the human names in `SOCCER_SKILL_MATRIX.md` and move the audit behind a dev flag.

---

## What's already strong (keep it)

- **Contrast-based feedback** (`ComparisonView`) is genuinely good pedagogy — seeing both consequences side by side is how tactical understanding forms.
- **Growth-mindset framing** ("See what happened?" / "Let's learn from it", no ❌) is right for this age.
- **Consequence animations instead of text feedback** — showing the team outcome is the correct medium for kids.
- Skill matrix mapping, semantic option checks, and the automated curriculum tests are an unusually solid quality backbone.
- Reduced-motion support, aria-labels, and the press-and-hold parent gate are thoughtful touches.

## Suggested order of work

1. Shuffle choices + neutral icons (P0.1) — hours, biggest learning payoff.
2. Show the visible cue during choose (P0.3) — small, high teaching value.
3. Fix/remove stage-2 predictions, neutral choice ids (P0.2).
4. Practice-again queue + mastery-based stages (P0.4).
5. Prettier + split the generator + precompute scenes to JSON (P2.9/10) — unlocks the editorial pass.
6. Editorial pass on expansion scenes + age-band language (P1.5/6).
7. rAF timeline with slow replay (P2.11 enabling P1.7).
