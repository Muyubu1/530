import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button, Input } from "@/ui/design-system";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { AuthShell, Field } from "./auth-shell";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordPage() {
  const { auth } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) return toast.error("Geçerli bir e-posta gir.");
    setLoading(true);
    const { error } = await auth.resetPasswordForEmail(email.trim().toLowerCase());
    setLoading(false);
    if (error) return toast.error("İstek gönderilemedi. Tekrar dene.");
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell
        eyebrow="şifre sıfırlama"
        title="E-postanı kontrol et"
        footer={
          <Link to="/login" className="text-cream underline-offset-4 hover:underline">
            ← girişe dön
          </Link>
        }
      >
        <p className="text-center text-sm leading-relaxed text-muted-foreground/80">
          Şifre sıfırlama bağlantısını <span className="text-cream">{email}</span> adresine
          gönderdik.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="şifre sıfırlama"
      title="Şifreni mi unuttun?"
      footer={
        <Link to="/login" className="text-cream underline-offset-4 hover:underline">
          ← girişe dön
        </Link>
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
        <Button type="submit" variant="cream" size="lg" className="w-full" disabled={loading}>
          {loading ? "gönderiliyor…" : "sıfırlama bağlantısı gönder"}
        </Button>
      </form>
    </AuthShell>
  );
}
