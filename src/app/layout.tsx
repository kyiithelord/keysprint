import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import AuthRedirect from "@/components/AuthRedirect";
import ProgressSync from "@/components/ProgressSync";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://typencil.vercel.app"),
  title: "Free Typing Test — Check WPM and Accuracy | Typencil",
  description: "Take a free typing test with 15, 30, 60, or 120 second rounds. See your WPM and accuracy instantly, then practice with typing lessons and games.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthRedirect /><ProgressSync />{children}<Analytics /></body></html>;
}
