import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

// Domain/application logic is framework-free → fast node tests.
export default defineConfig({
  plugins: [tsConfigPaths({ projects: ["./tsconfig.json"] })],
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
