import type { PackageMetadata } from "../../../../types/project.js";

export type TailwindVersion = "v3" | "v4";

export const tailwindV3Dependencies: PackageMetadata = {
  devDependencies: ["tailwindcss", "postcss", "autoprefixer"],
};

export const tailwindV4Dependencies: PackageMetadata = {
  devDependencies: ["tailwindcss", "@tailwindcss/vite"],
};

export const tailwindDependencies = tailwindV4Dependencies;

export function getTailwindDependencies(
  version: TailwindVersion
): PackageMetadata {
  return version === "v3" ? tailwindV3Dependencies : tailwindV4Dependencies;
}
