import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import AuthRedirect from "@/components/AuthRedirect";
import ProgressSync from "@/components/ProgressSync";
import "./globals.css";

export const metadata: Metadata = {
  title: "Typencil — Free Typing Speed Test",
  description: "Practice your typing rhythm with free timed tests, instant WPM and accuracy feedback, and optional progress sync across devices.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthRedirect /><ProgressSync />{children}<Analytics /></body></html>;
}
