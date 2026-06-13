import "dotenv/config";
import postgres from "postgres";

// Server-only Postgres connection. The `.server.ts` suffix keeps this out of
// the client bundle. A single shared connection pool for the process.
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set — see .env.example");
}

// `prepare: false` is required for Supabase's transaction pooler (and harmless
// on the session pooler) so the same code runs locally and on Vercel.
export const sql = postgres(url, { prepare: false, onnotice: () => {} });
