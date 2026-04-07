import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(["projects/**/*"]),
  {
    rules: {},
  },
  {
    files: ["**/*.ts"],

    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@angular-eslint/recommended",
      "plugin:@angular-eslint/template/process-inline-templates",
    ),

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        project: ["tsconfig.json", "tsconfig.app.json", "tsconfig.*.json"],
        createDefaultProgram: true,
      },
    },

    rules: {
      "no-empty-function": "off",

      "@typescript-eslint/no-empty-function": [
        "off",
        {
          allow: ["protected-constructors"],
        },
      ],

      "@typescript-eslint/explicit-module-boundary-types": "error",

      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "explicit",

          overrides: {
            accessors: "explicit",
            constructors: "no-public",
            methods: "no-public",
            properties: "explicit",
            parameterProperties: "explicit",
          },
        },
      ],

      "@typescript-eslint/no-explicit-any": "warn",
      "no-debugger": "warn",
      "no-var": "off",
      "prefer-template": "off",

      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-unused-vars": "warn",

      "@angular-eslint/component-class-suffix": [
        "off",
        {
          suffixes: ["Page", "Component"],
        },
      ],

      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],

      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],

      "@angular-eslint/use-lifecycle-interface": ["error"],
      "@typescript-eslint/member-ordering": 0,
      "@typescript-eslint/naming-convention": 0,
    },
  },
  {
    files: ["**/*.html"],
    ignores: ["**/*inline-template-*.component.html"],
    extends: compat.extends("plugin:@angular-eslint/template/recommended"),
    rules: {},
  },
]);
