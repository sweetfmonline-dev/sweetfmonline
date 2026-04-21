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
      {
        source: "/bolshevik-report",
        destination: "/oversight-pi",
        permanent: true,
      },
      {
        source: "/bolshevik-report/:slug*",
        destination: "/oversight-pi/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
