import { useRef, useState } from "react";
import { toast } from "sonner";
import { Eyebrow, Heading, Card, Input, Label, Button } from "@/ui/design-system";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { ValidatedField } from "@/ui/shared/forms/validated-field";
import * as validate from "@/lib/validation";

export function SettingsPage() {
  const { user, auth } = useAuth();
  const [name, setName] = useState(user?.displayName ?? "");
  const [lastName, setLastName] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials =
    (user?.displayName || "?")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "?";

  async function onAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return toast.error("Dosya 5MB'tan küçük olmalı.");
    setUploadingAvatar(true);
    try {
      await auth.uploadAvatar(f);
      toast.success("Avatar güncellendi.");
    } catch {
      toast.error("Avatar yüklenemedi. (avatars bucket'ı var mı?)");
    } finally {
      setUploadingAvatar(false);
    }
  }

  const nameErr = validate.required(name, "Ad");
  const pwErr = validate.password(pw);
  const pw2Err = validate.match(pw, pw2);
  const canSavePassword = !pwErr && !pw2Err && pw2.length > 0 && !savingPw;

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (nameErr) return;
    setSavingProfile(true);
    const { error } = await auth.updateProfile(name.trim(), lastName.trim());
    setSavingProfile(false);
    if (error) toast.error("Kaydedilemedi.");
    else toast.success("Profil güncellendi.");
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!canSavePassword) return;
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

      <Card variant="subtle" className="mt-8 flex items-center gap-4 p-6">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cream/20 bg-cream/5">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-mono text-sm font-semibold text-cream/80">{initials}</span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm text-cream">{user?.displayName}</p>
          <p className="truncate text-xs text-muted-foreground/60">{user?.email}</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onAvatarFile} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploadingAvatar}
        >
          {uploadingAvatar ? "…" : "değiştir"}
        </Button>
      </Card>

      <Card variant="subtle" className="mt-4 p-6">
        <form onSubmit={saveProfile} className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
            profil
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ValidatedField label="ad" id="name" value={name} onChange={setName} error={nameErr} />
            <ValidatedField
              label="soyad"
              id="lastName"
              value={lastName}
              onChange={setLastName}
              error={null}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">e-posta</Label>
            <Input id="email" value={user?.email ?? ""} disabled className="opacity-70" />
          </div>
          <Button type="submit" variant="cream" disabled={!!nameErr || savingProfile}>
            {savingProfile ? "kaydediliyor…" : "kaydet"}
          </Button>
        </form>
      </Card>

      <Card variant="subtle" className="mt-4 p-6">
        <form onSubmit={savePassword} className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
            şifre değiştir
          </p>
          <ValidatedField
            label="yeni şifre"
            id="pw"
            type="password"
            autoComplete="new-password"
            value={pw}
            onChange={setPw}
            error={pwErr}
          />
          <ValidatedField
            label="şifre tekrar"
            id="pw2"
            type="password"
            autoComplete="new-password"
            value={pw2}
            onChange={setPw2}
            error={pw2Err}
          />
          <Button type="submit" variant="cream" disabled={!canSavePassword}>
            {savingPw ? "güncelleniyor…" : "şifreyi güncelle"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
