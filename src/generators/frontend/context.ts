import path from "node:path";
import type { SourceFile } from "ts-morph";

import { createAstContext, type AstContext } from "../../composer/ast/context.js";
import {
  resolveInsideRoot,
  toRootRelativePath,
} from "../../core/path-safety.js";

export type ConflictPolicy = "overwrite" | "ensure";

export interface GeneratedFile {
  path: string;
  content: string | Buffer;
  conflict: ConflictPolicy;
}

export interface FrontendGenerationOptions {
  projectDirectory: string;
  projectName: string;
  technologies: string[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  includePackageJson?: boolean;
  rootDirectory?: string;
  fullStack?: boolean;
}

const SOURCE_FILE_PATTERN = /\.(ts|tsx|js|jsx|mts|mjs|cts|cjs)$/;

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

export class FrontendGenerationContext {
  readonly projectDirectory: string;
  readonly projectName: string;
  readonly technologies: Set<string>;
  readonly options: FrontendGenerationOptions;
  readonly ast: AstContext;
  readonly rootDirectory: string;

  private readonly files = new Map<string, GeneratedFile>();
  private readonly physicalPaths = new Map<string, string>();

  constructor(options: FrontendGenerationOptions) {
    this.projectDirectory = options.projectDirectory;
    this.projectName = options.projectName;
    this.technologies = new Set(options.technologies);
    this.options = options;
    this.ast = createAstContext(options.projectDirectory);
    this.rootDirectory = normalizeRelative(
      options.rootDirectory ?? "",
      "Frontend root directory"
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
    const absolutePath = resolveInsideRoot(
      this.projectDirectory,
      physicalRelative
    );
    const physicalPath = toRootRelativePath(
      this.projectDirectory,
      absolutePath
    );

    this.files.set(logicalPath, { path: physicalPath, content, conflict });
    this.physicalPaths.set(logicalPath, physicalPath);

    if (typeof content === "string" && SOURCE_FILE_PATTERN.test(physicalPath)) {
      this.ast.createSourceFile(physicalPath, content);
    }
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

  getFile(relativePath: string): GeneratedFile | undefined {
    return this.files.get(normalizeRelative(relativePath, "Destination path"));
  }

  getTextFile(relativePath: string): string {
    const file = this.getFile(relativePath);

    if (!file || typeof file.content !== "string") {
      throw new Error(`Generated text file not found: ${relativePath}`);
    }

    return file.content;
  }

  hasFile(relativePath: string): boolean {
    return this.getFile(relativePath) !== undefined;
  }

  getSourceFile(relativePath: string): SourceFile {
    const logicalPath = normalizeRelative(relativePath, "Source path");
    const physicalPath = this.physicalPaths.get(logicalPath);

    if (!physicalPath) {
      throw new Error(`Source file not found: ${relativePath}`);
    }

    return this.ast.getSourceFile(physicalPath);
  }

  getSourceFileIfExists(relativePath: string): SourceFile | undefined {
    const logicalPath = normalizeRelative(relativePath, "Source path");
    const physicalPath = this.physicalPaths.get(logicalPath);
    return physicalPath ? this.ast.getSourceFileIfExists(physicalPath) : undefined;
  }

  renameFile(from: string, to: string): void {
    const file = this.getFile(from);
    const physicalPath = this.physicalPaths.get(
      normalizeRelative(from, "Source path")
    );

    if (!file || !physicalPath) {
      throw new Error(`Generated file not found: ${from}`);
    }

    const content = this.ast.getSourceFile(physicalPath).getFullText();
    const conflict = file.conflict;
    const fromLogical = normalizeRelative(from, "Source path");

    this.ast.removeSourceFile(physicalPath);
    this.files.delete(fromLogical);
    this.physicalPaths.delete(fromLogical);
    this.addFile(to, content, conflict);
  }

  listFiles(): GeneratedFile[] {
    return [...this.files.values()].sort((left, right) =>
      left.path.localeCompare(right.path)
    );
  }

  finalize(): GeneratedFile[] {
    const logicalByPhysical = new Map(
      [...this.physicalPaths].map(([logicalPath, physicalPath]) => [
        physicalPath,
        logicalPath,
      ])
    );

    for (const [physicalPath, content] of this.ast.finalize()) {
      const logicalPath = logicalByPhysical.get(physicalPath);
      const file = logicalPath ? this.files.get(logicalPath) : undefined;

      if (file) {
        file.content = content;
      }
    }

    return this.listFiles();
  }
}
