import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getExpressBaseFiles } from "../../base/backend/express/manifest.js";
import { getFastifyBaseFiles } from "../../base/backend/fastify/manifest.js";
import type { BaseFileDefinition } from "../../base/backend/express/manifest.js";
import type { BackendFramework, BackendLanguage } from "../../types/project.js";

export interface LoadedBackendFile extends BaseFileDefinition {
  content: string | Buffer;
}

export function getBackendBaseDirectory(): string {
  return path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "base"
  );
}

export async function loadBackendBaseFiles(
  framework: BackendFramework,
  language: BackendLanguage
): Promise<LoadedBackendFile[]> {
  const baseDirectory = getBackendBaseDirectory();
  const definitions =
    framework === "fastify"
      ? getFastifyBaseFiles(language)
      : getExpressBaseFiles(language);

  return Promise.all(
    definitions.map(async (file) => {
      const sourcePath = path.join(baseDirectory, file.source);

      try {
        const content = await readFile(sourcePath, {
          encoding: file.kind === "text" ? "utf8" : undefined,
        });
        return { ...file, content };
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`Could not load base file ${file.source}: ${reason}`);
      }
    })
  );
}

export function loadExpressBaseFiles(
  language: BackendLanguage
): Promise<LoadedBackendFile[]> {
  return loadBackendBaseFiles("express", language);
}

export function loadFastifyBaseFiles(
  language: BackendLanguage
): Promise<LoadedBackendFile[]> {
  return loadBackendBaseFiles("fastify", language);
}
