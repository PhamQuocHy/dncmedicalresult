"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import { BiSearchAlt } from "react-icons/bi";
import { TurnstileMock } from "@/features/lookup/TurnstileMock";
import { cn, validateMaKcb, validatePhone } from "@/lib/utils";
import { requestOtp } from "@/lib/api";
import { contactLinks } from "@/data/mock";

type Props = {
  onSuccess: (payload: { maKcb: string; phone: string }) => void;
};

function PillFloatField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  icon: Icon,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  icon: React.ComponentType<{ className?: string; sx?: object }>;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className="w-full min-w-0">
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          aria-label={label}
          className={cn(
            "peer h-[58px] w-full rounded-full border bg-white px-5 pt-0.5 text-[16px] text-slate-900 outline-none transition shadow-xs",
            floated ? "pl-5" : "pl-11",
            error
              ? "border-red-400 focus:border-red-500"
              : focused
                ? "border-[#1a73e8]"
                : "border-slate-200 hover:border-slate-300",
          )}
          style={{ borderWidth: focused || error ? 1.5 : 1 }}
        />

        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 flex items-center gap-1.5 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            floated
              ? "top-0 -translate-y-1/2 bg-[#f8fafb] px-1.5 text-[13px] font-semibold"
              : "top-1/2 -translate-y-1/2 text-[16px] font-medium",
            floated && !error && focused && "text-[#1a73e8]",
            floated && !error && !focused && "text-slate-500",
            floated && error && "text-red-500",
            !floated && "text-slate-400",
          )}
        >
          <Icon
            className="h-[18px] w-[18px]"
            sx={{
              fontSize: 19,
              color: "currentColor",
            }}
          />
          <span>{label}</span>
        </label>
      </div>
      {error ? <p className="mt-1.5 pl-2 text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

export function LookupForm({ onSuccess }: Props) {
  const [maKcb, setMaKcb] = useState("");
  const [phone, setPhone] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [errors, setErrors] = useState<{ maKcb?: string; phone?: string; form?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const maErr = validateMaKcb(maKcb);
    const phoneErr = validatePhone(phone);
    if (maErr || phoneErr) {
      setErrors({ maKcb: maErr ?? undefined, phone: phoneErr ?? undefined });
      return;
    }
    if (!turnstileToken) {
      setErrors({ form: "Vui lòng xác minh bạn không phải robot" });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await requestOtp({ maKcb: maKcb.trim(), phone: phone.trim(), turnstileToken });
      onSuccess({ maKcb: maKcb.trim(), phone: phone.trim() });
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Không thể gửi OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchIcon = loading ? (
    <CircularProgress size={18} color="inherit" />
  ) : (
    <BiSearchAlt size={22} />
  );

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 sm:gap-5" noValidate>
      {/* Desktop: 2 ô + nút tròn cạnh nhau · Mobile: 2 ô xếp dọc */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <PillFloatField
          id="ma-kcb"
          label="Mã khám chữa bệnh"
          value={maKcb}
          onChange={setMaKcb}
          error={errors.maKcb}
          autoComplete="off"
          icon={BadgeOutlinedIcon}
        />
        <PillFloatField
          id="phone"
          label="Số điện thoại"
          value={phone}
          onChange={setPhone}
          error={errors.phone}
          type="tel"
          autoComplete="tel"
          icon={PhoneIphoneOutlinedIcon}
        />
        <IconButton
          type="submit"
          disabled={loading}
          aria-label="Tra cứu"
          className="shadow-xs"
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            alignSelf: "center",
            width: 46,
            height: 46,
            flexShrink: 0,
            bgcolor: "#1a73e8",
            color: "#fff",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            "&:hover": { bgcolor: "#1557b0" },
            "&.Mui-disabled": { bgcolor: "#1a73e8", color: "#fff", opacity: 0.65 },
          }}
        >
          {searchIcon}
        </IconButton>
      </div>

      <div className="flex flex-col items-stretch gap-3 sm:items-center">
        <div className="flex justify-center">
          <TurnstileMock onTokenChange={setTurnstileToken} />
        </div>

        {/* Mobile: nút Tra cứu full-width sau captcha — không “lọt” giữa form */}
        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          fullWidth
          startIcon={!loading ? <BiSearchAlt size={20} /> : undefined}
          sx={{
            display: { xs: "inline-flex", sm: "none" },
            height: 48,
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 16.5,
            bgcolor: "#1a73e8",
            boxShadow: "none",
            "&:hover": { bgcolor: "#1557b0", boxShadow: "none" },
            "&.Mui-disabled": { bgcolor: "#1a73e8", color: "#fff", opacity: 0.65 },
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
              Đang tra cứu...
            </>
          ) : (
            "Tra cứu kết quả"
          )}
        </Button>

        <p className="pt-1 text-center text-[15px] text-slate-500 sm:pt-3 sm:text-[17px]">
          Không thể tìm thấy kết quả khám chữa bệnh{" "}
          <a
            href={`tel:${contactLinks.phone}`}
            className="font-semibold text-[#f22b2c] underline underline-offset-2 hover:text-[#bf2122]"
          >
            Liên hệ ngay.
          </a>
        </p>
      </div>

      {errors.form ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {errors.form}
        </Alert>
      ) : null}
    </form>
  );
}
