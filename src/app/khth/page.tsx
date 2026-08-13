"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {
  Activity,
  Ambulance,
  Bone,
  Brain,
  ClipboardPlus,
  Droplets,
  HeartPulse,
  Hospital,
  Microscope,
  Pill,
  ScanLine,
  Stethoscope,
  Thermometer,
  UserRound,
} from "lucide-react";
import { PageFooter } from "@/components/layout/PageFooter";
import {
  defaultKhthDateFilters,
  filterKhthPatientsByDate,
  type KhthDateFilters,
} from "@/features/khth/KhthDateFilter";
import { KhthPatientList } from "@/features/khth/KhthPatientList";
import { useRequireKhthAuth } from "@/hooks/useRequireKhthAuth";
import { fetchKhthPatients } from "@/lib/api";
import { assetPath } from "@/lib/assetPath";
import type { KhthPatientRow } from "@/types";
import { G } from "@/theme/dashboardTokens";

const bgIcons = [
  { Icon: Stethoscope, className: "top-[10%] left-[4%] h-16 w-16 rotate-[-18deg] opacity-[0.07]" },
  { Icon: HeartPulse, className: "top-[14%] right-[5%] h-14 w-14 rotate-[12deg] opacity-[0.07]" },
  { Icon: Microscope, className: "top-[36%] left-[3%] h-16 w-16 rotate-[8deg] opacity-[0.06]" },
  { Icon: Pill, className: "top-[32%] right-[4%] h-14 w-14 rotate-[-12deg] opacity-[0.07]" },
  { Icon: Thermometer, className: "top-[22%] left-[18%] h-12 w-12 rotate-[16deg] opacity-[0.06]" },
  { Icon: Brain, className: "top-[20%] right-[16%] h-14 w-14 rotate-[-8deg] opacity-[0.06]" },
  { Icon: Hospital, className: "bottom-[18%] left-[6%] h-16 w-16 rotate-[6deg] opacity-[0.07]" },
  { Icon: ScanLine, className: "bottom-[12%] left-[34%] h-14 w-14 rotate-[-10deg] opacity-[0.06]" },
  { Icon: Ambulance, className: "bottom-[16%] right-[7%] h-16 w-16 rotate-[10deg] opacity-[0.07]" },
  { Icon: Droplets, className: "bottom-[6%] right-[28%] h-12 w-12 rotate-[-14deg] opacity-[0.06]" },
  { Icon: ClipboardPlus, className: "bottom-[28%] left-[24%] h-14 w-14 rotate-[8deg] opacity-[0.06]" },
  { Icon: Bone, className: "bottom-[26%] right-[22%] h-14 w-14 rotate-[-6deg] opacity-[0.06]" },
  { Icon: UserRound, className: "top-[46%] left-[10%] h-12 w-12 rotate-[4deg] opacity-[0.05]" },
  { Icon: Activity, className: "top-[48%] right-[10%] h-12 w-12 rotate-[-4deg] opacity-[0.05]" },
] as const;

function KhthLoading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "#f8fafb",
      }}
    >
      <Stack spacing={1.5} sx={{ alignItems: "center" }}>
        <CircularProgress size={32} thickness={4} sx={{ color: "#1a73e8" }} />
        <Typography sx={{ fontSize: 15, color: "#6B7280" }}>
          Đang tải danh sách bệnh nhân...
        </Typography>
      </Stack>
    </Box>
  );
}

export default function KhthPage() {
  const { ready, session, handleLogout } = useRequireKhthAuth();
  const [patients, setPatients] = useState<KhthPatientRow[] | null>(null);
  const [filters, setFilters] = useState<KhthDateFilters>(() =>
    defaultKhthDateFilters(),
  );

  useEffect(() => {
    if (!ready) return;
    void fetchKhthPatients().then((data) => setPatients(data.patients));
  }, [ready]);

  const filtered = useMemo(() => {
    if (!patients) return [];
    return filterKhthPatientsByDate(patients, filters);
  }, [patients, filters]);

  if (!ready || !session || !patients) {
    return <KhthLoading />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f8fafb",
      }}
    >
      <Box
        component="header"
        sx={{
          zIndex: 30,
          bgcolor: "#fff",
          borderBottom: `1px solid ${G.outline}`,
          boxShadow: "0 1px 2px 0 rgba(60,64,67,0.08)",
          position: "sticky",
          top: 0,
        }}
      >
        <Box
          sx={{
            maxWidth: 1440,
            mx: "auto",
            px: { xs: 2, sm: 10 },
            height: { xs: 60, sm: 64 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
            <Image
              src={assetPath("/images/logo-bv.png")}
              alt="Bệnh viện Đại học Nam Cần Thơ"
              width={180}
              height={40}
              className="h-10 w-auto object-contain sm:h-11"
              priority
            />
            <Box sx={{ display: { xs: "none", md: "block" }, minWidth: 0 }}>
              <Typography
                sx={{ fontSize: 14.5, fontWeight: 600, color: G.ink, lineHeight: 1.3 }}
              >
                Phòng Kế hoạch tổng hợp
              </Typography>
              <Typography sx={{ fontSize: 13, color: G.secondary, lineHeight: 1.3 }}>
                {session.displayName}
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutRoundedIcon sx={{ fontSize: 19 }} />}
            sx={{
              height: 36,
              px: { xs: 1.1, sm: 1.75 },
              minWidth: { xs: 40, sm: "auto" },
              borderRadius: "24px",
              borderColor: G.outline,
              color: G.secondary,
              fontWeight: 500,
              fontSize: 14.5,
              textTransform: "none",
              "& .MuiButton-startIcon": {
                mr: { xs: 0, sm: 0.75 },
              },
              "&:hover": {
                borderColor: "#bdc1c6",
                bgcolor: G.surface,
              },
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Thoát
            </Box>
          </Button>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          aria-hidden
          className="pointer-events-none absolute inset-0 text-[#8ab4f8]"
        >
          {bgIcons.map(({ Icon, className }, i) => (
            <Icon
              key={i}
              strokeWidth={1.25}
              className={`absolute ${className}`}
            />
          ))}
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1440,
            mx: "auto",
            px: { xs: 2, sm: 10 },
            py: { xs: 2.5, sm: "35px" },
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontSize: { xs: 20, sm: 22 },
                fontWeight: 600,
                color: G.ink,
                letterSpacing: "-0.01em",
              }}
            >
              Tra cứu bệnh nhân
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 14.5, color: G.secondary }}>
              Mặc định lọc theo ngày hôm nay — đổi sang tháng, năm hoặc khoảng
              ngày khi cần.
            </Typography>
          </Box>

          <KhthPatientList
            patients={filtered}
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={filtered.length}
          />
        </Box>
      </Box>

      <PageFooter />
    </Box>
  );
}
