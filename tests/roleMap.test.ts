import { describe, expect, it } from "vitest";
import {
  mapRoles,
  pointInZone,
  positionPackIds,
  quizRounds,
  shiftedZone,
  type Phase,
} from "../src/lessons/roleMap";
import { sceneById, starterSceneIds, starterScenes } from "../src/lessons";

const phases: Phase[] = ["attack", "defend"];

describe("7-a-side 2-2-2 role map", () => {
  it("fields exactly seven roles: 1 GK, 2 defenders, 2 midfielders, 2 forwards", () => {
    expect(mapRoles).toHaveLength(7);
    const names = mapRoles.map((role) => role.name).join("|");
    expect(names).toContain("Goalkeeper");
    expect(names.match(/Defender/g)).toHaveLength(2);
    expect(names.match(/Midfielder/g)).toHaveLength(2);
    expect(names.match(/Forward/g)).toHaveLength(2);
  });

  it("keeps every zone and standing spot inside the field", () => {
    for (const role of mapRoles)
      for (const phase of phases) {
        const zone = role.zones[phase];
        expect(zone.x, role.id).toBeGreaterThanOrEqual(0);
        expect(zone.y, role.id).toBeGreaterThanOrEqual(4);
        expect(zone.x + zone.width, role.id).toBeLessThanOrEqual(100);
        expect(zone.y + zone.height, role.id).toBeLessThanOrEqual(60);
        expect(
          pointInZone(role.spot[phase], zone),
          `${role.id} ${phase} spot sits in its own zone`,
        ).toBe(true);
      }
  });

  it("breathes forward on attack and backward on defense for every outfield role", () => {
    for (const role of mapRoles.filter((item) => item.id !== "gk")) {
      expect(
        role.zones.attack.x,
        `${role.id} attack zone reaches further forward`,
      ).toBeGreaterThan(role.zones.defend.x);
      expect(
        role.spot.attack.x,
        `${role.id} attack spot is ahead of defend spot`,
      ).toBeGreaterThan(role.spot.defend.x);
      expect(
        role.duty.attack,
        `${role.id} teaches different jobs per phase`,
      ).not.toBe(role.duty.defend);
    }
  });

  it("quizzes both phases with in-bounds ball positions", () => {
    const rounds = quizRounds(0.42);
    expect(rounds.length).toBeGreaterThanOrEqual(6);
    expect(rounds.some((round) => round.phase === "attack")).toBe(true);
    expect(rounds.some((round) => round.phase === "defend")).toBe(true);
    for (const round of rounds) {
      expect(round.ball.x).toBeGreaterThan(0);
      expect(round.ball.x).toBeLessThan(100);
      expect(round.ball.y).toBeGreaterThan(4);
      expect(round.ball.y).toBeLessThan(60);
      expect(round.prompt.length).toBeGreaterThan(10);
    }
  });

  it("randomizes rounds per seed but replays the same seed exactly", () => {
    const first = quizRounds(0.123),
      replay = quizRounds(0.123),
      other = quizRounds(0.987);
    expect(replay).toEqual(first);
    expect(JSON.stringify(other)).not.toBe(JSON.stringify(first));
    expect(first.filter((round) => round.shift).length).toBeGreaterThanOrEqual(
      2,
    );
  });

  it("slides every zone toward a wing ball and stays inside the field", () => {
    const wingBallTop = { x: 30, y: 12 },
      wingBallBottom = { x: 30, y: 52 },
      centralBall = { x: 50, y: 32 };
    for (const role of mapRoles)
      for (const phase of phases) {
        const base = role.zones[phase];
        const towardTop = shiftedZone(role, phase, wingBallTop);
        const towardBottom = shiftedZone(role, phase, wingBallBottom);
        const central = shiftedZone(role, phase, centralBall);
        expect(central).toEqual(base);
        expect(
          towardTop.y,
          `${role.id} ${phase} slides up`,
        ).toBeLessThanOrEqual(base.y);
        expect(
          towardBottom.y,
          `${role.id} ${phase} slides down`,
        ).toBeGreaterThanOrEqual(base.y);
        for (const zone of [towardTop, towardBottom]) {
          expect(zone.y).toBeGreaterThanOrEqual(4);
          expect(zone.y + zone.height).toBeLessThanOrEqual(60);
        }
      }
  });
});

describe("position bridge from the 2-2-2 to the scene curriculum", () => {
  it("gives every 2-2-2 role a real position pack of existing scenes", () => {
    for (const role of mapRoles) {
      const ids = positionPackIds[role.id];
      expect(ids, role.id).toBeDefined();
      expect(ids.length, role.id).toBeGreaterThanOrEqual(10);
      expect(ids.length, role.id).toBeLessThanOrEqual(15);
      for (const id of ids)
        expect(sceneById(id), `${role.id}: ${id}`).toBeDefined();
      expect(new Set(ids).size, `${role.id} has no duplicates`).toBe(
        ids.length,
      );
    }
  });
  it("matches pack content to the position family", () => {
    expect(positionPackIds.gk.every((id) => id.startsWith("GK-"))).toBe(true);
    expect(
      positionPackIds.lf.some((id) => id.startsWith("STR-")) &&
        positionPackIds.lf.some((id) => id.startsWith("WNG-")),
    ).toBe(true);
    expect(
      positionPackIds.ld.some((id) => id.startsWith("CB-")) &&
        positionPackIds.ld.some((id) => id.startsWith("FB-")),
    ).toBe(true);
    expect(positionPackIds.lm.some((id) => id.startsWith("CM-"))).toBe(true);
    expect(positionPackIds.lf).toEqual(positionPackIds.rf);
    expect(positionPackIds.ld).toEqual(positionPackIds.rd);
    expect(positionPackIds.lm).toEqual(positionPackIds.rm);
  });
});

describe("First Lessons starter pack", () => {
  it("collects eight real scenes against ball-chasing", () => {
    expect(starterSceneIds).toHaveLength(8);
    expect(starterScenes).toHaveLength(8);
    for (const id of starterSceneIds) expect(sceneById(id), id).toBeDefined();
  });
  it("covers spacing, pressing roles, scanning, and combining", () => {
    const concepts = starterScenes
      .map((scene) => scene.formalConcept.toLowerCase())
      .join(" ");
    expect(concepts).toMatch(/width|space/);
    expect(concepts).toMatch(/scan/);
    expect(concepts).toMatch(/wall pass/);
    expect(concepts).toMatch(/presses|covers|pressure/);
  });
});
