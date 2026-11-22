import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/auth/session";

export const metadata: Metadata = {
  title: "CoBusiness | Compra colectiva B2B",
  description:
    "Proyecto de comercio colectivo para que importadores y negocios reúnan pedidos hacia un mínimo de compra. Explora el MVP previsto y su roadmap.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
