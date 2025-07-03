import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/fullstacksimon/deep-weeds/main/public/images/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/fullstacksimon/deep-weeds/main/public/analysis/**",
      },
      new URL("https://my-store-id.public.blob.vercel-storage.com/**"),
    ],
  },
};

export default nextConfig;
