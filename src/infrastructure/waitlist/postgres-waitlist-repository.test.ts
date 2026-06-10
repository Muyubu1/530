import { afterAll, expect, test } from "vitest";
import { sql } from "../db/client.server";
import { makeWaitlistRepository } from "./postgres-waitlist-repository.server";
import { submitWaitlist } from "@/application/submit-waitlist";

// Integration test against the local Postgres `refactor530` database.
const email = `vitest+${Date.now()}@test.local`;
const repo = makeWaitlistRepository();

test("persists a new waitlist entry", async () => {
  const result = await submitWaitlist(repo, { name: "  Vitest  ", email, phone: "+900000000000" });
  expect(result).toBe("ok");

  const rows = await sql`select name, email, source from waitlist where email = ${email}`;
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({ name: "Vitest", email, source: "landing" });
});

test("rejects a duplicate e-mail", async () => {
  const result = await submitWaitlist(repo, { name: "Vitest", email: email.toUpperCase() });
  expect(result).toBe("duplicate");
});

afterAll(async () => {
  await sql`delete from waitlist where email = ${email}`;
  await sql.end();
});
