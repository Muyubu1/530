import { useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { Input, Label } from "@/ui/design-system";
import { cn } from "@/lib/utils";

/**
 * Label + Input + realtime inline validation. The parent computes `error`
 * (via @/lib/validation); this field decides WHEN to show it: as soon as the
 * field has content, or after first blur. Password fields get a reveal toggle.
 */
export function ValidatedField({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  disabled,
  showValid = true,
}: {
  label?: string;
  id?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  showValid?: boolean;
}) {
  const [touched, setTouched] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const show = (touched || value.length > 0) && !!error;
  const showCheck = showValid && !isPassword && value.length > 0 && !error;

  return (
    <div className="space-y-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          type={isPassword && revealed ? "text" : type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          invalid={show}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          className={cn(
            (showCheck || isPassword) && "pr-10",
            showCheck && "border-emerald-500/50 focus:border-emerald-500",
          )}
        />
        {showCheck && (
          <Check
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400"
            strokeWidth={2.5}
          />
        )}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? "şifreyi gizle" : "şifreyi göster"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-cream"
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {show && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
