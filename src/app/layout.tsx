import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dilyas Shop",
  description: "Управление магазином: товары, остатки, заказы, аналитика и AI Studio.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
