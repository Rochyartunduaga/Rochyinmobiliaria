import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Imágenes del blog subidas desde /admin al Storage de Supabase
const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://itvgygdckmkmpfgavhzy.supabase.co").hostname;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }],
  },
};

export default withNextIntl(nextConfig);
