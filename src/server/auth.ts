import { supabaseServer } from "@/infrastructure/supabase/client.server";

/** Verifies a Supabase access token server-side and returns the user id. */
export async function verifyUser(token: string): Promise<string> {
  const { data, error } = await supabaseServer.auth.getUser(token);
  if (error || !data.user) {
    throw new Error("Unauthorized");
  }
  return data.user.id;
}
