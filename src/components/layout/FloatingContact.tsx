import Image from "next/image";
import { contactLinks } from "@/data/mock";
import { assetPath } from "@/lib/assetPath";

/** Messenger FAB — Zalo dùng widget SDK bên dưới */
export function FloatingContact() {
  return (
    <a
      href={contactLinks.messenger}
      target="_blank"
      rel="noreferrer"
      aria-label="Messenger"
      className="floating-messenger-fab transition hover:scale-105"
    >
      <Image
        src={assetPath("/images/icon/mess-icon.png")}
        alt="Messenger"
        width={56}
        height={56}
        className="h-full w-full object-contain drop-shadow-md"
      />
    </a>
  );
}
