"use client";

import Script from "next/script";

const ZALO_OA_ID = "1960572385349798276";

/** Official Zalo OA chat widget */
export function ZaloChatWidget() {
  return (
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
  );
}
