"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import BloodtypeOutlinedIcon from "@mui/icons-material/BloodtypeOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import type { LabIndicator, LabResultDetail, Patient } from "@/types";
import { ScrollableTabBar } from "@/components/ui/ScrollableTabBar";
import { CARD_RADIUS, G, SHADOW } from "@/theme/dashboardTokens";

type Props = {
  patient: Patient;
  detail: LabResultDetail;
};

const TABS = [
  { id: "blood", label: "Xét nghiệm máu" },
  { id: "urine", label: "Xét nghiệm nước tiểu" },
  { id: "fluid", label: "Xét nghiệm dịch cơ thể" },
] as const;

const chipBaseSx = {
  height: 28,
  borderRadius: "8px",
  fontSize: 13.5,
  fontWeight: 500,
  letterSpacing: "0.01em",
  "& .MuiChip-icon": { ml: "8px", mr: "-2px" },
  "& .MuiChip-label": { px: 1 },
} as const;

/** Icon tonal bo góc — đồng bộ Google UI với Latest / Imaging */
function GoogleIcon({
  Icon,
  color,
  bg,
  size = 36,
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
      <Icon sx={{ fontSize: size * 0.55 }} />
    </Box>
  );
}

const categoryIconMeta: Record<
  string,
  { Icon: SvgIconComponent; color: string; bg: string }
> = {
  hematology: {
    Icon: BloodtypeOutlinedIcon,
    color: G.blueInk,
    bg: G.blueSoft,
  },
  biochemistry: {
    Icon: ScienceOutlinedIcon,
    color: G.green,
    bg: G.greenSoft,
  },
};

const defaultCategoryIcon = {
  Icon: ScienceOutlinedIcon,
  color: G.blueInk,
  bg: G.blueSoft,
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
          fontSize: { xs: 19, sm: 21 },
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

function flagOf(row: LabIndicator) {
  if (row.status === "critical") return "!!";
  if (row.status === "low") return "L";
  if (row.status === "high") return "H";
  return "";
}

const labTableHeadCellSx = {
  fontWeight: 500,
  fontSize: 13,
  color: G.secondary,
  borderColor: "rgba(218,220,224,0.55)",
  bgcolor: "#fafafa",
  py: 1,
} as const;

/** Cột số liệu gom gọn bên phải, không để dư khoảng trống. */
const labTableColSx = {
  name: {
    width: { xs: "38%", sm: "45%" },
    minWidth: 0,
    pr: { xs: 0.75, sm: 1 },
  },
  result: {
    width: { xs: "16%", sm: "15%" },
    textAlign: "center",
    px: 0.5,
    whiteSpace: "nowrap",
  },
  ref: {
    width: { xs: "28%", sm: "23%" },
    textAlign: "center",
    px: 0.5,
    whiteSpace: "nowrap",
  },
  unit: {
    width: { xs: "16%", sm: "17%" },
    textAlign: "center",
    px: 0.75,
    whiteSpace: "nowrap",
  },
} as const;

export function LabResultView({ patient, detail }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("blood");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(detail.categories.map((c, i) => [c.id, i === 0])),
  );
  const age = calcAge(patient.dateOfBirth);
  const indicators = detail.categories.flatMap((c) => c.indicators);
  const totalCount = indicators.length;
  const normalCount = indicators.filter((i) => i.status === "normal").length;
  const abnormalCount = indicators.filter(
    (i) => i.status === "low" || i.status === "high" || i.status === "critical",
  ).length;
  const criticalCount = indicators.filter(
    (i) => i.status === "critical",
  ).length;

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
              <VitalCell label="Tổng chỉ số" value={String(totalCount)} />
              <VitalCell
                label="Trong ngưỡng"
                value={String(normalCount)}
                valueColor={G.green}
              />
              <VitalCell
                label="Ngoài ngưỡng"
                value={String(abnormalCount)}
                valueColor={abnormalCount > 0 ? G.amber : G.ink}
              />
              <VitalCell
                label="Cảnh báo"
                value={String(criticalCount)}
                valueColor={criticalCount > 0 ? G.red : G.ink}
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
              label="Đã xác minh"
              size="small"
              sx={{
                ...chipBaseSx,
                alignSelf: "flex-start",
                height: 32,
                mb: 1.5,
                bgcolor: G.greenSoft,
                color: G.green,
                border: "none",
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
              {detail.title}
            </Typography>

            <Stack spacing={1.35} sx={{ flex: 1 }}>
              <MetaRow
                label="Thời gian lấy mẫu"
                value={detail.collectedAt}
                icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 17 }} />}
              />
              <MetaRow
                label="Thời gian xác minh"
                value={detail.verifiedAt}
                icon={<FactCheckOutlinedIcon sx={{ fontSize: 17 }} />}
              />
              <MetaRow
                label="Bác sĩ ký duyệt"
                value={detail.verifiedBy}
                icon={<PersonOutlineRoundedIcon sx={{ fontSize: 17 }} />}
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

        {/* Meta gọn — một dòng, không hộp xám */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 3 }}
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 1.5,
            alignItems: { sm: "center" },
            borderBottom: `1px solid rgba(218,220,224,0.65)`,
          }}
        >
          <Stack
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "baseline", minWidth: 0 }}
          >
            <Typography sx={{ fontSize: 14, color: G.secondary, flexShrink: 0 }}>
              Mã mẫu
            </Typography>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 500,
                color: G.ink,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                letterSpacing: "0.02em",
              }}
            >
              {detail.sampleId}
            </Typography>
          </Stack>

          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              width: 4,
              height: 4,
              borderRadius: "50%",
              bgcolor: G.outline,
              flexShrink: 0,
            }}
          />

          <Stack
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "center", minWidth: 0 }}
          >
            <Typography sx={{ fontSize: 14, color: G.secondary, flexShrink: 0 }}>
              Thiết bị
            </Typography>
            <Stack
              direction="row"
              spacing={0.75}
              sx={{ alignItems: "center", minWidth: 0 }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "8px",
                  bgcolor: G.blueSoft,
                  color: G.blueInk,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <ScienceOutlinedIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: G.ink,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {detail.equipment || "—"}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Box sx={{ p: { xs: 1.5, sm: 2.25 } }}>
          {tab !== "blood" ? (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
                color: G.secondary,
                fontSize: 15,
              }}
            >
              Chưa có dữ liệu demo cho tab này.
            </Box>
          ) : (
            <Stack spacing={1.25}>
              {detail.categories.map((cat) => {
                const open = openCats[cat.id];
                const iconMeta = categoryIconMeta[cat.id] ?? defaultCategoryIcon;
                return (
                  <Box
                    key={cat.id}
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
                        setOpenCats((prev) => ({
                          ...prev,
                          [cat.id]: !open,
                        }))
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
                        py: 1.25,
                        bgcolor: open ? "#fff" : G.surface,
                        transition: "background-color 120ms ease",
                        "&:hover": { bgcolor: open ? G.surface : "#e8eaed" },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.25}
                        sx={{ alignItems: "center", minWidth: 0 }}
                      >
                        <GoogleIcon
                          Icon={iconMeta.Icon}
                          color={iconMeta.color}
                          bg={iconMeta.bg}
                          size={36}
                        />
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 500,
                            color: G.ink,
                            lineHeight: 1.3,
                          }}
                        >
                          {cat.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${cat.indicators.length} chỉ số`}
                          sx={{
                            height: 22,
                            fontSize: 12.5,
                            fontWeight: 500,
                            bgcolor: "#fff",
                            border: "none",
                            color: G.secondary,
                            "& .MuiChip-label": { px: 0.9 },
                          }}
                        />
                      </Stack>
                      {open ? (
                        <ExpandLessRoundedIcon sx={{ color: G.secondary }} />
                      ) : (
                        <ExpandMoreRoundedIcon sx={{ color: G.secondary }} />
                      )}
                    </Box>

                    <Collapse in={open}>
                      <TableContainer sx={{ overflowX: "auto" }}>
                        <Table
                          size="medium"
                          sx={{
                            width: "100%",
                            tableLayout: "fixed",
                            "& .MuiTableCell-root": {
                              borderColor: "rgba(218,220,224,0.55)",
                            },
                          }}
                          aria-label={`Bảng ${cat.name}`}
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  ...labTableHeadCellSx,
                                  ...labTableColSx.name,
                                  letterSpacing: "0.02em",
                                }}
                              >
                                Chỉ số
                              </TableCell>
                              <TableCell
                                sx={{
                                  ...labTableHeadCellSx,
                                  ...labTableColSx.result,
                                }}
                              >
                                Kết quả
                              </TableCell>
                              <TableCell
                                sx={{
                                  ...labTableHeadCellSx,
                                  ...labTableColSx.ref,
                                  fontSize: { xs: 12.5, sm: 13 },
                                  lineHeight: 1.35,
                                }}
                              >
                                Khoảng tham chiếu
                              </TableCell>
                              <TableCell
                                sx={{
                                  ...labTableHeadCellSx,
                                  ...labTableColSx.unit,
                                  fontSize: { xs: 12.5, sm: 13 },
                                  lineHeight: 1.35,
                                }}
                              >
                                Đơn vị tính
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {cat.indicators.map((row) => {
                              const abnormal = Boolean(flagOf(row));
                              return (
                                <TableRow
                                  key={row.id}
                                  hover
                                  sx={{
                                    "&:last-child td": { borderBottom: 0 },
                                  }}
                                >
                                  <TableCell
                                    sx={{
                                      color: G.ink,
                                      borderColor: "rgba(218,220,224,0.55)",
                                      fontSize: 15,
                                      py: 1.25,
                                      ...labTableColSx.name,
                                    }}
                                  >
                                    {row.name}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: 500,
                                      fontVariantNumeric: "tabular-nums",
                                      color: abnormal ? G.red : G.ink,
                                      borderColor: "rgba(218,220,224,0.55)",
                                      fontSize: 15,
                                      py: 1.25,
                                      ...labTableColSx.result,
                                    }}
                                  >
                                    {row.result}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      color: G.secondary,
                                      fontVariantNumeric: "tabular-nums",
                                      borderColor: "rgba(218,220,224,0.55)",
                                      fontSize: 14.5,
                                      py: 1.25,
                                      ...labTableColSx.ref,
                                    }}
                                  >
                                    {row.refMin} – {row.refMax}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      color: G.secondary,
                                      borderColor: "rgba(218,220,224,0.55)",
                                      fontSize: 14.5,
                                      py: 1.25,
                                      ...labTableColSx.unit,
                                    }}
                                  >
                                    {row.unit}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Collapse>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>

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
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ alignItems: "center", mb: 1.25 }}
        >
          <GoogleIcon
            Icon={FactCheckOutlinedIcon}
            color={G.blueInk}
            bg={G.blueSoft}
            size={36}
          />
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: G.ink }}>
            Kết luận
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: 15, lineHeight: 1.7, color: G.secondary }}>
          {detail.conclusion}
        </Typography>
        {detail.criticalAlert ? (
          <Box
            sx={{
              mt: 1.5,
              px: 1.5,
              py: 1.15,
              borderRadius: "8px",
              bgcolor: G.redSoft,
              border: "1px solid rgba(197,34,31,0.16)",
            }}
          >
            <Typography sx={{ fontSize: 14.5, fontWeight: 500, color: G.red }}>
              {detail.criticalAlert.name}: {detail.criticalAlert.value}{" "}
              {detail.criticalAlert.unit} (TC {detail.criticalAlert.ref})
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Stack>
  );
}
