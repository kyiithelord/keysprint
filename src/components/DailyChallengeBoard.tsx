"use client";

import { useEffect, useState } from "react";
import { bestStreak, completeRecord, currentStreak, dailyPlan, localDateKey, readDailyRecords, type DailyRecords } from "@/lib/daily-challenge";
import { lessons } from "@/lib/lessons";

const gameNames = { rush: "Word Rush", sprint: "Speed Sprint", precision: "Precision Quest", memory: "Memory Flash", racer: "Typing Racer" };
const weekLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function DailyChallengeBoard() {
  const [today, setToday] = useState("");
  const [records, setRecords] = useState<DailyRecords>({});

  useEffect(() => {
    const refresh = () => {
      setToday(localDateKey(new Date()));
      setRecords(readDailyRecords());
    };
    refresh();
    window.addEventListener("keysprint-daily-update", refresh);
    window.addEventListener("storage", refresh);
    const timer = window.setInterval(refresh, 60000);
    return () => {
      window.removeEventListener("keysprint-daily-update", refresh);
      window.removeEventListener("storage", refresh);
      window.clearInterval(timer);
    };
  }, []);

  if (!today) return <div className="daily-loading" role="status">Loading today&apos;s challenge…</div>;

  const plan = dailyPlan(today);
  const record = records[today] ?? { test: false, lesson: false, game: false };
  const completed = Number(record.test) + Number(record.lesson) + Number(record.game);
  const streak = currentStreak(records, today);
  const best = bestStreak(records);
  const lesson = lessons.find(item => item.id === plan.lessonId)!;
  const gameName = gameNames[plan.gameId];
  const date = new Date(`${today}T12:00:00`);
  const monday = new Date(date);
  monday.setDate(date.getDate() - (date.getDay() + 6) % 7);
  const week = weekLabels.map((label, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    const key = localDateKey(day);
    return { label, day: day.getDate(), key, done: completeRecord(records[key]), today: key === today };
  });
  const nextBadge = [3, 7, 14, 30, 50, 100, 365].find(days => days > streak) ?? Math.ceil((streak + 1) / 100) * 100;

  const tasks = [
    { id: "test", number: "01", icon: "↗", eyebrow: "THE WARM-UP", title: `${plan.duration}-second typing test`, description: `Finish a ${plan.duration}s test with at least one correct character. Choose the displayed duration before typing.`, href: `/?duration=${plan.duration}#practice`, action: "Start the test ↗", done: record.test },
    { id: "lesson", number: "02", icon: "⌨", eyebrow: "THE TECHNIQUE", title: lesson.title, description: "Complete today's guided exercise. You can repeat a lesson even if you finished it before.", href: `/lessons?lesson=${lesson.id}`, action: "Open the lesson ↗", done: record.lesson },
    { id: "game", number: "03", icon: "✦", eyebrow: "THE PLAY ROUND", title: gameName, description: `Finish one ${gameName} round with at least one scored word. A win is not required.`, href: `/game?mode=${plan.gameId}`, action: "Play the game ↗", done: record.game },
  ] as const;

  return <div className="daily-board">
    <div className="daily-main">
      <div className="daily-progress-card"><div><p className="eyebrow">TODAY / {date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}</p><h2>{completed === 3 ? <>Day complete.<br /><em>Nice work.</em></> : <>Three small wins.<br /><em>One better rhythm.</em></>}</h2><p>{completed === 3 ? "You finished every task today. A new challenge arrives tomorrow." : "Finish today's test, lesson, and game to keep your streak going."}</p></div><div className="daily-progress-ring" style={{ background: `conic-gradient(var(--coral) ${completed / 3 * 100}%, #e4e5dc 0)` }} aria-label={`${completed} of 3 tasks complete`}><div><strong>{completed}<small> / 3</small></strong><span>COMPLETE</span></div></div></div>
      <div className="daily-task-list" aria-label="Today's three tasks">{tasks.map(task => <article key={task.id} className={`daily-task${task.done ? " is-done" : ""}`}><div className="daily-task-symbol" aria-hidden="true">{task.done ? "✓" : task.icon}</div><div className="daily-task-copy"><div className="daily-task-meta"><span>{task.number} / 03 · {task.eyebrow}</span><span>{task.done ? "COMPLETED" : "TO DO"}</span></div><h3>{task.title}</h3><p>{task.description}</p><a href={task.href}>{task.done ? "Practice again ↗" : task.action}</a></div></article>)}</div>
      <p className="daily-storage-note">Challenge progress and streaks are saved in this browser. A new set of tasks appears at local midnight.</p>
    </div>
    <aside className="daily-side"><div className="daily-streak-card"><p className="eyebrow">KEEP THE MOMENTUM</p><div className="daily-flame" aria-hidden="true">✦</div><strong>{streak}<small> day{streak === 1 ? "" : "s"}</small></strong><span>CURRENT STREAK</span><p>Complete all three daily tasks to add a day. Today stays open until midnight.</p><div><span>BEST STREAK</span><strong>{best} days</strong></div></div><div className="daily-week-card"><div><p className="eyebrow">THIS WEEK</p><h3>Show up. Add a day.</h3></div><div className="daily-week-days">{week.map(day => <div key={day.key} className={`${day.done ? "is-done" : ""}${day.today ? " is-today" : ""}`} aria-label={`${day.label} ${day.day}: ${day.done ? "complete" : day.today ? "today" : "not complete"}`}><span>{day.label}</span><strong>{day.done ? "✓" : day.day}</strong></div>)}</div><p>Complete every task to mark a day.</p></div><div className="daily-badge-card"><span>✦ NEXT MILESTONE</span><strong>{nextBadge}-day streak</strong><p>{Math.max(0, nextBadge - streak)} more completed day{nextBadge - streak === 1 ? "" : "s"} to reach your next badge.</p></div></aside>
  </div>;
}
