// Bir SQL dosyasını DATABASE_URL'e uygular (Supabase-native kurulum için).
// Kullanım: node scripts/run-sql.mjs supabase/setup.sql
// Bağlantı: SETUP_DATABASE_URL (session/direct, DDL için ideal) yoksa DATABASE_URL.
import "dotenv/config";
import { readFileSync } from "node:fs";
import postgres from "postgres";

const url = process.env.SETUP_DATABASE_URL || process.env.DATABASE_URL;
if (!url) throw new Error("SETUP_DATABASE_URL veya DATABASE_URL gerekli (.env).");

const file = process.argv[2] || "supabase/setup.sql";
const text = readFileSync(file, "utf8");

const sql = postgres(url, { prepare: false, onnotice: () => {}, max: 1 });
try {
  await sql.unsafe(text);
  console.log(`✓ uygulandı: ${file}`);
} catch (err) {
  console.error(`✗ HATA (${file}):`, err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
