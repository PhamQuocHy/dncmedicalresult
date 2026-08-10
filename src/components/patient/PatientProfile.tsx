"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import type { Patient } from "@/types";
import { CARD_RADIUS, G, SHADOW } from "@/theme/dashboardTokens";

type Props = {
  patient: Patient;
  meta?: { date?: string; department?: string; doctor?: string };
  compact?: boolean;
};

const chipBaseSx = {
  height: 28,
  borderRadius: "8px",
  fontSize: 13.5,
  fontWeight: 500,
  letterSpacing: "0.01em",
  border: "1px solid transparent",
  "& .MuiChip-icon": { ml: "8px", mr: "-2px" },
  "& .MuiChip-label": { px: 1 },
} as const;

function PatientAvatar({
  patient,
  size = 64,
}: {
  patient: Patient;
  size?: number;
}) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        bgcolor: G.blueSoft,
        display: "grid",
        placeItems: "center",
        fontWeight: 500,
        fontSize: size > 52 ? 18 : 14,
        color: G.blue,
      }}
    >
      {patient.avatarUrl ? (
        <Image
          src={patient.avatarUrl}
          alt={patient.fullName}
          width={size}
          height={size}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        patient.initials
      )}
    </Box>
  );
}

function InfoItem({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <Box
      sx={{
        bgcolor: "#f8f9fa",
        borderRadius: "12px",
        px: 1.5,
        py: 1.35,
        minHeight: 68,
      }}
    >
      <Stack
        direction="row"
        spacing={0.75}
        sx={{ alignItems: "center", mb: 0.6, color: G.secondary }}
      >
        {icon}
        <Typography sx={{ fontSize: 13.5, fontWeight: 500, color: G.secondary }}>
          {label}
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 500,
          color: valueColor ?? G.ink,
          lineHeight: 1.35,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function AllergyChips({ patient }: { patient: Patient }) {
  if (!patient.allergies.length) return null;
  return (
    <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: "wrap" }}>
      {patient.allergies.map((a) => {
        const danger = a.severity === "danger";
        return (
          <Chip
            key={a.name}
            size="small"
            variant="outlined"
            icon={
              <WarningAmberRoundedIcon sx={{ fontSize: "16px !important" }} />
            }
            label={a.name}
            sx={{
              ...chipBaseSx,
              bgcolor: danger ? G.redSoft : G.amberSoft,
              color: danger ? G.red : G.amber,
              borderColor: danger
                ? "rgba(197,34,31,0.18)"
                : "rgba(176,96,0,0.2)",
              "& .MuiChip-icon": {
                ...chipBaseSx["& .MuiChip-icon"],
                color: danger ? G.red : G.amber,
              },
            }}
          />
        );
      })}
    </Stack>
  );
}

export function PatientProfile({ patient, meta, compact }: Props) {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: CARD_RADIUS,
        boxShadow: SHADOW,
        border: "none",
        overflow: "hidden",
        backgroundImage:
          "radial-gradient(ellipse 70% 100% at 100% 0%, rgba(26,115,232,0.08), transparent 55%)",
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 2.25 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: { sm: "flex-start" },
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Stack
            direction="row"
            spacing={1.75}
            sx={{ alignItems: "center", minWidth: 0 }}
          >
            <PatientAvatar patient={patient} size={compact ? 56 : 64} />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: compact
                    ? { xs: 17, sm: 18 }
                    : { xs: 18, sm: 20 },
                  fontWeight: 500,
                  color: G.ink,
                  lineHeight: 1.3,
                }}
              >
                {patient.fullName}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 0.35, sm: 1.5 }}
                useFlexGap
                sx={{ mt: 0.5, flexWrap: "wrap" }}
              >
                <Stack
                  direction="row"
                  spacing={0.6}
                  sx={{ alignItems: "center", color: G.secondary }}
                >
                  <BadgeOutlinedIcon sx={{ fontSize: 15 }} />
                  <Typography sx={{ fontSize: 14.5, color: G.secondary }}>
                    Mã KCB:{" "}
                    <Box
                      component="span"
                      sx={{ color: G.blue, fontWeight: 500 }}
                    >
                      {patient.maKcb}
                    </Box>
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  spacing={0.6}
                  sx={{ alignItems: "center", color: G.secondary }}
                >
                  <ShieldOutlinedIcon sx={{ fontSize: 15 }} />
                  <Typography sx={{ fontSize: 14.5, color: G.secondary }}>
                    BHYT: {patient.bhyt}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          <AllergyChips patient={patient} />
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 1.25,
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)",
            },
          }}
        >
          <InfoItem
            icon={<PersonOutlineRoundedIcon sx={{ fontSize: 15 }} />}
            label="Giới tính"
            value={patient.gender}
          />
          <InfoItem
            icon={<CakeOutlinedIcon sx={{ fontSize: 15 }} />}
            label="Ngày sinh"
            value={patient.dateOfBirth}
          />
          <InfoItem
            icon={<WaterDropOutlinedIcon sx={{ fontSize: 15 }} />}
            label="Nhóm máu"
            value={patient.bloodType}
            valueColor={G.red}
          />
          <InfoItem
            icon={<PhoneOutlinedIcon sx={{ fontSize: 15 }} />}
            label="Điện thoại"
            value={patient.phone}
          />
          <InfoItem
            icon={<PlaceOutlinedIcon sx={{ fontSize: 15 }} />}
            label="Địa chỉ"
            value={patient.address}
          />
        </Box>
      </Box>

      {meta ? (
        <Box
          sx={{
            borderTop: "1px solid rgba(218,220,224,0.7)",
            bgcolor: "rgba(248,250,252,0.85)",
            px: { xs: 2, sm: 2.25 },
            py: 1.5,
          }}
        >
          <Stack
            direction="row"
            spacing={2.5}
            useFlexGap
            sx={{ flexWrap: "wrap" }}
          >
            {meta.date ? (
              <Typography sx={{ fontSize: 14.5, color: G.ink }}>
                <Box component="span" sx={{ color: G.secondary }}>
                  Ngày khám:{" "}
                </Box>
                {meta.date}
              </Typography>
            ) : null}
            {meta.department ? (
              <Typography sx={{ fontSize: 14.5, color: G.ink }}>
                <Box component="span" sx={{ color: G.secondary }}>
                  Khoa:{" "}
                </Box>
                {meta.department}
              </Typography>
            ) : null}
            {meta.doctor ? (
              <Typography sx={{ fontSize: 14.5, color: G.ink }}>
                <Box component="span" sx={{ color: G.secondary }}>
                  Bác sĩ:{" "}
                </Box>
                {meta.doctor}
              </Typography>
            ) : null}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
