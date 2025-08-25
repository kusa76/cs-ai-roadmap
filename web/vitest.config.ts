import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "dist/**",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/setupTests.ts",
        "src/test/**",
        "**/vite.config.*",
        "**/vitest.config.*",
        "**/tailwind.config.*",
        "**/postcss.config.*",
        "**/eslint.config.*",
      ],
    },
  },
});

