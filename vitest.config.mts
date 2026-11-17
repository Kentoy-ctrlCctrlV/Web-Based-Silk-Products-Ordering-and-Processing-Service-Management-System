import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['server/src/**/*.test.ts'],
    exclude: ['server/dist/**', 'node_modules/**'],
  },
});
