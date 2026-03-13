import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";

// core-web-vitals already bundles: base next + typescript + a11y + react-hooks
// It also includes global ignores for .next/, out/, build/, next-env.d.ts
// Spreading eslint-config-next/typescript separately causes duplicate plugin
// registrations (@typescript-eslint, @next/next) and triple global ignores.
const eslintConfig = defineConfig([
  ...nextVitals,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },
]);

export default eslintConfig;
