// Demo/admin kullanıcısı: signup (anon) + e-posta onayı + purchase + admin rolü.
// Direkt Postgres erişimiyle (pooler) onay & rol verilir — dashboard gerekmez.
// Kullanım: node scripts/seed-demo-user.mjs <email> <password>
import "dotenv/config";
import ws from "ws";
if (!globalThis.WebSocket) globalThis.WebSocket = ws; // G6
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

const email = (process.argv[2] || "admin@530lab.app").toLowerCase();
const password = process.argv[3] || "Admin.530.2026";
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false },
});
const sql = postgres(process.env.DATABASE_URL, { prepare: false, onnotice: () => {} });

try {
  const { error: suErr } = await sb.auth.signUp({
    email,
    password,
    options: { data: { display_name: "5.30 Admin" } },
  });
  console.log("signUp:", suErr ? suErr.message : "ok");

  // e-posta onayı (confirmation açık olsa bile giriş yapılabilsin)
  await sql`update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now()) where lower(email) = ${email}`;
  // gate
  await sql`insert into public.purchases (email) values (${email}) on conflict do nothing`;
  // admin rolü
  await sql`
    insert into public.user_roles (user_id, role)
    select id, 'admin' from auth.users where lower(email) = ${email}
    on conflict (user_id, role) do nothing`;

  const { data: si, error: siErr } = await sb.auth.signInWithPassword({ email, password });
  console.log("signIn:", siErr ? siErr.message : `ok (uid=${si.user?.id})`);
  const roles = await sql`
    select r.role from public.user_roles r join auth.users u on u.id = r.user_id
    where lower(u.email) = ${email}`;
  console.log("roller:", roles.map((r) => r.role).join(", ") || "yok");
  console.log(`\nGİRİŞ → ${email} / ${password}`);
} catch (e) {
  console.error("HATA:", e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
