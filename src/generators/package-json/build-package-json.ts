import type {
  PackageJsonOptions,
  GeneratedPackageJson,
} from "./types.js";

export function buildPackageJson(
  options: PackageJsonOptions,
): GeneratedPackageJson {
  return {
    name: options.name,
    version: options.version ?? "1.0.0",
    description: options.description,
    private: options.private ?? true,
    type: options.type ?? "module",

    scripts: options.scripts ?? {},

    dependencies: options.dependencies ?? {},
    devDependencies: options.devDependencies ?? {},

    engines: options.engines,
  };
}

export function buildFullStackRootPackageJson(
  projectName: string,
  devDependencies: Record<string, string>
): GeneratedPackageJson {
  return {
    name: projectName,
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: {
      dev: 'concurrently "npm --prefix client run dev" "npm --prefix server run dev"',
      "dev:client": "npm --prefix client run dev",
      "dev:server": "npm --prefix server run dev",
      build: "npm --prefix client run build && npm --prefix server run build",
      "build:client": "npm --prefix client run build",
      "build:server": "npm --prefix server run build",
      preview: "npm --prefix client run preview",
      start: "npm --prefix server run start",
    },
    dependencies: {},
    devDependencies,
  };
}
