import { create, EndingsImagePair } from "../EndingsImagePair";

export const FILE_ENDINGS_IMAGE_PAIRS: EndingsImagePair[] = [
  create(".js", "js-file"),
  create(".spec.js", "spec-js-file"),
  create(".jsx", "jsx-file"),
  create(".ts", "ts-file"),
  create(".spec.ts", "spec-ts-file"),
  create(".tsx", "tsx-file"),
  create(".tsbuildinfo", "tsbuildinfo-file"),
  create(".gitignore", "git-file"),
  create(
    [
      ".eslintrc.js",
      ".eslintrc.cjs",
      ".eslintrc.yaml",
      ".eslintrc.yml",
      ".eslintrc.json",
    ],
    "eslint-file"
  ),
  create(".css", "css-file"),
  create([".scss", ".sass"], "sass-file"),
  create("package.json", "node-package-file"),
  create("package-lock.json", "node-package-lock-file"),
  create(".json", "json-file"),
  create(".md", "markdown-file"),
];
