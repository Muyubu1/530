import { Link, Outlet, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Bell,
  Users,
  DollarSign,
  LogOut,
  Eye,
} from "lucide-react";
import { Wordmark } from "@/ui/design-system";
import type { AuthUser } from "@/domain/auth";

type AdminTo =
  | "/admin"
  | "/admin/kurslar"
  | "/admin/etkinlikler"
  | "/admin/guncellemeler"
  | "/admin/bekleme-listesi"
  | "/admin/fiyat-kontrol";

const NAV: { to: AdminTo; label: string; Icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "genel bakış", Icon: LayoutDashboard, exact: true },
  { to: "/admin/kurslar", label: "kurslar", Icon: BookOpen },
  { to: "/admin/etkinlikler", label: "etkinlikler", Icon: Calendar },
  { to: "/admin/guncellemeler", label: "güncellemeler", Icon: Bell },
  { to: "/admin/bekleme-listesi", label: "bekleme listesi", Icon: Users },
  { to: "/admin/fiyat-kontrol", label: "fiyat kontrol", Icon: DollarSign },
];

const itemCls =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 transition-colors hover:bg-cream/[0.04] hover:text-cream data-[status=active]:bg-cream/[0.06] data-[status=active]:text-cream";

/** Admin dashboard shell — sidebar layout, same mono-cinema language as the site. */
export function AdminLayout({ user }: { user: AuthUser }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border/40 bg-card/20 p-5 md:flex">
        <Link to="/admin" className="flex items-baseline gap-2">
          <Wordmark tone="cream" size="sm" />
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/50">
            yönetim
          </span>
        </Link>
        <p className="mt-2 truncate font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">
          {user.displayName}
        </p>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {NAV.map(({ to, label, Icon, exact }) => (
            <Link key={to} to={to} activeOptions={{ exact: !!exact }} className={itemCls}>
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 space-y-1 border-t border-border/40 pt-4">
          <Link
            to="/uye"
            className="flex items-center gap-3 rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors hover:text-cream"
          >
            <Eye className="h-3.5 w-3.5" />
            üye görünümü
          </Link>
          <button
            type="button"
            onClick={() => router.navigate({ to: "/" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors hover:text-cream"
          >
            <LogOut className="h-3.5 w-3.5" />
            çıkış
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-4 overflow-x-auto border-b border-border/40 px-4 py-3 md:hidden">
          {NAV.map(({ to, label, Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: !!exact }}
              className="flex shrink-0 items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors data-[status=active]:text-cream"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </header>
        <main className="animate-rise mx-auto w-full max-w-5xl flex-1 px-6 py-8 md:px-10 md:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
