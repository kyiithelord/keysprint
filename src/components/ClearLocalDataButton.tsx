"use client";

import { useState } from "react";

export default function ClearLocalDataButton() {
  const [message, setMessage] = useState("");

  function clearData() {
    if (!window.confirm("Delete your saved KeySprint test results and lesson completions from this browser?")) return;
    try {
      localStorage.removeItem("keysprint-results-v1");
      localStorage.removeItem("keysprint-lessons-v1");
      setMessage("Saved results and lesson completions were removed from this browser.");
    } catch {
      setMessage("Browser storage could not be cleared. Check your browser settings.");
    }
  }

  return <div className="privacy-control"><button className="button secondary" type="button" onClick={clearData}>Clear saved progress</button><p role="status">{message}</p></div>;
}
