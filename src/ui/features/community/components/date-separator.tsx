export function DateSeparator({ label }: { label: string }) {
  return (
    <div className="my-4 flex items-center justify-center">
      <span className="rounded-full bg-card/60 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/70 backdrop-blur">
        {label}
      </span>
    </div>
  );
}
