// Run with: npm run lint
import js from "@eslint/js"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import pluginA11y from "eslint-plugin-jsx-a11y"
import pluginImport from "eslint-plugin-import"

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { document: "readonly", window: "readonly", console: "readonly" },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginA11y,
      import: pluginImport,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          groups: [["builtin", "external"], ["internal"], ["parent", "sibling", "index"]],
        },
      ],
    },
  },
]
