"use client";

import { useEffect } from "react";
import { getAuthClient } from "@/lib/auth";
import { getActiveProgressUser, setActiveProgressUser } from "@/lib/progress-storage";
import { importGuestProgress, isSyncPaused, setSyncState, syncProgress } from "@/lib/progress-sync";

export default function ProgressSync() {
  useEffect(() => {
    const client = getAuthClient();
    if (!client) return;
    let mounted = true;
    let running = false;
    let pending = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const run = async () => {
      if (!mounted || !getActiveProgressUser() || isSyncPaused()) return;
      if (running) { pending = true; return; }
      running = true;
      const userId = getActiveProgressUser()!;
      setSyncState({ state: "syncing" });
      try {
        await syncProgress(client, userId);
        if (mounted && getActiveProgressUser() === userId) setSyncState({ state: "synced" });
      } catch (error) {
        if (mounted && getActiveProgressUser() === userId) setSyncState({ state: "error", message: error instanceof Error ? error.message : "Progress could not sync." });
      } finally {
        running = false;
        if (pending) { pending = false; schedule(); }
      }
    };

    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { void run(); }, 650);
    };

    const handleUser = (userId: string | null) => {
      if (!mounted) return;
      if (getActiveProgressUser() === userId) return;
      setActiveProgressUser(userId);
      if (!userId) { setSyncState({ state: "signed-out" }); return; }
      try { importGuestProgress(userId); }
      catch (error) { setSyncState({ state: "error", message: error instanceof Error ? error.message : "Browser progress could not be loaded." }); }
      schedule();
    };

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      // Supabase auth callbacks must not await database requests.
      setTimeout(() => handleUser(session?.user.id ?? null), 0);
    });
    void client.auth.getSession().then(({ data }) => handleUser(data.session?.user.id ?? null));
    const onProgress = () => { if (getActiveProgressUser()) schedule(); };
    const onStorage = (event: StorageEvent) => { if (event.key?.startsWith("keysprint-")) schedule(); };
    window.addEventListener("keysprint-progress-update", onProgress);
    window.addEventListener("storage", onStorage);
    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
      subscription.unsubscribe();
      window.removeEventListener("keysprint-progress-update", onProgress);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return null;
}
