export type PriceAuditStatus = "match" | "mismatch" | "missing";

export interface PriceAuditRow {
  planKey: string;
  label: string;
  lookupKey: string;
  expectedTRY: number;
  stripeTRY: number | null;
  status: PriceAuditStatus;
}

/** Port: resolves Stripe prices by lookup key (major units + currency). */
export interface PriceCatalog {
  byLookupKey(keys: string[]): Promise<Map<string, { amountMajor: number; currency: string }>>;
}
