"use client";

import { useEffect, useRef, useState } from "react";
import { authConfigured } from "@/lib/auth-config";
import { getAuthClient } from "@/lib/auth";

type Section = "home" | "lessons" | "progress" | "guides" | "info" | "account";

export default function SiteHeader({ current }: { current: Section }) {
  const normalRef = useRef<HTMLElement>(null);
  const [showFloating, setShowFloating] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

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

  useEffect(() => {
    const client = getAuthClient();
    if (!client) return;
    let mounted = true;
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (mounted) setSignedIn(Boolean(session?.user));
    });
    void client.auth.getSession().then(({ data }) => {
      if (mounted) setSignedIn(Boolean(data.session?.user));
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  return <>
    <header ref={normalRef} className="site-header" inert={showFloating}>
      <HeaderLinks current={current} signedIn={signedIn} />
    </header>
    <header className={`site-header floating-header${showFloating ? " is-visible" : ""}`} aria-hidden={!showFloating} inert={!showFloating}>
      <HeaderLinks current={current} signedIn={signedIn} />
    </header>
  </>;
}

function HeaderLinks({ current, signedIn }: { current: Section; signedIn: boolean }) {
  return <>
    <a className="brand" href="/" aria-label="KeySprint home"><span className="brand-mark">K<span>↗</span></span> KeySprint</a>
    <nav aria-label="Main navigation">
      <a href={current === "home" ? "#practice" : "/#practice"}>Practice</a>
      <a href="/lessons" aria-current={current === "lessons" ? "page" : undefined}>Typing lessons</a>
      <a href="/progress" aria-current={current === "progress" ? "page" : undefined}>My progress</a>
      <a href="/guides" aria-current={current === "guides" ? "page" : undefined}>Typing guides</a>
      <a href="/about">About</a>
      {authConfigured && <a href="/account" aria-current={current === "account" ? "page" : undefined}>{signedIn ? "Profile" : "Sign in"}</a>}
    </nav>
  </>;
}
