"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import type { Visit } from "@/types";
import { HistoryFilter } from "@/features/dashboard/HistoryFilter";
import { CARD_RADIUS, G, SHADOW } from "@/theme/dashboardTokens";

type Props = {
  visits: Visit[];
  onSearch: (filters: { q: string; from: string; to: string }) => void;
  totalCount: number;
  onOpenVisit: (visitId: string) => void;
};

export function MedicalHistoryList({
  visits,
  onSearch,
  totalCount,
  onOpenVisit,
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
          Lượt khám trước đó
        </Typography>
        <Typography sx={{ mt: 0.35, fontSize: 14.5, color: G.secondary }}>
          Tra cứu và xem lại kết quả từ các lần khám trước
        </Typography>
      </Box>

      <HistoryFilter onSearch={onSearch} resultCount={totalCount} />

      {visits.length === 0 ? (
        <Typography
          align="center"
          sx={{ px: 2.5, py: 5, fontSize: 15, color: G.secondary }}
        >
          Không có lượt khám nào khác phù hợp.
        </Typography>
      ) : (
        <Box sx={{ px: { xs: 0.5, sm: 1 }, pb: 0.75 }}>
          {visits.map((visit, index) => (
            <Box key={visit.id}>
              {index > 0 ? (
                <Divider sx={{ borderColor: "rgba(218,220,224,0.5)" }} />
              ) : null}

              <Box
                component="button"
                type="button"
                onClick={() => onOpenVisit(visit.id)}
                sx={{
                  appearance: "none",
                  border: 0,
                  margin: 0,
                  background: "transparent",
                  font: "inherit",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  width: "100%",
                  boxSizing: "border-box",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                  px: { xs: 1.5, sm: 2 },
                  py: 1.5,
                  borderRadius: "8px",
                  color: "inherit",
                  outline: "none",
                  transition: "background-color 120ms ease",
                  "&:hover": {
                    bgcolor: G.surface,
                    "& .xem": { color: G.blue },
                    "& .chevron": {
                      color: G.blue,
                      transform: "translateX(2px)",
                    },
                  },
                  "&:focus-visible": { bgcolor: G.surface },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: G.ink,
                      lineHeight: 1.35,
                    }}
                  >
                    {visit.title}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.4,
                      fontSize: 14.5,
                      fontWeight: 400,
                      color: G.secondary,
                      lineHeight: 1.45,
                    }}
                  >
                    {visit.date} · {visit.doctor} · {visit.department}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.25,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    className="xem"
                    sx={{
                      display: { xs: "none", sm: "block" },
                      fontSize: 14.5,
                      fontWeight: 500,
                      color: G.blue,
                    }}
                  >
                    Xem kết quả
                  </Typography>
                  <ChevronRightRoundedIcon
                    className="chevron"
                    sx={{
                      fontSize: 23,
                      color: G.outline,
                      transition: "color 120ms ease, transform 120ms ease",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
