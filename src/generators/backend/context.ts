import path from "node:path";

import {
  resolveInsideRoot,
  toRootRelativePath,
} from "../../core/path-safety.js";

export type ConflictPolicy = "overwrite" | "ensure";

export interface GeneratedBackendFile {
  path: string;
  content: string | Buffer;
  conflict: ConflictPolicy;
}

export interface BackendGenerationOptions {
  projectDirectory: string;
  projectName: string;
  technologies: string[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  includePackageJson?: boolean;
  rootDirectory?: string;
  standalone?: boolean;
}

function normalizeRelative(value: string, label: string): string {
  const normalized = value.replace(/\\/g, "/");

  if (!normalized) {
    return "";
  }

  if (
    normalized.startsWith("/") ||
    normalized.split("/").includes("..")
  ) {
    throw new Error(`${label} escapes the project root: ${value}`);
  }

  return path.posix.normalize(normalized).replace(/^\.\//, "");
}

export class BackendGenerationContext {
  readonly projectDirectory: string;
  readonly projectName: string;
  readonly technologies: Set<string>;
  readonly options: BackendGenerationOptions;
  readonly rootDirectory: string;

  private readonly files = new Map<string, GeneratedBackendFile>();

  constructor(options: BackendGenerationOptions) {
    this.projectDirectory = options.projectDirectory;
    this.projectName = options.projectName;
    this.technologies = new Set(options.technologies);
    this.options = options;
    this.rootDirectory = normalizeRelative(
      options.rootDirectory ?? "",
      "Backend root directory"
    );
  }

  has(technology: string): boolean {
    return this.technologies.has(technology);
  }

  addFile(
    relativePath: string,
    content: string | Buffer,
    conflict: ConflictPolicy = "ensure",
    atProjectRoot = false
  ): void {
    const logicalPath = normalizeRelative(relativePath, "Destination path");
    const physicalRelative = atProjectRoot
      ? logicalPath
      : path.posix.join(this.rootDirectory, logicalPath);
    const physicalPath = toRootRelativePath(
      this.projectDirectory,
      resolveInsideRoot(this.projectDirectory, physicalRelative)
    );

    this.files.set(logicalPath, { path: physicalPath, content, conflict });
  }

  addRootFile(
    relativePath: string,
    content: string | Buffer,
    conflict: ConflictPolicy = "ensure"
  ): void {
    this.addFile(relativePath, content, conflict, true);
  }

  addRootJsonFile(
    relativePath: string,
    value: unknown,
    conflict: ConflictPolicy = "ensure"
  ): void {
    this.addRootFile(
      relativePath,
      `${JSON.stringify(value, null, 2)}\n`,
      conflict
    );
  }

  addTextFile(
    relativePath: string,
    content: string,
    conflict: ConflictPolicy = "ensure"
  ): void {
    this.addFile(relativePath, content, conflict);
  }

  addJsonFile(
    relativePath: string,
    value: unknown,
    conflict: ConflictPolicy = "ensure"
  ): void {
    this.addTextFile(
      relativePath,
      `${JSON.stringify(value, null, 2)}\n`,
      conflict
    );
  }

  finalize(): GeneratedBackendFile[] {
    return [...this.files.values()].sort((left, right) =>
      left.path.localeCompare(right.path)
    );
  }
}
