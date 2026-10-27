"use client";

import { useEffect, useRef, useState } from "react";
import { lessons } from "@/lib/lessons";

export default function LessonsPractice() {
  const [selected, setSelected] = useState(0);
  const [input, setInput] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const lesson = lessons[selected];
  const target = Array.from(lesson.exercise);
  const typed = Array.from(input);
  const correct = typed.reduce((count, character, index) => count + Number(character === target[index]), 0);
  const accuracy = typed.length ? Math.round(correct / typed.length * 100) : 100;
  const done = typed.length === target.length && correct === target.length;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("keysprint-lessons-v1") || "[]");
      if (Array.isArray(saved)) setCompleted(saved.filter((id): id is string => typeof id === "string"));
    } catch { setStorageAvailable(false); }
  }, []);

  useEffect(() => {
    if (!done || completed.includes(lesson.id)) return;
    const next = [...completed, lesson.id];
    setCompleted(next);
    try { localStorage.setItem("keysprint-lessons-v1", JSON.stringify(next)); }
    catch { setStorageAvailable(false); }
  }, [done, completed, lesson.id]);

  useEffect(() => {
    const prompt = promptRef.current;
    const current = prompt?.querySelector<HTMLElement>(".current");
    if (prompt && current) prompt.scrollTop = Math.max(0, current.offsetTop - prompt.offsetTop - 36);
  }, [input, selected]);

  function choose(index: number) {
    setSelected(index);
    setInput("");
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  return <section className="lesson-workspace"><aside className="lesson-sidebar" aria-label="Choose a lesson"><p className="eyebrow">YOUR LESSON PATH</p><div className="lesson-tabs">{lessons.map((item, index) => <button key={item.id} className={index === selected ? "active" : ""} onClick={() => choose(index)} aria-current={index === selected ? "step" : undefined}><span className="lesson-tab-number">{String(index + 1).padStart(2, "0")}</span><span><strong>{item.title}</strong><small>{completed.includes(item.id) ? "Completed ✓" : item.level.split(" / ")[1]}</small></span><span aria-hidden="true">→</span></button>)}</div><p className="lesson-note">Your completed lessons are saved in this browser only.</p></aside><div className="lesson-main"><div className="lesson-content"><p className="eyebrow">{lesson.level}</p><h2>{lesson.title}</h2><p className="lesson-goal">{lesson.goal}</p><p>{lesson.explanation}</p><h3>Keep in mind</h3><ul>{lesson.tips.map(tip => <li key={tip}>{tip}</li>)}</ul></div><div className="exercise-card"><div className="exercise-header"><span>YOUR EXERCISE</span><span>{typed.length} / {target.length} CHARACTERS</span></div><div className="exercise-stats"><div><span>ACCURACY</span><strong>{accuracy}%</strong></div><div><span>CORRECT</span><strong>{correct}</strong></div><div><span>TO FIX</span><strong>{typed.length - correct}</strong></div></div><div className="exercise-progress" role="progressbar" aria-label="Exercise progress" aria-valuenow={typed.length} aria-valuemin={0} aria-valuemax={target.length}><span style={{ width: `${typed.length / target.length * 100}%` }} /></div><div ref={promptRef} id="lesson-target" className="exercise-prompt" onClick={() => inputRef.current?.focus()}>{target.map((character, index) => <span key={index} className={index < typed.length ? typed[index] === character ? "correct" : "incorrect" : index === typed.length ? "current" : ""}>{character}</span>)}</div><label className="sr-only" htmlFor="lesson-input">Type the exercise text shown above</label><textarea id="lesson-input" ref={inputRef} aria-describedby="lesson-target" className="typing-input" value={input} onChange={event => setInput(Array.from(event.target.value).slice(0, target.length).join(""))} autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} placeholder="Click here and type the exercise above." /><div className="exercise-footer">{done ? <span className="exercise-success" role="status">Exercise complete. Nice work!</span> : <span>Use Backspace to fix mistakes and finish the line.</span>}<div><button className="exercise-reset" onClick={() => { setInput(""); inputRef.current?.focus(); }}>↻ Retry</button>{done && selected < lessons.length - 1 && <button className="button primary" onClick={() => choose(selected + 1)}>Next lesson →</button>}{done && selected === lessons.length - 1 && <a className="button primary" href="/#practice">Take a timed test →</a>}</div></div></div>{!storageAvailable && <p className="storage-note">Browser storage is unavailable. Exercises still work, but completion may not be saved.</p>}</div></section>;
}
