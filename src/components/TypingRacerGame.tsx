"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { GHOST_FINISH_SECONDS, RACE_TIME_LIMIT, RACE_WORD_COUNT, newRace, raceReducer, raceWord } from "@/lib/typing-racer";
import { recordDailyActivity } from "@/lib/daily-challenge";
import { readGameBest, saveGameBest } from "@/lib/progress-storage";

const BEST_MODE = "typing-racer";

export default function TypingRacerGame() {
  const [race, dispatch] = useReducer(raceReducer, undefined, newRace);
  const [best, setBest] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const target = raceWord(race, race.wordIndex);
  const playerProgress = Math.min(1, (race.wordIndex + (race.input && target.startsWith(race.input) ? race.input.length / target.length : 0)) / RACE_WORD_COUNT);
  const validPrefix = target.startsWith(race.input);
  const secondsLeft = Math.ceil(RACE_TIME_LIMIT - race.elapsed);

  useEffect(() => {
    const refresh = () => setBest(readGameBest(BEST_MODE));
    refresh();
    window.addEventListener("keysprint-progress-update", refresh);
    return () => window.removeEventListener("keysprint-progress-update", refresh);
  }, []);

  useEffect(() => {
    if (race.status !== "running") return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      dispatch({ type: "tick", seconds: Math.min((now - last) / 1000, 0.2) });
      last = now;
    }, 50);
    return () => window.clearInterval(timer);
  }, [race.status]);

  useEffect(() => {
    const pauseWhenHidden = () => { if (document.hidden) dispatch({ type: "pause" }); };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  useEffect(() => {
    if (race.status !== "finished" || race.score <= best) return;
    setBest(race.score);
    try { saveGameBest(BEST_MODE, race.score); } catch { /* Keep the score for this visit. */ }
  }, [race.status, race.score, best]);

  useEffect(() => {
    if (race.status === "finished") recordDailyActivity({ kind: "game", gameId: "racer", score: race.score });
  }, [race.status, race.score]);

  function play() {
    dispatch({ type: "start", seed: Math.floor(Math.random() * 0x100000000) });
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  return <section className="racer-game" aria-label="Typing Racer game">
    <div className="racer-header"><div className="racer-brand"><span className="racer-brand-mark">R<span>↗</span></span><div><span>KEYSPRINT ARCADE / 05</span><strong>TYPING RACER</strong></div></div><div className="racer-header-right"><span className="racer-live"><i /> NIGHT CIRCUIT</span><span className="racer-best">PERSONAL BEST <strong>{best.toLocaleString()}</strong></span></div></div>
    <div className="racer-hud"><div><span>YOUR POSITION</span><strong>{Math.round(playerProgress * 100)}<small>%</small></strong></div><div><span>GHOST POSITION</span><strong>{Math.round(race.ghostProgress * 100)}<small>%</small></strong></div><div><span>TIME LEFT</span><strong>{secondsLeft}<small>s</small></strong></div><div><span>COMBO</span><strong>{race.combo}<small>×</small></strong></div><div><span>SCORE</span><strong>{race.score.toLocaleString()}</strong></div></div>
    <div className="racer-arena">
      <div className="racer-grid" aria-hidden="true" />
      <div className="racer-arena-heading"><span>STAGE 05 / NIGHT CIRCUIT</span><span>{race.nitroRemaining > 0 ? "NITRO ACTIVE · GHOST FROZEN" : `GHOST PACE / ${GHOST_FINISH_SECONDS} SEC`}</span></div>
      <div className="racer-target-zone"><span>TYPE TO DRIVE</span><div className={`racer-target${race.input && !validPrefix ? " is-error" : ""}`}>{race.status === "running" ? race.input && validPrefix ? <><b>{race.input}</b>{target.slice(race.input.length)}</> : target : "READY TO RACE"}</div><p>{race.status === "running" ? race.input && !validPrefix ? "Wrong turn — Backspace and correct it." : `${race.wordIndex} of ${RACE_WORD_COUNT} words cleared · Exact words advance your racer` : "Every correct word pushes your racer toward the finish line."}</p></div>
      <div className="racer-track" aria-label={`Your racer ${Math.round(playerProgress * 100)} percent, ghost ${Math.round(race.ghostProgress * 100)} percent`}>
        <div className="racer-lane racer-lane-ghost"><span className="racer-lane-label">GHOST / 02</span><div className="racer-vehicle racer-vehicle-ghost" style={{ left: `${4 + race.ghostProgress * 91}%` }}><i/></div></div>
        <div className="racer-lane racer-lane-player"><span className="racer-lane-label">YOU / 01</span><div className="racer-vehicle racer-vehicle-player" style={{ left: `${4 + playerProgress * 91}%` }}><i/></div></div>
        <div className="racer-finish-line" aria-hidden="true"><span>FINISH</span></div>
      </div>
      <div className="racer-track-foot"><span>START / 00</span><span>CHECKPOINTS · 25% / 50% / 75%</span><span>FINISH / {RACE_WORD_COUNT}</span></div>
      {race.status !== "running" && <div className="racer-overlay"><div className="racer-overlay-content"><span className="racer-overlay-kicker">{race.status === "finished" ? race.winner === "player" ? "YOU WON THE RACE" : "THE GHOST WON THIS ROUND" : race.status === "paused" ? "RACE PAUSED" : "NEW GAME / NIGHT CIRCUIT"}</span><h2>{race.status === "finished" ? race.winner === "player" ? <>You beat<br /><em>the ghost.</em></> : <>The finish is<br /><em>still ahead.</em></> : race.status === "paused" ? <>Back on<br /><em>the track?</em></> : <>Race your<br /><em>own rhythm.</em></>}</h2><p>{race.status === "finished" ? `${race.wordIndex}/${RACE_WORD_COUNT} words · ${race.bestCombo} best combo · ${race.mistakes} mistakes · ${race.score.toLocaleString()} points` : race.status === "paused" ? "Your progress is saved until you resume." : "Clear 24 words before the ghost reaches the finish. Every four-word streak earns a Nitro charge that freezes the ghost for three seconds."}</p><button type="button" onClick={play}>{race.status === "paused" ? "Resume race ↗" : race.status === "finished" ? "Race again ↗" : "Start racing ↗"}</button></div></div>}
    </div>
    <div className="racer-console"><div className="racer-input-wrap"><label htmlFor="racer-input">RACE INPUT / TYPE THE HIGHLIGHTED WORD</label><input ref={inputRef} id="racer-input" type="text" inputMode="text" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} disabled={race.status !== "running"} value={race.input} onChange={event => dispatch({ type: "type", value: event.target.value })} placeholder={race.status === "running" ? "Type here to accelerate…" : "Press Start racing to begin"} /><span>Next up: {race.status === "running" ? [1, 2, 3].filter(step => race.wordIndex + step < RACE_WORD_COUNT).map(step => raceWord(race, race.wordIndex + step)).join("  ·  ") || "Finish line ahead!" : "Stay sharp. Stay fast."}</span></div><div className="racer-console-actions"><button type="button" className={`racer-nitro${race.nitroRemaining > 0 ? " is-active" : ""}`} onClick={() => dispatch({ type: "nitro" })} disabled={race.status !== "running" || race.nitroCharges === 0 || race.nitroRemaining > 0}><span>✦ NITRO BOOST</span><strong>{race.nitroRemaining > 0 ? "ACTIVE" : `${race.nitroCharges} / 2`}</strong></button><div className="racer-secondary-actions">{race.status === "running" && <button type="button" onClick={() => dispatch({ type: "pause" })}>Pause Ⅱ</button>}{(race.status === "paused" || race.status === "finished") && <button type="button" onClick={() => dispatch({ type: "reset" })}>New race ↻</button>}</div></div></div>
  </section>;
}
