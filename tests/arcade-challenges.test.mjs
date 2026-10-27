import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const wordSource = await readFile(new URL("../src/lib/word-game.ts", import.meta.url), "utf8");
const wordJs = ts.transpileModule(wordSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { GAME_WORDS } = await import(`data:text/javascript;base64,${Buffer.from(wordJs).toString("base64")}`);
const challengeSource = await readFile(new URL("../src/lib/arcade-challenges.ts", import.meta.url), "utf8");
const standaloneSource = challengeSource.replace('import { GAME_WORDS } from "./word-game";', `const GAME_WORDS = ${JSON.stringify(GAME_WORDS)};`);
const challengeJs = ts.transpileModule(standaloneSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { newChallenge, startChallenge, tickChallenge, typeChallenge, submitChallenge, challengeWord } = await import(`data:text/javascript;base64,${Buffer.from(challengeJs).toString("base64")}`);

test("sprint clears exact words without Enter and ends at 30 seconds", () => {
  const start = startChallenge(newChallenge("sprint"));
  const cleared = typeChallenge(start, challengeWord("sprint", 0));
  assert.equal(cleared.round, 1);
  assert.ok(cleared.score > 0);
  assert.equal(tickChallenge({ ...cleared, elapsed: 29.9 }, 0.2).status, "finished");
});

test("precision loses a life on a wrong submission and finishes after three misses", () => {
  let game = startChallenge(newChallenge("precision"));
  for (let index = 0; index < 3; index++) game = submitChallenge(typeChallenge(game, "wrong"));
  assert.equal(game.lives, 0);
  assert.equal(game.status, "finished");
  assert.equal(game.score, 0);
});

test("precision completes after 12 correct words", () => {
  let game = startChallenge(newChallenge("precision"));
  for (let index = 0; index < 12; index++) game = submitChallenge(typeChallenge(game, challengeWord("precision", index)));
  assert.equal(game.status, "finished");
  assert.equal(game.round, 12);
  assert.equal(game.lives, 3);
  assert.equal(game.bestCombo, 12);
});

test("memory word stays hidden for typing until reveal ends", () => {
  let game = startChallenge(newChallenge("memory"));
  assert.equal(typeChallenge(game, "wrong").input, "");
  game = tickChallenge(game, 2.5);
  game = submitChallenge(typeChallenge(game, challengeWord("memory", 0)));
  assert.equal(game.round, 1);
  assert.equal(game.lives, 3);
  assert.ok(game.score > 0);
  assert.ok(game.reveal > 0);
});

test("memory completes after eight recalled words", () => {
  let game = startChallenge(newChallenge("memory"));
  for (let index = 0; index < 8; index++) {
    game = tickChallenge(game, 2.5);
    game = submitChallenge(typeChallenge(game, challengeWord("memory", index)));
  }
  assert.equal(game.status, "finished");
  assert.equal(game.round, 8);
});
