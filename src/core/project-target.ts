import path from "node:path";

const NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export interface ProjectTarget {
  projectName: string;
  projectDirectory: string;
}

export function isPathLike(value: string): boolean {
  return (
    value === "." ||
    value === ".." ||
    value.startsWith("./") ||
    value.startsWith("../") ||
    value.includes("/") ||
    value.includes("\\") ||
    path.isAbsolute(value)
  );
}

function validateProjectName(value: string): string {
  if (!NAME_PATTERN.test(value)) {
    throw new Error(`Invalid project name: ${value}`);
  }

  return value;
}

function normalizePackageName(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^[-_.]+/, "") || "origo-app"
  );
}

export function resolveProjectTarget(
  projectInput: string,
  targetPathInput?: string
): ProjectTarget {
  const projectNameInput = projectInput.trim();

  if (!projectNameInput) {
    throw new Error("Project name is required");
  }

  const targetPath = (targetPathInput ?? projectNameInput).trim();

  if (!targetPath) {
    throw new Error("Project path is required");
  }

  const projectDirectory = path.resolve(process.cwd(), targetPath);
  const hasExplicitTargetPath = Boolean(targetPathInput?.trim());
  const projectName =
    !hasExplicitTargetPath && isPathLike(projectNameInput)
      ? normalizePackageName(path.basename(projectDirectory))
      : validateProjectName(projectNameInput);

  return { projectName, projectDirectory };
}
