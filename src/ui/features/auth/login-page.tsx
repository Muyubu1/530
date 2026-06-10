import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button, Input, Checkbox } from "@/ui/design-system";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { AuthShell, Field, GoogleButton } from "./auth-shell";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const { auth } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) return toast.error("Geçerli bir e-posta gir.");
    if (password.length < 6) return toast.error("Şifre en az 6 karakter olmalı.");
    setLoading(true);
    const { error } = await auth.signInWithPassword(email.trim().toLowerCase(), password);
    setLoading(false);
    if (error) return toast.error("Giriş başarısız. Bilgileri kontrol et.");
    if (typeof window !== "undefined")
      window.localStorage.setItem("530lab-remember-me", String(remember));
    router.navigate({ to: "/uye" });
  }

  return (
    <AuthShell
      eyebrow="üye girişi"
      title="Tekrar hoş geldin"
      footer={
        <>
          Hesabın yok mu?{" "}
          <Link to="/" className="text-cream underline-offset-4 hover:underline">
            programlara göz at
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="e-posta" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sen@ornek.com"
          />
        </Field>
        <Field label="şifre" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
            beni hatırla
          </label>
          <Link
            to="/forgot-password"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors hover:text-cream"
          >
            şifremi unuttum
          </Link>
        </div>
        <Button type="submit" variant="cream" size="lg" className="w-full" disabled={loading}>
          {loading ? "giriş yapılıyor…" : "giriş yap"}
        </Button>
      </form>
      <GoogleButton onClick={() => auth.signInWithGoogle()} />
    </AuthShell>
  );
}
