import { Link, Outlet, useRouter } from "@tanstack/react-router";
import { Home, MessageCircle, User as UserIcon, Dumbbell, LogOut } from "lucide-react";
import {
  Wordmark,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/ui/design-system";
import type { CurrentUser } from "@/domain/session";

const AMBIENCE = [
  "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(220, 225, 235, 0.18), transparent 65%)",
  "radial-gradient(ellipse 60% 40% at 85% 20%, rgba(200, 210, 225, 0.12), transparent 65%)",
  "radial-gradient(ellipse 70% 45% at 10% 75%, rgba(180, 190, 210, 0.10), transparent 65%)",
];

type NavItem = { to: "/uye" | "/uye/dersler"; label: string; Icon: typeof Home; exact?: boolean };

const NAV: NavItem[] = [
  { to: "/uye", label: "ana sayfa", Icon: Home, exact: true },
  { to: "/uye/dersler", label: "programlarım", Icon: Dumbbell },
];

// Deferred until the auth phase.
const SOON: { label: string; Icon: typeof Home }[] = [
  { label: "topluluk", Icon: MessageCircle },
  { label: "benim odam", Icon: UserIcon },
];

/** Authenticated member shell: ambient background, top + mobile nav, account menu. */
export function MemberLayout({ user }: { user: CurrentUser }) {
  const router = useRouter();
  const initials =
    user.displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "?";

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

      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 md:px-10">
          <Link to="/uye" aria-label="5.30 üye ana sayfa">
            <Wordmark tone="cream" />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map(({ to, label, Icon, exact }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: !!exact }}
                className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70 transition-colors hover:text-cream data-[status=active]:text-cream"
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                {label}
              </Link>
            ))}
            {SOON.map(({ label, Icon }) => (
              <span
                key={label}
                title="yakında"
                className="flex cursor-default items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/30"
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                {label}
              </span>
            ))}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="hesap menüsü"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/30 bg-transparent font-mono text-[10px] uppercase tracking-[0.15em] text-cream/80 transition-colors hover:border-cream hover:text-cream focus:outline-none"
              >
                {initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={10} className="w-56">
              <DropdownMenuLabel>
                <p className="truncate font-display text-sm text-cream">{user.displayName}</p>
                <p className="mt-0.5 truncate font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60">
                  üye
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => router.navigate({ to: "/" })}
                className="gap-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80 focus:text-cream"
              >
                <LogOut className="h-3.5 w-3.5" />
                çıkış
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-32 pt-12 md:px-10 md:py-20">
        <Outlet />
      </main>

      <nav
        aria-label="alt navigasyon"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border/40 bg-background md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-2">
          {NAV.map(({ to, label, Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: !!exact }}
              className="group flex flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-muted-foreground/60 transition-colors data-[status=active]:text-cream"
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="font-mono text-[8.5px] uppercase tracking-[0.2em]">{label}</span>
            </Link>
          ))}
          {SOON.map(({ label, Icon }) => (
            <span
              key={label}
              className="flex flex-1 flex-col items-center justify-center gap-1 px-2 py-1.5 text-muted-foreground/25"
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="font-mono text-[8.5px] uppercase tracking-[0.2em]">{label}</span>
            </span>
          ))}
        </div>
      </nav>
    </div>
  );
}
