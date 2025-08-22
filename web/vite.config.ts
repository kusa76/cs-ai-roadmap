import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/**',
        'coverage/**',
        'dist/**',
        'eslint.config.js',
        'postcss.config.cjs',
        'tailwind.config.js',
        'vite.config.ts',
        'src/test/**',
        'src/vite-env.d.ts',
        '**/*.d.ts'
      ],
      thresholds: {
        lines: 70,
        statements: 70,
        branches: 55,
        functions: 30
      }
    }
  }
})

