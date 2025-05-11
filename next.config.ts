import { NextConfig } from "next/types";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
    CLERK_API_KEY: process.env.CLERK_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI
  },
  experimental: {
    optimizePackageImports: [
      '@clerk/nextjs',
      'mongodb'
    ]
  },
};

export default nextConfig;