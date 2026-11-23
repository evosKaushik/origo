import type { BackendTechStack } from "../types/project.js";
import { backendFrameworkOptions } from "../registry/frameworks.js";
import { languageOptions, runtimeOptions } from "../registry/runtimes.js";
import { databaseOptions } from "../registry/databases.js";

export const backendConfig: BackendTechStack = {
  runtimes: { required: true, options: runtimeOptions },
  frameworks: { required: true, options: backendFrameworkOptions },
  languages: { required: true, options: languageOptions },
  databases: { required: false, options: databaseOptions },
};
