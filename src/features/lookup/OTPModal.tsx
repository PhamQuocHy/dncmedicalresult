"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCountdown } from "@/hooks/useCountdown";
import { useOtpInput } from "@/hooks/useOtpInput";
import { resendOtp, verifyOtp } from "@/lib/api";
import { clearKhthSession, setSession } from "@/lib/session";
import { MOCK_OTP } from "@/data/mock";

type Props = {
  open: boolean;
  onClose: () => void;
  maKcb: string;
  phone: string;
};

const MAX_ERRORS = 5;
const OTP_TTL = 180;
const RESEND_COOLDOWN = 60;

export function OTPModal({ open, onClose, maKcb, phone }: Props) {
  const router = useRouter();
  const otp = useOtpInput(6);
  const ttl = useCountdown(0);
  const resend = useCountdown(0);
  const [errorCount, setErrorCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const locked = errorCount >= MAX_ERRORS;

  useEffect(() => {
    if (open) {
      // Reset toàn bộ trạng thái mỗi lần mở modal — setState đồng bộ ở đây là cố ý
      /* eslint-disable react-hooks/set-state-in-effect */
      otp.reset();
      setError(null);
      setErrorCount(0);
      ttl.start(OTP_TTL);
      resend.start(RESEND_COOLDOWN);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Ẩn Zalo / Messenger FAB khi mở OTP — tránh che nút Xác nhận trên mobile
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("otp-modal-open");
    return () => {
      document.body.classList.remove("otp-modal-open");
    };
  }, [open]);

  const handleConfirm = async () => {
    if (!otp.isComplete || locked || ttl.seconds <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const result = await verifyOtp(otp.value);
      clearKhthSession();
      setSession({
        token: result.token,
        maKcb,
        phone,
        authenticatedAt: Date.now(),
      });
      router.replace("/dashboard");
    } catch (err) {
      const next = errorCount + 1;
      setErrorCount(next);
      setError(
        next >= MAX_ERRORS
          ? "Bạn đã nhập sai quá 5 lần. Vui lòng thử lại sau."
          : err instanceof Error
            ? `${err.message} (còn ${MAX_ERRORS - next} lần)`
            : "OTP không đúng",
      );
      otp.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resend.isRunning || locked) return;
    await resendOtp();
    ttl.start(OTP_TTL);
    resend.start(RESEND_COOLDOWN);
    setError(null);
    otp.reset();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{ zIndex: 1400 }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            px: { xs: 0.75, sm: 1 },
            py: { xs: 1.25, sm: 1.5 },
            mx: 2,
            width: "100%",
            maxWidth: 400,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontSize: { xs: 19, sm: 21 },
          fontWeight: 700,
          pb: 1,
        }}
      >
        Xác thực OTP
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 1.5, sm: 3 }, overflowX: "hidden" }}>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 2, fontSize: 14 }}
        >
          Nhập mã gửi về {phone || "số điện thoại"}
        </Typography>

        <div className="mb-3 flex w-full items-center justify-center gap-1 sm:gap-2">
          {otp.digits.map((digit, index) => (
            <div key={index} className="flex items-center gap-1 sm:gap-2">
              <TextField
                inputRef={(el: HTMLInputElement | null) => {
                  otp.refs.current[index] = el;
                }}
                value={digit}
                onChange={(e) => otp.setDigit(index, e.target.value)}
                onKeyDown={(e) =>
                  otp.onKeyDown(index, e as React.KeyboardEvent<HTMLInputElement>)
                }
                onPaste={otp.onPaste}
                disabled={locked}
                variant="outlined"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                sx={{
                  width: { xs: 40, sm: 48 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 1,
                    "aria-label": `OTP chữ số ${index + 1}`,
                    style: {
                      textAlign: "center",
                      fontSize: 21,
                      fontWeight: 600,
                      padding: "10px 0",
                    },
                  },
                }}
              />
              {index === 2 ? (
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: 17, sm: 21 },
                    fontWeight: 600,
                    color: "text.disabled",
                    px: 0.25,
                  }}
                >
                  -
                </Typography>
              ) : null}
            </div>
          ))}
        </div>

        {error ? (
          <Typography variant="body2" color="error" align="center" sx={{ mb: 1 }}>
            {error}
          </Typography>
        ) : (
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            sx={{ display: "block", mb: 1 }}
          >
            Demo OTP:{" "}
            <Typography
              component="span"
              variant="caption"
              color="text.primary"
              sx={{ fontWeight: 600 }}
            >
              {MOCK_OTP}
            </Typography>
            {ttl.seconds > 0
              ? ` · Hiệu lực còn ${ttl.seconds}s`
              : " · OTP đã hết hạn"}
          </Typography>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          flexDirection: "column",
          gap: 1,
          px: { xs: 2, sm: 3 },
          pb: 2,
          pt: 0,
        }}
      >
        <Button
          type="button"
          variant="contained"
          size="large"
          fullWidth
          disabled={!otp.isComplete || loading || locked || ttl.seconds <= 0}
          onClick={handleConfirm}
          sx={{
            height: 48,
            fontSize: 16,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 999,
            bgcolor: "#1a73e8",
            "&:hover": { bgcolor: "#1557b0" },
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
              Đang xác nhận...
            </>
          ) : (
            "Xác nhận"
          )}
        </Button>

        <Button
          type="button"
          variant="text"
          size="small"
          fullWidth
          onClick={handleResend}
          disabled={resend.isRunning || locked}
          sx={{ color: "text.secondary", textDecoration: "underline" }}
        >
          {resend.isRunning
            ? `Gửi lại mã xác thực sau ${resend.seconds}s nữa`
            : "Gửi lại mã xác thực"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
