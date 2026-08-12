"use client";

import Box from "@mui/material/Box";
import { G } from "@/theme/dashboardTokens";

export type SegmentedTabItem<T extends string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  tabs: readonly SegmentedTabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Bật để tab chia đều chiều ngang (mobile). */
  fullWidth?: boolean;
};

/** Nút chuyển dạng pill — gọn, phù hợp header / filter. */
export function SegmentedControl<T extends string>({
  tabs,
  value,
  onChange,
  fullWidth = false,
}: Props<T>) {
  return (
    <Box
      role="tablist"
      sx={{
        display: "flex",
        alignItems: "center",
        width: fullWidth ? { xs: "100%", sm: "auto" } : "auto",
        p: { xs: "4px", sm: "3px" },
        gap: 0.25,
        borderRadius: "999px",
        bgcolor: G.surface,
        border: "1px solid rgba(218,220,224,0.95)",
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
            onClick={() => onChange(t.id)}
            sx={{
              appearance: "none",
              border: 0,
              margin: 0,
              font: "inherit",
              cursor: "pointer",
              flex: fullWidth ? { xs: 1, sm: "0 0 auto" } : "0 0 auto",
              minWidth: 0,
              px: { xs: 1.5, sm: 1.5 },
              py: { xs: 0.9, sm: 0.65 },
              minHeight: { xs: 40, sm: "auto" },
              borderRadius: "999px",
              fontSize: { xs: 14.5, sm: 13.5 },
              fontWeight: active ? 600 : 500,
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              textAlign: "center",
              color: active ? G.blueInk : G.secondary,
              bgcolor: active ? "#fff" : "transparent",
              boxShadow: active
                ? "0 1px 2px rgba(60,64,67,0.16), 0 1px 3px rgba(60,64,67,0.08)"
                : "none",
              transition:
                "color 150ms ease, background-color 150ms ease, box-shadow 150ms ease",
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
              "&:hover": {
                color: active ? G.blueInk : G.ink,
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
