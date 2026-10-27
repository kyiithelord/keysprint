"use client";

import { useEffect, useState } from "react";

const previewWords = ["rhythm", "focus", "speed", "spark", "flow"];

export default function ArcadeTypingPreview() {
  const [wordIndex, setWordIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const word = previewWords[wordIndex];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (typed !== previewWords[0]) setTyped(previewWords[0]);
      return;
    }

    let delay: number;
    let next: () => void;

    if (!deleting && typed.length < word.length) {
      delay = 145;
      next = () => setTyped(word.slice(0, typed.length + 1));
    } else if (!deleting) {
      delay = 1050;
      next = () => setDeleting(true);
    } else if (typed.length > 0) {
      delay = 85;
      next = () => setTyped(typed.slice(0, -1));
    } else {
      delay = 120;
      next = () => {
        setWordIndex((index) => (index + 1) % previewWords.length);
        setDeleting(false);
      };
    }

    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [word, wordIndex, typed, deleting]);

  return <span className="arcade-art-typing" aria-hidden="true">{typed}<span>▍</span></span>;
}
