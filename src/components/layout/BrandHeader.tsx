import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  compact?: boolean;
};

export function BrandHeader({ className, compact }: Props) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Image
        src="/images/logo-bv.png"
        alt="Bệnh viện Đại học Nam Cần Thơ"
        width={compact ? 240 : 320}
        height={compact ? 62 : 82}
        className={cn(
          "h-auto w-auto max-w-full object-contain",
          compact ? "max-h-12" : "max-h-16 sm:max-h-[72px]",
        )}
        priority
      />
    </div>
  );
}
