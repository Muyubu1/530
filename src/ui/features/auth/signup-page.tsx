import { useEffect, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button, Input } from "@/ui/design-system";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { ValidatedField } from "@/ui/shared/forms/validated-field";
import * as validate from "@/lib/validation";
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

  const nameErr = validate.required(name, "Ad");
  const lastErr = validate.required(lastName, "Soyad");
  const pwErr = validate.password(password);
  const confErr = validate.match(password, confirm);
  const canSubmit = !nameErr && !lastErr && !pwErr && !confErr && confirm.length > 0 && !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
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
          <ValidatedField label="ad" id="name" value={name} onChange={setName} error={nameErr} />
          <ValidatedField
            label="soyad"
            id="lastName"
            value={lastName}
            onChange={setLastName}
            error={lastErr}
          />
        </div>
        <Field label="e-posta">
          <Input value={email} disabled className="opacity-70" />
        </Field>
        <ValidatedField
          label="şifre"
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
          {loading ? "oluşturuluyor…" : "hesabı oluştur"}
        </Button>
      </form>
      <GoogleButton onClick={() => auth.signInWithGoogle()} />
    </AuthShell>
  );
}
