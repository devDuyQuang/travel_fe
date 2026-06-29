import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_LOCAL_URL ||
  "http://api.localhost:8000";

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

  async rewrites() {
    return [
      {
        source: "/backend-api/sanctum/:path*",
        destination: `${backendUrl}/sanctum/:path*`,
      },
      {
        source: "/backend-api/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
