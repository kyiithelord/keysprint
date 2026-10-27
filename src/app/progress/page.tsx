import { ProgressArtwork } from "@/components/SectionArtwork";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import type { Metadata } from "next";
import ProgressDashboard from "@/components/ProgressDashboard";

export const metadata: Metadata = {
  title: "Your Typing Progress | KeySprint",
  description: "Review recent typing tests, compare net WPM and accuracy, and track your personal best on this device.",
};

export default function ProgressPage() {
  return <main className="page progress-page">
    <SiteHeader current="progress" />
    <section className="progress-intro"><div><p className="eyebrow">KEYSPRINT / PROGRESS LAB</p><h1>See how far<br /><em>you&apos;ve come.</em></h1><p>Your recent test results live in this browser. Choose a test setup to compare like with like, then keep practicing at your own pace.</p></div><ProgressArtwork /></section>
    <ProgressDashboard />
    <SiteFooter />
  </main>;
}
