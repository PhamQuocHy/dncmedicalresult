"use client";

import { useCallback, useEffect, useState } from "react";

export function useCountdown(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = window.setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [seconds > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = useCallback((value: number) => setSeconds(value), []);
  const reset = useCallback(() => setSeconds(0), []);

  return { seconds, start, reset, isRunning: seconds > 0 };
}
