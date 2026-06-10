import type { PurchaseRepository } from "@/domain/purchase";

export async function recordPurchase(repo: PurchaseRepository, email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;
  await repo.record(normalized);
}
