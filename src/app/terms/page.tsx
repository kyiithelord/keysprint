import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service | KeySprint",
  description: "Terms for using KeySprint's free typing tests, lessons, guides, and locally saved progress.",
  robots: contactEmail ? undefined : { index: false, follow: true },
};

export default function TermsPage() {
  return <main className="page info-page"><SiteHeader current="info" /><article className="info-article"><p className="eyebrow">TERMS / KEYSPRINT</p><h1>Terms of Service</h1><p className="info-updated">Last updated: 27 October 2026</p><p className="info-lead">These terms describe the current KeySprint website and how to use its free typing practice tools.</p><section><h2>Using KeySprint</h2><p>You may use the typing tests, lessons, guides, and progress view for personal learning and practice. No account or payment is required for these features. Please use the site lawfully and do not interfere with its operation or other visitors&apos; access.</p></section><section><h2>Understanding your results</h2><p>Scores are practice measurements, not a certification, exam result, or guarantee of performance elsewhere. Raw and net WPM, accuracy, and character counts use the formulas described on the site. Results can vary with test duration, passage, device, and typing conditions.</p></section><section><h2>Local progress and availability</h2><p>Saved progress is kept in your browser. It may be lost if you clear site data, use private browsing, change devices, or browser storage fails. We may change, pause, or improve features, and cannot promise uninterrupted availability.</p></section><section><h2>Content and links</h2><p>KeySprint&apos;s original text, design, and exercises are provided for use on this site. Please do not copy or republish substantial parts of them as your own service. Links to other websites, if added, will be governed by those sites&apos; own terms and privacy practices.</p></section><section><h2>Changes and questions</h2><p>We may revise these terms as the website develops. The date above will be updated when changes are published. {contactEmail ? <>For questions, email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</> : <>A public contact method will be added before launch on the <a href="/contact">Contact page</a>.</>}</p></section></article><SiteFooter /></main>;
}
