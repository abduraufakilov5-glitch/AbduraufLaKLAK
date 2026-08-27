import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Dilyas Shop",
    template: "%s · Dilyas Shop",
  },
  description: "Управление магазином: товары, склад, заказы, аналитика и AI Studio.",
  applicationName: "Dilyas Shop",
  appleWebApp: {
    capable: true,
    title: "Dilyas Shop",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FAF9F6",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
