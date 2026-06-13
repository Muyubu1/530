import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button, Checkbox } from "@/ui/design-system";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { ValidatedField } from "@/ui/shared/forms/validated-field";
import * as validate from "@/lib/validation";
import { AuthShell, GoogleButton } from "./auth-shell";

export function LoginPage() {
  const { auth } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const emailErr = validate.email(email);
  const pwErr = validate.password(password);
  const canSubmit = !emailErr && !pwErr && !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (emailErr || pwErr) return;
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
        <ValidatedField
          label="e-posta"
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={emailErr}
          placeholder="sen@ornek.com"
        />
        <ValidatedField
          label="şifre"
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          error={pwErr}
          placeholder="••••••••"
          showValid={false}
        />
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
        <Button type="submit" variant="cream" size="lg" className="w-full" disabled={!canSubmit}>
          {loading ? "giriş yapılıyor…" : "giriş yap"}
        </Button>
      </form>
      <GoogleButton onClick={() => auth.signInWithGoogle()} />
    </AuthShell>
  );
}
