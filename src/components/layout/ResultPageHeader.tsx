"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import {
  BRAND,
  BRAND_DARK,
  BRAND_SOFT,
  INK,
  MUTED,
} from "@/theme/dashboardTokens";

type Props = {
  title: string;
  fallbackHref?: string;
  onBack?: () => void;
  onDownload?: () => void;
  showDownload?: boolean;
  showSupport?: boolean;
};

export function ResultPageHeader({
  title,
  fallbackHref = "/dashboard",
  onBack,
  onDownload,
  showDownload = true,
  showSupport = true,
}: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        bgcolor: "#fff",
        borderBottom: "1px solid #f1f5f9",
        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
      }}
    >
      <Box
        sx={{
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2, sm: 10 },
          height: { xs: 56, sm: 64 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", minWidth: 0 }}
        >
          <IconButton
            onClick={handleBack}
            aria-label="Quay lại"
            size="small"
            sx={{
              color: MUTED,
              borderRadius: "10px",
              "&:hover": { bgcolor: BRAND_SOFT, color: BRAND },
            }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography
            sx={{
              fontSize: { xs: 16, sm: 17 },
              fontWeight: 600,
              color: INK,
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", flexShrink: 0 }}
        >
          {showSupport ? (
            <Button
              variant="outlined"
              startIcon={<SupportAgentRoundedIcon sx={{ fontSize: 19 }} />}
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                height: 36,
                borderRadius: 999,
                borderColor: "#e2e8f0",
                color: MUTED,
                fontWeight: 500,
                fontSize: 14.5,
                textTransform: "none",
                px: 1.75,
                "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
              }}
            >
              Hỗ trợ
            </Button>
          ) : null}
          {showDownload ? (
            <Button
              variant="contained"
              onClick={onDownload}
              startIcon={<DownloadRoundedIcon sx={{ fontSize: 19 }} />}
              sx={{
                height: 36,
                borderRadius: 999,
                bgcolor: BRAND,
                fontWeight: 500,
                fontSize: 14.5,
                textTransform: "none",
                px: { xs: 1.25, sm: 2 },
                boxShadow: "none",
                "& .MuiButton-startIcon": { mr: { xs: 0, sm: 0.75 } },
                "&:hover": { bgcolor: BRAND_DARK, boxShadow: "none" },
              }}
            >
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Tải xuống kết quả
              </Box>
            </Button>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
