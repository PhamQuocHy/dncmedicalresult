"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FiFileText, FiHome, FiHeadphones, FiUser } from "react-icons/fi";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import type { LabResultDetail, Patient, Visit } from "@/types";
import { assetPath } from "@/lib/assetPath";
import {
  CARD_RADIUS,
  SHADOW,
} from "@/theme/dashboardTokens";

type DashboardView = "latest" | "history" | "profile" | "support";
export type NavTab = "home" | "history" | "info" | "support";

type Props = {
  patient: Patient;
  visits: Visit[];
  latestVisit: Visit | null;
  lab: LabResultDetail;
  onNavigate: (view: DashboardView) => void;
  onOpenVisit: (visitId: string) => void;
};

/** Palette gần Google Material / Workspace */
const G = {
  blue: "#1a73e8",
  blueInk: "#174ea6",
  blueSoft: "#e8f0fe",
  green: "#137333",
  greenSoft: "#e6f4ea",
  amber: "#b06000",
  amberSoft: "#fef7e0",
  ink: "#202124",
  secondary: "#5f6368",
  outline: "#dadce0",
  surface: "#f1f3f4",
} as const;

function calcAge(dob: string) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(dob.trim());
  if (!m) return null;
  const birth = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

function SoftCard({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: object;
}) {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: CARD_RADIUS,
        boxShadow: SHADOW,
        border: "none",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function VitalCell({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        bgcolor: "#f8f9fa",
        borderRadius: "12px",
        px: 1.85,
        py: 1.6,
        minHeight: 78,
      }}
    >
      <Typography
        sx={{
          fontSize: 14.5,
          fontWeight: 500,
          color: G.secondary,
          mb: 0.65,
          lineHeight: 1.3,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: 19, sm: 21 },
          fontWeight: 500,
          color: G.ink,
          letterSpacing: "-0.01em",
          lineHeight: 1.25,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function MetaIcon({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "8px",
        bgcolor: G.surface,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        color: G.secondary,
      }}
    >
      {children}
    </Box>
  );
}

function StatusChip({ status }: { status: string }) {
  const ok = status.toLowerCase().includes("kết quả");
  return (
    <Chip
      size="small"
      label={status}
      sx={{
        height: 26,
        borderRadius: "8px",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.01em",
        bgcolor: ok ? G.greenSoft : G.surface,
        color: ok ? G.green : G.secondary,
        border: "none",
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
}

export function DashboardTopBar({
  activeTab,
  onTabChange,
  onLogout,
}: {
  activeTab: "home" | "history" | "info";
  onTabChange: (tab: "home" | "history" | "info") => void;
  onLogout: () => void;
}) {
  return (
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
        <Box
          component={Link}
          href="/dashboard"
          onClick={() => onTabChange("home")}
          aria-label="Về trang chủ"
          sx={{
            display: "flex",
            alignItems: "center",
            height: { xs: 48, sm: 56 },
            textDecoration: "none",
            borderRadius: "8px",
            flexShrink: 0,
            "&:hover": { opacity: 0.9 },
          }}
        >
          <Image
            src={assetPath("/images/logo-bv.png")}
            alt="Bệnh viện Đại học Nam Cần Thơ"
            width={220}
            height={48}
            priority
            style={{ height: "100%", width: "auto", objectFit: "contain" }}
          />
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {/* Desktop tabs — mobile dùng bottom nav */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}
          >
            {(
              [
                { id: "home" as const, label: "Trang chủ" },
                { id: "history" as const, label: "Lịch sử khám" },
                { id: "info" as const, label: "Thông tin" },
              ] as const
            ).map((tab) => {
              const active = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  sx={{
                    minWidth: 0,
                    px: 2,
                    height: 34,
                    borderRadius: "8px",
                    color: active ? G.blueInk : G.secondary,
                    bgcolor: active ? G.blueSoft : "transparent",
                    fontWeight: 500,
                    fontSize: 15,
                    textTransform: "none",
                    letterSpacing: "0.01em",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      bgcolor: G.blueSoft,
                      color: G.blue,
                    },
                  }}
                >
                  {tab.label}
                </Button>
              );
            })}
          </Stack>

          <Button
            variant="outlined"
            onClick={onLogout}
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
        </Stack>
      </Box>
    </Box>
  );
}

const MOBILE_NAV: { id: NavTab; label: string; Icon: IconType }[] = [
  { id: "home", label: "Trang chủ", Icon: FiHome },
  { id: "history", label: "Lịch sử", Icon: FiFileText },
  { id: "info", label: "Thông tin", Icon: FiUser },
  { id: "support", label: "Hỗ trợ", Icon: FiHeadphones },
];

/** Bottom nav dạng pill nổi + liquid glass — chỉ hiện trên mobile */
export function MobileBottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}) {
  return (
    <Box
      sx={{
        display: { xs: "flex", sm: "none" },
        position: "fixed",
        left: 0,
        right: 0,
        bottom: "max(6px, env(safe-area-inset-bottom))",
        zIndex: 40,
        justifyContent: "center",
        pointerEvents: "none",
        px: 2,
      }}
    >
      <Box
        sx={{
          pointerEvents: "auto",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          px: 1,
          py: 0.65,
          width: "auto",
          borderRadius: "999px",
          bgcolor: "rgba(255,255,255,0.42)",
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow:
            "0 8px 28px rgba(60,64,67,0.16), inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(255,255,255,0.2)",
          backdropFilter: "blur(18px) saturate(180%)",
          WebkitBackdropFilter: "blur(18px) saturate(180%)",
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.32) 100%)",
        }}
      >
        {MOBILE_NAV.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <IconButton
              key={id}
              aria-label={label}
              onClick={() => onTabChange(id)}
              sx={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                color: active ? "#fff" : G.secondary,
                bgcolor: active ? G.blue : "transparent",
                boxShadow: active
                  ? "0 2px 10px rgba(26,115,232,0.35)"
                  : "none",
                transition:
                  "background-color 180ms ease, color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
                "&:hover": {
                  bgcolor: active ? G.blue : "rgba(255,255,255,0.35)",
                  color: active ? "#fff" : G.ink,
                },
                "&:active": {
                  transform: "scale(0.92)",
                },
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
            </IconButton>
          );
        })}
      </Box>
    </Box>
  );
}

export function WelcomeDashboard({
  patient,
  visits,
  latestVisit,
  lab,
  onNavigate,
  onOpenVisit,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState<string | false>(false);
  const age = calcAge(patient.dateOfBirth);
  const glucose = lab.categories
    .flatMap((c) => c.indicators)
    .find((i) => i.id === "glucose");

  const recentVisits = useMemo(() => visits.slice(0, 4), [visits]);

  useEffect(() => {
    if (!isMobile && visits[0]?.id) {
      setExpanded(visits[0].id);
    } else {
      setExpanded(false);
    }
  }, [isMobile, visits]);

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.7fr) minmax(280px, 1fr)" },
        alignItems: "stretch",
      }}
    >
      {/* Patient profile card */}
      <SoftCard sx={{ p: { xs: 2.25, sm: 2.75 } }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "flex-start", mb: 2.25 }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              bgcolor: G.blueSoft,
            }}
          >
            {patient.avatarUrl ? (
              <Box
                component="img"
                src={patient.avatarUrl}
                alt={patient.fullName}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 500,
                  color: G.blue,
                  fontSize: 19,
                }}
              >
                {patient.initials}
              </Box>
            )}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0, pt: 0.35 }}>
            <Typography
              sx={{
                fontSize: { xs: 21, sm: 23 },
                fontWeight: 500,
                color: G.ink,
                letterSpacing: "0",
                lineHeight: 1.3,
              }}
            >
              {patient.fullName}
            </Typography>
            <Typography
              sx={{
                mt: 0.55,
                fontSize: 15,
                color: G.secondary,
                fontWeight: 400,
                lineHeight: 1.45,
              }}
            >
              {patient.gender}
              {age != null ? `, ${age} tuổi` : ""}
              {" · "}
              {patient.dateOfBirth}
            </Typography>
            <Typography
              sx={{
                mt: 0.4,
                fontSize: 15,
                fontWeight: 500,
                color: G.blue,
              }}
            >
              Mã KCB: {patient.maKcb}
            </Typography>
          </Box>

          <IconButton
            aria-label="Thông tin cá nhân"
            onClick={() => onNavigate("profile")}
            size="small"
            sx={{
              color: G.secondary,
              bgcolor: G.surface,
              borderRadius: "8px",
              width: 32,
              height: 32,
              "&:hover": { bgcolor: G.blueSoft, color: G.blue },
            }}
          >
            <SettingsOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2.5 }}
          useFlexGap
          sx={{ mb: 2.5, flexWrap: "wrap" }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <MetaIcon>
              <PhoneOutlinedIcon sx={{ fontSize: 16 }} />
            </MetaIcon>
            <Typography sx={{ fontSize: 15, color: G.ink }}>
              {patient.phone}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <MetaIcon>
              <PlaceOutlinedIcon sx={{ fontSize: 16 }} />
            </MetaIcon>
            <Typography sx={{ fontSize: 15, color: G.ink }}>
              {patient.address}
            </Typography>
          </Stack>
          <Stack
            component="button"
            type="button"
            direction="row"
            spacing={1}
            onClick={() => onNavigate("support")}
            sx={{
              all: "unset",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: G.blue,
              fontSize: 15,
              fontWeight: 500,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                bgcolor: G.blueSoft,
                display: "grid",
                placeItems: "center",
                color: G.blueInk,
              }}
            >
              <MailOutlineRoundedIcon sx={{ fontSize: 16 }} />
            </Box>
            Hỗ trợ dịch vụ
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 1.25,
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <VitalCell label="BHYT" value={patient.bhyt.slice(-6)} />
          <VitalCell
            label="Dị ứng"
            value={
              patient.allergies.length
                ? `${patient.allergies.length} loại`
                : "Không"
            }
          />
          <VitalCell label="Nhóm máu" value={patient.bloodType} />
          <VitalCell
            label="Đường huyết gần nhất"
            value={glucose ? `${glucose.result} ${glucose.unit}` : "—"}
          />
        </Box>
      </SoftCard>

      {/* Recent visits */}
      <SoftCard
        sx={{
          p: { xs: 2.25, sm: 2.75 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 500,
            color: G.ink,
            mb: 1.25,
            letterSpacing: "0",
          }}
        >
          Lần khám gần đây
        </Typography>

        <Stack
          spacing={0}
          sx={{
            flex: 1,
            mx: { xs: -2.25, sm: -2.75 },
          }}
        >
          {recentVisits.map((visit, index) => (
            <Box key={visit.id}>
              {index > 0 ? (
                <Divider sx={{ borderColor: "rgba(218,220,224,0.55)" }} />
              ) : null}
              <Box
                component="button"
                type="button"
                aria-label={`Xem kết quả ${visit.doctor}, ${visit.date}`}
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
                  gap: 1.25,
                  py: { xs: 1.5, sm: 1.3 },
                  px: { xs: 2.25, sm: 2.75 },
                  minHeight: { xs: 64, sm: 56 },
                  borderRadius: 0,
                  color: "inherit",
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                  transition: "background-color 120ms ease",
                  "&:hover": {
                    bgcolor: G.surface,
                  },
                  "&:active": {
                    bgcolor: G.surface,
                  },
                  "&:focus-visible": {
                    bgcolor: G.surface,
                  },
                  "& *": {
                    pointerEvents: "none",
                  },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ minWidth: 0, alignItems: "flex-start" }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: G.secondary,
                      width: 18,
                      flexShrink: 0,
                      pt: 0.2,
                    }}
                  >
                    {index + 1}.
                  </Typography>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: G.ink,
                        lineHeight: 1.4,
                      }}
                    >
                      {visit.doctor}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: G.secondary,
                        mt: 0.25,
                        fontWeight: 400,
                        lineHeight: 1.4,
                      }}
                    >
                      {visit.date} · {visit.department}
                    </Typography>
                  </Box>
                </Stack>
                <Box
                  aria-hidden
                  sx={{
                    color: G.blueInk,
                    borderRadius: "12px",
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    bgcolor: G.blueSoft,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 19 }} />
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>

        <Button
          fullWidth
          startIcon={<CalendarTodayOutlinedIcon sx={{ fontSize: 19 }} />}
          onClick={() => {
            if (latestVisit) onOpenVisit(latestVisit.id);
            else onNavigate("history");
          }}
          sx={{
            mt: 2,
            height: 44,
            borderRadius: "24px",
            bgcolor: G.blue,
            color: "#fff",
            fontWeight: 500,
            fontSize: 15,
            letterSpacing: "0.01em",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { bgcolor: "#1765cc", boxShadow: "none" },
          }}
        >
          Xem kết quả mới nhất
        </Button>
      </SoftCard>

      {/* Medical history accordion */}
      <SoftCard sx={{ gridColumn: { lg: "1 / -1" }, p: { xs: 1.75, sm: 2.25 } }}>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: 0.5,
            py: 0.5,
            mb: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 500,
              color: G.ink,
              letterSpacing: "0",
            }}
          >
            Hồ sơ khám bệnh
          </Typography>
          <Button
            size="small"
            onClick={() => onNavigate("history")}
            sx={{
              color: G.blue,
              fontWeight: 500,
              fontSize: 14.5,
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": { bgcolor: G.blueSoft },
            }}
          >
            Xem tất cả
          </Button>
        </Stack>

        {visits.map((visit) => {
          const isOpen = expanded === visit.id;
          return (
            <Box
              key={visit.id}
              sx={{ borderTop: `1px solid rgba(218,220,224,0.55)` }}
            >
              <Box
                component="button"
                type="button"
                aria-expanded={isOpen}
                onClick={() => setExpanded(isOpen ? false : visit.id)}
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
                  gap: 1.25,
                  px: 0.5,
                  py: 1.2,
                  minHeight: 56,
                  borderRadius: "8px",
                  color: "inherit",
                  outline: "none",
                  transition: "background-color 120ms ease",
                  "&:hover": {
                    bgcolor: G.surface,
                  },
                  "&:focus-visible": {
                    bgcolor: G.surface,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "12px",
                    bgcolor: G.blueSoft,
                    color: G.blueInk,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <LocalHospitalOutlinedIcon sx={{ fontSize: 19 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: G.ink,
                      lineHeight: 1.4,
                    }}
                  >
                    {visit.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: G.secondary,
                      fontWeight: 400,
                      lineHeight: 1.4,
                    }}
                  >
                    {visit.doctor} · {visit.date}
                  </Typography>
                </Box>
                {!isOpen ? (
                  <Box
                    sx={{
                      display: { xs: "none", sm: "block" },
                      mr: 0.5,
                      flexShrink: 0,
                    }}
                  >
                    <StatusChip status={visit.status} />
                  </Box>
                ) : null}
                <ExpandMoreRoundedIcon
                  sx={{
                    color: G.secondary,
                    fontSize: 23,
                    flexShrink: 0,
                    transform: isOpen ? "rotate(180deg)" : "none",
                    transition: "transform 180ms ease",
                  }}
                />
              </Box>

              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box sx={{ px: 0.5, pb: 1.75 }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => onOpenVisit(visit.id)}
                  sx={{
                    appearance: "none",
                    border: 0,
                    margin: 0,
                    background: G.surface,
                    font: "inherit",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    borderRadius: "12px",
                    p: 2,
                    color: "inherit",
                    outline: "none",
                    transition: "background-color 120ms ease, box-shadow 120ms ease",
                    "&:hover": {
                      bgcolor: "#eef2f6",
                    },
                    "&:focus-visible": {
                      boxShadow: `0 0 0 2px ${G.blueSoft}`,
                    },
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    sx={{
                      alignItems: { sm: "center" },
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.25}
                      sx={{ alignItems: "center" }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: G.blue,
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {visit.doctor
                          .replace(/^Bác sĩ\s+/i, "")
                          .split(" ")
                          .slice(-2)
                          .map((w) => w[0])
                          .join("")}
                      </Avatar>
                      <Box>
                        <Typography
                          sx={{ fontSize: 15, fontWeight: 500, color: G.ink }}
                        >
                          {visit.doctor}
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: G.secondary }}>
                          {visit.department}
                        </Typography>
                      </Box>
                    </Stack>
                    <Box
                      sx={{
                        borderRadius: "24px",
                        bgcolor: "#fff",
                        color: G.ink,
                        border: "none",
                        boxShadow: "0 0 0 1px rgba(60,64,67,0.12)",
                        fontWeight: 500,
                        fontSize: 14.5,
                        px: 2,
                        height: 36,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      Xem kết quả
                    </Box>
                  </Stack>

                  <Box
                    sx={{
                      display: "grid",
                      gap: 1.1,
                      gridTemplateColumns: { xs: "1fr", sm: "140px 1fr" },
                    }}
                  >
                    {[
                      { label: "Ngày khám", value: visit.date },
                      { label: "Chuyên khoa", value: visit.department },
                      {
                        label: "Dịch vụ",
                        value:
                          visit.previews.map((p) => p.title).join(", ") || "—",
                      },
                      {
                        label: "Kết luận",
                        value: visit.conclusion ?? visit.status,
                      },
                    ].map((row) => (
                      <Box key={row.label} sx={{ display: "contents" }}>
                        <Typography
                          sx={{
                            fontSize: 14,
                            color: G.secondary,
                            pt: 0.15,
                            fontWeight: 400,
                          }}
                        >
                          {row.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 15,
                            color: G.ink,
                            fontWeight: 400,
                            lineHeight: 1.55,
                          }}
                        >
                          {row.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </SoftCard>
    </Box>
  );
}
