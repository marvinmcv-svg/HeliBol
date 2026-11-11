import path from "node:path";
import type { NextConfig } from "next";

const root = path.join(__dirname, "../..");

const config: NextConfig = {
  transpilePackages: ["@kinetik/web", "@kinetik/core", "@kinetik/tokens"],
  outputFileTracingRoot: root,
  turbopack: { root },
  // keep the dev badge out of thumbnails captured against `next dev`
  devIndicators: false,
  outputFileTracingIncludes: { "/**": ["../../packages/web/src/**/*"] },
};

export default config;
