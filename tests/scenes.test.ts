import { describe, expect, it } from "vitest";
import { animatedScenarios, scenePacks } from "../src/lessons";
import { timelineDuration } from "../src/logic/timeline";
import { blockedBestChoicePaths } from "../src/logic/trajectory";

describe("role-specific animation curriculum", () => {
  it("contains 30 scenarios for every positional role", () => {
    expect(animatedScenarios).toHaveLength(250);
    expect(
      Object.fromEntries(
        scenePacks.map((pack) => [pack.id, pack.scenes.length]),
      ),
    ).toEqual({
      winger: 30,
      striker: 30,
      "central-midfielder": 30,
      "attacking-midfielder": 30,
      "defensive-midfielder": 30,
      fullback: 30,
      "center-defender": 30,
      goalkeeper: 30,
      teamwork: 10,
    });
  });
  it("has no cloned curriculum signatures", () => {
    expect(
      new Set(
        animatedScenarios.map(
          (scene) => `${scene.introNarration}|${scene.formalConcept}`,
        ),
      ).size,
    ).toBe(250);
    const signatures = new Map<string, string[]>();
    for (const scene of animatedScenarios) {
      const signature = JSON.stringify({
        actors: scene.actors.map((actor) => actor.start),
        good: scene.results[0].animationSteps,
        poor: scene.results.at(-1)!.animationSteps,
      });
      signatures.set(signature, [
        ...(signatures.get(signature) ?? []),
        scene.id,
      ]);
    }
    const duplicates = [...signatures.values()].filter((ids) => ids.length > 1);
    expect(duplicates, JSON.stringify(duplicates)).toEqual([]);
  });
  it("uses neutral option identities, icons, and real prediction labels", () => {
    for (const scene of animatedScenarios) {
      expect(
        scene.choices.every((choice) => ["a", "b", "c"].includes(choice.id)),
        scene.id,
      ).toBe(true);
      expect(
        scene.choices.every((choice) => Boolean(choice.predictionLabel)),
        scene.id,
      ).toBe(true);
      expect(
        scene.choices.every((choice) => !["🤔", "✅"].includes(choice.icon)),
        scene.id,
      ).toBe(true);
      expect(
        scene.choices.every((choice) =>
          scene.results.some((result) => result.choiceId === choice.id),
        ),
        scene.id,
      ).toBe(true);
    }
  });
  it("gives generated lessons coach-readable language and multiple field archetypes", () => {
    const generated = animatedScenarios.filter(
      (scene) =>
        Number(scene.id.slice(-2)) >
        ({ WNG: 8, STR: 8, CM: 8, AM: 6, DM: 6, FB: 6, CB: 6, GK: 7, TW: 10 }[
          scene.id.split("-")[0]
        ] ?? 99),
    );
    expect(
      generated.some((scene) =>
        /Nolan (?:reads|misses the cue for)/i.test(scene.results[0].narration),
      ),
    ).toBe(false);
    for (const pack of scenePacks.filter((item) => item.id !== "teamwork")) {
      const signatures = new Set(
        pack.scenes.map((scene) => {
          const nolan = scene.actors.find((actor) => actor.id === "nolan")!;
          return `${Math.round(nolan.start.x / 5)}:${Math.round(nolan.start.y / 5)}:${Math.round(scene.ballStart.x / 5)}:${Math.round(scene.ballStart.y / 5)}`;
        }),
      );
      expect(signatures.size, pack.id).toBeGreaterThanOrEqual(3);
    }
  });
  it("plays setup and consequence animations for every visual choice", () => {
    for (const scene of animatedScenarios) {
      expect(
        timelineDuration(scene.setupAnimation),
        scene.id,
      ).toBeGreaterThanOrEqual(3000);
      expect(scene.choices.length).toBeGreaterThanOrEqual(2);
      expect(scene.choices.length).toBeLessThanOrEqual(3);
      expect(scene.results).toHaveLength(scene.choices.length);
      for (const choice of scene.choices) {
        expect(choice.previewAnimation.length).toBeGreaterThan(0);
        const consequence = scene.results.find(
          (item) => item.choiceId === choice.id,
        );
        expect(consequence, `${scene.id}/${choice.id}`).toBeDefined();
        expect(
          timelineDuration(consequence!.animationSteps),
          `${scene.id}/${choice.id}`,
        ).toBeGreaterThanOrEqual(2500);
      }
    }
  });
  it("uses normalized coordinates, active areas, and complete 7-v-7 kids teams", () => {
    for (const scene of animatedScenarios) {
      expect(scene.actors.some((actor) => actor.name === "Nolan")).toBe(true);
      expect(
        scene.actors.filter((actor) => actor.team === "blue"),
        scene.id,
      ).toHaveLength(7);
      expect(
        scene.actors.filter((actor) => actor.team === "red"),
        scene.id,
      ).toHaveLength(7);
      expect(
        scene.actors.filter(
          (actor) => actor.goalkeeper && actor.team === "blue",
        ),
        scene.id,
      ).toHaveLength(1);
      expect(
        scene.actors.filter(
          (actor) => actor.goalkeeper && actor.team === "red",
        ),
        scene.id,
      ).toHaveLength(1);
      expect(scene.activeArea.label.length).toBeGreaterThan(3);
      expect(scene.activeArea.x + scene.activeArea.width).toBeLessThanOrEqual(
        100,
      );
      expect(scene.activeArea.y + scene.activeArea.height).toBeLessThanOrEqual(
        64,
      );
      const points = [
        scene.ballStart,
        ...scene.actors.map((actor) => actor.start),
        ...scene.setupAnimation.flatMap((item) =>
          [item.from, item.to].filter(Boolean),
        ),
        ...scene.results.flatMap((result) =>
          result.animationSteps.flatMap((item) =>
            [item.from, item.to].filter(Boolean),
          ),
        ),
      ];
      for (const point of points) {
        expect(
          point!.x,
          `${scene.id}: ${JSON.stringify(point)}`,
        ).toBeGreaterThanOrEqual(0);
        expect(
          point!.x,
          `${scene.id}: ${JSON.stringify(point)}`,
        ).toBeLessThanOrEqual(100);
        expect(
          point!.y,
          `${scene.id}: ${JSON.stringify(point)}`,
        ).toBeGreaterThanOrEqual(0);
        expect(
          point!.y,
          `${scene.id}: ${JSON.stringify(point)}`,
        ).toBeLessThanOrEqual(64);
      }
    }
  });
  it("implements required role-specific content", () => {
    const ids = new Set(animatedScenarios.map((scene) => scene.id));
    for (const id of [
      "WNG-03",
      "WNG-07",
      "STR-04",
      "STR-06",
      "STR-07",
      "CM-01",
      "CM-03",
      "CM-06",
      "CM-07",
      "FB-03",
      "FB-04",
      "CB-03",
      "CB-05",
      "CB-06",
      "GK-01",
      "GK-02",
      "GK-03",
      "GK-04",
    ])
      expect(ids.has(id), id).toBe(true);
    const goalkeeperActions = new Set(
      scenePacks
        .find((pack) => pack.id === "goalkeeper")!
        .scenes.flatMap((scene) =>
          scene.results.flatMap((result) =>
            result.animationSteps.map((item) => item.action),
          ),
        ),
    );
    for (const action of ["set", "dive", "catch", "parry", "clear", "pass"])
      expect(goalkeeperActions.has(action as never), action).toBe(true);
  });
  it("uses correct nearby roles instead of generic teammates", () => {
    const expected: Record<string, { blue: string[]; red: string[] }> = {
      winger: { blue: ["Striker"], red: ["Fullback"] },
      striker: { blue: ["Attacking midfielder"], red: ["Center defender"] },
      "central-midfielder": { blue: ["Winger"], red: ["Central midfielder"] },
      "attacking-midfielder": {
        blue: ["Striker"],
        red: ["Defensive midfielder"],
      },
      "defensive-midfielder": {
        blue: ["Fullback"],
        red: ["Attacking midfielder"],
      },
      fullback: { blue: ["Winger"], red: ["Winger", "Fullback"] },
      "center-defender": { blue: ["Fullback"], red: ["Striker"] },
      goalkeeper: { blue: ["Center defender"], red: ["Striker"] },
    };
    for (const [packId, roles] of Object.entries(expected)) {
      const scenes = scenePacks.find((pack) => pack.id === packId)!.scenes;
      for (const scene of scenes) {
        expect(
          scene.actors.some(
            (actor) => actor.team === "blue" && roles.blue.includes(actor.role),
          ),
          scene.id,
        ).toBe(true);
        expect(
          scene.actors.some(
            (actor) => actor.team === "red" && roles.red.includes(actor.role),
          ),
          scene.id,
        ).toBe(true);
      }
    }
  });
  it("keeps Nolan inside the highlighted decision area", () => {
    for (const scene of animatedScenarios) {
      const nolan = scene.actors.find((actor) => actor.name === "Nolan")!;
      expect(nolan.start.x, scene.id).toBeGreaterThanOrEqual(
        scene.activeArea.x - 2,
      );
      expect(nolan.start.x, scene.id).toBeLessThanOrEqual(
        scene.activeArea.x + scene.activeArea.width + 2,
      );
      expect(nolan.start.y, scene.id).toBeGreaterThanOrEqual(
        scene.activeArea.y - 2,
      );
      expect(nolan.start.y, scene.id).toBeLessThanOrEqual(
        scene.activeArea.y + scene.activeArea.height + 2,
      );
    }
  });
  it("uses concrete strategy alternatives and genuinely different consequences", () => {
    for (const scene of animatedScenarios) {
      expect(
        new Set(scene.choices.map((choice) => choice.label)).size,
        scene.id,
      ).toBe(scene.choices.length);
      expect(
        scene.choices.every((choice) => choice.label !== "Miss the match cue"),
        scene.id,
      ).toBe(true);
      const consequenceSignatures = scene.results.map((result) =>
        JSON.stringify(result.animationSteps),
      );
      expect(new Set(consequenceSignatures).size, scene.id).toBe(
        scene.results.length,
      );
      expect(
        scene.results.some((result) => result.quality === "best"),
        scene.id,
      ).toBe(true);
      expect(
        scene.results.some((result) => result.quality === "poor"),
        scene.id,
      ).toBe(true);
    }
  });
  it("maps every scenario to a defined child skill, cue, and duty", () => {
    const skillIds = new Set([
      "A01",
      "A02",
      "A03",
      "A04",
      "A05",
      "A06",
      "A07",
      "A08",
      "A09",
      "A10",
      "A11",
      "A12",
      "A13",
      "A14",
      "A15",
      "A16",
      "A17",
      "A18",
      "A19",
      "A20",
      "A21",
      "A22",
      "A23",
      "A24",
      "A25",
      "A26",
      "A27",
      "D01",
      "D02",
      "D03",
      "D04",
      "D05",
      "D06",
      "D07",
      "D08",
      "D09",
      "D10",
      "D11",
      "D12",
      "D13",
      "D14",
      "D15",
      "D16",
      "D17",
      "D18",
      "D19",
      "D20",
      "T01",
      "T02",
      "T03",
      "T04",
      "T05",
      "G01",
      "G02",
      "G03",
      "G04",
      "G05",
      "G06",
      "G07",
      "G08",
      "G09",
      "G10",
      "G11",
      "G12",
      "G13",
    ]);
    for (const scene of animatedScenarios) {
      expect(skillIds.has(scene.skillId), scene.id).toBe(true);
      expect(scene.visibleCue.length, scene.id).toBeGreaterThan(20);
      expect(scene.playerDuty.length, scene.id).toBeGreaterThan(4);
    }
  });
  it("moves real teammates and opponents during setup and every consequence", () => {
    for (const scene of animatedScenarios) {
      expect(
        new Set(
          scene.setupAnimation
            .filter((step) => step.actorId?.startsWith("support-"))
            .map((step) => step.actorId),
        ).size,
        scene.id,
      ).toBeGreaterThanOrEqual(4);
      for (const result of scene.results) {
        const movingSupport = result.animationSteps.filter(
          (step) => step.actorId?.startsWith("support-") && step.to,
        );
        expect(
          new Set(movingSupport.map((step) => step.actorId)).size,
          `${scene.id}/${result.choiceId}`,
        ).toBeGreaterThanOrEqual(4);
        expect(
          new Set(
            movingSupport
              .filter(
                (step) =>
                  scene.actors.find((actor) => actor.id === step.actorId)
                    ?.team === "red",
              )
              .map((step) => step.actorId),
          ).size,
          `${scene.id}/${result.choiceId}`,
        ).toBeGreaterThanOrEqual(2);
      }
    }
  });
  it("keeps every best-choice kick out of an opponent body or crowd", () => {
    const failures = animatedScenarios.flatMap((scene) =>
      scene.results
        .filter((result) => result.quality !== "poor")
        .flatMap((result) =>
          blockedBestChoicePaths(scene, result).map(
            (blocked) =>
              `${scene.id}/${result.choiceId}/${blocked.step.action}:${blocked.blockerIds.join(",")}`,
          ),
        ),
    );
    expect(failures).toEqual([]);
  });
  it("rejects near-duplicate cases after ignoring tiny coordinate changes", () => {
    for (const pack of scenePacks) {
      const signatures = new Map<string, string[]>();
      for (const scene of pack.scenes) {
        const activeActors = scene.actors
            .filter((actor) => !actor.id.startsWith("support-"))
            .map((actor) => [
              actor.team,
              actor.role,
              Math.round(actor.start.x / 6),
              Math.round(actor.start.y / 6),
            ]),
          resultShape = scene.results.map((result) =>
            result.animationSteps
              .filter((item) => !item.actorId?.startsWith("support-"))
              .map((item) => [
                item.actorId,
                item.action,
                item.to ? Math.round(item.to.x / 8) : null,
                item.to ? Math.round(item.to.y / 8) : null,
              ]),
          );
        const signature = JSON.stringify({
          skill: scene.skillId,
          area: [
            scene.activeArea.label,
            Math.round(scene.activeArea.x / 8),
            Math.round(scene.activeArea.y / 8),
            Math.round(scene.activeArea.width / 8),
            Math.round(scene.activeArea.height / 8),
          ],
          activeActors,
          resultShape,
        });
        signatures.set(signature, [
          ...(signatures.get(signature) ?? []),
          scene.id,
        ]);
      }
      const duplicates = [...signatures.values()].filter(
        (ids) => ids.length > 1,
      );
      expect(duplicates, `${pack.id}: ${JSON.stringify(duplicates)}`).toEqual(
        [],
      );
    }
  });
  it("offers two acceptable choices in every role pack", () => {
    for (const pack of scenePacks)
      expect(
        pack.scenes.some(
          (scene) =>
            scene.results.filter((result) => result.quality !== "poor")
              .length >= 2,
        ),
        pack.id,
      ).toBe(true);
  });
  it("always shoots toward the opponent goal", () => {
    for (const scene of animatedScenarios)
      for (const result of scene.results)
        for (const shot of result.animationSteps.filter(
          (item) => item.action === "shoot",
        )) {
          const shooter = scene.actors.find(
            (actor) => actor.id === shot.actorId,
          )!;
          const opponentKeeper = scene.actors.find(
            (actor) => actor.goalkeeper && actor.team !== shooter.team,
          );
          expect(
            opponentKeeper,
            `${scene.id}/${result.choiceId}`,
          ).toBeDefined();
          expect(
            Math.abs(shot.to!.x - (shooter.team === "blue" ? 97 : 3)),
            `${scene.id}/${result.choiceId}`,
          ).toBeLessThanOrEqual(8);
        }
  });
});
