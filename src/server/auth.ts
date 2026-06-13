import { supabaseServer } from "@/infrastructure/supabase/client.server";
import { sql } from "@/infrastructure/db/client.server";

/** Verifies a Supabase access token server-side and returns the user id. */
export async function verifyUser(token: string): Promise<string> {
  const { data, error } = await supabaseServer.auth.getUser(token);
  if (error || !data.user) {
    throw new Error("Unauthorized");
  }
  return data.user.id;
}

/** Verifies the token AND that the user has the admin role. Gates all writes. */
export async function requireAdmin(token: string): Promise<string> {
  const userId = await verifyUser(token);
  const rows = await sql`
    select 1 from public.user_roles where user_id = ${userId} and role = 'admin' limit 1
  `;
  if (rows.length === 0) throw new Error("Forbidden");
  return userId;
}
