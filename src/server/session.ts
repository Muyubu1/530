import type { CurrentUser } from "@/domain/session";

/**
 * TEMPORARY mock session. Auth is deferred to the Supabase phase; this is the
 * single place that fabricates the current user. Swapping to real auth means
 * editing only this file — every screen already receives `user` by injection.
 */
const DEV_USER_ID = "00000000-0000-0000-0000-0000000000de";

// TODO(auth): replace with the real Supabase session lookup.
export function getCurrentUser(): CurrentUser {
  return { id: DEV_USER_ID, displayName: "Kardeş" };
}
