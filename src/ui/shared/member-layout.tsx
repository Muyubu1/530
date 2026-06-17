import { useEffect, useState } from "react";
import { Outlet, useRouter, useLocation } from "@tanstack/react-router";
import {
  Menu,
  Footprints,
  NotebookPen,
  Settings,
  CreditCard,
  LogOut,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  Wordmark,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/ui/design-system";
import type { AuthUser } from "@/domain/auth";
import { cn } from "@/lib/utils";
import { useAuth } from "./auth/auth-context";

const AMBIENCE = [
  "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(220, 225, 235, 0.18), transparent 65%)",
  "radial-gradient(ellipse 60% 40% at 85% 20%, rgba(200, 210, 225, 0.12), transparent 65%)",
  "radial-gradient(ellipse 70% 45% at 10% 75%, rgba(180, 190, 210, 0.10), transparent 65%)",
];

type MemberRoute =
  | "/uye/patika"
  | "/uye/profil/notlar"
  | "/uye/profil/ayarlar"
  | "/uye/profil/abonelik";

/** Single source of truth for member navigation — the hamburger menu maps over this. */
const MEMBER_NAV: { to: MemberRoute; label: string; Icon: LucideIcon }[] = [
  { to: "/uye/patika", label: "Patika", Icon: Footprints },
  { to: "/uye/profil/notlar", label: "Notlarım", Icon: NotebookPen },
  { to: "/uye/profil/ayarlar", label: "Ayarlar", Icon: Settings },
  { to: "/uye/profil/abonelik", label: "Aboneliğim", Icon: CreditCard },
];

/** Authenticated member shell: ambient background + a single top-left hamburger menu. */
export function MemberLayout({ user }: { user: AuthUser }) {
  const router = useRouter();
  const location = useLocation();
  const { auth } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    auth
      .isAdmin()
      .then(setIsAdmin)
      .catch(() => {});
  }, [auth]);

  // The chat is an immersive full-height surface: hide the shell chrome there.
  const isChat = location.pathname.startsWith("/uye/topluluk");

  async function handleLogout() {
    await auth.signOut();
    router.navigate({ to: "/" });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {AMBIENCE.map((bg) => (
        <div
          key={bg}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: bg }}
        />
      ))}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-1"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1.2px)",
          backgroundSize: "14px 14px",
          opacity: 0.05,
          maskImage: "radial-gradient(ellipse at 50% 35%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 35%, black 0%, transparent 75%)",
        }}
      />

      <header className={isChat ? "hidden" : "relative z-20"}>
        <div className="flex items-center gap-4 px-5 py-5 md:px-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="menü"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 bg-background/40 text-cream/90 backdrop-blur transition-colors hover:border-cream hover:text-cream focus:outline-none"
              >
                <Menu className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={12} className="w-64">
              <DropdownMenuLabel>
                <p className="truncate font-display text-base text-cream">{user.displayName}</p>
                <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
                  {isAdmin ? "yönetici" : "üye"}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {MEMBER_NAV.map(({ to, label, Icon }) => {
                const active = location.pathname.startsWith(to);
                return (
                  <DropdownMenuItem
                    key={to}
                    onSelect={() => router.navigate({ to })}
                    className={cn(
                      "gap-3 text-sm tracking-wide text-muted-foreground/85 focus:text-cream",
                      active && "text-cream",
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                    {label}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              {isAdmin && (
                <DropdownMenuItem
                  onSelect={() => router.navigate({ to: "/admin" })}
                  className="gap-3 text-sm tracking-wide text-muted-foreground/85 focus:text-cream"
                >
                  <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
                  Yönetim Paneli
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onSelect={handleLogout}
                className="gap-3 text-sm tracking-wide text-muted-foreground/85 focus:text-cream"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Çıkış
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Wordmark tone="cream" />
        </div>
      </header>

      <main
        className={
          isChat
            ? "relative z-10"
            : "relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-6 md:px-10 md:pb-28 md:pt-10"
        }
      >
        <Outlet />
      </main>
    </div>
  );
}
