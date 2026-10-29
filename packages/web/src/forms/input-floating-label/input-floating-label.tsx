import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@kinetik/core/utils";

export interface InputFloatingLabelProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  label: string;
  error?: string;
}

/** Label floats up on focus or when filled (CSS :placeholder-shown), with an underline that grows from the center. */
export function InputFloatingLabel({ label, error, className, id, ...props }: InputFloatingLabelProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div className={cn("relative", className)}>
      <input
        id={inputId}
        placeholder=" "
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${inputId}-err` : undefined}
        className="peer h-14 w-full rounded-xl border border-input bg-card px-4 pt-5 pb-1.5 text-sm outline-none transition-colors focus:border-transparent aria-invalid:border-destructive"
        {...props}
      />
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute top-1/2 left-4 origin-left -translate-y-1/2 text-sm text-muted-foreground transition-all duration-200 ease-[cubic-bezier(.2,0,0,1)] peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:scale-[0.8] peer-focus:text-brand peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-[0.8] motion-reduce:transition-none"
      >
        {label}
      </label>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-brand/0 transition-[box-shadow] duration-200 peer-focus:ring-brand/70" />
      <span aria-hidden className="absolute inset-x-4 bottom-0 h-0.5 origin-center scale-x-0 rounded-full bg-brand transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] peer-focus:scale-x-100 motion-reduce:transition-none" />
      {error && <p id={`${inputId}-err`} className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
