import { expect, test } from "vitest";
import { auditPricing } from "./audit-pricing";
import { PLANS } from "@/domain/pricing";
import type { PriceCatalog } from "@/domain/pricing-audit";

const catalog = (
  entries: Record<string, { amountMajor: number; currency: string }>,
): PriceCatalog => ({
  byLookupKey: async () => new Map(Object.entries(entries)),
});

test("flags match, mismatch and missing", async () => {
  const rows = await auditPricing(
    catalog({
      [PLANS.kisisel_1ay.lookupKey]: { amountMajor: PLANS.kisisel_1ay.amountTRY, currency: "try" },
      [PLANS.ozel_1ay.lookupKey]: { amountMajor: PLANS.ozel_1ay.amountTRY + 5, currency: "try" },
      // mentorluk_1saat intentionally absent → missing
    }),
  );
  const byKey = Object.fromEntries(rows.map((r) => [r.planKey, r.status]));
  expect(byKey.kisisel_1ay).toBe("match");
  expect(byKey.ozel_1ay).toBe("mismatch");
  expect(byKey.mentorluk_1saat).toBe("missing");
});
