import { createServerFn } from "@tanstack/react-start";
import { createPaymentIntent } from "@/application/create-payment-intent";
import { recordPurchase } from "@/application/record-purchase";
import { makeStripePaymentGateway } from "@/infrastructure/payment/stripe-payment-gateway.server";
import { makePurchaseRepository } from "@/infrastructure/purchase/supabase-purchase-repository.server";

export const createPaymentIntentFn = createServerFn({ method: "POST" })
  .validator((d: { planKey: string; email: string }) => d)
  .handler(({ data }) => createPaymentIntent(makeStripePaymentGateway(), data.planKey, data.email));

export const recordPurchaseFn = createServerFn({ method: "POST" })
  .validator((d: { email: string }) => d)
  .handler(({ data }) => recordPurchase(makePurchaseRepository(), data.email));
