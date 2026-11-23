import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

import type { PackageJsonOptions } from "./types.js";
import { buildPackageJson } from "./build-package-json.js";

export async function writePackageJson(
  projectDirectory: string,
  options: PackageJsonOptions,
): Promise<void> {
  const packageJson = buildPackageJson(options);

  const filePath = path.join(projectDirectory, "package.json");

  await mkdir(projectDirectory, { recursive: true });

  await writeFile(
    filePath,
    JSON.stringify(packageJson, null, 2) + "\n",
    "utf-8",
  );
}
