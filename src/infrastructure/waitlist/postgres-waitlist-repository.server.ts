import { sql } from "../db/client.server";
import {
  DuplicateEmailError,
  type NewWaitlistEntry,
  type WaitlistRepository,
} from "@/domain/waitlist";

const UNIQUE_VIOLATION = "23505";

/** Postgres adapter for {@link WaitlistRepository}. */
export function makeWaitlistRepository(): WaitlistRepository {
  return {
    async add(entry: NewWaitlistEntry): Promise<void> {
      try {
        await sql`
          insert into waitlist (name, email, phone, contact, why, source)
          values (${entry.name || null}, ${entry.email ?? null}, ${entry.phone ?? null}, ${entry.contact ?? null}, ${entry.why ?? null}, 'landing')
        `;
      } catch (err) {
        if (err && typeof err === "object" && "code" in err && err.code === UNIQUE_VIOLATION) {
          throw new DuplicateEmailError(entry.email ?? "");
        }
        throw err;
      }
    },
  };
}
