import path from "node:path";

import { Project, type SourceFile } from "ts-morph";

import {
  resolveInsideRoot,
  toRootRelativePath,
} from "../../core/path-safety.js";

export interface AstContext {
  readonly project: Project;
  createSourceFile(relativePath: string, content: string): SourceFile;
  getSourceFile(relativePath: string): SourceFile;
  getSourceFileIfExists(relativePath: string): SourceFile | undefined;
  renameSourceFile(from: string, to: string): void;
  removeSourceFile(relativePath: string): void;
  finalize(): Map<string, string>;
}

export function createAstContext(projectDirectory: string): AstContext {
  const root = path.resolve(projectDirectory);
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    useInMemoryFileSystem: true,
  });
  const sourceFiles = new Map<string, SourceFile>();

  function normalize(relativePath: string): string {
    return toRootRelativePath(root, resolveInsideRoot(root, relativePath));
  }

  function absolute(relativePath: string): string {
    return resolveInsideRoot(root, relativePath);
  }

  function createSourceFile(relativePath: string, content: string): SourceFile {
    const normalized = normalize(relativePath);
    const existing = project.getSourceFile(absolute(normalized));

    if (existing) {
      project.removeSourceFile(existing);
      sourceFiles.delete(normalized);
    }

    const sourceFile = project.createSourceFile(absolute(normalized), content, {
      overwrite: true,
    });
    sourceFiles.set(normalized, sourceFile);
    return sourceFile;
  }

  function getSourceFileIfExists(
    relativePath: string
  ): SourceFile | undefined {
    return project.getSourceFile(absolute(relativePath));
  }

  function getSourceFile(relativePath: string): SourceFile {
    const sourceFile = getSourceFileIfExists(relativePath);

    if (!sourceFile) {
      throw new Error(`Source file not found: ${relativePath}`);
    }

    return sourceFile;
  }

  function removeSourceFile(relativePath: string): void {
    const normalized = normalize(relativePath);
    const sourceFile = getSourceFileIfExists(normalized);

    if (sourceFile) {
      project.removeSourceFile(sourceFile);
      sourceFiles.delete(normalized);
    }
  }

  function renameSourceFile(from: string, to: string): void {
    const normalizedFrom = normalize(from);
    const normalizedTo = normalize(to);
    const sourceFile = getSourceFile(normalizedFrom);
    const content = sourceFile.getFullText();

    removeSourceFile(normalizedFrom);
    createSourceFile(normalizedTo, content);
  }

  function finalize(): Map<string, string> {
    const output = new Map<string, string>();

    for (const [relativePath, sourceFile] of sourceFiles) {
      sourceFile.formatText();
      output.set(relativePath, sourceFile.getFullText());
    }

    return output;
  }

  return {
    project,
    createSourceFile,
    getSourceFile,
    getSourceFileIfExists,
    renameSourceFile,
    removeSourceFile,
    finalize,
  };
}
