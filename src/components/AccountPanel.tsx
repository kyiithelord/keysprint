"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { getAuthClient } from "@/lib/auth";
import { authConfigured } from "@/lib/auth-config";
import { getSyncState, type SyncState } from "@/lib/progress-sync";
import ProfileDashboard from "@/components/ProfileDashboard";

type Mode = "sign-in" | "sign-up" | "forgot" | "reset";

export default function AccountPanel() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [syncState, setSyncState] = useState<SyncState>(() => getSyncState());

  useEffect(() => {
    const refresh = () => setSyncState(getSyncState());
    window.addEventListener("keysprint-sync-status", refresh);
    return () => window.removeEventListener("keysprint-sync-status", refresh);
  }, []);

  useEffect(() => {
    const client = getAuthClient();
    if (!client) { setLoading(false); return; }
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (hash.get("type") === "recovery") setMode("reset");
    if (hash.get("error_description")) setErrorMessage(hash.get("error_description") || "The sign-in link could not be used.");
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") setMode("reset");
      setLoading(false);
    });
    void client.auth.getSession().then(({ data, error }) => {
      if (error) setErrorMessage(error.message);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  function changeMode(next: Mode) {
    setMode(next);
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setErrorMessage("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getAuthClient();
    if (!client) return;
    setBusy(true); setMessage(""); setErrorMessage("");
    try {
      if ((mode === "sign-up" || mode === "reset") && password.length < 8) throw new Error("Use at least 8 characters for your password.");
      if ((mode === "sign-up" || mode === "reset") && password !== confirmPassword) throw new Error("The passwords do not match.");
      if (mode === "sign-up") {
        const { data, error } = await client.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${window.location.origin}/account` } });
        if (error) throw error;
        setMessage(data.session ? "Your account is ready." : "Check your inbox for the confirmation link before signing in.");
        setPassword(""); setConfirmPassword("");
      } else if (mode === "sign-in") {
        const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        setPassword("");
      } else if (mode === "forgot") {
        const { error } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/account` });
        if (error) throw error;
        setMessage("If this email has an account, a password reset link will arrive in its inbox.");
      } else {
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        setMessage("Your password was updated.");
        setPassword(""); setConfirmPassword(""); setMode("sign-in");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    const client = getAuthClient();
    if (!client) return;
    setBusy(true); setErrorMessage(""); setMessage("");
    const { error } = await client.auth.signOut();
    if (error) setErrorMessage(error.message);
    else { setUser(null); changeMode("sign-in"); setMessage("You have signed out."); }
    setBusy(false);
  }

  async function resendConfirmation() {
    const client = getAuthClient();
    if (!client) return;
    if (!email.trim()) {
      setErrorMessage("Enter your email address first.");
      return;
    }
    setBusy(true); setMessage(""); setErrorMessage("");
    const { error } = await client.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/account` },
    });
    if (error) setErrorMessage(error.message);
    else setMessage("If this email is awaiting confirmation, a new link will arrive in its inbox.");
    setBusy(false);
  }

  if (!authConfigured) return <div className="account-card account-unavailable"><p className="eyebrow">ACCOUNT SETUP</p><h2>Coming soon.</h2><p>Email accounts will be available after the authentication service is connected. Typing tests and lessons still work without an account.</p><a className="button primary" href="/#practice">Practice without an account →</a></div>;

  if (!loading && user && mode !== "reset") return <ProfileDashboard user={user} syncState={syncState} onSignOut={() => void signOut()} busy={busy} />;

  return <div className="account-card">
    {message && <p className="account-message" role="status">{message}</p>}
    {errorMessage && <p className="account-error" role="alert">{errorMessage}</p>}
    {loading ? <p role="status">Checking your account…</p> : <>
      {mode === "sign-in" || mode === "sign-up" ? <div className="account-tabs" role="tablist" aria-label="Account action"><button type="button" role="tab" aria-selected={mode === "sign-in"} className={mode === "sign-in" ? "active" : ""} onClick={() => changeMode("sign-in")}>Sign in</button><button type="button" role="tab" aria-selected={mode === "sign-up"} className={mode === "sign-up" ? "active" : ""} onClick={() => changeMode("sign-up")}>Create account</button></div> : <button className="account-back" type="button" onClick={() => changeMode("sign-in")}>← Back to sign in</button>}
      <h2>{mode === "sign-up" ? "Create your account." : mode === "forgot" ? "Reset your password." : mode === "reset" ? "Choose a new password." : "Welcome back."}</h2>
      <p className="account-subtitle">{mode === "sign-up" ? "Use your email to make a free Typencil account." : mode === "forgot" ? "Enter your account email and we will send a reset link." : mode === "reset" ? "Enter a new password for your account." : "Sign in to your Typencil account."}</p>
      <form onSubmit={submit}>
        {mode !== "reset" && <label>Email address<input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></label>}
        {mode !== "forgot" && <label>{mode === "reset" ? "New password" : "Password"}<input type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} value={password} onChange={event => setPassword(event.target.value)} minLength={mode === "sign-in" ? undefined : 8} required /></label>}
        {(mode === "sign-up" || mode === "reset") && <label>Confirm password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} minLength={8} required /></label>}
        {mode === "sign-in" && <button className="account-forgot" type="button" onClick={() => changeMode("forgot")}>Forgot password?</button>}
        <button className="button primary account-submit" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "sign-up" ? "Create account →" : mode === "forgot" ? "Send reset link →" : mode === "reset" ? "Update password →" : "Sign in →"}</button>
      </form>
      {(mode === "sign-in" || mode === "sign-up") && <button className="account-forgot" type="button" onClick={resendConfirmation} disabled={busy}>Resend confirmation email</button>}
      <p className="account-small">Creating an account is optional. Sign in to sync your typing results, lessons, game bests, and daily challenges across devices.</p>
    </>}
  </div>;
}
