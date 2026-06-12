import { Award } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, Button } from "@/ui/design-system";
import type { DemoBadge } from "../lib/mock-journey";

export function RewardModal({ badge, onClose }: { badge: DemoBadge | null; onClose: () => void }) {
  return (
    <Dialog open={!!badge} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xs">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-cream bg-cream/10 text-cream [animation:gold-badge-pulse_2s_ease-in-out_infinite]">
            <Award className="h-9 w-9" strokeWidth={1.5} />
          </span>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
              rozet açıldı
            </p>
            <DialogTitle className="mt-2 text-2xl">{badge?.name}</DialogTitle>
            <p className="mt-2 text-sm text-muted-foreground/70">{badge?.desc}</p>
          </div>
          <Button variant="cream" size="md" onClick={onClose}>
            devam
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
