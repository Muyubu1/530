import { useState } from "react";
import { Check } from "lucide-react";
import { Input, Label } from "@/ui/design-system";

/**
 * Label + Input + realtime inline validation. The parent computes `error`
 * (via @/lib/validation); this field decides WHEN to show it: as soon as the
 * field has content, or after first blur — never on an untouched empty field.
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
  const show = (touched || value.length > 0) && !!error;
  const valid = showValid && value.length > 0 && !error;

  return (
    <div className="space-y-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          invalid={show}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          className={valid ? "border-emerald-500/50 pr-10 focus:border-emerald-500" : undefined}
        />
        {valid && (
          <Check
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400"
            strokeWidth={2.5}
          />
        )}
      </div>
      {show && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
