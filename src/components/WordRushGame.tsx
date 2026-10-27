"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { GAME_DURATION, GAME_LIVES, gameReducer, newGame } from "@/lib/word-game";

const BEST_KEY = "keysprint-word-rush-best-v1";

export default function WordRushGame() {
  const [game, dispatch] = useReducer(gameReducer, undefined, newGame);
  const [best, setBest] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { setBest(Number(localStorage.getItem(BEST_KEY)) || 0); } catch { /* Game remains playable without storage. */ }
  }, []);

  useEffect(() => {
    if (game.status !== "running") return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      dispatch({ type: "tick", seconds: Math.min((now - last) / 1000, 0.2) });
      last = now;
    }, 50);
    return () => window.clearInterval(timer);
  }, [game.status]);

  useEffect(() => {
    const pauseWhenHidden = () => { if (document.hidden) dispatch({ type: "pause" }); };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  useEffect(() => {
    if (game.status !== "finished" || game.score <= best) return;
    setBest(game.score);
    try { localStorage.setItem(BEST_KEY, String(game.score)); } catch { /* Keep the score for this visit. */ }
  }, [game.status, game.score, best]);

  function play() {
    dispatch({ type: "start" });
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  const focused = game.typed
    ? game.words.filter(word => word.text.startsWith(game.typed)).sort((a, b) => b.progress - a.progress)[0]
    : undefined;

  return <section className="word-rush" aria-label="Word Rush typing game">
    <div className="rush-topbar"><div><span className="rush-status-light" /> ARCADE / WORD RUSH</div><span>ROUND 01 — SURVIVE THE DROP</span></div>
    <div className="rush-stats" aria-live="off">
      <div><span>SCORE</span><strong>{game.score.toLocaleString()}</strong></div>
      <div><span>COMBO</span><strong>{game.combo}<small> ×</small></strong></div>
      <div><span>TIME LEFT</span><strong>{Math.ceil(GAME_DURATION - game.elapsed)}<small> s</small></strong></div>
      <div><span>LIVES</span><strong className="rush-lives" aria-label={`${game.lives} of ${GAME_LIVES} lives remaining`}>{Array.from({ length: GAME_LIVES }, (_, index) => <span key={index} className={index < game.lives ? "is-live" : ""}>♥</span>)}</strong></div>
    </div>
    <div className="rush-stage" aria-label="Falling words play area">
      <div className="rush-stage-grid" aria-hidden="true" />
      <div className="rush-lane-lines" aria-hidden="true"><i/><i/><i/><i/></div>
      {game.words.map(word => <div key={word.id} className={`rush-word${focused?.id === word.id ? " is-target" : ""}`} style={{ left: `${10 + word.lane * 20}%`, top: `${7 + word.progress * 78}%` }}><span className="rush-word-icon">↗</span><span>{focused?.id === word.id ? <><b>{game.typed}</b>{word.text.slice(game.typed.length)}</> : word.text}</span></div>)}
      <div className="rush-danger-line" aria-hidden="true"><span>MISS ZONE</span><span>MISS ZONE</span></div>
      {game.status !== "running" && <div className="rush-overlay">
        <div className="rush-overlay-card">
          <span className="rush-overlay-kicker">{game.status === "finished" ? "ROUND COMPLETE" : game.status === "paused" ? "GAME PAUSED" : "KEYSPRINT ARCADE / 01"}</span>
          <h2>{game.status === "finished" ? <>Nice run.<br /><em>Go again?</em></> : game.status === "paused" ? <>Catch your<br /><em>breath.</em></> : <>Words fall.<br /><em>You rise.</em></>}</h2>
          <p>{game.status === "finished" ? `${game.cleared} words cleared · ${game.bestCombo} best combo · ${game.score.toLocaleString()} points` : game.status === "paused" ? "Your score and remaining lives are waiting for you." : "Type each word before it reaches the bottom. Three misses end the round. Build a combo for bonus points."}</p>
          <button type="button" className="button primary" onClick={play}>{game.status === "paused" ? "Resume game ↗" : game.status === "finished" ? "Play again ↗" : "Start game ↗"}</button>
        </div>
      </div>}
    </div>
    <div className="rush-controls">
      <div className="rush-entry"><label htmlFor="rush-input">TYPE THE FALLING WORD</label><input ref={inputRef} id="rush-input" type="text" inputMode="text" autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} value={game.typed} onChange={event => dispatch({ type: "type", value: event.target.value })} disabled={game.status !== "running"} placeholder={game.status === "running" ? "Type here…" : "Press Start game to begin"} /><span className={game.typed && !focused ? "rush-input-hint is-error" : "rush-input-hint"}>{game.typed && !focused ? "No matching word — Backspace to correct" : "Words clear as soon as they match"}</span></div>
      <div className="rush-control-actions"><span>BEST <strong>{best.toLocaleString()}</strong></span>{game.status === "running" && <button type="button" onClick={() => dispatch({ type: "pause" })}>Pause Ⅱ</button>}{(game.status === "paused" || game.status === "finished") && <button type="button" onClick={() => dispatch({ type: "reset" })}>New round ↻</button>}</div>
    </div>
  </section>;
}
