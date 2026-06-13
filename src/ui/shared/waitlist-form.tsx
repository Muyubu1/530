import { useState } from "react";
import { toast } from "sonner";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { NewWaitlistEntry, WaitlistResult } from "@/domain/waitlist";
import * as validate from "@/lib/validation";
import { cn } from "@/lib/utils";

// The form collects exactly a NewWaitlistEntry. Alias kept for call sites.
export type WaitlistData = NewWaitlistEntry;
export type { WaitlistResult };

/**
 * Presentational waitlist form. The persistence action is injected via
 * `onSubmit` (DIP). Realtime validation on e-mail (required) + phone (optional).
 */
export function WaitlistForm({
  onSubmit,
}: {
  onSubmit: (data: WaitlistData) => Promise<WaitlistResult>;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState<string | undefined>();
  const [emailTouched, setEmailTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const emailErr = validate.email(email);
  const phoneErr = validate.phoneOptional(phone);
  const showEmailErr = (emailTouched || email.length > 0) && !!emailErr;
  const canSubmit = !emailErr && !phoneErr && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const result = await onSubmit({ name: name.trim(), email: email.trim().toLowerCase(), phone });
    setLoading(false);
    if (result === "duplicate") return void toast.error("Bu e-posta zaten listemizde.");
    if (result === "error") return void toast.error("Bir şeyler ters gitti. Lütfen tekrar dene.");
    setDone(true);
    toast.success("Listemize katıldın. Şafak vakti haber vereceğiz.");
  }

  if (done) {
    return (
      <div className="rounded-full border border-border/60 bg-card/40 px-6 py-6 text-center">
        <p className="font-display text-sm font-medium tracking-[-0.005em] text-cream">
          Kaydedildi.
        </p>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
          5.30'da görüşmek üzere
        </p>
      </div>
    );
  }

  const fieldBase =
    "w-full rounded-full border bg-transparent px-5 py-3 text-left text-sm text-cream placeholder:text-muted-foreground/40 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Adın"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={cn(fieldBase, "border-border/60 focus:border-cream")}
      />
      <div>
        <input
          type="email"
          inputMode="email"
          placeholder="E-posta adresin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          aria-invalid={showEmailErr || undefined}
          className={cn(
            fieldBase,
            showEmailErr
              ? "border-destructive/70 focus:border-destructive"
              : "border-border/60 focus:border-cream",
          )}
        />
        {showEmailErr && <p className="mt-1.5 pl-5 text-[11px] text-destructive">{emailErr}</p>}
      </div>
      <div>
        <div
          className={cn(
            "phone-input-wrapper rounded-full border bg-transparent px-5 py-3",
            phoneErr ? "border-destructive/70" : "border-border/60",
          )}
        >
          <PhoneInput
            international
            defaultCountry="TR"
            placeholder="Telefon numaran"
            value={phone}
            onChange={setPhone}
            className="text-sm text-cream"
          />
        </div>
        {phoneErr && <p className="mt-1.5 pl-5 text-[11px] text-destructive">{phoneErr}</p>}
      </div>
      <button
        type="submit"
        disabled={!canSubmit}
        className="group relative w-full overflow-hidden rounded-full border border-cream/60 bg-transparent px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cream transition-all hover:border-cream hover:bg-cream hover:text-background disabled:opacity-60"
      >
        {loading ? "kaydediliyor…" : "katıl"}
      </button>
    </form>
  );
}
