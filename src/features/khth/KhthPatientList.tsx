"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import type { KhthPatientRow } from "@/types";
import {
  KhthDateFilter,
  type KhthDateFilters,
} from "@/features/khth/KhthDateFilter";
import { CARD_RADIUS, G, SHADOW } from "@/theme/dashboardTokens";

type Props = {
  patients: KhthPatientRow[];
  filters: KhthDateFilters;
  onFiltersChange: (next: KhthDateFilters) => void;
  totalCount: number;
};

function formatVisitDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

function statusTone(status: string): { bg: string; color: string } {
  if (status.includes("Đã có")) {
    return { bg: G.greenSoft, color: G.green };
  }
  if (status.includes("Chờ")) {
    return { bg: G.amberSoft, color: G.amber };
  }
  return { bg: G.blueSoft, color: G.blueInk };
}

export function KhthPatientList({
  patients,
  filters,
  onFiltersChange,
  totalCount,
}: Props) {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: CARD_RADIUS,
        boxShadow: SHADOW,
        border: "none",
        overflow: "hidden",
      }}
    >
      <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: 2.25, pb: 0.5 }}>
        <Typography sx={{ fontSize: 17, fontWeight: 500, color: G.ink }}>
          Danh sách bệnh nhân
        </Typography>
        <Typography sx={{ mt: 0.35, fontSize: 14.5, color: G.secondary }}>
          Lọc theo ngày, tháng, năm hoặc khoảng thời gian khám
        </Typography>
      </Box>

      <KhthDateFilter
        value={filters}
        onChange={onFiltersChange}
        resultCount={totalCount}
      />

      {patients.length === 0 ? (
        <Typography
          align="center"
          sx={{ px: 2.5, py: 5, fontSize: 15, color: G.secondary }}
        >
          Không có bệnh nhân nào phù hợp bộ lọc.
        </Typography>
      ) : (
        <Box sx={{ px: { xs: 0.5, sm: 1 }, pb: 0.75 }}>
          {patients.map((p, index) => {
            const tone = statusTone(p.status);
            return (
              <Box key={p.id}>
                {index > 0 ? (
                  <Divider sx={{ borderColor: "rgba(218,220,224,0.5)" }} />
                ) : null}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { sm: "center" },
                    justifyContent: "space-between",
                    gap: { xs: 1.25, sm: 2 },
                    px: { xs: 1.5, sm: 2 },
                    py: 1.6,
                    borderRadius: "8px",
                  }}
                >
                  <Stack spacing={0.65} sx={{ minWidth: 0, flex: 1 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      sx={{ flexWrap: "wrap", alignItems: "center" }}
                    >
                      <Typography
                        sx={{
                          fontSize: 15.5,
                          fontWeight: 600,
                          color: G.ink,
                          lineHeight: 1.35,
                        }}
                      >
                        {p.fullName}
                      </Typography>
                      <Chip
                        size="small"
                        label={p.status}
                        sx={{
                          height: 26,
                          borderRadius: "8px",
                          bgcolor: tone.bg,
                          color: tone.color,
                          fontWeight: 500,
                          fontSize: 12.5,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1.75}
                      useFlexGap
                      sx={{
                        flexWrap: "wrap",
                        alignItems: "center",
                        color: G.secondary,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ alignItems: "center" }}
                      >
                        <PersonOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                        <Typography sx={{ fontSize: 13.5 }}>
                          Mã KCB: {p.maKcb}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ alignItems: "center" }}
                      >
                        <PhoneOutlinedIcon sx={{ fontSize: 15 }} />
                        <Typography sx={{ fontSize: 13.5 }}>{p.phone}</Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ alignItems: "center" }}
                      >
                        <LocalHospitalOutlinedIcon sx={{ fontSize: 15 }} />
                        <Typography sx={{ fontSize: 13.5 }}>
                          {p.department} · {p.doctor}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={0.6}
                    sx={{
                      alignItems: "center",
                      flexShrink: 0,
                      color: G.secondary,
                      pl: { xs: 0, sm: 1 },
                    }}
                  >
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                      {formatVisitDate(p.visitDate)}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
