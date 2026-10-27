import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KeySprint — Free Typing Speed Test",
  description: "Practice your typing rhythm with free timed tests, instant WPM and accuracy feedback, and progress saved on this device.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
