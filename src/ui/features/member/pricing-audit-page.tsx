import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { Eyebrow, Heading } from "@/ui/design-system";
import type { PriceAuditRow } from "@/domain/pricing-audit";
import { formatTRY } from "@/domain/pricing";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { auditPricingFn } from "@/server/payments";
import { cn } from "@/lib/utils";

const STATUS: Record<PriceAuditRow["status"], { label: string; cls: string }> = {
  match: { label: "uyumlu", cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
  mismatch: { label: "uyuşmuyor", cls: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
  missing: { label: "eksik", cls: "border-red-500/40 bg-red-500/10 text-red-300" },
};

export function PricingAuditPage() {
  const { auth } = useAuth();
  const [state, setState] = useState<"checking" | "denied" | "unconfigured" | "ok">("checking");
  const [rows, setRows] = useState<PriceAuditRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    auth
      .isAdmin()
      .then(async (ok) => {
        if (cancelled) return;
        if (!ok) return setState("denied");
        try {
          const r = await auditPricingFn();
          if (!cancelled) {
            setRows(r);
            setState("ok");
          }
        } catch {
          if (!cancelled) setState("unconfigured");
        }
      })
      .catch(() => !cancelled && setState("denied"));
    return () => {
      cancelled = true;
    };
  }, [auth]);

  if (state === "checking") {
    return <p className="mt-20 text-center text-sm text-muted-foreground/60">Kontrol ediliyor…</p>;
  }

  if (state === "denied") {
    return (
      <div className="animate-rise mx-auto max-w-md py-16 text-center">
        <Lock className="mx-auto h-6 w-6 text-muted-foreground/40" />
        <p className="mt-4 text-sm text-muted-foreground/70">Bu sayfayı görüntüleme yetkin yok.</p>
      </div>
    );
  }

  if (state === "unconfigured") {
    return (
      <div className="animate-rise mx-auto max-w-md py-16 text-center">
        <p className="text-sm text-muted-foreground/70">
          Stripe anahtarları eklenmemiş. Fiyat denetimi için <code>STRIPE_SECRET_KEY</code> gerekli.
        </p>
      </div>
    );
  }

  const mismatches = rows.filter((r) => r.status !== "match").length;

  return (
    <div className="animate-rise mx-auto max-w-3xl">
      <Eyebrow size="sm">admin · fiyat kontrol</Eyebrow>
      <Heading as="h1" size="xl" className="mt-4">
        {mismatches === 0 ? "Tüm fiyatlar uyumlu" : `${mismatches} fiyat dikkat istiyor`}
      </Heading>
      <p className="mt-2 text-xs text-muted-foreground/60">
        Domain pricing (beklenen) ↔ Stripe (gerçek), lookup_key ile.
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
            <tr className="border-b border-border/40">
              <th className="py-2 pr-3">plan</th>
              <th className="py-2 pr-3">beklenen</th>
              <th className="py-2 pr-3">stripe</th>
              <th className="py-2">durum</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.planKey} className="border-b border-border/20 text-cream/85">
                <td className="py-2 pr-3">
                  <span className="block">{r.label}</span>
                  <span className="font-mono text-[9px] text-muted-foreground/40">
                    {r.lookupKey}
                  </span>
                </td>
                <td className="whitespace-nowrap py-2 pr-3 font-mono">
                  {formatTRY(r.expectedTRY)}
                </td>
                <td className="whitespace-nowrap py-2 pr-3 font-mono">
                  {r.stripeTRY != null ? formatTRY(r.stripeTRY) : "—"}
                </td>
                <td className="py-2">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em]",
                      STATUS[r.status].cls,
                    )}
                  >
                    {STATUS[r.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
