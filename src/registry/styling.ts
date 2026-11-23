import type { TechStackOption } from "../types/project.js";

export const DEFAULT_STYLING = "vanilla";

export const stylingOptions: TechStackOption[] = [
  { name: "Tailwind CSS", value: "tailwind" },
  { name: "Bootstrap", value: "bootstrap" },
  { name: "Sass", value: "sass" },
  { name: "CSS Modules", value: "css-modules" },
];
