import { loadStripe, type Stripe } from "@stripe/stripe-js";

const pk = () => import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

let promise: Promise<Stripe | null> | null = null;

/** Lazily loads Stripe.js. Returns null when no publishable key is configured. */
export function getStripe(): Promise<Stripe | null> | null {
  const key = pk();
  if (!key) return null;
  if (!promise) promise = loadStripe(key);
  return promise;
}

export const isStripeConfigured = () => !!pk();
export const isTestMode = () => !!pk()?.startsWith("pk_test_");
