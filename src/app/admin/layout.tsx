import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Panel administrativo", template: "%s · Admin Alfa Capital" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-ink">{children}</div>;
}
