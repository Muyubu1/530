import { supabaseServer } from "../supabase/client.server";
import {
  DuplicateEmailError,
  type NewWaitlistEntry,
  type WaitlistRepository,
} from "@/domain/waitlist";

const UNIQUE_VIOLATION = "23505";

/** Supabase adapter for {@link WaitlistRepository} (anon insert; RLS-allowed). */
export function makeSupabaseWaitlistRepository(): WaitlistRepository {
  return {
    async add(entry: NewWaitlistEntry): Promise<void> {
      const { error } = await supabaseServer.from("waitlist").insert({
        name: entry.name || null,
        email: entry.email,
        phone: entry.phone ?? null,
        source: "landing",
      });
      if (!error) return;
      if (error.code === UNIQUE_VIOLATION) throw new DuplicateEmailError(entry.email);
      throw new Error(`[waitlist] insert failed: ${error.message}`);
    },
  };
}
