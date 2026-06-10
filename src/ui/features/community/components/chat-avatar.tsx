import { cn } from "@/lib/utils";
import { userColor } from "../lib/user-color";

export function ChatAvatar({
  userId,
  name,
  avatarUrl,
  className,
}: {
  userId: string;
  name: string | null;
  avatarUrl?: string | null;
  className?: string;
}) {
  const color = userColor(userId);
  const initials =
    (name || "?")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "?";

  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-cream/10",
        className,
      )}
      style={
        avatarUrl ? undefined : { background: `linear-gradient(135deg, ${color}, ${color}88)` }
      }
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name ?? ""}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-mono text-[10px] font-semibold text-background">{initials}</span>
      )}
    </span>
  );
}
