import type { PlanKey } from "./pricing";

export interface PaymentIntentResult {
  clientSecret: string;
  amount: number;
  currency: string;
}

/** Port: creates a Stripe PaymentIntent for a plan. Implemented server-side. */
export interface PaymentGateway {
  createIntent(planKey: PlanKey, email: string): Promise<PaymentIntentResult>;
}
