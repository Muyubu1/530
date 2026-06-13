import { useEffect, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/ui/design-system";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { ValidatedField } from "@/ui/shared/forms/validated-field";
import * as validate from "@/lib/validation";
import { AuthShell } from "./auth-shell";

export function ResetPasswordPage() {
  const { auth } = useAuth();
  const router = useRouter();
  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash (#...type=recovery...).
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    setValid(hash.includes("type=recovery") || hash.includes("access_token"));
  }, []);

  const pwErr = validate.password(password);
  const confErr = validate.match(password, confirm);
  const canSubmit = !pwErr && !confErr && confirm.length > 0 && !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const { error } = await auth.updatePassword(password);
    setLoading(false);
    if (error) return toast.error("Şifre güncellenemedi. Bağlantı süresi dolmuş olabilir.");
    toast.success("Şifren güncellendi.");
    router.navigate({ to: "/login" });
  }

  if (valid === false) {
    return (
      <AuthShell
        eyebrow="şifre sıfırlama"
        title="Bağlantı geçersiz"
        footer={
          <Link to="/forgot-password" className="text-cream underline-offset-4 hover:underline">
            yeni bağlantı iste
          </Link>
        }
      >
        <p className="text-center text-sm leading-relaxed text-muted-foreground/80">
          Bu sıfırlama bağlantısı geçersiz ya da süresi dolmuş.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="şifre sıfırlama" title="Yeni şifre belirle">
      <form onSubmit={onSubmit} className="space-y-4">
        <ValidatedField
          label="yeni şifre"
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          error={pwErr}
          placeholder="en az 6 karakter"
        />
        <ValidatedField
          label="şifre tekrar"
          id="confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
          error={confErr}
        />
        <Button type="submit" variant="cream" size="lg" className="w-full" disabled={!canSubmit}>
          {loading ? "güncelleniyor…" : "şifreyi güncelle"}
        </Button>
      </form>
    </AuthShell>
  );
}
