import {
  DuplicateEmailError,
  type NewWaitlistEntry,
  type WaitlistRepository,
  type WaitlistResult,
} from "@/domain/waitlist";

/**
 * Use-case: normalise input and persist a waitlist join, mapping the outcome
 * to a UI-friendly result. Depends on the repository port, not a concrete DB.
 */
export async function submitWaitlist(
  repo: WaitlistRepository,
  input: NewWaitlistEntry,
): Promise<WaitlistResult> {
  const email = input.email.trim().toLowerCase();
  if (!email) return "error";

  try {
    await repo.add({
      name: input.name.trim(),
      email,
      phone: input.phone?.trim() || undefined,
    });
    return "ok";
  } catch (err) {
    if (err instanceof DuplicateEmailError) return "duplicate";
    console.error("[submitWaitlist] unexpected error", err);
    return "error";
  }
}
