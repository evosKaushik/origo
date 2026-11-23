import type { FeatureOption } from "../../types/project.js";

export const uiFeatureOptions: FeatureOption[] = [
  {
    name: "shadcn/ui",
    value: "shadcn-ui",
    category: "ui",
    frameworks: ["react"],
    requires: ["tailwind"],
    packages: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
  },
  {
    name: "Radix UI",
    value: "radix-ui",
    category: "ui",
    frameworks: ["react"],
    packages: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
  },
  {
    name: "Tailwind UI",
    value: "tailwind-ui",
    category: "ui",
    requires: ["tailwind"],
    packages: [],
  },
  {
    name: "Aceternity UI",
    value: "aceternity-ui",
    category: "ui",
    frameworks: ["react"],
    requires: ["tailwind"],
    packages: [],
  },
];
