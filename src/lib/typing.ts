export type Duration = 15 | 30 | 60 | 120;
export type Difficulty = "easy" | "standard" | "advanced";
export type Mode = "words" | "sentences";

export type Stats = {
  rawWpm: number;
  netWpm: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  evaluated: number;
};

/** Only characters still present in the input are evaluated. Backspace removes a character from both counts. */
export function calculateStats(input: string, target: string, elapsedSeconds: number): Stats {
  const characters = Array.from(input);
  const expected = Array.from(target);
  const correct = characters.reduce((count, character, index) => count + Number(character === expected[index]), 0);
  const evaluated = characters.length;
  const incorrect = evaluated - correct;
  const minutes = elapsedSeconds / 60;
  return {
    rawWpm: minutes > 0 ? Math.round(evaluated / 5 / minutes) : 0,
    netWpm: minutes > 0 ? Math.round(correct / 5 / minutes) : 0,
    accuracy: evaluated > 0 ? Math.round((correct / evaluated) * 100) : 100,
    correct,
    incorrect,
    evaluated,
  };
}

const passages: Record<Mode, Record<Difficulty, string[]>> = {
  words: {
    easy: ["time", "light", "home", "green", "water", "small", "dream", "music", "happy", "fresh", "table", "learn", "simple", "quiet", "bright"],
    standard: ["practice", "steady", "progress", "keyboard", "rhythm", "focus", "accuracy", "improve", "curious", "confident", "measure", "balance"],
    advanced: ["precision", "momentum", "deliberate", "consistency", "technique", "concentration", "refinement", "coordination", "persistence", "adaptability"],
  },
  sentences: {
    easy: ["Small steps lead to steady progress.", "Take your time and find your rhythm.", "Every day is a chance to learn."],
    standard: ["A steady rhythm can make difficult work feel easier.", "Good habits grow when you practice with patience.", "Focus on each key, then let your speed follow."],
    advanced: ["Precision grows through deliberate practice, not hurried repetition.", "When your attention wanders, pause briefly and return to the next word.", "Consistent technique turns unfamiliar patterns into comfortable movements."],
  },
};

export function createTarget(mode: Mode, difficulty: Difficulty, duration: Duration): string {
  const items = passages[mode][difficulty];
  // Keep enough text for unusually fast typists so the clock determines the end.
  const count = duration * 4;
  return Array.from({ length: count }, (_, index) => items[index % items.length]).join(" ");
}

export type SavedResult = Stats & { duration: Duration; difficulty: Difficulty; mode: Mode; finishedAt: string };
const STORAGE_KEY = "keysprint-results-v1";

export function readResults(): SavedResult[] {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter((entry): entry is SavedResult => typeof entry?.netWpm === "number" && typeof entry?.duration === "number") : [];
  } catch {
    return [];
  }
}

export function saveResult(result: SavedResult): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([result, ...readResults()].slice(0, 20)));
  } catch {
    // Typing remains usable when storage is unavailable.
  }
}
