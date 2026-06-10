import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser Supabase client — owns the auth session (localStorage). Created
// lazily on first use so it never instantiates during SSR (the realtime client
// needs browser globals). Auth is a client concern, hence ui-shared.
let client: SupabaseClient | undefined;

export function getSupabaseBrowser(): SupabaseClient {
  if (!client) {
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
    if (!url || !key) {
      throw new Error(
        "Supabase env not set — see .env.example (VITE_SUPABASE_URL / _PUBLISHABLE_KEY)",
      );
    }
    client = createClient(url, key, {
      auth: {
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
