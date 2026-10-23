import { ArrowDownRight, ArrowUpRight, Ban, CheckCircle2, CircleDot, PackageCheck, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { STATUS_LABEL } from "@/lib/labels";
import { cn } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Card({ title, action, className, children }: { title?: string; action?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-coal p-5 sm:p-6", className)}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          {title && <h2 className="text-sm font-semibold tracking-wide text-cream">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({ label, value, delta, icon: Icon, hint }: { label: string; value: string; delta?: number; icon: LucideIcon; hint?: string }) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-coal p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted">{label}</p>
        <span className="grid size-9 place-items-center rounded-xl bg-gold/10 text-gold">
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="mt-3 font-[family-name:var(--font-display)] text-3xl text-cream sm:text-4xl">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span className={cn("inline-flex items-center gap-0.5 font-semibold", up ? "text-success" : "text-danger")}>
            {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="text-faint">{hint}</span>}
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<OrderStatus, { cls: string; icon: LucideIcon }> = {
  new: { cls: "bg-gold/15 text-gold-bright", icon: CircleDot },
  confirmed: { cls: "bg-info/15 text-info", icon: CheckCircle2 },
  shipping: { cls: "bg-warning/15 text-warning", icon: Truck },
  delivered: { cls: "bg-success/15 text-success", icon: PackageCheck },
  cancelled: { cls: "bg-danger/15 text-danger", icon: Ban },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { cls, icon: Icon } = STATUS_STYLE[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap", cls)}>
      <Icon className="size-3.5" /> {STATUS_LABEL[status]}
    </span>
  );
}

export function RangeTabs({ value, onChange, options }: { value: number; onChange: (v: number) => void; options: { value: number; label: string }[] }) {
  return (
    <div role="tablist" aria-label="Rango de fechas" className="flex gap-1 rounded-full border border-line bg-coal p-1">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn("rounded-full px-4 py-1.5 text-xs transition", value === o.value ? "bg-gold font-semibold text-ink" : "text-muted hover:text-cream")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
