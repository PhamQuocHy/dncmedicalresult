"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
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
import { LookupForm } from "@/features/lookup/LookupForm";
import { OTPModal } from "@/features/lookup/OTPModal";
import { PageFooter } from "@/components/layout/PageFooter";
import { assetPath } from "@/lib/assetPath";
import { getSession } from "@/lib/session";

const BOOKING_URL = "https://benhviendhnct.com.vn/";

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

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [otpOpen, setOtpOpen] = useState(false);
  const [lookup, setLookup] = useState({ maKcb: "", phone: "" });

  // Đã login thì không cho về trang tra cứu bằng Back / URL
  useEffect(() => {
    const redirectIfAuthed = () => {
      if (getSession()) {
        router.replace("/dashboard");
        return true;
      }
      return false;
    };

    if (redirectIfAuthed()) return;
    setChecking(false);

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) redirectIfAuthed();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
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

          <Button
            component="a"
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            variant="contained"
            color="primary"
            className="animate-booking-btn"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              borderRadius: 999,
              px: { sm: 2, lg: 3 },
              py: 0.7,
              fontSize: 15,
              fontWeight: 500,
              bgcolor: "#1a73e8",
              border: "1px solid rgba(26,115,232,0.45)",
              "&:hover": { bgcolor: "#1557b0" },
            }}
          >
            Đặt lịch khám
          </Button>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col items-center overflow-hidden bg-[#f8fafb] px-4 pb-10 pt-12 sm:px-8 sm:pt-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden text-[#8ab4f8]">
          {bgIcons.map(({ Icon, className }, i) => (
            <Icon
              key={i}
              strokeWidth={1.25}
              className={`absolute ${className}`}
            />
          ))}
        </div>

        <div id="huong-dan" className="relative z-10 w-full max-w-[850px]">
          <Typography
            component="h1"
            align="center"
            sx={{
              mb: 3,
              fontSize: { xs: 21, sm: 27 },
              fontWeight: 600,
              letterSpacing: "-0.015em",
              color: "#0f172a",
            }}
          >
            Tra cứu kết quả cận lâm sàng
          </Typography>

          <LookupForm
            onSuccess={(payload) => {
              setLookup(payload);
              setOtpOpen(true);
            }}
          />
        </div>
      </main>

      <PageFooter />

      <OTPModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        maKcb={lookup.maKcb}
        phone={lookup.phone}
      />
    </div>
  );
}
