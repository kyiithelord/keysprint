import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const compile = async (path, replacements = []) => {
  let source = await readFile(new URL(path, import.meta.url), "utf8");
  for (const [from, to] of replacements) source = source.replace(`from "${from}"`, `from "${to}"`);
  const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  return `data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`;
};

const storageUrl = await compile("../src/lib/progress-storage.ts");
const typingUrl = await compile("../src/lib/typing.ts", [["./progress-storage", storageUrl]]);
const dailyUrl = await compile("../src/lib/daily-challenge.ts", [["./progress-storage", storageUrl]]);
const syncUrl = await compile("../src/lib/progress-sync.ts", [["./typing", typingUrl], ["./daily-challenge", dailyUrl], ["./progress-storage", storageUrl]]);
const { progressKeys, progressStorageKey, setActiveProgressUser } = await import(storageUrl);
const { readResults } = await import(typingUrl);
const { importGuestProgress, mergeProgressEvents, collectProgressEvents, syncProgress, deleteAccountProgress } = await import(syncUrl);

const values = new Map();
globalThis.localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value)),
  removeItem: key => values.delete(key),
};
globalThis.window = new EventTarget();

const result = {
  rawWpm: 45, netWpm: 42, accuracy: 93, correct: 210, incorrect: 15, evaluated: 225,
  duration: 60, difficulty: "standard", mode: "words", finishedAt: "2026-10-28T10:00:00.000Z",
};

test("guest progress imports once and stays separate from another account", () => {
  values.clear();
  setActiveProgressUser(null);
  localStorage.setItem(progressKeys.results, JSON.stringify([result]));
  localStorage.setItem(progressKeys.lessons, JSON.stringify(["home-row"]));
  importGuestProgress("user-a");
  setActiveProgressUser("user-a");
  assert.equal(readResults().length, 1);
  assert.equal(collectProgressEvents("user-a").length, 2);
  importGuestProgress("user-b");
  setActiveProgressUser("user-b");
  assert.equal(readResults().length, 0);
  assert.equal(collectProgressEvents("user-b").length, 0);
  setActiveProgressUser(null);
  assert.equal(readResults().length, 1);
});

test("remote progress merges without replacing an existing local result", () => {
  values.clear();
  setActiveProgressUser("user-a");
  localStorage.setItem(progressStorageKey(progressKeys.results), JSON.stringify([result]));
  const later = { ...result, netWpm: 50, finishedAt: "2026-10-28T11:00:00.000Z" };
  mergeProgressEvents([
    { event_key: "old", kind: "result", payload: result },
    { event_key: "new", kind: "result", payload: later },
    { event_key: "lesson:top-row", kind: "lesson", payload: { lessonId: "top-row" } },
    { event_key: "daily:2026-10-28:test", kind: "daily", payload: { date: "2026-10-28", task: "test" } },
  ], "user-a");
  assert.deepEqual(readResults().map(item => item.netWpm), [50, 42]);
  assert.deepEqual(JSON.parse(localStorage.getItem(progressStorageKey(progressKeys.lessons))), ["top-row"]);
  assert.equal(JSON.parse(localStorage.getItem(progressStorageKey(progressKeys.daily)))["2026-10-28"].test, true);
});

test("sync uploads local progress and restores a result from another device", async () => {
  values.clear();
  setActiveProgressUser("user-a");
  localStorage.setItem(progressStorageKey(progressKeys.results), JSON.stringify([result]));
  const remoteResult = { ...result, netWpm: 55, finishedAt: "2026-10-29T10:00:00.000Z" };
  const rows = [{ user_id: "user-a", event_key: "remote", kind: "result", payload: remoteResult }];
  const client = {
    from: () => ({
      upsert: async batch => { for (const row of batch) if (!rows.some(existing => existing.event_key === row.event_key)) rows.push(row); return { error: null }; },
      select: () => ({ eq: () => ({ order: () => ({ range: async (start, end) => ({ data: rows.slice(start, end + 1), error: null }) }) }) }),
    }),
  };
  await syncProgress(client, "user-a");
  assert.equal(rows.length, 2);
  assert.deepEqual(readResults().map(item => item.netWpm), [55, 42]);
});

test("account deletion removes remote events and the account's local copy", async () => {
  values.clear();
  setActiveProgressUser("user-a");
  localStorage.setItem(progressStorageKey(progressKeys.results), JSON.stringify([result]));
  const removed = [];
  const client = { from: () => ({ delete: () => ({ eq: async (_field, userId) => { removed.push(userId); return { error: null }; } }) }) };
  await deleteAccountProgress(client, "user-a");
  assert.deepEqual(removed, ["user-a"]);
  assert.equal(readResults().length, 0);
  assert.equal(localStorage.getItem("keysprint-guest-progress-owner-v1"), "deleted:user-a");
});
