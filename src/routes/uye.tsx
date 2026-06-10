import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { MemberLayout } from "@/ui/shared/member-layout";
import { useAuth } from "@/ui/shared/auth/auth-context";

// Member-area gate. Auth resolves client-side; access requires a session AND a
// purchase (email_has_purchase) — mirrors the old _authenticated flow.
export const Route = createFileRoute("/uye")({
  component: UyeLayout,
});

function UyeLayout() {
  const { status, user, auth } = useAuth();
  const router = useRouter();
  const [gate, setGate] = useState<"checking" | "ok">("checking");

  useEffect(() => {
    if (status === "checking") return;
    if (status === "unauthed" || !user) {
      router.navigate({ to: "/login" });
      return;
    }
    let cancelled = false;
    auth.hasPurchase(user.email).then((ok) => {
      if (cancelled) return;
      if (ok) {
        setGate("ok");
      } else {
        auth.signOut();
        toast.error("Bu e-mail program katılımcılarımız arasında bulunamadı");
        router.navigate({ to: "/login" });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [status, user, auth, router]);

  if (gate !== "ok" || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-eyebrow text-[11px] text-muted-foreground">Şafak hazırlanıyor…</p>
      </div>
    );
  }

  return <MemberLayout user={user} />;
}
