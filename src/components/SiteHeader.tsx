"use client";

import { useEffect, useRef, useState } from "react";

type Section = "home" | "lessons" | "progress" | "guides" | "info";

export default function SiteHeader({ current }: { current: Section }) {
  const normalRef = useRef<HTMLElement>(null);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const update = () => setShowFloating((normalRef.current?.getBoundingClientRect().bottom ?? 1) <= 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <>
    <header ref={normalRef} className="site-header" inert={showFloating}>
      <HeaderLinks current={current} />
    </header>
    <header className={`site-header floating-header${showFloating ? " is-visible" : ""}`} aria-hidden={!showFloating} inert={!showFloating}>
      <HeaderLinks current={current} />
    </header>
  </>;
}

function HeaderLinks({ current }: { current: Section }) {
  return <>
    <a className="brand" href="/" aria-label="KeySprint home"><span className="brand-mark">K<span>↗</span></span> KeySprint</a>
    <nav aria-label="Main navigation">
      <a href={current === "home" ? "#practice" : "/#practice"}>Practice</a>
      <a href="/lessons" aria-current={current === "lessons" ? "page" : undefined}>Typing lessons</a>
      <a href="/progress" aria-current={current === "progress" ? "page" : undefined}>My progress</a>
      <a href="/guides" aria-current={current === "guides" ? "page" : undefined}>Typing guides</a>
      <a href="/about">About</a>
    </nav>
  </>;
}
