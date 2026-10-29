import path from "node:path";
import type { NextConfig } from "next";

const root = path.join(__dirname, "../..");

const config: NextConfig = {
  transpilePackages: ["@kinetik/web", "@kinetik/core", "@kinetik/tokens"],
  outputFileTracingRoot: root,
  turbopack: { root },
  outputFileTracingIncludes: { "/**": ["../../packages/web/src/**/*"] },
};

export default config;
