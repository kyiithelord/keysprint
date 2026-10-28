/** Storage remains local for guests and is namespaced after a verified sign-in. */
let activeUserId: string | null = null;

export const progressKeys = {
  results: "keysprint-results-v1",
  lessons: "keysprint-lessons-v1",
  daily: "keysprint-daily-challenges-v1",
  gameBest: (mode: string) => `keysprint-${mode}-best-v1`,
};

export const gameBestModes = ["word-rush", "sprint", "precision", "memory", "typing-racer"] as const;

export function getActiveProgressUser(): string | null {
  return activeUserId;
}

export function setActiveProgressUser(id: string | null): void {
  if (activeUserId === id) return;
  activeUserId = id;
  if (typeof window !== "undefined") window.dispatchEvent(new Event("keysprint-progress-update"));
}

export function progressStorageKey(base: string, userId = activeUserId): string {
  return userId ? `${base}:user:${userId}` : base;
}

export function notifyProgressChanged(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("keysprint-progress-update"));
}

export function readGameBest(mode: string, userId?: string | null): number {
  try {
    const score = Number(localStorage.getItem(progressStorageKey(progressKeys.gameBest(mode), userId)));
    return Number.isFinite(score) ? Math.max(0, score) : 0;
  }
  catch { return 0; }
}

export function saveGameBest(mode: string, score: number): void {
  if (!Number.isFinite(score) || score < 0) return;
  try {
    localStorage.setItem(progressStorageKey(progressKeys.gameBest(mode)), String(score));
    notifyProgressChanged();
  } catch { /* The game still works without storage. */ }
}
