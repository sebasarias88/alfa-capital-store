import { BadgeCheck, Sparkles } from "lucide-react";
import type { Edition } from "@/lib/types";
import { cn } from "@/lib/format";

export function EditionBadge({ edition, className }: { edition: Edition; className?: string }) {
  const original = edition === "original";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur",
        original ? "bg-gold text-ink" : "border border-gold/40 bg-ink/70 text-gold-bright",
        className,
      )}
    >
      {original ? <BadgeCheck className="size-3" /> : <Sparkles className="size-3" />}
      {original ? "Original" : "Inspiración 1.1"}
    </span>
  );
}
