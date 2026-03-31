import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "sweetfmonline.com" }],
        destination: "https://www.sweetfmonline.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
