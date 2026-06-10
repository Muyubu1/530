import { useState } from "react";
import { toast } from "sonner";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export interface WaitlistData {
  name: string;
  email: string;
  phone?: string;
}

export type WaitlistResult = "ok" | "duplicate" | "error";

/**
 * Presentational waitlist form. The persistence action is injected via
 * `onSubmit` (DIP) — the route wires it to Supabase. The component owns only
 * its UI state (loading / done / toasts).
 */
export function WaitlistForm({
  onSubmit,
}: {
  onSubmit: (data: WaitlistData) => Promise<WaitlistResult>;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const result = await onSubmit({ name: name.trim(), email: email.trim().toLowerCase(), phone });
    setLoading(false);
    if (result === "duplicate") {
      toast.error("Bu e-posta zaten listemizde.");
      return;
    }
    if (result === "error") {
      toast.error("Bir şeyler ters gitti. Lütfen tekrar dene.");
      return;
    }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Adın"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full border border-border/60 bg-transparent px-5 py-3 text-left text-sm text-cream placeholder:text-muted-foreground/40 focus:border-cream focus:outline-none"
      />
      <input
        type="email"
        required
        placeholder="E-posta adresin"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-full border border-border/60 bg-transparent px-5 py-3 text-left text-sm text-cream placeholder:text-muted-foreground/40 focus:border-cream focus:outline-none"
      />
      <div className="phone-input-wrapper rounded-full border border-border/60 bg-transparent px-5 py-3">
        <PhoneInput
          international
          defaultCountry="TR"
          placeholder="Telefon numaran"
          value={phone}
          onChange={setPhone}
          className="text-sm text-cream"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-full border border-cream/60 bg-transparent px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cream transition-all hover:border-cream hover:bg-cream hover:text-background disabled:opacity-60"
      >
        {loading ? "kaydediliyor…" : "katıl"}
      </button>
    </form>
  );
}
