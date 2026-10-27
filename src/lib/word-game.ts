export type GameStatus = "ready" | "running" | "paused" | "finished";
export type FallingWord = { id: number; text: string; lane: number; progress: number };
export type GameState = {
  status: GameStatus;
  words: FallingWord[];
  typed: string;
  score: number;
  combo: number;
  bestCombo: number;
  cleared: number;
  lives: number;
  elapsed: number;
  nextSpawnAt: number;
  nextId: number;
};

export const GAME_DURATION = 60;
export const GAME_LIVES = 3;
export const GAME_WORDS = [
  "flow", "focus", "quick", "bright", "tempo", "spark", "pulse", "dream",
  "rhythm", "swift", "glide", "level", "orbit", "steady", "skill", "bloom",
  "typing", "energy", "motion", "winner", "rocket", "practice", "perfect", "forward",
];

export function newGame(): GameState {
  return { status: "ready", words: [], typed: "", score: 0, combo: 0, bestCombo: 0, cleared: 0, lives: GAME_LIVES, elapsed: 0, nextSpawnAt: 0, nextId: 0 };
}

function spawnWord(state: GameState): GameState {
  const id = state.nextId;
  const text = GAME_WORDS[(id * 7 + Math.floor(id / 3)) % GAME_WORDS.length];
  return { ...state, words: [...state.words, { id, text, lane: (id * 2) % 5, progress: 0 }], nextId: id + 1 };
}

export function startGame(state: GameState): GameState {
  if (state.status === "paused") return { ...state, status: "running" };
  const initial = newGame();
  return spawnWord({ ...initial, status: "running", nextSpawnAt: 2.4 });
}

export function advanceGame(state: GameState, seconds: number): GameState {
  if (state.status !== "running" || seconds <= 0) return state;
  const elapsed = Math.min(GAME_DURATION, state.elapsed + seconds);
  const fallSeconds = Math.max(7.5, 12 - elapsed / 15);
  const moved = state.words.map(word => ({ ...word, progress: word.progress + seconds / fallSeconds }));
  const escaped = moved.filter(word => word.progress >= 1).length;
  let next: GameState = {
    ...state,
    elapsed,
    words: moved.filter(word => word.progress < 1),
    lives: Math.max(0, state.lives - escaped),
    combo: escaped ? 0 : state.combo,
  };
  if (next.lives === 0 || elapsed >= GAME_DURATION) return { ...next, status: "finished", typed: "" };
  while (elapsed >= next.nextSpawnAt) {
    next = spawnWord(next);
    next.nextSpawnAt += Math.max(1.2, 2.4 - elapsed / 65);
  }
  return next;
}

export function typeInGame(state: GameState, value: string): GameState {
  if (state.status !== "running") return state;
  const typed = value.toLowerCase().replace(/[^a-z]/g, "").slice(0, 20);
  const match = state.words.filter(word => word.text === typed).sort((a, b) => b.progress - a.progress)[0];
  if (!match) return { ...state, typed };
  const combo = state.combo + 1;
  return {
    ...state,
    words: state.words.filter(word => word.id !== match.id),
    typed: "",
    score: state.score + match.text.length * 10 + Math.min(combo - 1, 10) * 5,
    combo,
    bestCombo: Math.max(state.bestCombo, combo),
    cleared: state.cleared + 1,
  };
}

export type GameAction =
  | { type: "start" }
  | { type: "pause" }
  | { type: "reset" }
  | { type: "tick"; seconds: number }
  | { type: "type"; value: string };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "start": return startGame(state);
    case "pause": return state.status === "running" ? { ...state, status: "paused" } : state;
    case "reset": return newGame();
    case "tick": return advanceGame(state, action.seconds);
    case "type": return typeInGame(state, action.value);
  }
}
