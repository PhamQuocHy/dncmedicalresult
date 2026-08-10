"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { G } from "@/theme/dashboardTokens";

type Props = {
  onSearch: (filters: { q: string; from: string; to: string }) => void;
  resultCount?: number;
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 40,
    borderRadius: "10px",
    bgcolor: "#fff",
    fontSize: 15,
    fontWeight: 500,
    color: G.ink,
    "& fieldset": { borderColor: "rgba(218,220,224,0.95)" },
    "&:hover fieldset": { borderColor: "#bdc1c6" },
    "&.Mui-focused fieldset": { borderColor: G.blue, borderWidth: 1.5 },
  },
  "& .MuiInputLabel-root": {
    fontSize: 14,
    color: G.secondary,
  },
} as const;

export function HistoryFilter({ onSearch, resultCount }: Props) {
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const submit = () => onSearch({ q, from, to });

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 2.5 },
        py: 2,
        borderBottom: "1px solid rgba(218,220,224,0.65)",
        bgcolor: "#fafbfc",
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={1.5}
        sx={{ alignItems: { lg: "flex-end" } }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{ mb: 0.75, fontSize: 13.5, fontWeight: 500, color: G.secondary }}
          >
            Tìm kiếm
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Khoa, bác sĩ, loại kết quả..."
            slotProps={{
              input: {
                startAdornment: (
                  <SearchRoundedIcon
                    sx={{ fontSize: 19, color: G.secondary, mr: 1 }}
                  />
                ),
              },
            }}
            sx={fieldSx}
          />
        </Box>

        <Box sx={{ width: { xs: "100%", sm: 160 } }}>
          <Typography
            sx={{ mb: 0.75, fontSize: 13.5, fontWeight: 500, color: G.secondary }}
          >
            Từ ngày
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={fieldSx}
          />
        </Box>

        <Box sx={{ width: { xs: "100%", sm: 160 } }}>
          <Typography
            sx={{ mb: 0.75, fontSize: 13.5, fontWeight: 500, color: G.secondary }}
          >
            Đến ngày
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={fieldSx}
          />
        </Box>

        <Button
          variant="contained"
          onClick={submit}
          sx={{
            height: 40,
            px: 2.25,
            borderRadius: "10px",
            bgcolor: G.blue,
            boxShadow: "none",
            fontWeight: 500,
            fontSize: 15,
            textTransform: "none",
            flexShrink: 0,
            "&:hover": { bgcolor: "#1557b0", boxShadow: "none" },
          }}
        >
          Tra cứu
          {typeof resultCount === "number" ? ` (${resultCount})` : ""}
        </Button>
      </Stack>
    </Box>
  );
}
