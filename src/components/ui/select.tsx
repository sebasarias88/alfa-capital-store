"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/format";

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  id?: string;
  /** Renders a hidden input so the value is sent with native forms */
  name?: string;
  placeholder?: string;
  ariaLabel?: string;
  invalid?: boolean;
  className?: string;
  buttonClassName?: string;
}

/** Styled replacement for the native <select> (same look on every browser) */
export function Select({ value, onChange, options, id, name, placeholder = "Selecciona…", ariaLabel, invalid, className, buttonClassName }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return setOpen(false);
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      return openList();
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(options[active].value);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "input flex items-center justify-between gap-3 text-left",
          open && "border-gold/70 ring-2 ring-gold/20",
          invalid && "border-danger",
          buttonClassName,
        )}
      >
        <span className={cn("truncate", !selected && "text-faint")}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-gold transition", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 left-0 z-50 mt-2 max-h-64 min-w-full overflow-y-auto rounded-2xl border border-line bg-raised p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)]"
          >
            {options.map((o, i) => {
              const isSel = o.value === value;
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={isSel}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(o.value)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                    i === active ? "bg-gold/10 text-gold-bright" : "text-cream/90",
                    isSel && "font-semibold",
                  )}
                >
                  {o.label}
                  {isSel && <Check className="size-4 text-gold" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
