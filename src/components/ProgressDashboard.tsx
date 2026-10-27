"use client";

import { useEffect, useState } from "react";
import { readResults, type Difficulty, type Duration, type Mode, type SavedResult } from "@/lib/typing";

type DurationFilter = Duration | "all";
type DifficultyFilter = Difficulty | "all";
type ModeFilter = Mode | "all";

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown date" : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function ProgressDashboard() {
  const [results, setResults] = useState<SavedResult[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState<DurationFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [mode, setMode] = useState<ModeFilter>("all");

  useEffect(() => { setResults(readResults()); setLoaded(true); }, []);

  const matching = results.filter(item =>
    (duration === "all" || item.duration === duration) &&
    (difficulty === "all" || item.difficulty === difficulty) &&
    (mode === "all" || item.mode === mode)
  ).sort((a, b) => Date.parse(b.finishedAt) - Date.parse(a.finishedAt));
  const best = matching.length ? Math.max(...matching.map(item => item.netWpm)) : 0;
  const averageAccuracy = matching.length ? Math.round(matching.reduce((sum, item) => sum + item.accuracy, 0) / matching.length) : 0;
  const latest = matching[0];
  const byDay = new Map<string, { label: string; totalWpm: number; totalAccuracy: number; count: number }>();
  for (const item of matching) {
    const date = new Date(item.finishedAt);
    if (Number.isNaN(date.getTime())) continue;
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const day = byDay.get(key) ?? { label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }), totalWpm: 0, totalAccuracy: 0, count: 0 };
    day.totalWpm += item.netWpm;
    day.totalAccuracy += item.accuracy;
    day.count += 1;
    byDay.set(key, day);
  }
  const chart = Array.from(byDay.values()).reverse().slice(-10).map(day => ({ label: day.label, netWpm: Math.round(day.totalWpm / day.count), accuracy: Math.round(day.totalAccuracy / day.count) }));
  const chartMax = Math.max(10, ...chart.map(day => day.netWpm));

  return <section className="progress-dashboard"><div className="progress-filters"><div><label htmlFor="progress-duration">DURATION</label><select id="progress-duration" value={duration} onChange={event => setDuration(event.target.value === "all" ? "all" : Number(event.target.value) as Duration)}><option value="all">All durations</option><option value="15">15 seconds</option><option value="30">30 seconds</option><option value="60">60 seconds</option><option value="120">120 seconds</option></select></div><div><label htmlFor="progress-difficulty">DIFFICULTY</label><select id="progress-difficulty" value={difficulty} onChange={event => setDifficulty(event.target.value as DifficultyFilter)}><option value="all">All levels</option><option value="easy">Easy</option><option value="standard">Standard</option><option value="advanced">Advanced</option></select></div><div><label htmlFor="progress-mode">MODE</label><select id="progress-mode" value={mode} onChange={event => setMode(event.target.value as ModeFilter)}><option value="all">All modes</option><option value="words">Words</option><option value="sentences">Sentences</option></select></div></div>{loaded && matching.length ? <><div className="progress-summary"><article><span>TESTS</span><strong>{matching.length}</strong><small>Matching this view</small></article><article><span>PERSONAL BEST</span><strong>{best}<small> WPM</small></strong><small>Highest net speed</small></article><article><span>LATEST TEST</span><strong>{latest.netWpm}<small> WPM</small></strong><small>{latest.accuracy}% accuracy</small></article><article><span>AVG. ACCURACY</span><strong>{averageAccuracy}<small>%</small></strong><small>Across matching tests</small></article></div><div className="progress-chart-card"><div className="progress-card-heading"><div><p className="eyebrow">RECENT SESSIONS</p><h2>Daily averages</h2></div><span>LAST {chart.length} ACTIVE DAY{chart.length === 1 ? "" : "S"}</span></div><div className="progress-chart" role="img" aria-label={`Daily average net WPM from oldest to newest: ${chart.map(item => `${item.label}: ${item.netWpm} WPM and ${item.accuracy}% accuracy`).join(", ")}`}><div className="chart-grid"><span>{chartMax}</span><span>{Math.round(chartMax / 2)}</span><span>0</span></div><div className="chart-bars">{chart.map((item, index) => <div className="chart-bar-item" key={`${item.label}-${index}`} title={`${item.label}: ${item.netWpm} average net WPM, ${item.accuracy}% average accuracy`}><span className="chart-value">{item.netWpm}</span><div className="chart-bar" style={{ height: `${Math.max(3, item.netWpm / chartMax * 100)}%` }} /><span className="chart-index">{item.label}<br />{item.accuracy}%</span></div>)}</div></div><p className="chart-caption">Oldest → newest · Bars show daily average net WPM. Accuracy appears below each bar; individual results are below.</p></div><div className="progress-history"><div className="progress-card-heading"><div><p className="eyebrow">YOUR HISTORY</p><h2>Recent results</h2></div><span>{matching.length} SAVED</span></div><div className="history-scroll"><table><thead><tr><th scope="col">DATE</th><th scope="col">TEST</th><th scope="col">NET WPM</th><th scope="col">RAW WPM</th><th scope="col">ACCURACY</th></tr></thead><tbody>{matching.map((item, index) => <tr key={`${item.finishedAt}-${index}`}><td>{formatDate(item.finishedAt)}</td><td>{item.duration}s · {item.difficulty} · {item.mode}</td><td><strong>{item.netWpm}</strong></td><td>{item.rawWpm}</td><td>{item.accuracy}%</td></tr>)}</tbody></table></div></div></> : loaded ? <div className="progress-empty"><span className="empty-icon">↗</span><h2>{results.length ? "No tests match these filters yet." : "Your progress starts with one test."}</h2><p>{results.length ? "Try another duration, difficulty, or mode to see your saved results." : "Complete a typing test to see your scores and progress here."}</p><a className="button primary" href="/#practice">Take a typing test →</a></div> : <p className="progress-loading" role="status">Loading your progress…</p>}<p className="progress-privacy">Results are stored on this device only. Clearing browser storage removes them, and they do not sync to another device. Up to 100 recent tests are kept.</p></section>;
}
