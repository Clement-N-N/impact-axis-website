import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Sanity Studio is a separate Vite-based app with its own package.json/lint
    // setup — Next.js-specific rules (react-hooks/refs, next/image, etc.) don't
    // apply to it.
    "studio/**",
  ]),
]);

export default eslintConfig;
