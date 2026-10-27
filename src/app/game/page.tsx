import { GamesArtwork } from "@/components/SectionArtwork";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArcadeHub from "@/components/ArcadeHub";

export const metadata: Metadata = {
  title: "Free Typing Games | KeySprint Arcade",
  description: "Choose from five free typing games: Word Rush, Speed Sprint, Precision Quest, Memory Flash, and Typing Racer.",
};

export default function GamePage() {
  return <main className="page game-page">
    <SiteHeader current="game" />
    <div className="game-shell">
      <div className="game-intro"><div><p className="eyebrow"><span className="eyebrow-dot" /> KEYSPRINT / ARCADE MODE</p><h1>Make every<br /><em>word count.</em></h1><p className="game-intro-copy">Five games, five ways to sharpen your typing. Choose your challenge and play at your own pace.</p></div><GamesArtwork /></div>
      <ArcadeHub />
    </div>
    <SiteFooter />
  </main>;
}
