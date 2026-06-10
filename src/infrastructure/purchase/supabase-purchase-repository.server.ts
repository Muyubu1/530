import { supabaseServer } from "../supabase/client.server";
import type { PurchaseRepository } from "@/domain/purchase";

/** Supabase adapter — anon insert is allowed by RLS (validated email). */
export function makePurchaseRepository(): PurchaseRepository {
  return {
    async record(email: string): Promise<void> {
      const { error } = await supabaseServer.from("purchases").insert({ email });
      // 23505 = already a purchaser; that's fine.
      if (error && error.code !== "23505") {
        throw new Error(`[purchases] insert failed: ${error.message}`);
      }
    },
  };
}
