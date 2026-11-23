import type { FeatureOption } from "../../types/project.js";

export const testingFeatureOptions: FeatureOption[] = [
  {
    name: "Vitest",
    value: "vitest",
    category: "testing",
    packages: ["vitest"],
  },
  {
    name: "Jest",
    value: "jest",
    category: "testing",
    packages: ["jest"],
  },
  {
    name: "Playwright",
    value: "playwright",
    category: "testing",
    packages: ["@playwright/test"],
  },
  {
    name: "Testing Library - React",
    value: "testing-library-react",
    category: "testing",
    frameworks: ["react"],
    requiresAny: ["vitest", "jest"],
    packages: ["@testing-library/react", "@testing-library/jest-dom"],
  },
  {
    name: "Testing Library - Vue",
    value: "testing-library-vue",
    category: "testing",
    frameworks: ["vue"],
    requiresAny: ["vitest", "jest"],
    packages: ["@testing-library/vue"],
  },
];
