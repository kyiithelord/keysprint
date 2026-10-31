import { ProgressArtwork } from "@/components/SectionArtwork";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import type { Metadata } from "next";
import ProgressDashboard from "@/components/ProgressDashboard";

export const metadata: Metadata = {
  title: "Your Typing Progress | Typencil",
  description: "Review recent typing tests, compare net WPM and accuracy, and track your personal best across devices when signed in.",
  robots: { index: false, follow: true },
};

export default function ProgressPage() {
  return <main className="page progress-page">
    <SiteHeader current="progress" />
    <section className="progress-intro"><div><p className="eyebrow">TYPENCIL / PROGRESS LAB</p><h1>See how far<br /><em>you&apos;ve come.</em></h1><p>Choose a test setup to compare like with like. Sign in to keep your results in sync across devices, then keep practicing at your own pace.</p></div><ProgressArtwork /></section>
    <ProgressDashboard />
    <SiteFooter />
  </main>;
}
