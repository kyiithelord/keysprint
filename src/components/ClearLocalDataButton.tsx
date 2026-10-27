"use client";

import { useState } from "react";

export default function ClearLocalDataButton() {
  const [message, setMessage] = useState("");

  function clearData() {
    if (!window.confirm("Delete your saved KeySprint tests, lessons, game bests, and daily challenges from this browser?")) return;
    try {
      localStorage.removeItem("keysprint-results-v1");
      localStorage.removeItem("keysprint-lessons-v1");
      localStorage.removeItem("keysprint-daily-challenges-v1");
      for (const mode of ["word-rush", "sprint", "precision", "memory", "typing-racer"]) localStorage.removeItem(`keysprint-${mode}-best-v1`);
      window.dispatchEvent(new Event("keysprint-daily-update"));
      setMessage("Saved tests, lessons, game bests, and daily challenges were removed from this browser.");
    } catch {
      setMessage("Browser storage could not be cleared. Check your browser settings.");
    }
  }

  return <div className="privacy-control"><button className="button secondary" type="button" onClick={clearData}>Clear saved progress</button><p role="status">{message}</p></div>;
}
