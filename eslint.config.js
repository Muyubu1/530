import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import boundaries from "eslint-plugin-boundaries";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".output", ".nitro", ".tanstack", "src/routeTree.gen.ts"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      boundaries,
    },
    settings: {
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        { type: "domain", pattern: "src/domain/**/*" },
        { type: "application", pattern: "src/application/**/*" },
        { type: "infrastructure", pattern: "src/infrastructure/**/*" },
        { type: "ui", pattern: "src/ui/**/*" },
        { type: "routes", pattern: "src/routes/**/*" },
        { type: "lib", pattern: "src/lib/**/*" },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Architecture enforcement — dependencies point inward only.
      // Kept at "warn" through Faz 0-1 (scaffold); promoted to "error" in the
      // infrastructure phase (Faz 3) once cross-layer wiring exists. See
      // memory/decisions.md.
      "boundaries/element-types": [
        "warn",
        {
          default: "disallow",
          rules: [
            { from: "domain", allow: ["domain", "lib"] },
            { from: "application", allow: ["application", "domain", "lib"] },
            {
              from: "infrastructure",
              allow: ["infrastructure", "application", "domain", "lib"],
            },
            { from: "ui", allow: ["ui", "application", "domain", "lib"] },
            { from: "routes", allow: ["routes", "ui", "application", "lib"] },
            { from: "lib", allow: ["lib"] },
          ],
        },
      ],
    },
  },
  {
    // Design-system modules intentionally co-export style helpers (cva variants,
    // shadcn convention) alongside components. Fast-refresh of a variants helper
    // is irrelevant for a library directory.
    files: ["src/ui/design-system/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  eslintPluginPrettier,
);
