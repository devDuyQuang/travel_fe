import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.voduyquang.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "api.voduyquang.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "api.localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "api.localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;