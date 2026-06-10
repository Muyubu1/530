import { expect, test } from "vitest";
import { supabaseServer } from "./client.server";

// Regression: the server client used to throw "Node.js 20 ... WebSocket" on
// any call. With the ws polyfill it must resolve gracefully instead.
test("server supabase client works under Node without native WebSocket", async () => {
  const { data, error } = await supabaseServer.auth.getUser("invalid-token");
  expect(data.user).toBeNull();
  expect(error).toBeTruthy();
});
