"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a73e8",
      dark: "#1557b0",
      contrastText: "#ffffff",
    },
    error: {
      main: "#d32f2f",
    },
  },
  typography: {
    fontFamily: "'Momo Trust Sans', sans-serif",
    fontSize: 15,
    h1: { fontFamily: "'Momo Trust Sans', sans-serif" },
    h2: { fontFamily: "'Momo Trust Sans', sans-serif" },
    h3: { fontFamily: "'Momo Trust Sans', sans-serif" },
    h4: { fontFamily: "'Momo Trust Sans', sans-serif" },
    h5: { fontFamily: "'Momo Trust Sans', sans-serif" },
    h6: { fontFamily: "'Momo Trust Sans', sans-serif" },
    subtitle1: { fontFamily: "'Momo Trust Sans', sans-serif" },
    subtitle2: { fontFamily: "'Momo Trust Sans', sans-serif" },
    body1: { fontFamily: "'Momo Trust Sans', sans-serif", fontSize: 15 },
    body2: { fontFamily: "'Momo Trust Sans', sans-serif", fontSize: 14 },
    caption: { fontFamily: "'Momo Trust Sans', sans-serif", fontSize: 12 },
    button: {
      fontFamily: "'Momo Trust Sans', sans-serif",
      textTransform: "none",
      fontWeight: 600,
      fontSize: 14,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontFamily: "'Momo Trust Sans', sans-serif",
        },
        body: {
          fontFamily: "'Momo Trust Sans', sans-serif",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#fff",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e2e8f0",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#cbd5e1",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1.5,
          },
        },
        input: {
          fontSize: 16,
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#f1f5f4",
          border: "1.5px solid transparent",
          transition: "background-color 150ms ease, border-color 150ms ease",
          "&:hover": {
            backgroundColor: "#e9efec",
          },
          "&.Mui-focused": {
            backgroundColor: "#fff",
            borderColor: "#1a73e8",
          },
          "&.Mui-error": {
            borderColor: "#d32f2f",
          },
        },
        input: {
          fontSize: 16,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 16,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 2,
        },
      },
    },
  },
});

export default theme;
