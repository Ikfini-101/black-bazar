// BB-03 §3 — next.config.ts (exact spec)
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: { unoptimized: true }, // next/image ne tourne pas sur Workers
};

initOpenNextCloudflareForDev();
export default nextConfig;
