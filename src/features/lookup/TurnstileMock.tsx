"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  onTokenChange: (token: string) => void;
};

/** Mock Cloudflare Turnstile — thay bằng SDK thật khi tích hợp backend */
export function TurnstileMock({ onTokenChange }: Props) {
  const [verified, setVerified] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        const next = !verified;
        setVerified(next);
        onTokenChange(next ? `mock-turnstile-${Date.now()}` : "");
      }}
      className={cn(
        "flex w-full max-w-[320px] touch-manipulation items-center justify-between rounded-md border border-slate-200 bg-[#fafafa] px-3 py-3 text-left active:bg-slate-100",
        verified && "border-emerald-200 bg-emerald-50/40",
      )}
    >
      <span className="flex items-center gap-2.5 text-base text-slate-700">
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded border",
            verified
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-300 bg-white",
          )}
        >
          {verified ? <Check className="h-4 w-4" /> : null}
        </span>
        {verified ? "Success!" : "Xác minh bạn không phải robot"}
      </span>
      <span className="shrink-0 text-[11px] leading-tight text-slate-400">
        Cloudflare
        <br />
        Turnstile
      </span>
    </button>
  );
}
