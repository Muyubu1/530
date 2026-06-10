import { expect, test, vi } from "vitest";
import { createPaymentIntent } from "./create-payment-intent";
import type { PaymentGateway } from "@/domain/payment";

const gateway: PaymentGateway = {
  createIntent: vi.fn(async () => ({ clientSecret: "cs_test", amount: 100, currency: "try" })),
};

test("rejects an unknown plan", async () => {
  await expect(createPaymentIntent(gateway, "nope", "a@b.com")).rejects.toThrow();
});

test("normalises the e-mail and calls the gateway for a valid plan", async () => {
  const result = await createPaymentIntent(gateway, "kisisel_1ay", "  A@B.COM ");
  expect(result.clientSecret).toBe("cs_test");
  expect(gateway.createIntent).toHaveBeenCalledWith("kisisel_1ay", "a@b.com");
});
