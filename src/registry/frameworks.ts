import type { TechStackOption } from "../types/project.js";

export const frontendFrameworkOptions: TechStackOption[] = [
  { name: "React", value: "react" },
  { name: "Vanilla", value: "vanilla" },
];

export const backendFrameworkOptions: TechStackOption[] = [
  { name: "Express.js", value: "express" },
  { name: "Fastify", value: "fastify" },
  { name: "Custom", value: "custom" },
];
