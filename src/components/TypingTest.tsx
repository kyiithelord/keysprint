"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { calculateStats, createTarget, readResults, saveResult, type Difficulty, type Duration, type Mode, type SavedResult } from "@/lib/typing";

const durations: Duration[] = [15, 30, 60, 120];

export default function TypingTest() {
  const [duration, setDuration] = useState<Duration>(30);
  const [difficulty, setDifficulty] = useState<Difficulty>("standard");
  const [mode, setMode] = useState<Mode>("words");
  const [target, setTarget] = useState(() => createTarget("words", "standard", 30));
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState(30);
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState<"ready" | "running" | "finished">("ready");
  const [result, setResult] = useState<SavedResult | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef<number | null>(null);
  const inputRefValue = useRef("");
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    try { localStorage.setItem("keysprint-storage-check", "1"); localStorage.removeItem("keysprint-storage-check"); }
    catch { setStorageAvailable(false); }
    setBest(Math.max(0, ...readResults().filter(item => item.duration === duration && item.difficulty === difficulty && item.mode === mode).map(item => item.netWpm)));
  }, [duration, difficulty, mode]);

  const finish = useCallback(() => {
    if (startedAt.current === null) return;
    const actualElapsed = Math.min(duration, (performance.now() - startedAt.current) / 1000);
    const final = { ...calculateStats(inputRefValue.current, target, actualElapsed), duration, difficulty, mode, finishedAt: new Date().toISOString() };
    setResult(final);
    saveResult(final);
    setBest(previous => Math.max(previous ?? 0, final.netWpm));
    setRemaining(0);
    setElapsed(actualElapsed);
    setStatus("finished");
    startedAt.current = null;
  }, [duration, difficulty, mode, target]);
  finishRef.current = finish;

  useEffect(() => {
    if (status !== "running") return;
    const tick = () => {
      if (startedAt.current === null) return;
      const seconds = (performance.now() - startedAt.current) / 1000;
      if (seconds >= duration) { finishRef.current(); return; }
      setElapsed(seconds);
      setRemaining(Math.ceil(duration - seconds));
    };
    const interval = window.setInterval(tick, 100);
    return () => window.clearInterval(interval);
  }, [status, duration]);

  const reset = useCallback((nextDuration = duration, nextDifficulty = difficulty, nextMode = mode) => {
    startedAt.current = null;
    inputRefValue.current = "";
    setInput(""); setElapsed(0); setRemaining(nextDuration); setStatus("ready"); setResult(null);
    setTarget(createTarget(nextMode, nextDifficulty, nextDuration));
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, [duration, difficulty, mode]);

  const handleInput = (value: string) => {
    if (status === "finished") return;
    if (startedAt.current !== null && performance.now() - startedAt.current >= duration * 1000) {
      finishRef.current();
      return;
    }
    const next = Array.from(value).slice(0, Array.from(target).length).join("");
    if (next && startedAt.current === null) { startedAt.current = performance.now(); setStatus("running"); }
    inputRefValue.current = next;
    setInput(next);
  };

  useEffect(() => {
    const prompt = promptRef.current;
    const current = prompt?.querySelector<HTMLElement>(".current");
    if (prompt && current) prompt.scrollTop = Math.max(0, current.offsetTop - prompt.offsetTop - 45);
  }, [input]);

  const live = calculateStats(input, target, elapsed);
  const stats = result ?? live;
  const targetCharacters = Array.from(target);
  const typedCharacters = Array.from(input);

  return <section className="workspace-section" id="practice"><div className="section-heading"><div><p className="eyebrow">YOUR WORKSPACE / 01</p><h2>Put your fingers<br />to work.</h2></div><p>Pick your pace, find your focus, and see how far you can go.</p></div><div className="test-card"><div className="test-topline"><span><span className="status-dot" /> {status === "finished" ? "SESSION COMPLETE" : status === "running" ? "TEST IN PROGRESS" : "READY WHEN YOU ARE"}</span><span>KEYSPRINT / TYPING LAB</span></div><div className="test-settings"><div><span className="setting-label">DURATION</span><div className="segments" aria-label="Test duration">{durations.map(item => <button key={item} className={duration === item ? "selected" : ""} onClick={() => { setDuration(item); reset(item, difficulty, mode); }} aria-pressed={duration === item}>{item}s</button>)}</div></div><div><label className="setting-label" htmlFor="difficulty">DIFFICULTY</label><select id="difficulty" value={difficulty} onChange={event => { const next = event.target.value as Difficulty; setDifficulty(next); reset(duration, next, mode); }}><option value="easy">Easy</option><option value="standard">Standard</option><option value="advanced">Advanced</option></select></div><div><label className="setting-label" htmlFor="mode">MODE</label><select id="mode" value={mode} onChange={event => { const next = event.target.value as Mode; setMode(next); reset(duration, difficulty, next); }}><option value="words">Words</option><option value="sentences">Sentences</option></select></div></div><div className="metrics" aria-live="off"><div><span>TIME LEFT</span><strong>{remaining}<small>s</small></strong></div><div><span>NET WPM</span><strong>{stats.netWpm}</strong></div><div><span>RAW WPM</span><strong>{stats.rawWpm}</strong></div><div><span>ACCURACY</span><strong>{stats.accuracy}<small>%</small></strong></div></div>{status === "finished" && result ? <div className="result-panel" aria-live="polite"><p className="eyebrow">SESSION COMPLETE</p><h3>Another step forward.</h3><p>Your {duration} second test: <strong>{result.netWpm} net WPM</strong>, {result.rawWpm} raw WPM, and {result.accuracy}% accuracy.</p><div className="result-details"><span><b>{result.correct}</b> correct</span><span><b>{result.incorrect}</b> incorrect</span><span><b>{best ?? result.netWpm}</b> personal best</span></div><p className="local-note">Personal best is saved on this device for this duration, difficulty, and mode.</p><div className="result-actions"><button className="button primary" onClick={() => reset()}>Try again ↗</button><button className="button secondary" onClick={() => { const summary = `I typed ${result.netWpm} net WPM (${result.rawWpm} raw) with ${result.accuracy}% accuracy on KeySprint.`; if (navigator.share) void navigator.share({ text: summary }).catch(() => {}); else if (navigator.clipboard) void navigator.clipboard.writeText(summary).catch(() => {}); }}>Share result ↗</button></div></div> : <><div ref={promptRef} id="target-text" className="typing-prompt" onClick={() => inputRef.current?.focus()}>{targetCharacters.map((character, index) => <span key={index} className={index < typedCharacters.length ? typedCharacters[index] === character ? "correct" : "incorrect" : index === typedCharacters.length ? "current" : ""}>{character}</span>)}</div><label className="sr-only" htmlFor="typing-input">Type the text shown above</label><textarea ref={inputRef} id="typing-input" aria-describedby="target-text" className="typing-input" value={input} onChange={event => handleInput(event.target.value)} disabled={status === "finished"} autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} placeholder="Click here and start typing. The timer begins with your first character." /><div className="test-bottom"><span>{status === "running" ? "Keep your rhythm going." : "Timer starts when you type your first character."}</span><button onClick={() => reset()} aria-label="Restart typing test">↻ <span>Restart test</span></button></div></>}{!storageAvailable && <p className="storage-note">Local storage is unavailable. Your current test will work, but your best score cannot be saved.</p>}</div></section>;
}
