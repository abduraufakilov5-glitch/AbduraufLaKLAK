import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dilyas Shop",
    short_name: "Dilyas Shop",
    description: "Управление магазином Dilyas Shop",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FAF9F6",
    theme_color: "#FAF9F6",
    lang: "ru",
    icons: [
      { src: "/icon.png", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
