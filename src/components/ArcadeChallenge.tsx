"use client";

import { useEffect, useReducer, useRef, useState, type FormEvent } from "react";
import { CHALLENGE_LIVES, MEMORY_ROUNDS, PRECISION_ROUNDS, SPRINT_DURATION, challengeReducer, challengeWord, newChallenge, type ChallengeMode } from "@/lib/arcade-challenges";
import { recordDailyActivity } from "@/lib/daily-challenge";

const details = {
  sprint: { name: "Speed Sprint", kicker: "30 SECOND DASH", headline: ["Fast hands.", "Fast score."], description: "Clear as many words as you can before the clock runs out. Exact words clear instantly." },
  precision: { name: "Precision Quest", kicker: "12 WORD CHALLENGE", headline: ["Make every", "answer count."], description: "Type the target and press Enter. A wrong answer costs one of your three lives." },
  memory: { name: "Memory Flash", kicker: "8 WORD MEMORY RUN", headline: ["See it.", "Remember it."], description: "Watch each word for 2.5 seconds, then type it from memory and press Enter." },
} as const;

export default function ArcadeChallenge({ mode }: { mode: ChallengeMode }) {
  const [game, dispatch] = useReducer(challengeReducer, mode, newChallenge);
  const [best, setBest] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const bestKey = `keysprint-${mode}-best-v1`;
  const detail = details[mode];
  const target = challengeWord(mode, game.round);
  const roundLimit = mode === "precision" ? PRECISION_ROUNDS : MEMORY_ROUNDS;
  const isRevealing = mode === "memory" && game.reveal > 0;
  const prefixMatches = target.startsWith(game.input);

  useEffect(() => {
    try { setBest(Number(localStorage.getItem(bestKey)) || 0); } catch { /* Keep playing without storage. */ }
  }, [bestKey]);

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
    try { localStorage.setItem(bestKey, String(game.score)); } catch { /* Keep the score for this visit. */ }
  }, [game.status, game.score, best, bestKey]);

  useEffect(() => {
    if (game.status === "finished") recordDailyActivity({ kind: "game", gameId: mode, score: game.score });
  }, [game.status, game.score, mode]);

  function play() {
    dispatch({ type: "start" });
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch({ type: "submit" });
    inputRef.current?.focus();
  }

  return <section className={`challenge-game challenge-${mode}`} aria-label={`${detail.name} typing game`}>
    <div className="rush-topbar"><div><span className="rush-status-light" /> ARCADE / {detail.name.toUpperCase()}</div><span>{detail.kicker}</span></div>
    <div className="rush-stats" aria-live="off">
      <div><span>SCORE</span><strong>{game.score.toLocaleString()}</strong></div>
      <div><span>COMBO</span><strong>{game.combo}<small> ×</small></strong></div>
      <div><span>{mode === "sprint" ? "TIME LEFT" : "ROUND"}</span><strong>{mode === "sprint" ? Math.ceil(SPRINT_DURATION - game.elapsed) : Math.min(game.round + 1, roundLimit)}<small>{mode === "sprint" ? " s" : ` / ${roundLimit}`}</small></strong></div>
      <div><span>{mode === "sprint" ? "WORDS" : "LIVES"}</span>{mode === "sprint" ? <strong>{game.round}</strong> : <strong className="rush-lives" aria-label={`${game.lives} of ${CHALLENGE_LIVES} lives remaining`}>{Array.from({ length: CHALLENGE_LIVES }, (_, index) => <span key={index} className={index < game.lives ? "is-live" : ""}>♥</span>)}</strong>}</div>
    </div>
    <div className="challenge-stage">
      <div className="rush-stage-grid" aria-hidden="true" />
      {game.status === "running" && <div className="challenge-stage-content">
        <span className="challenge-stage-kicker">{mode === "memory" ? isRevealing ? `MEMORIZE · ${Math.ceil(game.reveal)}S` : "NOW TYPE FROM MEMORY" : mode === "precision" ? "TYPE EXACTLY, THEN PRESS ENTER" : "TYPE TO CLEAR · NO ENTER NEEDED"}</span>
        <div className={`challenge-target${mode === "memory" && !isRevealing ? " is-hidden" : ""}`} aria-live="polite">{mode === "memory" && !isRevealing ? "•".repeat(target.length) : <>{game.input && prefixMatches ? <><span>{game.input}</span>{target.slice(game.input.length)}</> : target}</>}</div>
        <div className="challenge-progress" aria-hidden="true">{mode === "sprint" ? <span className="challenge-timer-fill" style={{ width: `${Math.max(0, (SPRINT_DURATION - game.elapsed) / SPRINT_DURATION * 100)}%` }} /> : Array.from({ length: roundLimit }, (_, index) => <i key={index} className={index < game.round ? "is-done" : index === game.round ? "is-current" : ""} />)}</div>
        <p>{mode === "memory" && isRevealing ? "The word will disappear. Remember its spelling." : game.feedback || (mode === "sprint" ? "Keep your streak alive." : "Press Enter when your answer is ready.")}</p>
      </div>}
      {game.status !== "running" && <div className="rush-overlay"><div className="rush-overlay-card"><span className="rush-overlay-kicker">{game.status === "finished" ? "ROUND COMPLETE" : game.status === "paused" ? "GAME PAUSED" : detail.kicker}</span><h2>{game.status === "finished" ? <>Round over.<br /><em>Go again?</em></> : game.status === "paused" ? <>Catch your<br /><em>breath.</em></> : <>{detail.headline[0]}<br /><em>{detail.headline[1]}</em></>}</h2><p>{game.status === "finished" ? `${game.round} words played · ${game.bestCombo} best combo · ${game.score.toLocaleString()} points` : game.status === "paused" ? "Your round is waiting for you." : detail.description}</p><button type="button" className="button primary" onClick={play}>{game.status === "paused" ? "Resume game ↗" : game.status === "finished" ? "Play again ↗" : "Start game ↗"}</button></div></div>}
    </div>
    <div className="rush-controls"><form className="rush-entry" onSubmit={submit}><label htmlFor={`challenge-input-${mode}`}>{mode === "memory" ? "YOUR MEMORY ANSWER" : "TYPE THE TARGET WORD"}</label><div className="challenge-input-row"><input ref={inputRef} id={`challenge-input-${mode}`} type="text" inputMode="text" autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} value={game.input} onChange={event => dispatch({ type: "type", value: event.target.value })} readOnly={isRevealing} disabled={game.status !== "running"} placeholder={game.status !== "running" ? "Press Start game to begin" : isRevealing ? "Remember the word…" : "Type here…"} />{mode !== "sprint" && <button type="submit" disabled={game.status !== "running" || isRevealing || !game.input}>Check ↗</button>}</div><span className={game.input && !prefixMatches && mode !== "memory" ? "rush-input-hint is-error" : "rush-input-hint"}>{game.input && !prefixMatches && mode !== "memory" ? "Check the spelling or press Backspace" : mode === "sprint" ? "Exact words clear automatically" : "Press Enter or use Check"}</span></form><div className="rush-control-actions"><span>BEST <strong>{best.toLocaleString()}</strong></span>{game.status === "running" && <button type="button" onClick={() => dispatch({ type: "pause" })}>Pause Ⅱ</button>}{(game.status === "paused" || game.status === "finished") && <button type="button" onClick={() => dispatch({ type: "reset" })}>New round ↻</button>}</div></div>
  </section>;
}
