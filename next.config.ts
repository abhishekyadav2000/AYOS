import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    jsx: true,
    jsxImportSource: "@emotion/react",
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default withMDX(nextConfig);
