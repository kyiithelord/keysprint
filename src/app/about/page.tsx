import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { authConfigured } from "@/lib/auth-config";

export const metadata: Metadata = {
  title: "About KeySprint",
  description: "Learn why KeySprint offers free typing tests, beginner lessons, practical guides, and progress tracking without an account.",
};

export default function AboutPage() {
  return <main className="page info-page"><SiteHeader current="info" /><article className="info-article"><p className="eyebrow">ABOUT / KEYSPRINT</p><h1>Practice with purpose.</h1><p className="info-lead">KeySprint is a free typing practice space built around a simple idea: useful feedback helps you build a steadier rhythm over time.</p><section><h2>What you can do here</h2><p>Take a timed test without creating an account. See raw and net words per minute, accuracy, and character feedback. Work through beginner lessons, read practical guides, and compare your recent results on the same device.</p><p>Our Progress Lab design keeps the typing area focused and the scores easy to understand. Five characters count as one word. Net WPM counts correctly typed characters, while accuracy reflects the characters currently in your input, including corrections made with Backspace.</p></section><section><h2>Learn at your own pace</h2><p>Start with the home row, then try the top row, bottom row, and complete sentences. Short practice rounds can help you notice patterns. Your progress is yours to interpret; KeySprint does not assign a skill label based on one result.</p></section><section><h2>Free and account-free</h2><p>Typing tests and lessons are free and do not require an account. {authConfigured ? "You can optionally create an email account, but results and lesson completions still stay in this browser and do not sync between devices." : "Email accounts are planned but not available yet. Results and lesson completions stay in this browser and do not sync between devices."}</p></section><div className="info-actions"><a className="button primary" href="/#practice">Start a free test →</a><a className="button secondary" href="/lessons">Explore lessons →</a></div></article><SiteFooter /></main>;
}
