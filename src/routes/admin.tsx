import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { AdminLayout } from "@/ui/shared/admin-layout";

export const Route = createFileRoute("/admin")({
  component: AdminGate,
});

function AdminGate() {
  const { status, user, auth } = useAuth();
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (status === "checking") return;
    if (status === "unauthed" || !user) {
      router.navigate({ to: "/login" });
      return;
    }
    let active = true;
    auth
      .isAdmin()
      .then((admin) => {
        if (!active) return;
        if (admin) setOk(true);
        else router.navigate({ to: "/uye" });
      })
      .catch(() => router.navigate({ to: "/uye" }));
    return () => {
      active = false;
    };
  }, [status, user, auth, router]);

  if (!ok || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
          yönetim hazırlanıyor…
        </p>
      </div>
    );
  }

  return <AdminLayout user={user} />;
}
