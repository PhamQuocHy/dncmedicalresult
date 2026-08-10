import type { Metadata } from "next";
import "./globals.css";
import { ZaloChatWidget } from "@/components/layout/ZaloChatWidget";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Tra cứu kết quả cận lâm sàng | BV ĐH Nam Cần Thơ",
  description:
    "Hệ thống tra cứu kết quả cận lâm sàng Bệnh viện Đại học Nam Cần Thơ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full font-sans text-slate-900">
        <Providers>
          {children}
          <ZaloChatWidget />
        </Providers>
      </body>
    </html>
  );
}
