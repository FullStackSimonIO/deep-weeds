// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
  images: {
    // you can still use domains if you're only loading whole-host images
    domains: ["localhost", "plant.id.let-net.cc", "let-net.cc"],

    // remotePatterns gives you fine-grained path+protocol control
    remotePatterns: [
      // your GitHub raw URLs
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

      // your Vercel blob storage
      {
        protocol: "https",
        hostname: "my-store-id.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },

      // allow raw object-URLs & static files from localhost during dev
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        // you can tighten this to your actual upload folder if you want:
        pathname: "/images/**",
      },

      {
        protocol: "https",
        hostname: "plant.id.let-net.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "plant.id.let-net.cc",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
