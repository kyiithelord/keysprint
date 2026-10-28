import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { contactEmail, operatorCountry } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Typencil",
  description: "Typencil contact information and guidance for sharing feedback about the site.",
  robots: contactEmail ? undefined : { index: false, follow: true },
};

export default function ContactPage() {
  return <main className="page info-page"><SiteHeader current="info" /><article className="info-article"><p className="eyebrow">CONTACT / TYPENCIL</p><h1>Contact Typencil.</h1><p className="info-lead">A public contact method is not available yet. This page will be updated before Typencil launches publicly.</p><section className="contact-panel"><h2>Contact Typencil</h2>{contactEmail ? <><p>Email us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p><a className="button primary" href={`mailto:${contactEmail}?subject=Typencil%20feedback`}>Send an email →</a></> : <p>No public email address is listed at this time. Please check this page again before public launch.</p>}{operatorCountry && <p className="contact-location">Operating location: {operatorCountry}</p>}</section><section><h2>Helpful details to include</h2><p>For a typing test issue, tell us your device, browser, selected duration, difficulty, and mode, plus what happened. For privacy questions, mention the browser data or page you are asking about. Please do not send passwords or sensitive personal information.</p></section><div className="info-actions"><a className="button secondary" href="/privacy">Read our privacy policy →</a></div></article><SiteFooter /></main>;
}
