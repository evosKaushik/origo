import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getReactBaseFiles,
  type BaseFileDefinition,
} from "../../base/frontend/react/manifest.js";
import type { FrontendStyle } from "../../types/project.js";

export interface LoadedBaseFile extends BaseFileDefinition {
  content: string | Buffer;
}

export function getBaseDirectory(): string {
  return path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "base"
  );
}

export async function loadReactBaseFiles(
  style: FrontendStyle = "vanilla",
  fullStack = false
): Promise<LoadedBaseFile[]> {
  const baseDirectory = getBaseDirectory();

  return Promise.all(
    getReactBaseFiles(style, fullStack).map(async (file) => {
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
