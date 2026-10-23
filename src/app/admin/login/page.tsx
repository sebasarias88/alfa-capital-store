"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { DEMO_ADMIN } from "@/lib/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [email, setEmail] = useState(DEMO_ADMIN.email);
  const [password, setPassword] = useState(DEMO_ADMIN.password);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
      setError("Correo o contraseña incorrectos");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login();
      router.replace("/admin");
    }, 600);
  };

  return (
    <div className="grain relative grid min-h-dvh place-items-center overflow-hidden px-4">
      <div aria-hidden className="absolute top-1/2 left-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[140px]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-[2rem] border border-line bg-coal/80 p-8 backdrop-blur-xl sm:p-10"
      >
        <Image src="/logo.png" alt="Alfa Capital" width={72} height={72} className="mx-auto rounded-full ring-1 ring-gold/40" priority />
        <h1 className="mt-6 text-center font-[family-name:var(--font-display)] text-4xl">Panel administrativo</h1>
        <p className="mt-2 text-center text-sm text-muted">Gestiona productos, pedidos y ventas</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="label">Correo</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" autoComplete="username" />
          </div>
          <div>
            <label htmlFor="password" className="label">Contraseña</label>
            <div className="relative">
              <input id="password" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="input pr-12" autoComplete="current-password" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"} className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center text-muted">
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full py-4">
            <Lock className="size-4" /> {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
        <p className="mt-6 rounded-xl border border-dashed border-gold/30 px-4 py-3 text-center text-xs text-muted">
          Demo: <span className="text-gold-bright">{DEMO_ADMIN.email}</span> / <span className="text-gold-bright">{DEMO_ADMIN.password}</span>
        </p>
      </motion.div>
    </div>
  );
}
