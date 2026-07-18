import { animatedScenarios } from "../src/lessons";
import { coachFailures } from "../src/logic/coachQuality";
import { scoreScenario } from "../src/logic/scenarioQuality";

const roleLabels: Record<string, string> = {
  winger: "Winger",
  striker: "Striker",
  "central-midfielder": "Central midfielder",
  "attacking-midfielder": "Attacking midfielder",
  "defensive-midfielder": "Defensive midfielder",
  fullback: "Fullback",
  "center-defender": "Center defender",
  goalkeeper: "Goalkeeper",
  teamwork: "Teamwork",
};

console.log("## Full curriculum coach-contract ledger — 2026-07-18\n");
console.log(
  "`Coach-verified` means the story title and primary skill were checked one by one, and the actual normalized timeline passed the named-skill, possession, direction, open-lane, moving-opponent, distinct-option, consequence, and 390px phone gates. It does not claim independent licensed-coach certification.\n",
);
console.log("| ID | Role | Story | Skill | Score | Status |");
console.log("|---|---|---|---:|---:|---|");
for (const scene of animatedScenarios) {
  const quality = scoreScenario(scene);
  const passed =
    quality.score >= 97 &&
    quality.hardFailures.length === 0 &&
    coachFailures(scene).length === 0;
  console.log(
    `| ${scene.id} | ${roleLabels[scene.category]} | ${scene.title} | ${scene.skillId} | ${quality.score}/100 | ${passed ? "Coach-verified" : "Repairing"} |`,
  );
}
