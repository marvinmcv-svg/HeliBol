import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    testTimeout: 20000,
    // The contract suite discovers components with import.meta.glob; Vitest's fs module cache
    // reuses the transformed file by content hash and misses newly added components.
    fsModuleCache: false,
  },
});
