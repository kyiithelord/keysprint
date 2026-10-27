import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/typing.ts", import.meta.url), "utf8");
const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { calculateStats, createTarget } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

test("standard WPM example uses five characters per word", () => {
  const target = "a".repeat(225) + "b".repeat(25);
  const input = "a".repeat(250);
  assert.deepEqual(calculateStats(input, target, 60), {
    rawWpm: 50, netWpm: 45, accuracy: 90, correct: 225, incorrect: 25, evaluated: 250,
  });
});

test("backspace correction changes current counts", () => {
  assert.equal(calculateStats("abx", "abc", 30).incorrect, 1);
  assert.deepEqual(calculateStats("abc", "abc", 30), {
    rawWpm: 1, netWpm: 1, accuracy: 100, correct: 3, incorrect: 0, evaluated: 3,
  });
});

test("empty input and zero elapsed time avoid division errors", () => {
  assert.deepEqual(calculateStats("", "abc", 0), {
    rawWpm: 0, netWpm: 0, accuracy: 100, correct: 0, incorrect: 0, evaluated: 0,
  });
  assert.equal(calculateStats("abc", "abc", 0).netWpm, 0);
});

test("each supported configuration creates a nonempty target", () => {
  for (const duration of [15, 30, 60, 120]) {
    for (const difficulty of ["easy", "standard", "advanced"]) {
      for (const mode of ["words", "sentences"]) {
        assert.ok(createTarget(mode, difficulty, duration).length > duration * 4);
      }
    }
  }
});
