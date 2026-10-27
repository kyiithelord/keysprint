"use client";

import { useEffect, useState } from "react";
import WordRushGame from "./WordRushGame";
import ArcadeChallenge from "./ArcadeChallenge";
import TypingRacerGame from "./TypingRacerGame";
import type { ChallengeMode } from "@/lib/arcade-challenges";

type ArcadeMode = "rush" | ChallengeMode | "racer";

const games: { id: ArcadeMode; number: string; icon: string; title: string; tag: string; description: string }[] = [
  { id: "rush", number: "01", icon: "↘", title: "Word Rush", tag: "FALLING WORDS", description: "Clear words before they fall. Three misses end your 60-second round." },
  { id: "sprint", number: "02", icon: "↗", title: "Speed Sprint", tag: "30-SECOND DASH", description: "Race the clock and clear as many words as you can. No Enter needed." },
  { id: "precision", number: "03", icon: "◎", title: "Precision Quest", tag: "12-WORD CHALLENGE", description: "Submit exact answers across 12 words. A wrong answer costs a life." },
  { id: "memory", number: "04", icon: "◈", title: "Memory Flash", tag: "8-WORD MEMORY RUN", description: "See a word for 2.5 seconds, then type it from memory." },
  { id: "racer", number: "05", icon: "✦", title: "Typing Racer", tag: "NIGHT CIRCUIT", description: "Race a moving ghost across 24 words. Build a streak to earn Nitro boosts." },
];

export default function ArcadeHub() {
  const [selected, setSelected] = useState<ArcadeMode>("rush");
  const active = games.find(game => game.id === selected)!;

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("mode");
    if (games.some(game => game.id === requested)) {
      setSelected(requested as ArcadeMode);
      window.requestAnimationFrame(() => document.getElementById("play-game")?.scrollIntoView({ block: "start" }));
    }
  }, []);

  function choose(id: ArcadeMode) {
    setSelected(id);
    window.history.replaceState(null, "", `/game?mode=${id}`);
    window.requestAnimationFrame(() => document.getElementById("play-game")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return <>
    <section className="arcade-selector" aria-labelledby="arcade-choose-title"><div className="arcade-selector-heading"><div><p className="eyebrow">CHOOSE YOUR CHALLENGE</p><h2 id="arcade-choose-title">Five ways to <em>find your flow.</em></h2></div><p>Pick a game. Each one tests a different typing skill.</p></div><div className="arcade-game-grid">{games.map(game => <button key={game.id} type="button" className={`arcade-game-card${selected === game.id ? " is-selected" : ""}`} onClick={() => choose(game.id)} aria-pressed={selected === game.id}><span className="arcade-card-top"><span>{game.number} / 05</span><span className="arcade-card-icon" aria-hidden="true">{game.icon}</span></span><span className="arcade-card-tag">{game.tag}</span><strong>{game.title}</strong><span className="arcade-card-description">{game.description}</span><span className="arcade-card-link">{selected === game.id ? "Selected — play below ↓" : "Choose game ↗"}</span></button>)}</div></section>
    <div id="play-game" className="arcade-play-area"><div className="arcade-play-heading"><div><p className="eyebrow">NOW PLAYING / {active.number}</p><h2>{active.title}</h2></div><span>{active.tag}</span></div>{selected === "rush" ? <WordRushGame key="rush" /> : selected === "racer" ? <TypingRacerGame key="racer" /> : <ArcadeChallenge key={selected} mode={selected} />}</div>
  </>;
}
