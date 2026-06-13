import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  Bell,
  Users,
  FileText,
  ShoppingBag,
  GraduationCap,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow, Heading, Card } from "@/ui/design-system";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { adminStatsFn, type AdminStats } from "@/server/admin";

export function AdminDashboardPage() {
  const { auth } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    let active = true;
    auth.getAccessToken().then(async (token) => {
      if (!token) return;
      try {
        const s = await adminStatsFn({ data: { token } });
        if (active) setStats(s);
      } catch {
        /* ignore */
      }
    });
    return () => {
      active = false;
    };
  }, [auth]);

  const cards: { label: string; value?: number; Icon: LucideIcon }[] = [
    { label: "kurs", value: stats?.courses, Icon: GraduationCap },
    { label: "ders", value: stats?.lessons, Icon: BookOpen },
    { label: "materyal", value: stats?.materials, Icon: Layers },
    { label: "etkinlik", value: stats?.events, Icon: Calendar },
    { label: "güncelleme", value: stats?.updates, Icon: Bell },
    { label: "üye", value: stats?.members, Icon: Users },
    { label: "bekleme listesi", value: stats?.waitlist, Icon: FileText },
    { label: "satın alma", value: stats?.purchases, Icon: ShoppingBag },
  ];

  return (
    <div>
      <Eyebrow size="sm">yönetim · genel bakış</Eyebrow>
      <Heading as="h1" size="xl" className="mt-4">
        Kontrol Paneli
      </Heading>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} variant="subtle" className="flex flex-col gap-3 p-5">
            <c.Icon className="h-4 w-4 text-cream/60" strokeWidth={1.5} />
            <span className="font-display text-3xl text-cream">{c.value ?? "—"}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
              {c.label}
            </span>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <Eyebrow size="sm">hızlı işlem</Eyebrow>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <QuickLink to="/admin/kurslar" label="kursları yönet" />
          <QuickLink to="/admin/etkinlikler" label="etkinlik ekle" />
          <QuickLink to="/admin/guncellemeler" label="güncelleme yaz" />
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  to,
  label,
}: {
  to: "/admin/kurslar" | "/admin/etkinlikler" | "/admin/guncellemeler";
  label: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-border/40 bg-card/30 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/80 transition-colors hover:border-cream/40"
    >
      {label} →
    </Link>
  );
}
