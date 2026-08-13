"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const COPYRIGHT =
  "© 2022–2026 Bệnh Viện Đại Học Nam Cần Thơ. All Rights Reserved.";

/** Footer đồng bộ toàn app (login, dashboard, trang kết quả). */
export function PageFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        position: "relative",
        zIndex: 1,
        flexShrink: 0,
        bgcolor: "#fff",
        borderTop: "1px solid #E6EAEF",
      }}
    >
      <Box
        sx={{
          mx: "auto",
          maxWidth: 1200,
          px: 2,
          height: { xs: 48, sm: 56 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          align="center"
          sx={{
            fontSize: { xs: 14, sm: 16 },
            fontWeight: 400,
            color: "#6B7280",
            lineHeight: 1.35,
          }}
        >
          {COPYRIGHT}
        </Typography>
      </Box>
    </Box>
  );
}
