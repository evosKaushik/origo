import type { FullStackOption, StackStep } from "../types/project.js";

export const fullStackOptions: FullStackOption[] = [
  {
    name: "MERN Stack",
    value: "mern",
    description: "MongoDB, Express, React and Node.js",
    frontend: ["react", "vite"],
    backend: ["nodejs", "express"],
    database: ["mongodb"],
  },
  {
    name: "PERN Stack",
    value: "pern",
    description: "PostgreSQL, Express, React and Node.js",
    frontend: ["react", "vite"],
    backend: ["nodejs", "express"],
    database: ["postgresql"],
  },
  {
    name: "Custom Stack",
    value: "custom",
    description: "Build your own full-stack combination",
    frontend: [],
    backend: [],
    database: [],
  },
];

export const fullStackPreset: StackStep = {
  required: true,
  options: fullStackOptions,
};
