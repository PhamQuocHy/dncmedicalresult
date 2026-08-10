"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: "/images/ksk-hoc-duong-2.png",
    title: "Tra cứu kết quả cận lâm sàng",
    body: "Xem nhanh kết quả xét nghiệm, chẩn đoán hình ảnh và thăm dò chức năng mọi lúc, mọi nơi.",
    cta: "Hướng dẫn tra cứu",
    href: "#huong-dan",
  },
  {
    image: "/images/ksk-hoc-duong-4.png",
    title: "Bảo mật thông tin bệnh nhân",
    body: "Xác thực bằng mã KCB và OTP gửi về số điện thoại để bảo vệ dữ liệu của bạn.",
    cta: "Liên hệ hỗ trợ",
    href: "tel:0907365115",
  },
  {
    image: "/images/ksk-hoc-duong-6.png",
    title: "Một cổng cho mọi kết quả",
    body: "Theo dõi lịch sử khám và tải kết quả khi cần — tiện lợi, nhanh chóng, chính xác.",
    cta: "Đặt lịch khám",
    href: "https://benhviendhnct.com.vn/",
  },
];

const AUTO_MS = 5000;

export function LoginHeroPanel() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    const len = slides.length;
    setActive(((index % len) + len) % len);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-3">
      <div
        className="relative min-h-0 w-full flex-1 overflow-hidden rounded-2xl"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          if (start == null) return;
          const delta = e.changedTouches[0].clientX - start;
          if (Math.abs(delta) < 40) return;
          if (delta < 0) next();
          else prev();
        }}
      >
        <div
          className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={slide.image} className="relative h-full w-full shrink-0">
              <Image
                src={slide.image}
                alt=""
                fill
                priority={i === 0}
                className="object-cover object-center"
                sizes="48vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-6 sm:p-7">
                <h2 className="text-xl font-semibold leading-snug text-white sm:text-2xl">
                  {slide.title}
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-white/90">
                  {slide.body}
                </p>
                <Button
                  component="a"
                  href={slide.href}
                  {...(slide.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 0.5,
                    width: "fit-content",
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.8)",
                    "&:hover": {
                      borderColor: "#fff",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  {slide.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 px-1">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active
                ? "w-8 bg-brand-green"
                : "w-5 bg-slate-200 hover:bg-slate-300",
            )}
          />
        ))}
      </div>
    </div>
  );
}
