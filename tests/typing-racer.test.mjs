import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const wordSource = await readFile(new URL("../src/lib/word-game.ts", import.meta.url), "utf8");
const wordJs = ts.transpileModule(wordSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { GAME_WORDS } = await import(`data:text/javascript;base64,${Buffer.from(wordJs).toString("base64")}`);
const racerSource = await readFile(new URL("../src/lib/typing-racer.ts", import.meta.url), "utf8");
const standaloneSource = racerSource.replace('import { GAME_WORDS } from "./word-game";', `const GAME_WORDS = ${JSON.stringify(GAME_WORDS)};`);
const racerJs = ts.transpileModule(standaloneSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { newRace, startRace, tickRace, typeRace, useNitro, raceWord, RACE_WORD_COUNT } = await import(`data:text/javascript;base64,${Buffer.from(racerJs).toString("base64")}`);

test("24 cleared words beat the ghost and finish with a score", () => {
  let race = startRace(newRace());
  for (let index = 0; index < RACE_WORD_COUNT; index++) race = typeRace(race, raceWord(index));
  assert.equal(race.status, "finished");
  assert.equal(race.winner, "player");
  assert.equal(race.wordIndex, RACE_WORD_COUNT);
  assert.ok(race.score > 0);
});

test("ghost wins when its progress reaches the finish", () => {
  const race = tickRace(startRace(newRace()), 48);
  assert.equal(race.status, "finished");
  assert.equal(race.winner, "ghost");
});

test("four-word streak earns Nitro and Nitro freezes the ghost", () => {
  let race = startRace(newRace());
  for (let index = 0; index < 4; index++) race = typeRace(race, raceWord(index));
  assert.equal(race.nitroCharges, 1);
  race = useNitro(race);
  assert.equal(race.nitroCharges, 0);
  assert.equal(tickRace(race, 2).ghostProgress, 0);
  assert.ok(tickRace(race, 4).ghostProgress > 0);
});

test("wrong typing counts a mistake and paused races stay still", () => {
  const race = typeRace(startRace(newRace()), "zzz");
  assert.equal(race.mistakes, 1);
  const paused = { ...race, status: "paused" };
  assert.deepEqual(tickRace(paused, 1), paused);
});
