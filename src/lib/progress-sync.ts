import type { SupabaseClient } from "@supabase/supabase-js";
import { readResultsForUser, type SavedResult } from "./typing";
import { readDailyRecordsForUser, type DailyRecord } from "./daily-challenge";
import { gameBestModes, notifyProgressChanged, progressKeys, progressStorageKey, readGameBest } from "./progress-storage";

type ProgressEvent = { event_key: string; kind: "result" | "lesson" | "daily" | "game_best"; payload: Record<string, unknown> };
export type SyncState = { state: "signed-out" | "syncing" | "synced" | "error"; message?: string };
let syncState: SyncState = { state: "signed-out" };
let syncPaused = false;
let currentSync: Promise<void> | null = null;

export function getSyncState(): SyncState { return syncState; }
export function isSyncPaused(): boolean { return syncPaused; }
export function setSyncState(next: SyncState): void {
  syncState = next;
  if (typeof window !== "undefined") window.dispatchEvent(new Event("keysprint-sync-status"));
}

function readLessons(userId: string | null): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(progressStorageKey(progressKeys.lessons, userId)) || "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && ["home-row", "top-row", "bottom-row", "sentences"].includes(item)) : [];
  } catch { return []; }
}

export function collectProgressEvents(userId: string | null): ProgressEvent[] {
  const events: ProgressEvent[] = [];
  for (const result of readResultsForUser(userId)) {
    const event_key = `result:${result.finishedAt}:${result.duration}:${result.difficulty}:${result.mode}:${result.netWpm}:${result.rawWpm}:${result.accuracy}`;
    events.push({ event_key, kind: "result", payload: result });
  }
  for (const lessonId of readLessons(userId)) events.push({ event_key: `lesson:${lessonId}`, kind: "lesson", payload: { lessonId } });
  for (const [date, record] of Object.entries(readDailyRecordsForUser(userId))) {
    for (const task of ["test", "lesson", "game"] as const) if (record[task]) events.push({ event_key: `daily:${date}:${task}`, kind: "daily", payload: { date, task } });
  }
  for (const mode of gameBestModes) {
    const score = readGameBest(mode, userId);
    if (score > 0) events.push({ event_key: `game_best:${mode}:${score}`, kind: "game_best", payload: { mode, score } });
  }
  return events;
}

function isSavedResult(value: unknown): value is SavedResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<SavedResult>;
  return typeof result.finishedAt === "string" && Number.isFinite(Date.parse(result.finishedAt)) &&
    [15, 30, 60, 120].includes(result.duration as number) && ["easy", "standard", "advanced"].includes(result.difficulty as string) &&
    ["words", "sentences"].includes(result.mode as string) &&
    [result.rawWpm, result.netWpm, result.accuracy, result.correct, result.incorrect, result.evaluated].every(value => typeof value === "number" && Number.isFinite(value) && value >= 0);
}

export function mergeProgressEvents(events: ProgressEvent[], userId: string): void {
  const results = readResultsForUser(userId);
  const resultKeys = new Set(results.map(item => `${item.finishedAt}:${item.duration}:${item.difficulty}:${item.mode}:${item.netWpm}:${item.rawWpm}:${item.accuracy}`));
  const lessons = new Set(readLessons(userId));
  const daily = readDailyRecordsForUser(userId);
  const best = Object.fromEntries(gameBestModes.map(mode => [mode, readGameBest(mode, userId)])) as Record<string, number>;

  for (const event of events) {
    const payload = event.payload;
    if (!payload || typeof payload !== "object") continue;
    if (event.kind === "result" && isSavedResult(payload)) {
      const key = `${payload.finishedAt}:${payload.duration}:${payload.difficulty}:${payload.mode}:${payload.netWpm}:${payload.rawWpm}:${payload.accuracy}`;
      if (!resultKeys.has(key)) { results.push(payload); resultKeys.add(key); }
    } else if (event.kind === "lesson" && typeof payload.lessonId === "string" && ["home-row", "top-row", "bottom-row", "sentences"].includes(payload.lessonId)) {
      lessons.add(payload.lessonId);
    } else if (event.kind === "daily" && typeof payload.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(payload.date) && ["test", "lesson", "game"].includes(payload.task as string)) {
      const task = payload.task as keyof DailyRecord;
      daily[payload.date] = { ...(daily[payload.date] ?? { test: false, lesson: false, game: false }), [task]: true };
    } else if (event.kind === "game_best" && typeof payload.mode === "string" && gameBestModes.includes(payload.mode as typeof gameBestModes[number]) && typeof payload.score === "number" && Number.isFinite(payload.score)) {
      best[payload.mode] = Math.max(best[payload.mode], payload.score);
    }
  }

  results.sort((a, b) => Date.parse(b.finishedAt) - Date.parse(a.finishedAt));
  let changed = false;
  const write = (key: string, value: string) => {
    if (localStorage.getItem(key) !== value) { localStorage.setItem(key, value); changed = true; }
  };
  write(progressStorageKey(progressKeys.results, userId), JSON.stringify(results.slice(0, 100)));
  write(progressStorageKey(progressKeys.lessons, userId), JSON.stringify([...lessons]));
  write(progressStorageKey(progressKeys.daily, userId), JSON.stringify(Object.fromEntries(Object.entries(daily).sort(([a], [b]) => b.localeCompare(a)).slice(0, 400))));
  for (const mode of gameBestModes) write(progressStorageKey(progressKeys.gameBest(mode), userId), String(best[mode]));
  if (changed) { notifyProgressChanged(); window.dispatchEvent(new Event("keysprint-daily-update")); }
}

const GUEST_OWNER_KEY = "keysprint-guest-progress-owner-v1";
export function importGuestProgress(userId: string): void {
  const owner = localStorage.getItem(GUEST_OWNER_KEY);
  if (owner && owner !== userId) return;
  const events = collectProgressEvents(null);
  if (!owner && events.length) localStorage.setItem(GUEST_OWNER_KEY, userId);
  if (events.length) mergeProgressEvents(events, userId);
}

async function performSync(client: SupabaseClient, userId: string): Promise<void> {
  const events = collectProgressEvents(userId);
  for (let index = 0; index < events.length; index += 150) {
    const rows = events.slice(index, index + 150).map(event => ({ ...event, user_id: userId }));
    const { error } = await client.from("progress_events").upsert(rows, { onConflict: "user_id,event_key", ignoreDuplicates: true });
    if (error) throw error;
  }

  const remote: ProgressEvent[] = [];
  for (let index = 0; ; index += 500) {
    const { data, error } = await client.from("progress_events").select("event_key,kind,payload").eq("user_id", userId).order("event_key").range(index, index + 499);
    if (error) throw error;
    remote.push(...(data as ProgressEvent[]));
    if (!data || data.length < 500) break;
  }
  mergeProgressEvents(remote, userId);
}

export async function syncProgress(client: SupabaseClient, userId: string): Promise<void> {
  if (syncPaused) return;
  const task = performSync(client, userId);
  currentSync = task;
  try { await task; }
  finally { if (currentSync === task) currentSync = null; }
}

export async function deleteAccountProgress(client: SupabaseClient, userId: string): Promise<void> {
  syncPaused = true;
  try {
    if (currentSync) await currentSync.catch(() => {});
    const { error } = await client.from("progress_events").delete().eq("user_id", userId);
    if (error) throw error;
    for (const base of [progressKeys.results, progressKeys.lessons, progressKeys.daily, ...gameBestModes.map(progressKeys.gameBest)]) {
      localStorage.removeItem(progressStorageKey(base, userId));
    }
    localStorage.setItem(GUEST_OWNER_KEY, `deleted:${userId}`);
    notifyProgressChanged();
    window.dispatchEvent(new Event("keysprint-daily-update"));
    setSyncState({ state: "synced" });
  } finally { syncPaused = false; }
}
