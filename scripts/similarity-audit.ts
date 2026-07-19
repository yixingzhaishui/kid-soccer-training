import { animatedScenarios } from "../src/lessons";
import type { AnimatedScenario, AnimationStep } from "../src/types/soccer";

// Signature of what the child actually SEES for a choice: Nolan's route,
// the ball actions, and endpoints, quantized to a coarse grid.
const q = (n: number | undefined) =>
  n === undefined ? "?" : String(Math.round(n / 6));
const stepSig = (s: AnimationStep) =>
  `${s.actorId ?? "-"}:${s.action}:${q(s.from?.x)},${q(s.from?.y)}>${q(s.to?.x)},${q(s.to?.y)}`;
const choiceSig = (steps: AnimationStep[]) =>
  steps
    .filter(
      (s) =>
        s.actorId === "nolan" ||
        ["pass", "cross", "shoot", "clear"].includes(s.action),
    )
    .map(stepSig)
    .join("|");

function sceneSignature(scene: AnimatedScenario) {
  const parts = scene.results
    .map((r) => `${r.quality}=${choiceSig(r.animationSteps)}`)
    .sort();
  return parts.join("||");
}

// token-set similarity for narration text
const tokens = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .replace(/nolan|tom/g, "")
      .split(/[^a-z]+/)
      .filter((w) => w.length > 3),
  );
const jaccard = (a: Set<string>, b: Set<string>) => {
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter || 1);
};
const simSig = (a: string, b: string) => {
  const A = new Set(a.split("|")),
    B = new Set(b.split("|"));
  return jaccard(A as Set<string>, B as Set<string>);
};

type Pair = { a: string; b: string; anim: number; text: number };
const pairs: Pair[] = [];
const byCat = new Map<string, AnimatedScenario[]>();
for (const s of animatedScenarios) {
  const list = byCat.get(s.category) ?? [];
  list.push(s);
  byCat.set(s.category, list);
}
for (const [, list] of byCat) {
  for (let i = 0; i < list.length; i++)
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i],
        b = list[j];
      const anim = simSig(sceneSignature(a), sceneSignature(b));
      const text = jaccard(
        tokens(
          a.introNarration +
            " " +
            a.results.map((r) => r.narration + r.explanation).join(" "),
        ),
        tokens(
          b.introNarration +
            " " +
            b.results.map((r) => r.narration + r.explanation).join(" "),
        ),
      );
      if (anim > 0.6 || text > 0.55)
        pairs.push({
          a: a.id,
          b: b.id,
          anim: +anim.toFixed(2),
          text: +text.toFixed(2),
        });
    }
}
pairs.sort((x, y) => y.anim + y.text - (x.anim + x.text));
console.log(`High-similarity pairs (same role pack): ${pairs.length}`);
for (const p of pairs.slice(0, 80))
  console.log(`${p.a} ~ ${p.b}  anim=${p.anim} text=${p.text}`);

// identical animation signatures = child sees the same scene twice
const sigMap = new Map<string, string[]>();
for (const s of animatedScenarios) {
  const sig = sceneSignature(s);
  sigMap.set(sig, [...(sigMap.get(sig) ?? []), s.id]);
}
const dups = [...sigMap.values()].filter((v) => v.length > 1);
console.log(`\nExactly identical choice-animation groups: ${dups.length}`);
for (const d of dups) console.log("  " + d.join(", "));

// duplicate titles / setup narrations
const narrMap = new Map<string, string[]>();
for (const s of animatedScenarios) {
  narrMap.set(s.introNarration, [
    ...(narrMap.get(s.introNarration) ?? []),
    s.id,
  ]);
}
const narrDups = [...narrMap.entries()].filter(([, v]) => v.length > 1);
console.log(`\nIdentical setup narration groups: ${narrDups.length}`);
for (const [t, ids] of narrDups)
  console.log(`  [${ids.join(", ")}] "${t.slice(0, 90)}"`);
