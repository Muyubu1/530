import "dotenv/config";
import Stripe from "stripe";
import { PLANS, type PlanKey } from "@/domain/pricing";
import type { PaymentGateway, PaymentIntentResult } from "@/domain/payment";

let client: Stripe | null = null;

function stripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set — see .env.example");
    client = new Stripe(key);
  }
  return client;
}

/** Stripe adapter — amount comes from the domain pricing registry (no Stripe products needed). */
export function makeStripePaymentGateway(): PaymentGateway {
  return {
    async createIntent(planKey: PlanKey, email: string): Promise<PaymentIntentResult> {
      const plan = PLANS[planKey];
      const intent = await stripe().paymentIntents.create({
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
