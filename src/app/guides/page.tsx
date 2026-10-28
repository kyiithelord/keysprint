import { GuidesArtwork } from "@/components/SectionArtwork";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import type { Metadata } from "next";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Typing Guides | Typencil",
  description: "Practical guides to improve typing speed, accuracy, and keyboard habits, with exercises you can try right away.",
};

export default function GuidesPage() {
  return <main className="page guides-page">
    <SiteHeader current="guides" />
    <section className="guides-intro"><div><p className="eyebrow">TYPENCIL / FIELD NOTES</p><h1>Better habits,<br /><em>one key at a time.</em></h1><p>Clear advice you can put to work in your next practice round. Pick the skill you want to improve, then try the exercise at the end of each guide.</p></div><GuidesArtwork /></section>
    <section className="guide-index" aria-label="Typing guides"><div className="guide-index-heading"><p className="eyebrow">EXPLORE THE GUIDES</p><span>03 PRACTICAL READS</span></div><div className="guide-grid">{guides.map((guide, index) => <article className="guide-card" key={guide.slug}><span className="guide-card-number">0{index + 1} / {guide.readTime}</span><h2><a href={`/guides/${guide.slug}`}>{guide.title}</a></h2><p>{guide.intro}</p><a className="guide-card-link" href={`/guides/${guide.slug}`} aria-label={`Read ${guide.title}`}>Read guide <span aria-hidden="true">↗</span></a></article>)}</div></section>
    <section className="guides-cta"><div><p className="eyebrow">READY TO PRACTICE?</p><h2>Put the advice to work.</h2><p>Use a guided exercise to learn a key pattern, or take a timed test to see your current pace.</p></div><div><a className="button primary" href="/lessons">Explore lessons →</a><a className="button secondary" href="/#practice">Start a test →</a></div></section>
    <SiteFooter />
  </main>;
}
