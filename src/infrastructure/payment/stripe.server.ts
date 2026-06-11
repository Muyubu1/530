import "dotenv/config";
import Stripe from "stripe";

let client: Stripe | null = null;

/** Lazy shared Stripe client (secret key). Throws only when actually used without a key. */
export function getStripeClient(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set — see .env.example");
    client = new Stripe(key);
  }
  return client;
}
