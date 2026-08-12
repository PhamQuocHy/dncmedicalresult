import type { ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { G } from "@/theme/dashboardTokens";

type Props = {
  title: string;
  icon?: SvgIconComponent;
  iconColor?: string;
  iconSize?: number;
  action?: ReactNode;
};

/** Tiêu đề dạng icon + chữ (nằm trên card info), không click. */
export function ResultPageTitle({
  title,
  icon: Icon = ArrowBackRoundedIcon,
  iconColor = G.blue,
  iconSize = 26,
  action,
}: Props) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        minWidth: 0,
        mt: { xs: -0.5, sm: -1 },
        mb: 1.5,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", minWidth: 0, flex: 1 }}
      >
        <Icon sx={{ fontSize: iconSize, color: iconColor, flexShrink: 0 }} />
        <Typography
          sx={{
            fontSize: 19,
            fontWeight: 400,
            color: G.ink,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "'Momo Trust Sans', sans-serif",
          }}
        >
          {title}
        </Typography>
      </Stack>
      {action}
    </Stack>
  );
}
