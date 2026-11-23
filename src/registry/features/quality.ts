import type { FeatureOption } from "../../types/project.js";

export const qualityFeatureOptions: FeatureOption[] = [
  {
    name: "ESLint",
    value: "eslint",
    category: "quality",
    packages: ["eslint"],
  },
  {
    name: "Prettier",
    value: "prettier",
    category: "quality",
    packages: ["prettier"],
  },
  {
    name: "Biome",
    value: "biome",
    category: "quality",
    conflictsWith: ["eslint", "prettier"],
    packages: ["@biomejs/biome"],
  },
  {
    name: "Husky",
    value: "husky",
    category: "quality",
    packages: ["husky"],
  },
  {
    name: "lint-staged",
    value: "lint-staged",
    category: "quality",
    packages: ["lint-staged"],
  },
];
