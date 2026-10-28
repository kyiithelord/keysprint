import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { authConfigured } from "@/lib/auth-config";

export const metadata: Metadata = {
  title: "About Typencil",
  description: "Learn why Typencil offers free typing tests, beginner lessons, practical guides, and progress tracking without an account.",
};

export default function AboutPage() {
  return <main className="page info-page"><SiteHeader current="info" /><article className="info-article"><p className="eyebrow">ABOUT / TYPENCIL</p><h1>Practice with purpose.</h1><p className="info-lead">Typencil is a free typing practice space built around a simple idea: useful feedback helps you build a steadier rhythm over time.</p><section><h2>What you can do here</h2><p>Take a timed test without creating an account. See raw and net words per minute, accuracy, and character feedback. Work through beginner lessons, read practical guides, and compare your recent results.</p><p>Our Progress Lab design keeps the typing area focused and the scores easy to understand. Five characters count as one word. Net WPM counts correctly typed characters, while accuracy reflects the characters currently in your input, including corrections made with Backspace.</p></section><section><h2>Learn at your own pace</h2><p>Start with the home row, then try the top row, bottom row, and complete sentences. Short practice rounds can help you notice patterns. Your progress is yours to interpret; Typencil does not assign a skill label based on one result.</p></section><section><h2>Free and account-free</h2><p>Typing tests and lessons are free and do not require an account. {authConfigured ? "You can optionally create an email account to sync typing results, lessons, games, and daily challenges across devices." : "Email accounts are not connected yet. Guest progress stays in this browser."}</p></section><div className="info-actions"><a className="button primary" href="/#practice">Start a free test →</a><a className="button secondary" href="/lessons">Explore lessons →</a></div></article><SiteFooter /></main>;
}
