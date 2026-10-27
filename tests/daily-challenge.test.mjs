import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/daily-challenge.ts", import.meta.url), "utf8");
const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { dailyPlan, activityMatches, currentStreak, bestStreak, recordDailyActivity, readDailyRecords, localDateKey } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

test("daily plan is stable for a date and changes on the next day", () => {
  const today = dailyPlan("2026-10-27");
  assert.deepEqual(dailyPlan("2026-10-27"), today);
  assert.notDeepEqual(dailyPlan("2026-10-28"), today);
  assert.equal(localDateKey(new Date(2026, 9, 27)), "2026-10-27");
});

test("only the assigned test, lesson and game count", () => {
  const plan = dailyPlan("2026-10-27");
  assert.equal(activityMatches(plan, { kind: "test", duration: plan.duration, correct: 1 }), true);
  assert.equal(activityMatches(plan, { kind: "test", duration: plan.duration, correct: 0 }), false);
  assert.equal(activityMatches(plan, { kind: "lesson", lessonId: plan.lessonId }), true);
  assert.equal(activityMatches(plan, { kind: "game", gameId: plan.gameId, score: 0 }), false);
  assert.equal(activityMatches(plan, { kind: "game", gameId: plan.gameId, score: 10 }), true);
});

test("streak spans consecutive completed days and survives a partial current day", () => {
  const full = { test: true, lesson: true, game: true };
  const partial = { test: true, lesson: false, game: false };
  const records = { "2026-10-23": full, "2026-10-24": full, "2026-10-26": full, "2026-10-27": partial };
  assert.equal(currentStreak(records, "2026-10-27"), 1);
  assert.equal(bestStreak(records), 2);
  assert.equal(currentStreak({ ...records, "2026-10-27": full }, "2026-10-27"), 2);
});

test("recording a task is idempotent and persists only matching activity", () => {
  const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  globalThis.window = { dispatchEvent() {} };
  const date = new Date(2026, 9, 27, 12);
  const plan = dailyPlan("2026-10-27");
  assert.equal(recordDailyActivity({ kind: "test", duration: 120, correct: 2 }, date), plan.duration === 120);
  assert.equal(recordDailyActivity({ kind: "lesson", lessonId: plan.lessonId }, date), true);
  assert.equal(recordDailyActivity({ kind: "lesson", lessonId: plan.lessonId }, date), false);
  assert.equal(recordDailyActivity({ kind: "test", duration: plan.duration, correct: 12 }, date), true);
  assert.equal(recordDailyActivity({ kind: "game", gameId: plan.gameId, score: 40 }, date), true);
  assert.deepEqual(readDailyRecords()["2026-10-27"], { test: true, lesson: true, game: true });
  assert.equal(currentStreak(readDailyRecords(), "2026-10-27"), 1);
});
