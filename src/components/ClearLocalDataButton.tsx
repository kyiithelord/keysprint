"use client";

import { useEffect, useState } from "react";
import { getAuthClient } from "@/lib/auth";
import { deleteAccountProgress } from "@/lib/progress-sync";
import { gameBestModes, getActiveProgressUser, notifyProgressChanged, progressKeys } from "@/lib/progress-storage";

export default function ClearLocalDataButton() {
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const refresh = () => setUserId(getActiveProgressUser());
    refresh();
    window.addEventListener("keysprint-progress-update", refresh);
    return () => window.removeEventListener("keysprint-progress-update", refresh);
  }, []);

  async function clearData() {
    const signedIn = Boolean(userId);
    if (!window.confirm(signedIn
      ? "Delete all synced KeySprint tests, lessons, game bests, and daily challenges from your account and this device? This cannot be undone."
      : "Delete saved KeySprint tests, lessons, game bests, and daily challenges from this browser?")) return;
    setBusy(true);
    setMessage("");
    try {
      if (userId) {
        const client = getAuthClient();
        if (!client) throw new Error("Your account is unavailable.");
        await deleteAccountProgress(client, userId);
        setMessage("Your synced account progress and this device's account copy were deleted.");
      } else {
        for (const base of [progressKeys.results, progressKeys.lessons, progressKeys.daily, ...gameBestModes.map(progressKeys.gameBest)]) localStorage.removeItem(base);
        localStorage.removeItem("keysprint-guest-progress-owner-v1");
        notifyProgressChanged();
        window.dispatchEvent(new Event("keysprint-daily-update"));
        setMessage("Saved guest progress was removed from this browser.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Progress could not be deleted. Please try again.");
    } finally { setBusy(false); }
  }

  return <div className="privacy-control"><button className="button secondary" type="button" onClick={() => void clearData()} disabled={busy}>{busy ? "Please wait…" : userId ? "Delete synced progress" : "Clear saved progress"}</button><p role="status">{message}</p></div>;
}
