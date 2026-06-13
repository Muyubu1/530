import { createFileRoute } from "@tanstack/react-router";
import { PricingAuditPage } from "@/ui/features/member/pricing-audit-page";

export const Route = createFileRoute("/admin/fiyat-kontrol")({
  component: PricingAuditPage,
});
