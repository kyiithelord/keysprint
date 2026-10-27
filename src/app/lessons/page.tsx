import type { Metadata } from "next";
import LessonsPractice from "@/components/LessonsPractice";

export const metadata: Metadata = {
  title: "Beginner Typing Lessons | KeySprint",
  description: "Learn the home row, practice keyboard reaches, and build typing accuracy with free interactive beginner exercises.",
};

export default function LessonsPage() {
  return <main className="page lessons-page">
    <header className="site-header"><a className="brand" href="/" aria-label="KeySprint home"><span className="brand-mark">K<span>↗</span></span> KeySprint</a><nav aria-label="Main navigation"><a href="/#practice">Practice</a><a href="/lessons" aria-current="page">Typing lessons</a><a href="/#guide">Typing guides</a><a href="/#about">About</a></nav></header>
    <section className="lessons-intro"><p className="eyebrow">KEYSPRINT / LEARNING LAB</p><h1>Every great rhythm<br /><em>starts somewhere.</em></h1><p>Four short lessons take you from the home row to complete sentences. Read the tip, type the exercise, and move forward at your own pace.</p></section>
    <LessonsPractice />
    <footer><div><a className="brand" href="/">KeySprint</a><p>Free typing practice for steady progress.</p></div><div><a href="/#practice">Take a timed test ↗</a></div><small>© {new Date().getFullYear()} KeySprint</small></footer>
  </main>;
}
