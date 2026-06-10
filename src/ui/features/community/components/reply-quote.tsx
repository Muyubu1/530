export function ReplyQuote({
  name,
  snippet,
  onClick,
}: {
  name: string;
  snippet: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-1 flex w-full items-stretch gap-2 rounded-md bg-cream/[0.06] px-2 py-1 text-left"
    >
      <span className="w-0.5 shrink-0 rounded bg-cream/50" />
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold text-cream/90">{name}</span>
        <span className="block truncate text-[11px] text-muted-foreground/70">{snippet}</span>
      </span>
    </button>
  );
}
