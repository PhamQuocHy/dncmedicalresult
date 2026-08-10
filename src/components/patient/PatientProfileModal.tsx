"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import { FiCreditCard, FiMapPin, FiUser, FiX } from "react-icons/fi";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Patient } from "@/types";
import { G } from "@/theme/dashboardTokens";

type Props = {
  open: boolean;
  patient: Patient;
  onClose: () => void;
};

type SectionId = "personal" | "contact" | "idcard";

const MENU: {
  id: SectionId;
  label: string;
  Icon: IconType;
}[] = [
  { id: "personal", label: "Thông tin cá nhân", Icon: FiUser },
  { id: "contact", label: "Liên hệ & địa chỉ", Icon: FiMapPin },
  { id: "idcard", label: "Thông tin BHYT", Icon: FiCreditCard },
];

const MODAL_HEIGHT = 600;

const cardSx = {
  bgcolor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 1px 2px rgba(60,64,67,0.08), 0 1px 3px 1px rgba(60,64,67,0.06)",
  overflow: "hidden",
} as const;

function InfoRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        px: { xs: 1.75, sm: 2.25 },
        py: { xs: 1.25, sm: 1.85 },
        borderBottom: last ? "none" : "1px solid rgba(218,220,224,0.65)",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 15.5, sm: 17 },
          color: G.secondary,
          flexShrink: 0,
          fontWeight: 400,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: 15.5, sm: 17 },
          fontWeight: 400,
          color: G.ink,
          textAlign: "right",
          lineHeight: 1.4,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function InfoCard({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <Box sx={cardSx}>
      {rows.map((row, i) => (
        <InfoRow
          key={row.label}
          label={row.label}
          value={row.value}
          last={i === rows.length - 1}
        />
      ))}
    </Box>
  );
}

function sectionTitle(id: SectionId) {
  return MENU.find((m) => m.id === id)?.label ?? "Thông tin";
}

export function PatientProfileModal({ open, patient, onClose }: Props) {
  const [section, setSection] = useState<SectionId>("personal");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      scroll="paper"
      sx={{
        "& .MuiDialog-container": {
          alignItems: { xs: "flex-end", sm: "center" },
        },
      }}
      slotProps={{
        paper: {
          sx: {
            m: { xs: 0, sm: 4 },
            width: { xs: "100%", sm: 780 },
            maxWidth: "100%",
            height: MODAL_HEIGHT,
            maxHeight: { xs: "min(600px, 88dvh)", sm: MODAL_HEIGHT },
            borderRadius: { xs: "20px 20px 0 0", sm: "16px" },
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(60,64,67,0.32)",
          },
        },
        backdrop: {
          sx: { bgcolor: "rgba(32,33,36,0.52)" },
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "230px minmax(0, 1fr)" },
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            bgcolor: "#fff",
            borderRight: "1px solid rgba(218,220,224,0.75)",
            px: 1.75,
            pt: 2.25,
            pb: 2,
          }}
        >
          <Typography
            sx={{
              px: 1.5,
              mb: 2,
              fontSize: 23,
              fontWeight: 400,
              color: G.ink,
              letterSpacing: "-0.01em",
            }}
          >
            Hồ sơ
          </Typography>
          <Stack spacing={0.5}>
            {MENU.map(({ id, label, Icon }) => {
              const active = section === id;
              return (
                <Box
                  key={id}
                  component="button"
                  type="button"
                  onClick={() => setSection(id)}
                  sx={{
                    appearance: "none",
                    border: 0,
                    margin: 0,
                    font: "inherit",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: "10px",
                    bgcolor: active ? G.blueSoft : "transparent",
                    color: active ? G.blue : G.secondary,
                    transition: "background-color 120ms ease, color 120ms ease",
                    "&:hover": {
                      bgcolor: active ? G.blueSoft : "#f1f3f4",
                      color: active ? G.blue : G.ink,
                    },
                  }}
                >
                  <Icon size={20} strokeWidth={1.75} />
                  <Typography
                    sx={{
                      fontSize: 16.5,
                      fontWeight: 400,
                      color: "inherit",
                      lineHeight: 1.3,
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: 0,
            height: "100%",
            overflow: "hidden",
            bgcolor: "#f1f3f4",
          }}
        >
          {/* Mobile drag handle */}
          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              justifyContent: "center",
              pt: 1,
              pb: 0.25,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 4,
                borderRadius: 999,
                bgcolor: "rgba(60,64,67,0.22)",
              }}
            />
          </Box>

          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 2, sm: 2.75 },
              pt: { xs: 0.75, sm: 2 },
              pb: 1,
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{ fontSize: { xs: 19, sm: 21 }, fontWeight: 400, color: G.ink }}
            >
              {sectionTitle(section)}
            </Typography>
            <IconButton
              aria-label="Đóng"
              onClick={onClose}
              size="small"
              sx={{
                color: "#5f6368",
                width: 36,
                height: 36,
                "&:hover": { bgcolor: "rgba(60,64,67,0.08)" },
              }}
            >
              <FiX size={20} strokeWidth={1.75} />
            </IconButton>
          </Stack>

          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              gap: 0.75,
              px: 2,
              pb: 1.25,
              flexShrink: 0,
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": { display: "none", height: 0 },
            }}
          >
            {MENU.map(({ id, label }) => {
              const active = section === id;
              return (
                <Box
                  key={id}
                  component="button"
                  type="button"
                  onClick={() => setSection(id)}
                  sx={{
                    appearance: "none",
                    border: 0,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    px: 1.35,
                    py: 0.7,
                    borderRadius: "10px",
                    fontSize: 14.5,
                    fontWeight: 400,
                    bgcolor: active ? G.blueSoft : "#fff",
                    color: active ? G.blue : G.secondary,
                    flexShrink: 0,
                  }}
                >
                  {label}
                </Box>
              );
            })}
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              px: { xs: 2, sm: 2.75 },
              pb: { xs: 2.5, sm: 3.5 },
              WebkitOverflowScrolling: "touch",
            }}
          >
            {section === "personal" ? (
              <Stack spacing={1.5}>
                <Box
                  sx={{
                    ...cardSx,
                    display: "grid",
                    placeItems: "center",
                    py: { xs: 1.5, sm: 2.25 },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 88, sm: 112 },
                      height: { xs: 88, sm: 112 },
                      borderRadius: "50%",
                      overflow: "hidden",
                      bgcolor: G.blueSoft,
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 500,
                      fontSize: { xs: 29, sm: 33 },
                      color: G.blue,
                    }}
                  >
                    {patient.avatarUrl ? (
                      <Box
                        component="img"
                        src={patient.avatarUrl}
                        alt={patient.fullName}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      patient.initials
                    )}
                  </Box>
                </Box>

                <InfoCard
                  rows={[
                    { label: "Họ và tên", value: patient.fullName },
                    { label: "Ngày sinh", value: patient.dateOfBirth },
                    { label: "Giới tính", value: patient.gender },
                    { label: "Mã KCB", value: patient.maKcb },
                    { label: "Nhóm máu", value: patient.bloodType },
                    {
                      label: "Dị ứng",
                      value:
                        patient.allergies.length > 0
                          ? patient.allergies.map((a) => a.name).join(", ")
                          : "Không ghi nhận",
                    },
                  ]}
                />
              </Stack>
            ) : null}

            {section === "contact" ? (
              <InfoCard
                rows={[
                  { label: "Điện thoại", value: patient.phone },
                  { label: "Địa chỉ", value: patient.address },
                ]}
              />
            ) : null}

            {section === "idcard" ? (
              <InfoCard
                rows={[
                  { label: "Số BHYT", value: patient.bhyt },
                  { label: "Loại BHYT", value: patient.bhytType ?? "—" },
                  { label: "Hạn sử dụng", value: patient.bhytExpiry ?? "—" },
                ]}
              />
            ) : null}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
