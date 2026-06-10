/**
 * Central pricing registry — single source of truth (domain).
 * Framework-free: every landing/payment/audit surface reads from here.
 *
 * `amountTRY` is in major units (Türk lirası). Stripe stores kuruş = amountTRY * 100.
 * `lookupKey` is the stable Stripe price identifier for the plan.
 */

export type PlanKey =
  | "kisisel_1ay"
  | "kisisel_3ay"
  | "kisisel_1ay_v2"
  | "kisisel_2ay_v2"
  | "kisisel_3ay_v2"
  | "kisisel_3ay_2x_v2"
  | "ozel_1ay"
  | "ozel_2ay"
  | "ozel_3ay"
  | "mentorluk_1saat";

export interface PlanDef {
  lookupKey: string;
  amountTRY: number;
  currency: "try";
  label: string;
}

export const PLANS: Record<PlanKey, PlanDef> = {
  kisisel_1ay: {
    lookupKey: "kisisel_danismanlik_1ay_try_v3",
    amountTRY: 24750,
    currency: "try",
    label: "Kişisel Danışmanlık — 1 Ay",
  },
  kisisel_3ay: {
    lookupKey: "kisisel_danismanlik_3ay_try_v3",
    amountTRY: 34750,
    currency: "try",
    label: "Kişisel Danışmanlık — 3 Ay",
  },
  kisisel_1ay_v2: {
    lookupKey: "kisisel_danismanlik_1ay_try_v2",
    amountTRY: 18000,
    currency: "try",
    label: "Kişisel Danışmanlık v2 — 1 Ay",
  },
  kisisel_2ay_v2: {
    lookupKey: "kisisel_danismanlik_2ay_try_v2",
    amountTRY: 23000,
    currency: "try",
    label: "Kişisel Danışmanlık v2 — 2 Ay",
  },
  kisisel_3ay_v2: {
    lookupKey: "kisisel_danismanlik_3ay_try_v2",
    amountTRY: 29750,
    currency: "try",
    label: "Kişisel Danışmanlık v2 — 3 Ay",
  },
  kisisel_3ay_2x_v2: {
    lookupKey: "kisisel_danismanlik_3ay_try_2x_v2",
    amountTRY: 14875,
    currency: "try",
    label: "Kişisel Danışmanlık v2 — 3 Ay (2 Taksit, taksit başına)",
  },
  ozel_1ay: {
    lookupKey: "ozel_danismanlik_1ay_try",
    amountTRY: 18000,
    currency: "try",
    label: "Özel Program — 1 Ay",
  },
  ozel_2ay: {
    lookupKey: "ozel_danismanlik_2ay_try",
    amountTRY: 24750,
    currency: "try",
    label: "Özel Program — 2 Ay",
  },
  ozel_3ay: {
    lookupKey: "ozel_danismanlik_3ay_try",
    amountTRY: 29750,
    currency: "try",
    label: "Özel Program — 3 Ay",
  },
  mentorluk_1saat: {
    lookupKey: "mentorluk_1saat_try",
    amountTRY: 8750,
    currency: "try",
    label: "Mentörlük — 1 Saat",
  },
};

const TRY_FORMATTER = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formats an amount as "24.750" (no currency symbol). */
export function formatTRY(amount: number): string {
  return TRY_FORMATTER.format(amount);
}

export function getPlan(key: PlanKey): PlanDef {
  return PLANS[key];
}
