import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";

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
  ]),
  // contexts/architecture.md §2 — layer boundaries, enforced in the linter.
  {
    plugins: { import: importPlugin },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            { target: "./domain", from: "./infrastructure" },
            { target: "./domain", from: "./components" },
            { target: "./domain", from: "./app" },
            { target: "./components", from: "./infrastructure" },
          ],
        },
      ],
    },
  },
  // domain/ is plain TypeScript — no framework imports at all.
  {
    files: ["domain/**/*.ts", "domain/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "react", message: "domain/ must not import React." },
            { name: "next", message: "domain/ must not import Next.js." },
          ],
          patterns: [
            {
              group: ["react/*", "next/*"],
              message: "domain/ must not import React or Next.js.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
