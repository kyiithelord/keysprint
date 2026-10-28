import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AccountPanel from "@/components/AccountPanel";
import { authConfigured } from "@/lib/auth-config";

export const metadata: Metadata = {
  title: "KeySprint Account | Sign In or Create an Account",
  description: "Create a free KeySprint account with email, sign in, or reset your password. Typing practice remains available without an account.",
  robots: authConfigured ? undefined : { index: false, follow: true },
};

export default function AccountPage() {
  return <main className="page account-page"><SiteHeader current="account" /><section className="account-layout"><div className="account-intro"><p className="eyebrow">KEYSPRINT / ACCOUNT</p><h1>Keep your<br /><em>practice going.</em></h1><p>Create a free account or sign in with email. You can still use every typing test and lesson without registering.</p><div className="account-benefit"><span>01</span><p>Email and password sign in</p></div><div className="account-benefit"><span>02</span><p>Confirm your email to protect your account</p></div><div className="account-benefit"><span>03</span><p>Sync your progress across devices</p></div></div><AccountPanel /></section><SiteFooter /></main>;
}
