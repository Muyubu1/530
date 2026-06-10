import { createServerFn } from "@tanstack/react-start";
import { submitWaitlist } from "@/application/submit-waitlist";
import { makeWaitlistRepository } from "@/infrastructure/waitlist/postgres-waitlist-repository.server";
import type { NewWaitlistEntry } from "@/domain/waitlist";

/**
 * Composition root for the waitlist: a server function that wires the Postgres
 * adapter into the use-case. Callable from the client; the body runs server-side.
 */
export const submitWaitlistFn = createServerFn({ method: "POST" })
  .validator((data: NewWaitlistEntry) => data)
  .handler(({ data }) => submitWaitlist(makeWaitlistRepository(), data));
