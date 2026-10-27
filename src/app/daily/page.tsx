import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DailyChallengeBoard from "@/components/DailyChallengeBoard";

export const metadata: Metadata = {
  title: "Daily Typing Challenge | KeySprint",
  description: "Complete a fresh typing test, lesson, and game every day. Track your practice streak on KeySprint.",
};

export default function DailyPage() {
  return <main className="page daily-page"><SiteHeader current="daily" /><div className="daily-shell"><div className="daily-intro"><p className="eyebrow"><span className="eyebrow-dot" /> KEYSPRINT / DAILY CHALLENGE</p><h1>A little practice.<br /><em>Every day.</em></h1><p>One test, one lesson, one game. Build a habit that feels good to keep.</p></div><DailyChallengeBoard /></div><SiteFooter /></main>;
}
