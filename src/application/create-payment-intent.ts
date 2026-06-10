import { PLANS, type PlanKey } from "@/domain/pricing";
import type { PaymentGateway, PaymentIntentResult } from "@/domain/payment";

export async function createPaymentIntent(
  gateway: PaymentGateway,
  planKey: string,
  email: string,
): Promise<PaymentIntentResult> {
  if (!(planKey in PLANS)) throw new Error(`Bilinmeyen plan: ${planKey}`);
  const normalized = email.trim().toLowerCase();
  if (!normalized) throw new Error("E-posta gerekli.");
  return gateway.createIntent(planKey as PlanKey, normalized);
}
