import "dotenv/config";
import postgres from "postgres";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const MIGRATIONS_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/infrastructure/db/migrations",
);

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set (.env)");
  process.exit(1);
}

const sql = postgres(url);

try {
  await sql`create table if not exists schema_migrations (
    name text primary key,
    applied_at timestamptz not null default now()
  )`;

  const applied = new Set((await sql`select name from schema_migrations`).map((r) => r.name));
  const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith(".sql")).sort();

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) continue;
    const text = await readFile(join(MIGRATIONS_DIR, file), "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(text);
      await tx`insert into schema_migrations (name) values (${file})`;
    });
    console.log("applied:", file);
    count++;
  }
  console.log(count === 0 ? "migrations up to date" : `applied ${count} migration(s)`);
} finally {
  await sql.end();
}
