import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["tests/**/*.test.{ts,tsx}", "tests/**/*.spec.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
    ],
    environment: "node",
    // Run tests serially to avoid SQLite database conflicts
    fileParallelism: false,
    sequence: {
      shuffle: false,
    },
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
  resolve: {
    conditions: ["node", "import", "module", "default"],
  },
  ssr: {
    external: ["better-sqlite3"],
    noExternal: ["tinybase"],
  },
});
