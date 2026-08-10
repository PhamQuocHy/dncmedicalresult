"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";
import AirOutlinedIcon from "@mui/icons-material/AirOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import type { FunctionalResultItem, Patient } from "@/types";
import { ScrollableTabBar } from "@/components/ui/ScrollableTabBar";
import { CARD_RADIUS, G, SHADOW } from "@/theme/dashboardTokens";

type Props = {
  patient: Patient;
  items: FunctionalResultItem[];
  visitMeta?: {
    date: string;
    department: string;
    doctor: string;
  };
};

const TABS = [
  { id: "all", label: "Tất cả" },
  { id: "echo", label: "Siêu âm" },
  { id: "endo", label: "Nội soi" },
  { id: "spiro", label: "Hô hấp" },
] as const;

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

function GoogleIcon({
  Icon,
  color,
  bg,
  size = 40,
}: {
  Icon: SvgIconComponent;
  color: string;
  bg: string;
  size?: number;
}) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "12px",
        bgcolor: bg,
        color,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: size * 0.52 }} />
    </Box>
  );
}

function VitalCell({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
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
          fontSize: { xs: 23, sm: 25 },
          fontWeight: 500,
          color: valueColor ?? G.ink,
          letterSpacing: "-0.01em",
          lineHeight: 1.25,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Stack spacing={0.35}>
      <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: G.secondary }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "8px",
            bgcolor: G.surface,
            display: "grid",
            placeItems: "center",
            color: G.secondary,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ fontSize: 15, fontWeight: 500, color: G.ink }}>
          {value}
        </Typography>
      </Stack>
    </Stack>
  );
}

function itemKind(item: FunctionalResultItem): "echo" | "endo" | "spiro" {
  if (item.kind) return item.kind;
  if (item.id.includes("echo")) return "echo";
  if (item.id.includes("endo")) return "endo";
  return "spiro";
}

const kindMeta: Record<
  "echo" | "endo" | "spiro",
  { Icon: SvgIconComponent; color: string; bg: string }
> = {
  echo: {
    Icon: MonitorHeartOutlinedIcon,
    color: G.blueInk,
    bg: G.blueSoft,
  },
  endo: {
    Icon: ScienceOutlinedIcon,
    color: G.green,
    bg: G.greenSoft,
  },
  spiro: {
    Icon: AirOutlinedIcon,
    color: G.amber,
    bg: G.amberSoft,
  },
};

export function FunctionalResultList({ patient, items, visitMeta }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const [openIds, setOpenIds] = useState<string[]>(() =>
    items[0] ? [items[0].id] : [],
  );
  const [preview, setPreview] = useState<{ src: string; title: string } | null>(
    null,
  );
  const age = calcAge(patient.dateOfBirth);

  const filtered = useMemo(
    () =>
      tab === "all" ? items : items.filter((item) => itemKind(item) === tab),
    [items, tab],
  );

  const approvedCount = items.filter((i) => i.status === "approved").length;
  const pendingCount = items.filter((i) => i.status === "pending").length;

  return (
    <Stack spacing={2.25}>
      <Box
        sx={{
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
                    lineHeight: 1.25,
                  }}
                >
                  {patient.fullName}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.35,
                    fontSize: 14,
                    color: G.secondary,
                    lineHeight: 1.4,
                  }}
                >
                  {patient.gender}
                  {age != null ? ` · ${age} tuổi` : ""} · {patient.dateOfBirth}
                  {" · "}
                  <Box
                    component="span"
                    sx={{ color: G.blue, fontWeight: 500 }}
                  >
                    Mã KCB: {patient.maKcb}
                  </Box>
                </Typography>

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
              <VitalCell label="Tổng kết quả" value={String(items.length)} />
              <VitalCell
                label="Đã duyệt"
                value={String(approvedCount)}
                valueColor={G.green}
              />
              <VitalCell
                label="Đang chờ"
                value={String(pendingCount)}
                valueColor={pendingCount > 0 ? G.amber : G.ink}
              />
              <VitalCell
                label="Có hình ảnh"
                value={String(items.filter((i) => i.images?.length).length)}
              />
            </Box>
          </Box>

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
                mb: 1.5,
                lineHeight: 1.3,
              }}
            >
              Kết quả thăm dò chức năng
            </Typography>

            <Stack spacing={1.35} sx={{ flex: 1 }}>
              <MetaRow
                label="Bác sĩ"
                value={visitMeta?.doctor ?? "—"}
                icon={<PersonOutlineRoundedIcon sx={{ fontSize: 17 }} />}
              />
              <MetaRow
                label="Khoa"
                value={visitMeta?.department ?? "—"}
                icon={<LocalHospitalOutlinedIcon sx={{ fontSize: 17 }} />}
              />
              <MetaRow
                label="Ngày khám"
                value={visitMeta?.date ?? "—"}
                icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 17 }} />}
              />
            </Stack>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: CARD_RADIUS,
          boxShadow: SHADOW,
          border: "none",
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: { xs: 1.5, sm: 2.5 }, pt: 1 }}>
          <ScrollableTabBar tabs={TABS} value={tab} onChange={setTab} />
        </Box>
        <Divider sx={{ borderColor: "rgba(218,220,224,0.65)" }} />

        <Box sx={{ p: { xs: 1.5, sm: 2.25 } }}>
          {filtered.length === 0 ? (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
                color: G.secondary,
                fontSize: 15,
              }}
            >
              Chưa có kết quả trong nhóm này.
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {filtered.map((item) => {
                const open = openIds.includes(item.id);
                const kind = itemKind(item);
                const meta = kindMeta[kind];
                const approved = item.status === "approved";

                return (
                  <Box
                    key={item.id}
                    sx={{
                      border: "none",
                      borderRadius: "12px",
                      overflow: "hidden",
                      bgcolor: open ? "#fff" : "#f8f9fa",
                      boxShadow: open
                        ? "0 0 0 1px rgba(218,220,224,0.85)"
                        : "none",
                    }}
                  >
                    <Box
                      component="button"
                      type="button"
                      onClick={() =>
                        setOpenIds((prev) =>
                          open
                            ? prev.filter((id) => id !== item.id)
                            : [...prev, item.id],
                        )
                      }
                      sx={{
                        all: "unset",
                        cursor: "pointer",
                        display: "flex",
                        width: "100%",
                        boxSizing: "border-box",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1.5,
                        px: 1.75,
                        py: 1.4,
                        bgcolor: open ? "#fff" : G.surface,
                        transition: "background-color 120ms ease",
                        "&:hover": {
                          bgcolor: open ? G.surface : "#e8eaed",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.35}
                        sx={{ alignItems: "center", minWidth: 0 }}
                      >
                        <GoogleIcon
                          Icon={meta.Icon}
                          color={meta.color}
                          bg={meta.bg}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: 16,
                              fontWeight: 500,
                              color: G.ink,
                              lineHeight: 1.3,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.25,
                              fontSize: 14,
                              color: G.secondary,
                            }}
                          >
                            {item.datetime}
                          </Typography>
                        </Box>
                      </Stack>
                      {open ? (
                        <ExpandLessRoundedIcon sx={{ color: G.secondary }} />
                      ) : (
                        <ExpandMoreRoundedIcon sx={{ color: G.secondary }} />
                      )}
                    </Box>

                    <Collapse in={open}>
                      <Box
                        sx={{
                          px: { xs: 1.75, sm: 2.25 },
                          pb: 2.25,
                          pt: 0.5,
                        }}
                      >
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: "flex-end",
                            mb: 1.75,
                          }}
                        >
                          <Chip
                            size="small"
                            icon={
                              approved ? (
                                <CheckCircleOutlineRoundedIcon
                                  sx={{ fontSize: "18px !important" }}
                                />
                              ) : (
                                <HourglassEmptyRoundedIcon
                                  sx={{ fontSize: "18px !important" }}
                                />
                              )
                            }
                            label={item.statusLabel}
                            sx={{
                              ...chipBaseSx,
                              height: 32,
                              bgcolor: approved ? G.greenSoft : G.amberSoft,
                              color: approved ? G.green : G.amber,
                              border: approved
                                ? "1px solid rgba(19,115,51,0.16)"
                                : "1px solid rgba(176,96,0,0.2)",
                              fontSize: 14,
                              "& .MuiChip-icon": {
                                ...chipBaseSx["& .MuiChip-icon"],
                                color: approved ? G.green : G.amber,
                              },
                            }}
                          />
                        </Stack>

                        <Box
                          sx={{
                            display: "grid",
                            gap: 2.5,
                            gridTemplateColumns: {
                              xs: "1fr",
                              lg: item.images?.length
                                ? "minmax(0, 1.35fr) minmax(220px, 0.9fr)"
                                : "1fr",
                            },
                          }}
                        >
                          <Box>
                            <Stack
                              direction="row"
                              spacing={1.15}
                              sx={{ alignItems: "center", mb: 1.15 }}
                            >
                              <GoogleIcon
                                Icon={FactCheckOutlinedIcon}
                                color={G.blueInk}
                                bg={G.blueSoft}
                                size={36}
                              />
                              <Typography
                                sx={{
                                  fontSize: 16,
                                  fontWeight: 500,
                                  color: G.ink,
                                }}
                              >
                                Kết luận
                              </Typography>
                            </Stack>
                            <Typography
                              sx={{
                                fontSize: 15,
                                color: G.secondary,
                                lineHeight: 1.7,
                              }}
                            >
                              {item.conclusion}
                            </Typography>

                            {item.tags?.length ? (
                              <Stack
                                direction="row"
                                spacing={0.85}
                                useFlexGap
                                sx={{ flexWrap: "wrap", mt: 2 }}
                              >
                                {item.tags.map((tag) => {
                                  const warn = tag.tone === "warning";
                                  return (
                                    <Chip
                                      key={tag.label}
                                      size="small"
                                      label={tag.label}
                                      sx={{
                                        ...chipBaseSx,
                                        height: 28,
                                        bgcolor: warn
                                          ? G.amberSoft
                                          : "#f1f3f4",
                                        color: warn ? G.amber : G.secondary,
                                        border: warn
                                          ? "1px solid rgba(176,96,0,0.2)"
                                          : "1px solid rgba(218,220,224,0.8)",
                                      }}
                                    />
                                  );
                                })}
                              </Stack>
                            ) : null}

                            {item.metrics?.length ? (
                              <Box
                                sx={{
                                  mt: 2.25,
                                  display: "grid",
                                  gap: 1.15,
                                  gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(3, 1fr)",
                                  },
                                }}
                              >
                                {item.metrics.map((m) => (
                                  <Box
                                    key={m.label}
                                    sx={{
                                      bgcolor: "#f8f9fa",
                                      borderRadius: "12px",
                                      px: 1.5,
                                      py: 1.35,
                                      textAlign: "center",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: G.secondary,
                                      }}
                                    >
                                      {m.label}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        mt: 0.5,
                                        fontSize: 15,
                                        fontWeight: 500,
                                        color: G.ink,
                                      }}
                                    >
                                      {m.value}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            ) : null}
                          </Box>

                          {item.images?.length ? (
                            <Box>
                              <Typography
                                sx={{
                                  mb: 1.25,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  color: G.secondary,
                                }}
                              >
                                Hình ảnh ({item.images.length})
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                useFlexGap
                                sx={{ flexWrap: "wrap" }}
                              >
                                {item.images.map((img) => (
                                  <Box
                                    key={img.id}
                                    component="button"
                                    type="button"
                                    onClick={() =>
                                      setPreview({
                                        src: img.src,
                                        title: item.title,
                                      })
                                    }
                                    sx={{
                                      all: "unset",
                                      cursor: "pointer",
                                      position: "relative",
                                      width: 112,
                                      height: 88,
                                      borderRadius: "10px",
                                      overflow: "hidden",
                                      bgcolor: "#000",
                                      boxShadow:
                                        "0 0 0 1px rgba(218,220,224,0.85)",
                                      transition: "transform 120ms ease",
                                      "&:hover": {
                                        transform: "scale(1.02)",
                                        boxShadow: `0 0 0 2px ${G.blue}`,
                                      },
                                    }}
                                  >
                                    <Box
                                      component="img"
                                      src={img.src}
                                      alt=""
                                      sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                      }}
                                    />
                                  </Box>
                                ))}
                              </Stack>
                            </Box>
                          ) : null}
                        </Box>
                      </Box>
                    </Collapse>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>

      <Dialog
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#111",
              borderRadius: "12px",
              overflow: "hidden",
            },
          },
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.5,
            py: 1,
            bgcolor: "#202124",
          }}
        >
          <Typography sx={{ fontSize: 15, color: "rgba(255,255,255,0.85)" }}>
            {preview?.title}
          </Typography>
          <IconButton
            aria-label="Đóng"
            onClick={() => setPreview(null)}
            sx={{ color: "rgba(255,255,255,0.8)" }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
        {preview ? (
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              p: 2,
              minHeight: 360,
              bgcolor: "#000",
            }}
          >
            <Box
              component="img"
              src={preview.src}
              alt={preview.title}
              sx={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
          </Box>
        ) : null}
      </Dialog>
    </Stack>
  );
}
