import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guides } from "@/lib/guides";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map(guide => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find(item => item.slug === slug);
  return guide ? { title: `${guide.title} | Typencil`, description: guide.description } : {};
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find(item => item.slug === slug);
  if (!guide) notFound();
  const related = guides.filter(item => item.slug !== slug);

  return <main className="page guide-article-page">
    <SiteHeader current="guides" />
    <article className="guide-article"><a className="guide-back" href="/guides">← All typing guides</a><header><p className="eyebrow">{guide.label} · {guide.readTime}</p><h1>{guide.title}</h1><p className="guide-deck">{guide.intro}</p></header><div className="guide-body">{guide.sections.map((section, index) => <section key={section.heading}><span className="guide-section-number">{String(index + 1).padStart(2, "0")}</span><div><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></section>)}<aside className="guide-practice"><p className="eyebrow">MAKE IT PRACTICAL</p><h2>{guide.practice.heading}</h2><ol>{guide.practice.steps.map(step => <li key={step}>{step}</li>)}</ol><a className="button primary" href={guide.practice.href}>{guide.practice.cta}</a></aside></div></article>
    <section className="guide-related"><p className="eyebrow">KEEP LEARNING</p><h2>Read another guide</h2><div>{related.map(item => <a href={`/guides/${item.slug}`} key={item.slug}><span>{item.label}</span><strong>{item.title}</strong><span aria-hidden="true">↗</span></a>)}</div></section>
    <SiteFooter />
  </main>;
}
