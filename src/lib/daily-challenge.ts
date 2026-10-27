export type DailyTask = "test" | "lesson" | "game";
export type DailyGame = "rush" | "sprint" | "precision" | "memory" | "racer";
export type DailyRecord = { test: boolean; lesson: boolean; game: boolean };
export type DailyRecords = Record<string, DailyRecord>;
export type DailyPlan = { date: string; duration: 15 | 30 | 60; lessonId: string; gameId: DailyGame };
export type DailyActivity =
  | { kind: "test"; duration: number; correct: number }
  | { kind: "lesson"; lessonId: string }
  | { kind: "game"; gameId: DailyGame; score: number };

const STORAGE_KEY = "keysprint-daily-challenges-v1";
const DURATIONS = [15, 30, 60] as const;
const LESSON_IDS = ["home-row", "top-row", "bottom-row", "sentences"] as const;
const GAME_IDS: DailyGame[] = ["rush", "sprint", "precision", "memory", "racer"];
const emptyRecord = (): DailyRecord => ({ test: false, lesson: false, game: false });

export function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dayNumber(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function previousDay(dateKey: string): string {
  const date = new Date((dayNumber(dateKey) - 1) * 86400000);
  return date.toISOString().slice(0, 10);
}

export function dailyPlan(dateKey: string): DailyPlan {
  const day = dayNumber(dateKey);
  return {
    date: dateKey,
    duration: DURATIONS[day % DURATIONS.length],
    lessonId: LESSON_IDS[day % LESSON_IDS.length],
    gameId: GAME_IDS[day % GAME_IDS.length],
  };
}

export function activityMatches(plan: DailyPlan, activity: DailyActivity): boolean {
  switch (activity.kind) {
    case "test": return activity.duration === plan.duration && activity.correct > 0;
    case "lesson": return activity.lessonId === plan.lessonId;
    case "game": return activity.gameId === plan.gameId && activity.score > 0;
  }
}

export function completeRecord(record: DailyRecord | undefined): boolean {
  return Boolean(record?.test && record?.lesson && record?.game);
}

export function currentStreak(records: DailyRecords, today: string): number {
  let date = completeRecord(records[today]) ? today : previousDay(today);
  let streak = 0;
  while (completeRecord(records[date]) && streak < 10000) {
    streak++;
    date = previousDay(date);
  }
  return streak;
}

export function bestStreak(records: DailyRecords): number {
  const dates = Object.keys(records).filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date) && completeRecord(records[date])).sort();
  let best = 0;
  let current = 0;
  let previous = "";
  for (const date of dates) {
    current = previous && previousDay(date) === previous ? current + 1 : 1;
    best = Math.max(best, current);
    previous = date;
  }
  return best;
}

export function readDailyRecords(): DailyRecords {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([date, record]) =>
      /^\d{4}-\d{2}-\d{2}$/.test(date) && record && typeof record === "object" &&
      typeof (record as DailyRecord).test === "boolean" &&
      typeof (record as DailyRecord).lesson === "boolean" &&
      typeof (record as DailyRecord).game === "boolean")) as DailyRecords;
  } catch { return {}; }
}

export function recordDailyActivity(activity: DailyActivity, date = new Date()): boolean {
  const today = localDateKey(date);
  const plan = dailyPlan(today);
  if (!activityMatches(plan, activity)) return false;
  try {
    const records = readDailyRecords();
    const record = { ...emptyRecord(), ...records[today] };
    if (record[activity.kind]) return false;
    record[activity.kind] = true;
    records[today] = record;
    const recent = Object.fromEntries(Object.entries(records).sort(([a], [b]) => b.localeCompare(a)).slice(0, 400));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    window.dispatchEvent(new Event("keysprint-daily-update"));
    return true;
  } catch { return false; }
}
