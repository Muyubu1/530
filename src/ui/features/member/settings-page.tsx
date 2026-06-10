import { useState } from "react";
import { toast } from "sonner";
import { Eyebrow, Heading, Card, Input, Label, Button } from "@/ui/design-system";
import { useAuth } from "@/ui/shared/auth/auth-context";

export function SettingsPage() {
  const { user, auth } = useAuth();
  const [name, setName] = useState(user?.displayName ?? "");
  const [lastName, setLastName] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    const { error } = await auth.updateProfile(name.trim(), lastName.trim());
    setSavingProfile(false);
    if (error) toast.error("Kaydedilemedi.");
    else toast.success("Profil güncellendi.");
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) return toast.error("Şifre en az 6 karakter olmalı.");
    if (pw !== pw2) return toast.error("Şifreler eşleşmiyor.");
    setSavingPw(true);
    const { error } = await auth.updatePassword(pw);
    setSavingPw(false);
    if (error) {
      toast.error("Güncellenemedi.");
    } else {
      toast.success("Şifre güncellendi.");
      setPw("");
      setPw2("");
    }
  }

  return (
    <div className="animate-rise mx-auto max-w-lg">
      <Eyebrow size="sm">benim odam · ayarlar</Eyebrow>
      <Heading as="h1" size="xl" className="mt-6">
        Ayarlar
      </Heading>

      <Card variant="subtle" className="mt-8 p-6">
        <form onSubmit={saveProfile} className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
            profil
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">ad</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">soyad</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">e-posta</Label>
            <Input id="email" value={user?.email ?? ""} disabled className="opacity-70" />
          </div>
          <Button type="submit" variant="cream" disabled={savingProfile}>
            {savingProfile ? "kaydediliyor…" : "kaydet"}
          </Button>
        </form>
      </Card>

      <Card variant="subtle" className="mt-4 p-6">
        <form onSubmit={savePassword} className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
            şifre değiştir
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="pw">yeni şifre</Label>
            <Input
              id="pw"
              type="password"
              autoComplete="new-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw2">şifre tekrar</Label>
            <Input
              id="pw2"
              type="password"
              autoComplete="new-password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
            />
          </div>
          <Button type="submit" variant="cream" disabled={savingPw}>
            {savingPw ? "güncelleniyor…" : "şifreyi güncelle"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
