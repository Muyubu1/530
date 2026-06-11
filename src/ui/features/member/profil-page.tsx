import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Bookmark,
  Calendar,
  ChevronRight,
  CreditCard,
  DollarSign,
  Library,
  Settings,
  StickyNote,
  Users,
} from "lucide-react";
import { Eyebrow, Heading, Card } from "@/ui/design-system";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { listAllNotesFn, listSavedLessonsFn } from "@/server/learning";

export function ProfilPage() {
  const { user, auth } = useAuth();
  const [counts, setCounts] = useState<{ notes: number; saved: number } | null>(null);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    auth
      .isAdmin()
      .then((ok) => !cancelled && setAdmin(ok))
      .catch(() => {});
    (async () => {
      try {
        const token = await auth.getAccessToken();
        if (!token) return;
        const [notes, saved] = await Promise.all([
          listAllNotesFn({ data: { token } }),
          listSavedLessonsFn({ data: { token } }),
        ]);
        if (!cancelled) setCounts({ notes: notes.length, saved: saved.length });
      } catch {
        if (!cancelled) setCounts({ notes: 0, saved: 0 });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [auth]);

  return (
    <div className="animate-rise mx-auto max-w-2xl">
      <Eyebrow size="sm">benim odam</Eyebrow>
      <Heading as="h1" size="xl" className="mt-6">
        {user?.displayName ?? "üye"}
      </Heading>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <RoomCard
          to="/uye/profil/notlar"
          Icon={StickyNote}
          label="notlarım"
          count={counts?.notes}
        />
        <RoomCard
          to="/uye/profil/videolar"
          Icon={Bookmark}
          label="kaydettiklerim"
          count={counts?.saved}
        />
        <RoomCard to="/uye/profil/ayarlar" Icon={Settings} label="ayarlar" />
        <RoomCard to="/uye/kutuphane" Icon={Library} label="kütüphane" />
        <RoomCard to="/uye/guncellemeler" Icon={Bell} label="güncellemeler" />
        <RoomCard to="/uye/etkinlikler" Icon={Calendar} label="etkinlikler" />
        <RoomCard to="/uye/profil/abonelik" Icon={CreditCard} label="aboneliğim" />
        {admin && (
          <>
            <RoomCard to="/uye/profil/bekleme-listesi" Icon={Users} label="bekleme listesi" />
            <RoomCard to="/uye/profil/fiyat-kontrol" Icon={DollarSign} label="fiyat kontrol" />
          </>
        )}
      </div>
    </div>
  );
}

type RoomLink =
  | "/uye/profil/notlar"
  | "/uye/profil/videolar"
  | "/uye/profil/ayarlar"
  | "/uye/profil/abonelik"
  | "/uye/profil/bekleme-listesi"
  | "/uye/profil/fiyat-kontrol"
  | "/uye/kutuphane"
  | "/uye/guncellemeler"
  | "/uye/etkinlikler";

function RoomCard({
  to,
  Icon,
  label,
  count,
}: {
  to: RoomLink;
  Icon: typeof Settings;
  label: string;
  count?: number;
}) {
  return (
    <Link to={to} className="group">
      <Card
        variant="subtle"
        className="flex items-center justify-between p-5 transition-colors group-hover:border-cream/40"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 text-cream/70" strokeWidth={1.5} />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-cream">
            {label}
          </span>
          {count != null && (
            <span className="rounded-full bg-cream/10 px-2 py-0.5 font-mono text-[9px] text-cream/70">
              {count}
            </span>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
      </Card>
    </Link>
  );
}
