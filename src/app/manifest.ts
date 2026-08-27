import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/dashboard",
    name: "Dilyas Shop",
    short_name: "Dilyas",
    description: "AI-каталог Dilyas Shop: товары, контент и остатки.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#FAF9F6",
    theme_color: "#FAF9F6",
    lang: "ru",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
