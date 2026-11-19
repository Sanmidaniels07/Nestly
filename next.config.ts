import type { NextConfig } from "next";

const DEMO_URL = (process.env.NEXT_PUBLIC_DEMO_URL || "https://demo.nestlyapp.site").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // The old preview page became the interactive demo; shared links still land somewhere useful.
  async redirects() {
    return [{ source: "/preview", destination: DEMO_URL, permanent: false }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Profile photos of people who signed up with Google.
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;