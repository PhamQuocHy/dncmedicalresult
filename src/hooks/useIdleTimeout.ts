"use client";

import { useEffect, useRef } from "react";

type Options = {
  timeoutMs?: number;
  onIdle: () => void;
  enabled?: boolean;
};

export function useIdleTimeout({
  timeoutMs = 15 * 60 * 1000,
  onIdle,
  enabled = true,
}: Options) {
  const timerRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    if (!enabled) return;

    const reset = () => {
      const now = Date.now();
      if (now - lastRef.current < 2000) return;
      lastRef.current = now;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => onIdleRef.current(), timeoutMs);
    };

    const events = ["mousemove", "scroll", "keydown", "click", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [enabled, timeoutMs]);
}
