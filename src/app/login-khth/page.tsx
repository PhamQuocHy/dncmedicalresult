"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import {
  Activity,
  Ambulance,
  Bone,
  Brain,
  ClipboardPlus,
  Droplets,
  HeartPulse,
  Hospital,
  Microscope,
  Pill,
  ScanLine,
  Stethoscope,
  Thermometer,
  UserRound,
} from "lucide-react";
import { KhthLoginForm } from "@/features/lookup/KhthLoginForm";
import { PageFooter } from "@/components/layout/PageFooter";
import { assetPath } from "@/lib/assetPath";
import { getKhthSession, getSession } from "@/lib/session";

const bgIcons = [
  { Icon: Stethoscope, className: "top-[12%] left-[6%] h-16 w-16 rotate-[-18deg] opacity-[0.07]" },
  { Icon: HeartPulse, className: "top-[16%] right-[8%] h-14 w-14 rotate-[12deg] opacity-[0.07]" },
  { Icon: Microscope, className: "top-[38%] left-[5%] h-16 w-16 rotate-[8deg] opacity-[0.06]" },
  { Icon: Pill, className: "top-[34%] right-[6%] h-14 w-14 rotate-[-12deg] opacity-[0.07]" },
  { Icon: Thermometer, className: "top-[24%] left-[20%] h-12 w-12 rotate-[16deg] opacity-[0.06]" },
  { Icon: Brain, className: "top-[22%] right-[18%] h-14 w-14 rotate-[-8deg] opacity-[0.06]" },
  { Icon: Hospital, className: "bottom-[20%] left-[8%] h-16 w-16 rotate-[6deg] opacity-[0.07]" },
  { Icon: ScanLine, className: "bottom-[14%] left-[36%] h-14 w-14 rotate-[-10deg] opacity-[0.06]" },
  { Icon: Ambulance, className: "bottom-[18%] right-[9%] h-16 w-16 rotate-[10deg] opacity-[0.07]" },
  { Icon: Droplets, className: "bottom-[8%] right-[30%] h-12 w-12 rotate-[-14deg] opacity-[0.06]" },
  { Icon: ClipboardPlus, className: "bottom-[30%] left-[26%] h-14 w-14 rotate-[8deg] opacity-[0.06]" },
  { Icon: Bone, className: "bottom-[28%] right-[24%] h-14 w-14 rotate-[-6deg] opacity-[0.06]" },
  { Icon: UserRound, className: "top-[48%] left-[12%] h-12 w-12 rotate-[4deg] opacity-[0.05]" },
  { Icon: Activity, className: "top-[50%] right-[12%] h-12 w-12 rotate-[-4deg] opacity-[0.05]" },
] as const;

export default function KhthLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (getKhthSession()) {
      router.replace("/khth");
      return;
    }
    if (getSession()) {
      router.replace("/dashboard");
      return;
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafb]" />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="z-30 border-b border-slate-100 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 sm:h-16 sm:px-20">
          <Image
            src={assetPath("/images/logo-bv.png")}
            alt="Bệnh viện Đại học Nam Cần Thơ"
            width={220}
            height={48}
            className="h-12 w-auto object-contain sm:h-14"
            priority
          />
          <Link
            href="/"
            className="text-[14.5px] font-medium text-[#1a73e8] hover:text-[#1557b0] hover:underline underline-offset-2"
          >
            Tra cứu bệnh nhân
          </Link>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col items-center overflow-hidden bg-[#f8fafb] px-4 pb-10 pt-12 sm:px-8 sm:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden text-[#8ab4f8]"
        >
          {bgIcons.map(({ Icon, className }, i) => (
            <Icon
              key={i}
              strokeWidth={1.25}
              className={`absolute ${className}`}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-[420px]">
          <Typography
            component="h1"
            align="center"
            sx={{
              mb: 0.75,
              fontSize: { xs: 21, sm: 24 },
              fontWeight: 600,
              letterSpacing: "-0.015em",
              color: "#0f172a",
            }}
          >
            Đăng nhập phòng KHTH
          </Typography>
          <Typography
            align="center"
            sx={{
              mb: 3,
              fontSize: 14.5,
              color: "#64748b",
              lineHeight: 1.45,
            }}
          >
            Dành cho nhân viên Kế hoạch tổng hợp — đăng nhập bằng tài khoản nội
            bộ, không cần OTP.
          </Typography>

          <KhthLoginForm />
        </div>
      </main>

      <PageFooter />
    </div>
  );
}
