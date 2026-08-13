"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  SegmentedControl,
  type SegmentedTabItem,
} from "@/components/ui/SegmentedControl";
import { G } from "@/theme/dashboardTokens";

export type KhthFilterMode = "day" | "month" | "year" | "range";

export type KhthDateFilters = {
  mode: KhthFilterMode;
  /** YYYY-MM-DD — dùng cho mode day */
  day: string;
  /** YYYY-MM — dùng cho mode month */
  month: string;
  /** YYYY — dùng cho mode year */
  year: string;
  /** YYYY-MM-DD — dùng cho mode range */
  from: string;
  to: string;
  q: string;
};

type Props = {
  value: KhthDateFilters;
  onChange: (next: KhthDateFilters) => void;
  resultCount: number;
};

const MODE_TABS: readonly SegmentedTabItem<KhthFilterMode>[] = [
  { id: "day", label: "Theo ngày" },
  { id: "month", label: "Theo tháng" },
  { id: "year", label: "Theo năm" },
  { id: "range", label: "Từ ngày → đến ngày" },
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 40,
    borderRadius: "10px",
    bgcolor: "#fff",
    fontSize: 15,
    fontWeight: 500,
    color: G.ink,
    "& fieldset": { borderColor: "rgba(218,220,224,0.95)" },
    "&:hover fieldset": { borderColor: "#bdc1c6" },
    "&.Mui-focused fieldset": { borderColor: G.blue, borderWidth: 1.5 },
  },
  "& .MuiInputLabel-root": {
    fontSize: 14,
    color: G.secondary,
  },
} as const;

function currentYear(): number {
  return new Date().getFullYear();
}

function yearOptions(): number[] {
  const y = currentYear();
  const list: number[] = [];
  for (let i = y; i >= y - 5; i -= 1) list.push(i);
  return list;
}

export function KhthDateFilter({ value, onChange, resultCount }: Props) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const apply = () => onChange(draft);

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 2.5 },
        py: 2,
        borderBottom: "1px solid rgba(218,220,224,0.65)",
        bgcolor: "#fafbfc",
      }}
    >
      <Stack spacing={1.75}>
        <Box>
          <Typography
            sx={{ mb: 1, fontSize: 13.5, fontWeight: 500, color: G.secondary }}
          >
            Cách lọc
          </Typography>
          <SegmentedControl
            tabs={MODE_TABS}
            value={draft.mode}
            onChange={(mode) => setDraft((prev) => ({ ...prev, mode }))}
            fullWidth
          />
        </Box>

        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={1.5}
          sx={{ alignItems: { lg: "flex-end" } }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                mb: 0.75,
                fontSize: 13.5,
                fontWeight: 500,
                color: G.secondary,
              }}
            >
              Tìm kiếm
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={draft.q}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, q: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") apply();
              }}
              placeholder="Họ tên, mã KCB, SĐT, khoa..."
              sx={fieldSx}
            />
          </Box>

          {draft.mode === "day" ? (
            <Box sx={{ width: { xs: "100%", sm: 180 } }}>
              <Typography
                sx={{
                  mb: 0.75,
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: G.secondary,
                }}
              >
                Ngày khám
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={draft.day}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, day: e.target.value }))
                }
                slotProps={{ inputLabel: { shrink: true } }}
                sx={fieldSx}
              />
            </Box>
          ) : null}

          {draft.mode === "month" ? (
            <Box sx={{ width: { xs: "100%", sm: 180 } }}>
              <Typography
                sx={{
                  mb: 0.75,
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: G.secondary,
                }}
              >
                Tháng
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="month"
                value={draft.month}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, month: e.target.value }))
                }
                slotProps={{ inputLabel: { shrink: true } }}
                sx={fieldSx}
              />
            </Box>
          ) : null}

          {draft.mode === "year" ? (
            <Box sx={{ width: { xs: "100%", sm: 140 } }}>
              <Typography
                sx={{
                  mb: 0.75,
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: G.secondary,
                }}
              >
                Năm
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={draft.year}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, year: e.target.value }))
                }
                sx={fieldSx}
              >
                {yearOptions().map((y) => (
                  <MenuItem key={y} value={String(y)}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ) : null}

          {draft.mode === "range" ? (
            <>
              <Box sx={{ width: { xs: "100%", sm: 160 } }}>
                <Typography
                  sx={{
                    mb: 0.75,
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: G.secondary,
                  }}
                >
                  Từ ngày
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={draft.from}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, from: e.target.value }))
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={fieldSx}
                />
              </Box>
              <Box sx={{ width: { xs: "100%", sm: 160 } }}>
                <Typography
                  sx={{
                    mb: 0.75,
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: G.secondary,
                  }}
                >
                  Đến ngày
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={draft.to}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, to: e.target.value }))
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={fieldSx}
                />
              </Box>
            </>
          ) : null}

          <Button
            variant="contained"
            onClick={apply}
            sx={{
              height: 40,
              px: 2.25,
              borderRadius: "10px",
              bgcolor: G.blue,
              boxShadow: "none",
              fontWeight: 500,
              fontSize: 15,
              textTransform: "none",
              flexShrink: 0,
              "&:hover": { bgcolor: "#1557b0", boxShadow: "none" },
            }}
          >
            Lọc ({resultCount})
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export function defaultKhthDateFilters(): KhthDateFilters {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return {
    mode: "day",
    day: `${yyyy}-${mm}-${dd}`,
    month: `${yyyy}-${mm}`,
    year: String(yyyy),
    from: "",
    to: "",
    q: "",
  };
}

export function filterKhthPatientsByDate<
  T extends { visitDate: string; fullName: string; maKcb: string; phone: string; department: string; doctor: string },
>(patients: T[], filters: KhthDateFilters): T[] {
  const q = filters.q.trim().toLowerCase();

  return patients.filter((p) => {
    if (q) {
      const hit =
        p.fullName.toLowerCase().includes(q) ||
        p.maKcb.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.doctor.toLowerCase().includes(q);
      if (!hit) return false;
    }

    const d = p.visitDate; // YYYY-MM-DD
    if (filters.mode === "day") {
      if (!filters.day) return true;
      return d === filters.day;
    }
    if (filters.mode === "month") {
      if (!filters.month) return true;
      return d.startsWith(filters.month);
    }
    if (filters.mode === "year") {
      if (!filters.year) return true;
      return d.startsWith(filters.year);
    }
    // range
    if (filters.from && d < filters.from) return false;
    if (filters.to && d > filters.to) return false;
    return true;
  });
}
