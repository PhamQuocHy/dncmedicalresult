"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import { G } from "@/theme/dashboardTokens";

type Props = {
  conclusion: string;
};

export function VisitConclusion({ conclusion }: Props) {
  return (
    <Box
      sx={{
        borderRadius: "12px",
        bgcolor: G.blueSoft,
        px: { xs: 1.75, sm: 2 },
        py: 1.5,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", mb: 0.85 }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "8px",
            bgcolor: "#fff",
            color: G.blueInk,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <FactCheckOutlinedIcon sx={{ fontSize: 17 }} />
        </Box>
        <Typography sx={{ fontSize: 15, fontWeight: 500, color: G.blueInk }}>
          Kết luận
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontSize: 15,
          lineHeight: 1.7,
          color: G.secondary,
          fontWeight: 400,
        }}
      >
        {conclusion}
      </Typography>
    </Box>
  );
}
