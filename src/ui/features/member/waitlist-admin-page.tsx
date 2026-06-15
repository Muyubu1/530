import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { format } from "date-fns";
import { Eyebrow, Heading, Button } from "@/ui/design-system";
import type { WaitlistEntry } from "@/domain/waitlist";
import { useAuth } from "@/ui/shared/auth/auth-context";

const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export function WaitlistAdminPage() {
  const { auth } = useAuth();
  const [state, setState] = useState<"checking" | "denied" | "ok">("checking");
  const [rows, setRows] = useState<WaitlistEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    auth
      .isAdmin()
      .then(async (ok) => {
        if (cancelled) return;
        if (!ok) return setState("denied");
        try {
          const list = await auth.listWaitlist();
          if (!cancelled) {
            setRows(list);
            setState("ok");
          }
        } catch {
          if (!cancelled) setState("denied");
        }
      })
      .catch(() => !cancelled && setState("denied"));
    return () => {
      cancelled = true;
    };
  }, [auth]);

  function exportCsv() {
    const header = "tarih,ad,iletişim,e-posta,telefon,neden,kaynak";
    const lines = rows.map((r) =>
      [
        format(r.createdAt, "yyyy-MM-dd HH:mm"),
        r.name,
        r.contact ?? "",
        r.email ?? "",
        r.phone ?? "",
        r.why ?? "",
        r.source,
      ]
        .map(csvCell)
        .join(","),
    );
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bekleme-listesi.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

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

  return (
    <div className="animate-rise mx-auto max-w-3xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Eyebrow size="sm">admin · bekleme listesi</Eyebrow>
          <Heading as="h1" size="xl" className="mt-4">
            {rows.length} kişi
          </Heading>
        </div>
        {rows.length > 0 && (
          <Button variant="ghost" size="sm" onClick={exportCsv}>
            CSV indir
          </Button>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground/70">Listede kimse yok.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
              <tr className="border-b border-border/40">
                <th className="py-2 pr-3">tarih</th>
                <th className="py-2 pr-3">ad</th>
                <th className="py-2 pr-3">iletişim</th>
                <th className="py-2 pr-3">neden</th>
                <th className="py-2">kaynak</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/20 text-cream/85">
                  <td className="whitespace-nowrap py-2 pr-3 font-mono text-[10px] text-muted-foreground/60">
                    {format(r.createdAt, "dd.MM.yyyy")}
                  </td>
                  <td className="py-2 pr-3">{r.name || "—"}</td>
                  <td className="py-2 pr-3">{r.contact || r.email || "—"}</td>
                  <td className="max-w-[20ch] truncate py-2 pr-3 text-muted-foreground/70">
                    {r.why || "—"}
                  </td>
                  <td className="py-2 text-muted-foreground/60">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
