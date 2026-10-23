"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useAppStore } from "@/store/app-store";
import { waLink } from "@/lib/whatsapp";

export function WhatsappFab() {
  const phone = useAppStore((s) => s.settings.whatsapp);
  const pathname = usePathname();
  if (pathname === "/look" || pathname === "/checkout") return null;
  return (
    <motion.a
      href={waLink(phone, "Hola Alfa Capital 👋 Quiero información")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring" }}
      className="fixed right-4 bottom-4 z-30 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_40px_-8px_rgba(37,211,102,0.6)] transition hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-25" />
      <MessageCircle className="relative size-7" />
    </motion.a>
  );
}
