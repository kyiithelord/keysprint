import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArcadeHub from "@/components/ArcadeHub";

export const metadata: Metadata = {
  title: "Free Typing Games | KeySprint Arcade",
  description: "Choose from four free typing games: Word Rush, Speed Sprint, Precision Quest, and Memory Flash.",
};

export default function GamePage() {
  return <main className="page game-page">
    <SiteHeader current="game" />
    <div className="game-shell">
      <div className="game-intro"><div><p className="eyebrow"><span className="eyebrow-dot" /> KEYSPRINT / ARCADE MODE</p><h1>Make every<br /><em>word count.</em></h1></div><p>Four games, four ways to sharpen your typing. Choose your challenge and play at your own pace.</p></div>
      <ArcadeHub />
    </div>
    <SiteFooter />
  </main>;
}
