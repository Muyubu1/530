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
        { type: "server", pattern: "src/server/**/*" },
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
      // `server` is the composition root (the one place that may touch
      // infrastructure). ui/routes call server functions but never reach into
      // infrastructure directly. See memory/decisions.md.
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "domain", allow: ["domain", "lib"] },
            { from: "application", allow: ["application", "domain", "lib"] },
            {
              from: "infrastructure",
              allow: ["infrastructure", "application", "domain", "lib"],
            },
            {
              from: "server",
              allow: ["server", "infrastructure", "application", "domain", "lib"],
            },
            { from: "ui", allow: ["ui", "server", "application", "domain", "lib"] },
            { from: "routes", allow: ["routes", "ui", "server", "application", "domain", "lib"] },
            { from: "lib", allow: ["lib"] },
          ],
        },
      ],
    },
  },
  {
    // Library/context modules intentionally co-export helpers (cva variants,
    // shadcn convention) and hooks (useAuth) alongside components.
    files: ["src/ui/design-system/**/*.{ts,tsx}", "src/ui/shared/auth/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  eslintPluginPrettier,
);
