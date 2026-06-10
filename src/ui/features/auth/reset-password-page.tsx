import { useEffect, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button, Input } from "@/ui/design-system";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { AuthShell, Field } from "./auth-shell";

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return toast.error("Şifre en az 6 karakter olmalı.");
    if (password !== confirm) return toast.error("Şifreler eşleşmiyor.");
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
        <Field label="yeni şifre" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="en az 6 karakter"
          />
        </Field>
        <Field label="şifre tekrar" htmlFor="confirm">
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <Button type="submit" variant="cream" size="lg" className="w-full" disabled={loading}>
          {loading ? "güncelleniyor…" : "şifreyi güncelle"}
        </Button>
      </form>
    </AuthShell>
  );
}
