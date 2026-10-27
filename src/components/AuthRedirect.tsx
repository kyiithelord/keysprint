"use client";

import { useEffect } from "react";

export default function AuthRedirect() {
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (window.location.pathname !== "/account" && (hash.has("access_token") || hash.has("error_code") || hash.has("error_description"))) {
      window.location.replace(`/account${window.location.hash}`);
    }
  }, []);

  return null;
}
