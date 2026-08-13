"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { loginKhth } from "@/lib/api";
import { clearSession, setKhthSession } from "@/lib/session";
import { cn } from "@/lib/utils";

function PillFloatField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  icon: Icon,
  endAdornment,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  icon: React.ComponentType<{ className?: string; sx?: object }>;
  endAdornment?: React.ReactNode;
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
            endAdornment ? "pr-12" : "pr-5",
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
            sx={{ fontSize: 19, color: "currentColor" }}
          />
          <span>{label}</span>
        </label>

        {endAdornment ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {endAdornment}
          </div>
        ) : null}
      </div>
      {error ? <p className="mt-1.5 pl-2 text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

export function KhthLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!username.trim()) nextErrors.username = "Vui lòng nhập tài khoản";
    if (!password) nextErrors.password = "Vui lòng nhập mật khẩu";
    if (nextErrors.username || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const result = await loginKhth({
        username: username.trim(),
        password,
      });
      // Không giữ phiên bệnh nhân khi đăng nhập nội bộ
      clearSession();
      setKhthSession({
        token: result.token,
        username: result.username,
        displayName: result.displayName,
        role: "khth",
        authenticatedAt: Date.now(),
      });
      router.replace("/khth");
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Đăng nhập thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 sm:gap-5"
      noValidate
    >
      <PillFloatField
        id="khth-username"
        label="Tài khoản"
        value={username}
        onChange={(v) => {
          setUsername(v);
          if (errors.form || errors.username) {
            setErrors((prev) => ({
              ...prev,
              username: undefined,
              form: undefined,
            }));
          }
        }}
        error={errors.username}
        autoComplete="username"
        icon={PersonOutlineOutlinedIcon}
      />

      <PillFloatField
        id="khth-password"
        label="Mật khẩu"
        value={password}
        onChange={(v) => {
          setPassword(v);
          if (errors.form || errors.password) {
            setErrors((prev) => ({
              ...prev,
              password: undefined,
              form: undefined,
            }));
          }
        }}
        error={errors.password}
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        icon={LockOutlinedIcon}
        endAdornment={
          <IconButton
            type="button"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            onClick={() => setShowPassword((v) => !v)}
            size="small"
            sx={{ color: "#64748b" }}
          >
            {showPassword ? (
              <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} />
            ) : (
              <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        }
      />

      <Button
        type="submit"
        disabled={loading}
        variant="contained"
        fullWidth
        startIcon={!loading ? <LoginRoundedIcon /> : undefined}
        sx={{
          height: 50,
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 600,
          fontSize: 16.5,
          bgcolor: "#1a73e8",
          boxShadow: "none",
          mt: 0.5,
          "&:hover": { bgcolor: "#1557b0", boxShadow: "none" },
          "&.Mui-disabled": {
            bgcolor: "#1a73e8",
            color: "#fff",
            opacity: 0.65,
          },
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
            Đang đăng nhập...
          </>
        ) : (
          "Đăng nhập"
        )}
      </Button>

      {errors.form ? (
        <Alert severity="error" sx={{ borderRadius: 2, width: "100%" }}>
          {errors.form}
        </Alert>
      ) : null}
    </form>
  );
}
