import type { Metadata } from "next";
import { QuickDemo } from "@/features/quick-demo/quick-demo";
import "./demo.css";

export const metadata: Metadata = {
  title: "Demo interactiva | CoBusiness",
  description: "Recorre una compra colectiva ficticia en 90 segundos. Sin fondos reales, wallet ni blockchain.",
};

export default function DemoPage() {
  return <QuickDemo />;
}
