import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { authConfigured, supabasePublishableKey, supabaseUrl } from "./auth-config";
let browserClient: SupabaseClient | null = null;

export function getAuthClient(): SupabaseClient | null {
  if (!authConfigured || !supabaseUrl || !supabasePublishableKey) return null;
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return browserClient;
}
