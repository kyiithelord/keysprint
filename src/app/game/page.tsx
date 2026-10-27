import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WordRushGame from "@/components/WordRushGame";

export const metadata: Metadata = {
  title: "Word Rush Typing Game | KeySprint",
  description: "Play Word Rush, a free typing game. Clear falling words, build combos, and beat your personal best.",
};

export default function GamePage() {
  return <main className="page game-page">
    <SiteHeader current="game" />
    <div className="game-shell">
      <div className="game-intro"><div><p className="eyebrow"><span className="eyebrow-dot" /> KEYSPRINT / ARCADE MODE</p><h1>Make every<br /><em>word count.</em></h1></div><p>Catch falling words with your keyboard. Keep your streak alive, chase a high score, and turn practice into play.</p></div>
      <WordRushGame />
      <div className="game-after"><div><span>01 / QUICK HANDS</span><p>Type a word exactly to clear it. There is no need to press Enter.</p></div><div><span>02 / BIGGER COMBOS</span><p>Every word in a row adds a bonus. Missing one resets your combo.</p></div><div><span>03 / ONE MORE ROUND</span><p>Your best score stays on this device. Play again to beat it.</p></div></div>
    </div>
    <SiteFooter />
  </main>;
}
