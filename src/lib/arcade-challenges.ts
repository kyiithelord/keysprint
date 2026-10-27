import { GAME_WORDS } from "./word-game";

export type ChallengeMode = "sprint" | "precision" | "memory";
export type ChallengeStatus = "ready" | "running" | "paused" | "finished";
export type ChallengeState = {
  mode: ChallengeMode;
  status: ChallengeStatus;
  round: number;
  input: string;
  score: number;
  combo: number;
  bestCombo: number;
  lives: number;
  elapsed: number;
  reveal: number;
  feedback: string;
};

export const SPRINT_DURATION = 30;
export const PRECISION_ROUNDS = 12;
export const MEMORY_ROUNDS = 8;
export const CHALLENGE_LIVES = 3;
export const MEMORY_REVEAL_SECONDS = 2.5;

export function challengeWord(mode: ChallengeMode, round: number): string {
  const offset = mode === "sprint" ? 0 : mode === "precision" ? 5 : 11;
  return GAME_WORDS[(round * 7 + Math.floor(round / 3) + offset) % GAME_WORDS.length];
}

export function newChallenge(mode: ChallengeMode): ChallengeState {
  return { mode, status: "ready", round: 0, input: "", score: 0, combo: 0, bestCombo: 0, lives: CHALLENGE_LIVES, elapsed: 0, reveal: 0, feedback: "" };
}

export function startChallenge(state: ChallengeState): ChallengeState {
  if (state.status === "paused") return { ...state, status: "running" };
  return { ...newChallenge(state.mode), status: "running", reveal: state.mode === "memory" ? MEMORY_REVEAL_SECONDS : 0 };
}

export function tickChallenge(state: ChallengeState, seconds: number): ChallengeState {
  if (state.status !== "running" || seconds <= 0) return state;
  const elapsed = state.elapsed + seconds;
  if (state.mode === "sprint" && elapsed >= SPRINT_DURATION) {
    return { ...state, elapsed: SPRINT_DURATION, status: "finished", input: "" };
  }
  return { ...state, elapsed, reveal: Math.max(0, state.reveal - seconds) };
}

function nextRound(state: ChallengeState, correct: boolean): ChallengeState {
  const combo = correct ? state.combo + 1 : 0;
  const lives = correct || state.mode === "sprint" ? state.lives : state.lives - 1;
  const round = state.round + 1;
  const limit = state.mode === "precision" ? PRECISION_ROUNDS : MEMORY_ROUNDS;
  const finished = lives <= 0 || (state.mode !== "sprint" && round >= limit);
  return {
    ...state,
    round,
    input: "",
    lives,
    combo,
    bestCombo: Math.max(state.bestCombo, combo),
    score: state.score + (correct ? challengeWord(state.mode, state.round).length * 10 + Math.min(combo - 1, 10) * 5 : 0),
    reveal: !finished && state.mode === "memory" ? MEMORY_REVEAL_SECONDS : 0,
    feedback: correct ? "Nice! Keep the streak going." : `Missed “${challengeWord(state.mode, state.round)}”. One life lost.`,
    status: finished ? "finished" : "running",
  };
}

export function typeChallenge(state: ChallengeState, value: string): ChallengeState {
  if (state.status !== "running" || (state.mode === "memory" && state.reveal > 0)) return state;
  const input = value.toLowerCase().replace(/[^a-z]/g, "").slice(0, 20);
  if (state.mode === "sprint" && input === challengeWord(state.mode, state.round)) return nextRound(state, true);
  return { ...state, input, feedback: "" };
}

export function submitChallenge(state: ChallengeState): ChallengeState {
  if (state.status !== "running" || state.mode === "sprint" || (state.mode === "memory" && state.reveal > 0) || !state.input) return state;
  return nextRound(state, state.input === challengeWord(state.mode, state.round));
}

export type ChallengeAction =
  | { type: "start" }
  | { type: "pause" }
  | { type: "reset" }
  | { type: "tick"; seconds: number }
  | { type: "type"; value: string }
  | { type: "submit" };

export function challengeReducer(state: ChallengeState, action: ChallengeAction): ChallengeState {
  switch (action.type) {
    case "start": return startChallenge(state);
    case "pause": return state.status === "running" ? { ...state, status: "paused" } : state;
    case "reset": return newChallenge(state.mode);
    case "tick": return tickChallenge(state, action.seconds);
    case "type": return typeChallenge(state, action.value);
    case "submit": return submitChallenge(state);
  }
}
