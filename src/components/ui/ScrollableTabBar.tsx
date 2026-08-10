"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { G } from "@/theme/dashboardTokens";

export type ScrollableTabItem<T extends string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  tabs: readonly ScrollableTabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Kéo rộng vùng tab sát mép card (mobile). */
  bleedX?: { xs: number; sm: number };
};

export function ScrollableTabBar<T extends string>({
  tabs,
  value,
  onChange,
  bleedX = { xs: 1.5, sm: 0 },
}: Props<T>) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<T, HTMLButtonElement>>>({});

  useEffect(() => {
    const scroller = scrollerRef.current;
    const selected = tabRefs.current[value];
    if (!scroller || !selected) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const tabRect = selected.getBoundingClientRect();
    const delta =
      tabRect.left +
      tabRect.width / 2 -
      (scrollerRect.left + scrollerRect.width / 2);

    if (Math.abs(delta) > 1) {
      scroller.scrollBy({ left: delta, behavior: "smooth" });
    }
  }, [value]);

  return (
    <Box
      ref={scrollerRef}
      role="tablist"
      sx={{
        display: "flex",
        gap: 0.25,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": { display: "none" },
        mx: { xs: -bleedX.xs, sm: -bleedX.sm },
        px: { xs: bleedX.xs, sm: bleedX.sm },
      }}
    >
      {tabs.map((t) => {
        const active = value === t.id;
        return (
          <Box
            key={t.id}
            component="button"
            type="button"
            role="tab"
            aria-selected={active}
            ref={(el: HTMLButtonElement | null) => {
              if (el) tabRefs.current[t.id] = el;
            }}
            onClick={() => onChange(t.id)}
            sx={{
              appearance: "none",
              border: 0,
              margin: 0,
              font: "inherit",
              flexShrink: 0,
              cursor: "pointer",
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1.35, sm: 1.1 },
              minHeight: { xs: 48, sm: 44 },
              bgcolor: "transparent",
              color: active ? G.blue : G.secondary,
              fontWeight: 500,
              fontSize: { xs: 14.5, sm: 15 },
              lineHeight: 1.35,
              whiteSpace: "nowrap",
              borderBottom: active
                ? `3px solid ${G.blue}`
                : "3px solid transparent",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              userSelect: "none",
              transition: "color 120ms ease, border-color 120ms ease",
              "&:active": {
                bgcolor: "rgba(26,115,232,0.08)",
              },
            }}
          >
            {t.label}
          </Box>
        );
      })}
    </Box>
  );
}
