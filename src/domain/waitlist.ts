/**
 * Waitlist domain — entities, the repository port, and domain errors.
 * No framework, no Postgres, no Supabase. Infrastructure adapters implement
 * `WaitlistRepository`; the application layer depends on the interface only.
 */

export interface NewWaitlistEntry {
  name: string;
  /** Validated e-mail when the contact is an address; otherwise undefined. */
  email?: string;
  phone?: string;
  /** Raw contact as typed — e-mail or an Instagram handle. */
  contact?: string;
  /** Free-text "why are you here?" from the application form. */
  why?: string;
}

export interface WaitlistEntry extends NewWaitlistEntry {
  id: string;
  source: string;
  createdAt: Date;
}

/** Outcome of a join attempt, suitable for the UI to react to. */
export type WaitlistResult = "ok" | "duplicate" | "error";

/** Thrown by adapters when the e-mail already exists (unique violation). */
export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`E-mail already on the waitlist: ${email}`);
    this.name = "DuplicateEmailError";
  }
}

/** Port: persistence boundary for the waitlist. */
export interface WaitlistRepository {
  /** Persists a new entry. Throws {@link DuplicateEmailError} on conflict. */
  add(entry: NewWaitlistEntry): Promise<void>;
}
