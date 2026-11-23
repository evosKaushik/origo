import path from "node:path";

export function resolveInsideRoot(root: string, relativePath: string): string {
  if (!relativePath) {
    throw new Error("A destination path is required");
  }

  const rootPath = path.resolve(root);
  const resolved = path.isAbsolute(relativePath)
    ? path.resolve(relativePath)
    : path.resolve(rootPath, relativePath);

  if (resolved !== rootPath && !resolved.startsWith(`${rootPath}${path.sep}`)) {
    throw new Error(`Destination path escapes the project root: ${relativePath}`);
  }

  return resolved;
}

export function toRootRelativePath(root: string, absolutePath: string): string {
  const rootPath = path.resolve(root);
  const resolved = path.resolve(absolutePath);

  if (resolved !== rootPath && !resolved.startsWith(`${rootPath}${path.sep}`)) {
    throw new Error(`Path escapes the project root: ${absolutePath}`);
  }

  return path.relative(rootPath, resolved).split(path.sep).join("/");
}
