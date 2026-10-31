import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { authConfigured, supabasePublishableKey, supabaseUrl } from "./auth-config";
let browserClient: SupabaseClient | null = null;
const AUTH_REQUEST_TIMEOUT_MS = 10000;

async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), AUTH_REQUEST_TIMEOUT_MS);
  const originalSignal = init?.signal;
  const abort = () => controller.abort();
  originalSignal?.addEventListener("abort", abort, { once: true });
  if (originalSignal?.aborted) controller.abort();
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
    originalSignal?.removeEventListener("abort", abort);
  }
}

export function getAuthClient(): SupabaseClient | null {
  if (!authConfigured || !supabaseUrl || !supabasePublishableKey) return null;
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      global: { fetch: authFetch },
    });
  }
  return browserClient;
}
