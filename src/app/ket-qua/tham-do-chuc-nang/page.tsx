"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
import { AppMobileBottomNav } from "@/components/layout/AppMobileBottomNav";
import { ResultPageHeader } from "@/components/layout/ResultPageHeader";
import { FunctionalResultList } from "@/features/functional/FunctionalResultList";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { functionalResults, patient } from "@/data/mock";
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

export default function FunctionalResultPage() {
  const { ready } = useRequireAuth();

  if (!ready) {
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
          <CircularProgress size={32} thickness={4} sx={{ color: G.blue }} />
          <Typography sx={{ fontSize: 15, color: G.secondary }}>
            Đang tải...
          </Typography>
        </Stack>
      </Box>
    );
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
      <ResultPageHeader title="Kết quả thăm dò chức năng" />

      <Box
        component="main"
        sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          pb: { xs: 9, sm: 0 },
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
            py: { xs: 2.5, sm: 3 },
          }}
        >
          <FunctionalResultList
            patient={patient}
            items={functionalResults}
            visitMeta={{
              date: "30/07/2026",
              department: "Nội khoa",
              doctor: "Bác sĩ Trần Văn C",
            }}
          />
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          mt: "auto",
          py: 1.75,
          borderTop: `1px solid ${G.outline}`,
          bgcolor: "#fff",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography align="center" sx={{ fontSize: 14, color: "#9AA3B2" }}>
          © 2022–2024 Bệnh Viện Đại Học Nam Cần Thơ. All Rights Reserved.
        </Typography>
      </Box>

      <AppMobileBottomNav />
    </Box>
  );
}
