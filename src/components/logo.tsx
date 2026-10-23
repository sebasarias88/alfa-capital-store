import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/format";

export function Logo({ href = "/", className, compact = false }: { href?: string; className?: string; compact?: boolean }) {
  return (
    <Link href={href} aria-label="Alfa Capital — inicio" className={cn("group flex items-center gap-3", className)}>
      <Image
        src="/logo.png"
        alt=""
        width={44}
        height={44}
        priority
        className="size-10 rounded-full ring-1 ring-gold/30 transition group-hover:ring-gold/70 sm:size-11"
      />
      {!compact && (
        <span className="leading-none">
          <span className="block font-[family-name:var(--font-display)] text-xl font-semibold tracking-[0.22em] text-cream">
            ALFA
          </span>
          <span className="block text-[9px] font-semibold tracking-[0.5em] text-gold">CAPITAL</span>
        </span>
      )}
    </Link>
  );
}
