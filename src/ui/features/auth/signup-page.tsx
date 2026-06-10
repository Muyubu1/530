import { useEffect, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button, Input } from "@/ui/design-system";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { AuthShell, Field, GoogleButton } from "./auth-shell";

/** Signup is purchase-gated: the e-mail must already exist in `purchases`. */
export function SignupPage({ email }: { email: string }) {
  const { auth } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      setChecking(false);
      return;
    }
    auth.hasPurchase(email).then((ok) => {
      setAllowed(ok);
      setChecking(false);
    });
  }, [email, auth]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !lastName.trim()) return toast.error("Ad ve soyad gerekli.");
    if (password.length < 6) return toast.error("Şifre en az 6 karakter olmalı.");
    if (password !== confirm) return toast.error("Şifreler eşleşmiyor.");
    setLoading(true);
    const { error } = await auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      displayName: name.trim(),
      lastName: lastName.trim(),
    });
    setLoading(false);
    if (error) return toast.error("Kayıt başarısız. Lütfen tekrar dene.");
    toast.success("Hesabın oluşturuldu.");
    router.navigate({ to: "/uye" });
  }

  if (checking) {
    return (
      <AuthShell eyebrow="kayıt" title="Kontrol ediliyor…">
        <p className="text-center text-sm text-muted-foreground/70">Bir saniye…</p>
      </AuthShell>
    );
  }

  if (!allowed) {
    return (
      <AuthShell
        eyebrow="kayıt"
        title="Önce bir programa katıl"
        footer={
          <Link to="/login" className="text-cream underline-offset-4 hover:underline">
            zaten üyeyim · giriş yap
          </Link>
        }
      >
        <p className="text-center text-sm leading-relaxed text-muted-foreground/80">
          Bu e-posta katılımcılarımız arasında bulunamadı. Üye alanına erişmek için önce bir
          programa katılman gerekiyor.
        </p>
        <Button asChild variant="cta" size="lg" className="mt-6 w-full">
          <Link to="/kisisel-program">programlara göz at</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="kayıt" title="Hesabını oluştur">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="ad" htmlFor="name">
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="soyad" htmlFor="lastName">
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Field>
        </div>
        <Field label="e-posta">
          <Input value={email} disabled className="opacity-70" />
        </Field>
        <Field label="şifre" htmlFor="password">
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
          {loading ? "oluşturuluyor…" : "hesabı oluştur"}
        </Button>
      </form>
      <GoogleButton onClick={() => auth.signInWithGoogle()} />
    </AuthShell>
  );
}
