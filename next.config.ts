import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  outputFileTracingRoot: path.resolve(process.cwd()),
  experimental: {
    serverActions: {
      // Uploaded images can exceed the 1MB default.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
