"use client";

import { memo, useEffect, useRef, type RefObject } from "react";

type Props = { target: string; input: string; inputRef: RefObject<HTMLTextAreaElement | null> };

function TypingPrompt({ target, input, inputRef }: Props) {
  const promptRef = useRef<HTMLDivElement>(null);
  const characters = Array.from(target);
  const typed = Array.from(input);
  // Keep the DOM small even for long tests. Advance the window only after a full chunk.
  const start = Math.floor(typed.length / 250) * 250;
  const visible = characters.slice(start, start + 500);

  useEffect(() => {
    const prompt = promptRef.current;
    const current = prompt?.querySelector<HTMLElement>(".current");
    if (prompt && current) prompt.scrollTop = Math.max(0, current.offsetTop - prompt.offsetTop - 45);
  }, [input]);

  return <div ref={promptRef} id="target-text" className="typing-prompt" onClick={() => inputRef.current?.focus()}>
    {visible.map((character, offset) => {
      const index = start + offset;
      const state = index < typed.length ? typed[index] === character ? "correct" : "incorrect" : index === typed.length ? "current" : "";
      return <span key={index} className={state}>{character}</span>;
    })}
  </div>;
}

export default memo(TypingPrompt);
