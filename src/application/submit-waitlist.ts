import {
  DuplicateEmailError,
  type NewWaitlistEntry,
  type WaitlistRepository,
  type WaitlistResult,
} from "@/domain/waitlist";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Use-case: normalise input and persist a waitlist join, mapping the outcome
 * to a UI-friendly result. Depends on the repository port, not a concrete DB.
 *
 * The application form's `contact` may be an e-mail or an Instagram handle.
 * When it parses as an e-mail we also store it in `email` (enables dedup); the
 * raw value is always kept in `contact`.
 */
export async function submitWaitlist(
  repo: WaitlistRepository,
  input: NewWaitlistEntry,
): Promise<WaitlistResult> {
  const contact = (input.contact ?? input.email ?? "").trim();
  const emailRaw = (input.email ?? input.contact ?? "").trim().toLowerCase();
  const email = EMAIL_RE.test(emailRaw) ? emailRaw : undefined;

  // Need at least some way to reach the applicant.
  if (!email && !contact) return "error";

  try {
    await repo.add({
      name: input.name.trim(),
      email,
      phone: input.phone?.trim() || undefined,
      contact: contact || undefined,
      why: input.why?.trim() || undefined,
    });
    return "ok";
  } catch (err) {
    if (err instanceof DuplicateEmailError) return "duplicate";
    console.error("[submitWaitlist] unexpected error", err);
    return "error";
  }
}
