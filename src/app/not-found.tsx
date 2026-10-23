import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-6xl">Página no encontrada</h1>
        <p className="mt-4 text-muted">El aroma que buscas no está aquí, pero tenemos muchos más.</p>
        <Link href="/" className="btn-gold mt-8">Volver al inicio</Link>
      </div>
    </div>
  );
}
