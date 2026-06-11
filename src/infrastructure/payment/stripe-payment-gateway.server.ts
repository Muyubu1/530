import { PLANS, type PlanKey } from "@/domain/pricing";
import type { PaymentGateway, PaymentIntentResult } from "@/domain/payment";
import { getStripeClient } from "./stripe.server";

/** Stripe adapter — amount comes from the domain pricing registry (no Stripe products needed). */
export function makeStripePaymentGateway(): PaymentGateway {
  return {
    async createIntent(planKey: PlanKey, email: string): Promise<PaymentIntentResult> {
      const plan = PLANS[planKey];
      const intent = await getStripeClient().paymentIntents.create({
        amount: plan.amountTRY * 100,
        currency: plan.currency,
        receipt_email: email,
        description: plan.label,
        metadata: { planKey, email },
        automatic_payment_methods: { enabled: true },
      });
      return {
        clientSecret: intent.client_secret ?? "",
        amount: plan.amountTRY,
        currency: plan.currency,
      };
    },
  };
}
