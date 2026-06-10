import type { User } from "@supabase/supabase-js";
import type { AuthGateway, AuthUser, SignUpInput } from "@/domain/auth";
import { getSupabaseBrowser } from "./supabase-client";

function toUser(u: User | null | undefined): AuthUser | null {
  if (!u?.email) return null;
  const meta = (u.user_metadata ?? {}) as { display_name?: string };
  return { id: u.id, email: u.email, displayName: meta.display_name || u.email.split("@")[0] };
}

const origin = () => (typeof window !== "undefined" ? window.location.origin : "");

/** Supabase implementation of the {@link AuthGateway} port (browser session). */
export const supabaseAuthGateway: AuthGateway = {
  async getUser() {
    const { data } = await getSupabaseBrowser().auth.getUser();
    return toUser(data.user);
  },

  onAuthChange(cb) {
    const { data } = getSupabaseBrowser().auth.onAuthStateChange((_event, session) =>
      cb(toUser(session?.user)),
    );
    return () => data.subscription.unsubscribe();
  },

  async signInWithPassword(email, password) {
    const { error } = await getSupabaseBrowser().auth.signInWithPassword({ email, password });
    return { error: error?.message };
  },

  async signUp({ email, password, displayName, lastName }: SignUpInput) {
    const { error } = await getSupabaseBrowser().auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName, last_name: lastName },
        emailRedirectTo: `${origin()}/uye`,
      },
    });
    return { error: error?.message };
  },

  async signOut() {
    await getSupabaseBrowser().auth.signOut();
  },

  async resetPasswordForEmail(email) {
    const { error } = await getSupabaseBrowser().auth.resetPasswordForEmail(email, {
      redirectTo: `${origin()}/reset-password`,
    });
    return { error: error?.message };
  },

  async updatePassword(password) {
    const { error } = await getSupabaseBrowser().auth.updateUser({ password });
    return { error: error?.message };
  },

  async signInWithGoogle() {
    const { error } = await getSupabaseBrowser().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin()}/uye` },
    });
    return { error: error?.message };
  },

  async hasPurchase(email): Promise<boolean> {
    const { data, error } = await getSupabaseBrowser().rpc("email_has_purchase", {
      check_email: email,
    });
    return !error && data === true;
  },
};
