"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useState } from "react";
import { assetPath } from "@/lib/assetPath";

const ZALO_OA_ID = "1960572385349798276";
const ZALO_OA_URL = `https://zalo.me/${ZALO_OA_ID}`;
const DESKTOP_MQ = "(min-width: 768px)";

/** Desktop: Zalo OA chat widget. Mobile: icon link (tránh khung SDK đè UI). */
export function ZaloChatWidget() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <>
      <a
        href={ZALO_OA_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat Zalo"
        className="floating-zalo-fab transition hover:scale-105"
      >
        <Image
          src={assetPath("/images/icon/zalo-icon.png")}
          alt="Zalo"
          width={56}
          height={56}
          className="h-full w-full object-contain drop-shadow-md"
        />
      </a>

      {isDesktop ? (
        <>
          <div
            className="zalo-chat-widget"
            data-oaid={ZALO_OA_ID}
            data-welcome-message="Rất vui khi được hỗ trợ bạn!"
            data-autopopup="0"
            data-width="300"
            data-height="380"
          />
          <Script
            src="https://sp.zalo.me/plugins/sdk.js"
            strategy="lazyOnload"
          />
        </>
      ) : null}
    </>
  );
}
