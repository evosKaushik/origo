import type { FeatureOption } from "../../types/project.js";

export const developmentFeatureOptions: FeatureOption[] = [
  {
    name: "Docker",
    value: "docker",
    category: "development",
    packages: [],
  },
  {
    name: "GitHub Actions",
    value: "github-actions",
    category: "development",
    packages: [],
  },
  {
    name: "Storybook - React",
    value: "storybook-react",
    category: "development",
    frameworks: ["react"],
    packages: ["storybook", "@storybook/react-vite"],
  },
  {
    name: "Storybook - Vue",
    value: "storybook-vue",
    category: "development",
    frameworks: ["vue"],
    packages: ["storybook", "@storybook/vue3-vite"],
  },
  {
    name: "Turborepo",
    value: "turborepo",
    category: "development",
    packages: ["turbo"],
  },
  {
    name: "Changesets",
    value: "changesets",
    category: "development",
    packages: ["@changesets/cli"],
  },
];
