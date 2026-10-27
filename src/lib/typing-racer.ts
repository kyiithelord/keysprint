import { GAME_WORDS } from "./word-game";

export const RACE_WORD_COUNT = 24;
export const RACE_TIME_LIMIT = 55;
export const GHOST_FINISH_SECONDS = 48;
export const NITRO_SECONDS = 3;

export type RaceStatus = "ready" | "running" | "paused" | "finished";
export type RaceState = {
  status: RaceStatus;
  words: string[];
  lastFirstWord: string | null;
  wordIndex: number;
  input: string;
  score: number;
  combo: number;
  bestCombo: number;
  mistakes: number;
  elapsed: number;
  ghostProgress: number;
  nitroCharges: number;
  nitroRemaining: number;
  winner: "player" | "ghost" | null;
};

export function raceWord(state: RaceState, index: number): string {
  return state.words[index] ?? GAME_WORDS[index % GAME_WORDS.length];
}

export function newRace(lastFirstWord: string | null = null): RaceState {
  return { status: "ready", words: [], lastFirstWord, wordIndex: 0, input: "", score: 0, combo: 0, bestCombo: 0, mistakes: 0, elapsed: 0, ghostProgress: 0, nitroCharges: 0, nitroRemaining: 0, winner: null };
}

export function createRaceWords(seed: number, avoidFirst: string | null = null): string[] {
  const words = [...GAME_WORDS];
  let value = seed >>> 0;
  for (let index = words.length - 1; index > 0; index--) {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    const swapIndex = value % (index + 1);
    [words[index], words[swapIndex]] = [words[swapIndex], words[index]];
  }
  if (words[0] === avoidFirst) {
    const swapIndex = words.findIndex(word => word !== avoidFirst);
    [words[0], words[swapIndex]] = [words[swapIndex], words[0]];
  }
  return words;
}

export function startRace(state: RaceState, seed = 0): RaceState {
  if (state.status === "paused") return { ...state, status: "running" };
  const words = createRaceWords(seed, state.lastFirstWord);
  return { ...newRace(words[0]), status: "running", words };
}

export function tickRace(state: RaceState, seconds: number): RaceState {
  if (state.status !== "running" || seconds <= 0) return state;
  const ghostSeconds = Math.max(0, seconds - state.nitroRemaining);
  const elapsed = Math.min(RACE_TIME_LIMIT, state.elapsed + seconds);
  const ghostProgress = Math.min(1, state.ghostProgress + ghostSeconds / GHOST_FINISH_SECONDS);
  const finished = ghostProgress >= 1 || elapsed >= RACE_TIME_LIMIT;
  return { ...state, elapsed, ghostProgress, nitroRemaining: Math.max(0, state.nitroRemaining - seconds), status: finished ? "finished" : "running", winner: finished ? "ghost" : null, input: finished ? "" : state.input };
}

export function typeRace(state: RaceState, value: string): RaceState {
  if (state.status !== "running") return state;
  const input = value.toLowerCase().replace(/[^a-z]/g, "").slice(0, 20);
  const target = raceWord(state, state.wordIndex);
  const mistakes = state.mistakes + Number(input.length > state.input.length && !target.startsWith(input));
  if (input !== target) return { ...state, input, mistakes };
  const wordIndex = state.wordIndex + 1;
  const combo = state.combo + 1;
  const finished = wordIndex >= RACE_WORD_COUNT;
  return {
    ...state,
    wordIndex,
    input: "",
    mistakes,
    combo,
    bestCombo: Math.max(state.bestCombo, combo),
    score: state.score + target.length * 12 + Math.min(combo - 1, 10) * 8 + (finished ? Math.ceil(RACE_TIME_LIMIT - state.elapsed) * 20 : 0),
    nitroCharges: Math.min(2, state.nitroCharges + Number(combo % 4 === 0)),
    status: finished ? "finished" : "running",
    winner: finished ? "player" : null,
  };
}

export function useNitro(state: RaceState): RaceState {
  if (state.status !== "running" || state.nitroCharges === 0 || state.nitroRemaining > 0) return state;
  return { ...state, nitroCharges: state.nitroCharges - 1, nitroRemaining: NITRO_SECONDS };
}

export type RaceAction =
  | { type: "start"; seed: number }
  | { type: "pause" }
  | { type: "reset" }
  | { type: "tick"; seconds: number }
  | { type: "type"; value: string }
  | { type: "nitro" };

export function raceReducer(state: RaceState, action: RaceAction): RaceState {
  switch (action.type) {
    case "start": return startRace(state, action.seed);
    case "pause": return state.status === "running" ? { ...state, status: "paused" } : state;
    case "reset": return newRace(state.lastFirstWord);
    case "tick": return tickRace(state, action.seconds);
    case "type": return typeRace(state, action.value);
    case "nitro": return useNitro(state);
  }
}
