import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tone?: "success" | "danger" | "warning" | "neutral" | "info";
  className?: string;
};

const tones = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  danger: "bg-red-50 text-red-600 border-red-100",
  warning: "bg-orange-50 text-orange-600 border-orange-100",
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
  info: "bg-sky-50 text-sky-700 border-sky-100",
};

export function Badge({ children, tone = "neutral", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
