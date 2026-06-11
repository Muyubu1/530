import type { PriceCatalog } from "@/domain/pricing-audit";
import { getStripeClient } from "./stripe.server";

export function makeStripePriceCatalog(): PriceCatalog {
  return {
    async byLookupKey(keys: string[]) {
      const res = await getStripeClient().prices.list({
        lookup_keys: keys,
        active: true,
        limit: 100,
      });
      const map = new Map<string, { amountMajor: number; currency: string }>();
      for (const p of res.data) {
        if (p.lookup_key && p.unit_amount != null) {
          map.set(p.lookup_key, { amountMajor: p.unit_amount / 100, currency: p.currency });
        }
      }
      return map;
    },
  };
}
