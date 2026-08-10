"use client";

import {
  useCallback,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

export function useOtpInput(length = 6) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = useCallback(
    (index: number, value: string) => {
      const char = value.replace(/\D/g, "").slice(-1);
      setDigits((prev) => {
        const next = [...prev];
        next[index] = char;
        return next;
      });
      if (char && index < length - 1) {
        refs.current[index + 1]?.focus();
      }
    },
    [length],
  );

  const onKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  const onPaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (!text) return;
      const next = Array(length).fill("");
      text.split("").forEach((c, i) => {
        next[i] = c;
      });
      setDigits(next);
      refs.current[Math.min(text.length, length - 1)]?.focus();
    },
    [length],
  );

  const reset = useCallback(() => setDigits(Array(length).fill("")), [length]);
  const value = digits.join("");
  const isComplete = value.length === length;

  return { digits, setDigit, onKeyDown, onPaste, refs, value, isComplete, reset };
}
