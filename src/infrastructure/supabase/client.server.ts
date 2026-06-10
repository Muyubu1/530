import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client (anon key) — used for the waitlist insert, which
// RLS allows for the anon role (`insert with check (true)`). No session here.
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  throw new Error("Supabase env not set — see .env.example (VITE_SUPABASE_URL / _PUBLISHABLE_KEY)");
}

export const supabaseServer = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
