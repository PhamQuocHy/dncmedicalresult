"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import type {
  LabResultDetail,
  Patient,
  Visit,
  VisitPreview,
  VisitPreviewKind,
} from "@/types";
import {
  CARD_RADIUS,
  G,
  SHADOW,
} from "@/theme/dashboardTokens";

type Props = {
  patient: Patient;
  visit: Visit;
  lab: LabResultDetail;
  onDownload?: () => void;
};

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

/** Leading icon kiểu Google Drive / Photos — rounded square + tonal */
const kindMeta: Record<
  VisitPreviewKind,
  { Icon: SvgIconComponent; color: string; bg: string }
> = {
  lab: {
    Icon: ScienceOutlinedIcon,
    color: G.blueInk,
    bg: G.blueSoft,
  },
  imaging: {
    Icon: ImageOutlinedIcon,
    color: G.green,
    bg: G.greenSoft,
  },
  functional: {
    Icon: MonitorHeartOutlinedIcon,
    color: G.amber,
    bg: G.amberSoft,
  },
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

function ResultRow({ preview }: { preview: VisitPreview }) {
  const { Icon, color, bg } = kindMeta[preview.kind];

  return (
    <Box
      component={Link}
      href={preview.detailHref}
      aria-label={`Xem ${preview.title}: ${preview.subtitle}`}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.75,
        width: "100%",
        boxSizing: "border-box",
        px: { xs: 2, sm: 2.5 },
        py: { xs: 1.65, sm: 1.5 },
        minHeight: { xs: 72, sm: 64 },
        textDecoration: "none",
        color: "inherit",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        cursor: "pointer",
        transition: "background-color 120ms ease",
        "&:hover": {
          bgcolor: G.blueSoft,
          "& .chevron": { color: G.blue, transform: "translateX(2px)" },
        },
        "&:active": {
          bgcolor: G.blueSoft,
        },
        "& *": {
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "12px",
          bgcolor: bg,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 23, color }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 500,
            color: G.ink,
            letterSpacing: "0.01em",
            lineHeight: 1.35,
          }}
        >
          {preview.title}
        </Typography>
        <Typography
          sx={{
            mt: 0.35,
            fontSize: 14,
            color: G.secondary,
            lineHeight: 1.45,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {preview.subtitle}
        </Typography>
      </Box>

      <Typography
        sx={{
          display: { xs: "none", sm: "block" },
          fontSize: 14,
          fontWeight: 500,
          color: G.blue,
          flexShrink: 0,
          mr: 0.25,
        }}
      >
        Xem
      </Typography>
      <ChevronRightRoundedIcon
        className="chevron"
        sx={{
          fontSize: 21,
          color: G.outline,
          flexShrink: 0,
          transition: "color 120ms ease, transform 120ms ease",
        }}
      />
    </Box>
  );
}

export function LatestResultsView({
  patient,
  visit,
  lab,
  onDownload,
}: Props) {
  const age = calcAge(patient.dateOfBirth);
  const glucose = lab.categories
    .flatMap((c) => c.indicators)
    .find((i) => i.id === "glucose");

  return (
    <Stack spacing={2.25}>
      {/* Hero — gọn, hai cột sát nhau hơn */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: CARD_RADIUS,
          bgcolor: "#fff",
          boxShadow: SHADOW,
          border: "none",
          backgroundImage:
            "radial-gradient(ellipse 70% 100% at 100% 0%, rgba(26,115,232,0.1), transparent 55%)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 300px" },
            gap: 0,
          }}
        >
          {/* Patient */}
          <Box sx={{ p: { xs: 2, sm: 2.25 }, minWidth: 0 }}>
            <Stack direction="row" spacing={1.75} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
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

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 19, sm: 21 },
                    fontWeight: 500,
                    color: G.ink,
                    letterSpacing: "0",
                    lineHeight: 1.25,
                  }}
                >
                  {patient.fullName}
                </Typography>
                <Box sx={{ mt: 0.35, fontSize: 14, lineHeight: 1.4 }}>
                  <Typography
                    component="span"
                    sx={{ fontSize: 14, color: G.secondary, lineHeight: 1.4 }}
                  >
                    {patient.gender}
                    {age != null ? ` · ${age} tuổi` : ""} · {patient.dateOfBirth}
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      display: { xs: "block", sm: "inline" },
                      mt: { xs: 0.25, sm: 0 },
                      color: G.blue,
                      fontWeight: 500,
                      fontSize: 14,
                      lineHeight: 1.4,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: { xs: "none", sm: "inline" },
                        color: G.secondary,
                        fontWeight: 400,
                      }}
                    >
                      {" · "}
                    </Box>
                    Mã KCB: {patient.maKcb}
                  </Box>
                </Box>

                {patient.allergies.length > 0 ? (
                  <Stack
                    direction="row"
                    spacing={0.75}
                    useFlexGap
                    sx={{ flexWrap: "wrap", mt: 1 }}
                  >
                    {patient.allergies.map((a) => {
                      const danger = a.severity === "danger";
                      return (
                        <Chip
                          key={a.name}
                          size="small"
                          variant="outlined"
                          icon={
                            <WarningAmberRoundedIcon
                              sx={{ fontSize: "16px !important" }}
                            />
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
                ) : null}
              </Box>
            </Stack>

            <Box
              sx={{
                mt: 1.5,
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
          </Box>

          {/* Visit */}
          <Box
            sx={{
              p: { xs: 2, sm: 2.25 },
              borderTop: { xs: `1px solid rgba(218,220,224,0.7)`, md: "none" },
              borderLeft: { md: `1px solid rgba(218,220,224,0.7)` },
              bgcolor: "rgba(248,250,252,0.65)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Chip
              icon={
                <CheckCircleOutlineRoundedIcon
                  sx={{ fontSize: "18px !important" }}
                />
              }
              label="Đã có kết quả"
              size="small"
              sx={{
                ...chipBaseSx,
                alignSelf: "flex-start",
                height: 32,
                mb: 1.5,
                bgcolor: G.greenSoft,
                color: G.green,
                borderColor: "rgba(19,115,51,0.16)",
                border: "1px solid rgba(19,115,51,0.16)",
                fontSize: 14,
                "& .MuiChip-icon": {
                  ...chipBaseSx["& .MuiChip-icon"],
                  color: G.green,
                },
              }}
            />

            <Typography
              sx={{
                fontSize: { xs: 19, sm: 21 },
                fontWeight: 500,
                color: G.ink,
                letterSpacing: "0",
                lineHeight: 1.3,
                mb: 1.5,
              }}
            >
              {visit.title}
            </Typography>

            <Stack spacing={1.15} sx={{ flex: 1, mb: 2 }}>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "8px",
                    bgcolor: G.surface,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <CalendarTodayOutlinedIcon
                    sx={{ fontSize: 17, color: G.secondary }}
                  />
                </Box>
                <Typography sx={{ fontSize: 16, fontWeight: 400, color: G.ink }}>
                  {visit.date}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "8px",
                    bgcolor: G.surface,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <PersonOutlineRoundedIcon
                    sx={{ fontSize: 18, color: G.secondary }}
                  />
                </Box>
                <Typography sx={{ fontSize: 16, fontWeight: 400, color: G.ink }}>
                  {visit.doctor}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "8px",
                    bgcolor: G.surface,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <LocalHospitalOutlinedIcon
                    sx={{ fontSize: 17, color: G.secondary }}
                  />
                </Box>
                <Typography sx={{ fontSize: 16, fontWeight: 400, color: G.ink }}>
                  {visit.department}
                </Typography>
              </Stack>
            </Stack>

            <Button
              fullWidth
              startIcon={<DownloadRoundedIcon />}
              onClick={onDownload}
              sx={{
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
              Tải xuống kết quả
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Results list */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: CARD_RADIUS,
          boxShadow: SHADOW,
          border: "none",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 1.75,
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
            Chi tiết kết quả
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 14, color: G.secondary }}>
            {visit.previews.length} nhóm kết quả · chọn để xem đầy đủ
          </Typography>
        </Box>

        <Stack divider={<Divider sx={{ borderColor: "rgba(218,220,224,0.65)" }} />}>
          {visit.previews.map((preview) => (
            <ResultRow key={preview.id} preview={preview} />
          ))}
        </Stack>
      </Box>

      {visit.conclusion ? (
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: CARD_RADIUS,
            boxShadow: SHADOW,
            border: "none",
            px: { xs: 2.25, sm: 2.75 },
            py: 2.25,
          }}
        >
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", mb: 1.25 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                bgcolor: G.blueSoft,
                display: "grid",
                placeItems: "center",
              }}
            >
              <FactCheckOutlinedIcon sx={{ fontSize: 19, color: G.blueInk }} />
            </Box>
            <Typography sx={{ fontSize: 15, fontWeight: 500, color: G.ink }}>
              Kết luận của bác sĩ
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 15, lineHeight: 1.7, color: G.secondary }}>
            {visit.conclusion}
          </Typography>
        </Box>
      ) : null}
    </Stack>
  );
}
