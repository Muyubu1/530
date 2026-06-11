import type { User } from "@supabase/supabase-js";
import type { AuthGateway, AuthUser, SignUpInput } from "@/domain/auth";
import { getSupabaseBrowser } from "./supabase-client";

function toUser(u: User | null | undefined): AuthUser | null {
  if (!u?.email) return null;
  const meta = (u.user_metadata ?? {}) as { display_name?: string; avatar_url?: string };
  return {
    id: u.id,
    email: u.email,
    displayName: meta.display_name || u.email.split("@")[0],
    avatarUrl: meta.avatar_url ?? null,
  };
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

  async updateProfile(displayName, lastName) {
    const { error } = await getSupabaseBrowser().auth.updateUser({
      data: { display_name: displayName, last_name: lastName },
    });
    return { error: error?.message };
  },

  async hasPurchase(email): Promise<boolean> {
    const { data, error } = await getSupabaseBrowser().rpc("email_has_purchase", {
      check_email: email,
    });
    return !error && data === true;
  },

  async getAccessToken() {
    const { data } = await getSupabaseBrowser().auth.getSession();
    return data.session?.access_token ?? null;
  },

  async uploadAvatar(file) {
    const sb = getSupabaseBrowser();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) throw new Error("Oturum bulunamadı.");
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await sb.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type || undefined });
    if (upErr) throw upErr;
    const url = sb.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    const { error: updErr } = await sb.auth.updateUser({ data: { avatar_url: url } });
    if (updErr) throw updErr;
    return url;
  },

  async isAdmin() {
    const sb = getSupabaseBrowser();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return false;
    const { data } = await sb.from("user_roles").select("role").eq("user_id", user.id);
    return ((data ?? []) as { role: string }[]).some((r) => r.role === "admin");
  },

  async listWaitlist() {
    const { data, error } = await getSupabaseBrowser()
      .from("waitlist")
      .select("id, name, email, phone, source, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as WaitlistRow[]).map((r) => ({
      id: r.id,
      name: r.name ?? "",
      email: r.email,
      phone: r.phone ?? undefined,
      source: r.source,
      createdAt: new Date(r.created_at),
    }));
  },
};

interface WaitlistRow {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  source: string;
  created_at: string;
}
