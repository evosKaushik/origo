import { lstat, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { resolveInsideRoot } from "../../core/path-safety.js";
import type { GeneratedFile } from "./context.js";

function contentMatches(
  existing: Buffer,
  content: string | Buffer
): boolean {
  const incoming = Buffer.isBuffer(content) ? content : Buffer.from(content);
  return existing.equals(incoming);
}

export async function writeGeneratedFiles(
  projectDirectory: string,
  files: GeneratedFile[]
): Promise<void> {
  for (const file of files) {
    const destination = resolveInsideRoot(projectDirectory, file.path);

    await mkdir(path.dirname(destination), { recursive: true });

    let existing: Buffer | undefined;

    try {
      const stats = await lstat(destination);

      if (stats.isSymbolicLink()) {
        throw new Error(`Refusing to write through a symbolic link: ${file.path}`);
      }

      if (stats.isFile()) {
        existing = await readFile(destination);
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }

    if (existing) {
      if (contentMatches(existing, file.content)) {
        continue;
      }

      if (file.conflict !== "overwrite") {
        throw new Error(`Refusing to overwrite existing file: ${file.path}`);
      }
    }

    await writeFile(destination, file.content);
  }
}
