module.exports = {
  root: true,
  env: {
    es6: true,
    commonjs: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist/**/*.js"],
  rules: {
    "prettier/prettier": ["warn"],
  },
};
