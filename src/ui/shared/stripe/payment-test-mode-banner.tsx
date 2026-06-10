import { isTestMode } from "./stripe-client";

export function PaymentTestModeBanner() {
  if (!isTestMode()) return null;
  return (
    <div className="bg-amber-500/90 px-4 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-black">
      test modu · gerçek ödeme alınmaz
    </div>
  );
}
