import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
};

export function Input({ label, error, className, id, ...props }: Props) {
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-600">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20",
          error && "border-red-400 focus:border-red-500 focus:ring-red-200",
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
