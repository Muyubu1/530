import { PLANS, type PlanKey } from "@/domain/pricing";
import type { PriceAuditRow, PriceCatalog } from "@/domain/pricing-audit";

export async function auditPricing(catalog: PriceCatalog): Promise<PriceAuditRow[]> {
  const keys = Object.keys(PLANS) as PlanKey[];
  const stripe = await catalog.byLookupKey(keys.map((k) => PLANS[k].lookupKey));

  return keys.map((k) => {
    const plan = PLANS[k];
    const found = stripe.get(plan.lookupKey);
    const stripeTRY = found ? found.amountMajor : null;
    const status: PriceAuditRow["status"] = !found
      ? "missing"
      : found.amountMajor !== plan.amountTRY || found.currency.toLowerCase() !== plan.currency
        ? "mismatch"
        : "match";
    return {
      planKey: k,
      label: plan.label,
      lookupKey: plan.lookupKey,
      expectedTRY: plan.amountTRY,
      stripeTRY,
      status,
    };
  });
}
