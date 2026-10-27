import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/word-game.ts", import.meta.url), "utf8");
const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { newGame, startGame, advanceGame, typeInGame } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

test("a correct word clears immediately and increases score and combo", () => {
  const running = startGame(newGame());
  const word = running.words[0];
  const partial = typeInGame(running, word.text.slice(0, -1));
  assert.equal(partial.score, 0);
  const cleared = typeInGame(partial, word.text);
  assert.equal(cleared.words.length, 0);
  assert.equal(cleared.score, word.text.length * 10);
  assert.equal(cleared.combo, 1);
  assert.equal(cleared.typed, "");
});

test("missed words cost lives and finish the round after three misses", () => {
  let game = startGame(newGame());
  for (let index = 0; index < 3; index++) {
    game = { ...game, words: [{ id: index, text: "flow", lane: 0, progress: 0.99 }], nextSpawnAt: 100 };
    game = advanceGame(game, 0.2);
  }
  assert.equal(game.lives, 0);
  assert.equal(game.status, "finished");
});

test("a round ends after 60 seconds and paused rounds do not advance", () => {
  const running = startGame(newGame());
  const paused = { ...running, status: "paused" };
  assert.deepEqual(advanceGame(paused, 2), paused);
  const finished = advanceGame({ ...running, words: [], elapsed: 59.9, nextSpawnAt: 100 }, 0.2);
  assert.equal(finished.status, "finished");
  assert.equal(finished.elapsed, 60);
});
