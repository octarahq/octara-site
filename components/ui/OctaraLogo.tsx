import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoSize = "sm" | "md" | "lg" | "xl";

interface OctaraLogoProps {
  className?: string;
  size?: LogoSize;
}

const sizeMap: Record<LogoSize, { width: number; height: number; className: string }> = {
  sm: { width: 24, height: 24, className: "w-6 h-6" },
  md: { width: 32, height: 32, className: "w-8 h-8" },
  lg: { width: 48, height: 48, className: "w-12 h-12" },
  xl: { width: 64, height: 64, className: "w-16 h-16" },
};

export default function OctaraLogo({ className, size = "md" }: OctaraLogoProps) {
  const currentSize = sizeMap[size];

  return (
    <Image
      src="/favicon.svg"
      alt="Octara Logo"
      width={currentSize.width}
      height={currentSize.height}
      className={cn("rounded-full", currentSize.className, className)}
    />
  );
}
