import type { NextConfig } from "next";

/** Bật khi deploy GitHub Pages (repo project site: /dncmedicalresult) */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/dncmedicalresult" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
