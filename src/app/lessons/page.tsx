import { LessonsArtwork } from "@/components/SectionArtwork";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import type { Metadata } from "next";
import LessonsPractice from "@/components/LessonsPractice";

export const metadata: Metadata = {
  title: "Beginner Typing Lessons | Typencil",
  description: "Learn the home row, practice keyboard reaches, and build typing accuracy with free interactive beginner exercises.",
};

export default function LessonsPage() {
  return <main className="page lessons-page">
    <SiteHeader current="lessons" />
    <section className="lessons-intro"><div><p className="eyebrow">TYPENCIL / LEARNING LAB</p><h1>Every great rhythm<br /><em>starts somewhere.</em></h1><p>Four short lessons take you from the home row to complete sentences. Read the tip, type the exercise, and move forward at your own pace.</p></div><LessonsArtwork /></section>
    <LessonsPractice />
    <SiteFooter />
  </main>;
}
