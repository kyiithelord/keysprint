"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { readResults } from "@/lib/typing";
import { currentStreak, localDateKey, readDailyRecords } from "@/lib/daily-challenge";
import { gameBestModes, progressKeys, progressStorageKey, readGameBest } from "@/lib/progress-storage";
import type { SyncState } from "@/lib/progress-sync";

type Snapshot = { tests: number; bestWpm: number; lessons: number; streak: number; gameBest: number };
const empty: Snapshot = { tests: 0, bestWpm: 0, lessons: 0, streak: 0, gameBest: 0 };

function readSnapshot(): Snapshot {
  const results = readResults();
  let lessons: string[] = [];
  try {
    const saved = JSON.parse(localStorage.getItem(progressStorageKey(progressKeys.lessons)) || "[]");
    if (Array.isArray(saved)) lessons = saved.filter((id): id is string => typeof id === "string");
  } catch { /* Keep profile usable without storage. */ }
  return {
    tests: results.length,
    bestWpm: Math.max(0, ...results.map(result => result.netWpm)),
    lessons: new Set(lessons).size,
    streak: currentStreak(readDailyRecords(), localDateKey(new Date())),
    gameBest: Math.max(0, ...gameBestModes.map(mode => readGameBest(mode))),
  };
}

export default function ProfileDashboard({ user, syncState, onSignOut, busy }: { user: User; syncState: SyncState; onSignOut: () => void; busy: boolean }) {
  const [snapshot, setSnapshot] = useState<Snapshot>(empty);

  useEffect(() => {
    const refresh = () => setSnapshot(readSnapshot());
    refresh();
    window.addEventListener("keysprint-progress-update", refresh);
    window.addEventListener("keysprint-daily-update", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("keysprint-progress-update", refresh);
      window.removeEventListener("keysprint-daily-update", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [user.id]);

  const syncLabel = syncState.state === "synced" ? "Progress synced" : syncState.state === "syncing" ? "Syncing progress" : syncState.state === "error" ? "Sync needs attention" : "Preparing sync";
  const initial = (user.email?.trim().charAt(0) || "K").toUpperCase();

  return <div className="profile-dashboard">
    <section className="profile-hero">
      <div className="profile-hero-top"><span>KEYSPRINT / YOUR SPACE</span><span className={`profile-sync profile-sync-${syncState.state}`} role="status"><i />{syncLabel}</span></div>
      <div className="profile-hero-main"><div className="profile-avatar" aria-hidden="true">{initial}<span>↗</span></div><div><p className="profile-hero-kicker">WELCOME BACK</p><h1>Keep your rhythm<br /><em>moving.</em></h1><p className="profile-email">{user.email}</p></div></div>
      <div className="profile-hero-bottom"><span>Every session is a step forward.</span><button type="button" onClick={onSignOut} disabled={busy}>Sign out →</button></div>
    </section>

    {syncState.state === "error" && <p className="profile-sync-alert" role="alert">Progress is still saved on this device. Cloud sync failed: {syncState.message}</p>}

    <section className="profile-overview" aria-label="Your practice overview">
      <div className="profile-section-heading"><div><p className="eyebrow">YOUR PRACTICE / AT A GLANCE</p><h2>Progress in motion.</h2></div><a href="/progress">See all results ↗</a></div>
      <div className="profile-stat-grid">
        <article><span>01 / TYPING TESTS</span><strong>{snapshot.tests}</strong><p>Completed sessions</p></article>
        <article><span>02 / PERSONAL BEST</span><strong>{snapshot.bestWpm}<small> WPM</small></strong><p>Fastest net speed</p></article>
        <article><span>03 / LESSON PATH</span><strong>{snapshot.lessons}<small> / 4</small></strong><p>Lessons completed</p></article>
        <article><span>04 / DAILY STREAK</span><strong>{snapshot.streak}<small> days</small></strong><p>Keep showing up</p></article>
      </div>
    </section>

    <section className="profile-next" aria-label="Keep practicing">
      <div className="profile-section-heading"><div><p className="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2>Your next move.</h2></div><span>{snapshot.gameBest > 0 ? `Arcade best · ${snapshot.gameBest.toLocaleString()} pts` : "Choose your pace"}</span></div>
      <div className="profile-next-grid">
        <a href="/#practice"><span className="profile-next-icon">⌨</span><span>01 / PRACTICE</span><strong>Take a typing test</strong><small>Measure your speed and accuracy.</small><b>Start typing ↗</b></a>
        <a href="/lessons"><span className="profile-next-icon">↗</span><span>02 / LEARN</span><strong>Continue lessons</strong><small>Build confidence, one key at a time.</small><b>Open lessons ↗</b></a>
        <a href="/daily"><span className="profile-next-icon">✦</span><span>03 / DAILY</span><strong>Do today&apos;s challenge</strong><small>One test, one lesson, one game.</small><b>See today ↗</b></a>
      </div>
    </section>
  </div>;
}
