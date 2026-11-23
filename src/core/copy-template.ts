import { cp, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(moduleDirectory, "../..");

const DEFAULT_TEMPLATE_ROOT = path.resolve(cliRoot, "../template/frontend");
const DEFAULT_TEMPLATE_SOURCE = path.join(DEFAULT_TEMPLATE_ROOT, "vite-react/raw");
const DEFAULT_TYPESCRIPT_TEMPLATE_SOURCE = path.join(
  DEFAULT_TEMPLATE_ROOT,
  "vite-react-ts/raw"
);

const EXCLUDED_NAMES = new Set([
  ".git",
  ".env",
  ".DS_Store",
  "node_modules",
  "coverage",
  "package.json",
  "package-lock.json",
]);

function resolveTemplateSource(technologies: Iterable<string>): string {
  if (process.env.ORIGO_TEMPLATE_SOURCE) {
    return path.resolve(process.env.ORIGO_TEMPLATE_SOURCE);
  }

  return new Set(technologies).has("typescript")
    ? DEFAULT_TYPESCRIPT_TEMPLATE_SOURCE
    : DEFAULT_TEMPLATE_SOURCE;
}

function shouldCopy(source: string | URL): boolean {
  const sourcePath = typeof source === "string" ? source : fileURLToPath(source);
  const name = path.basename(sourcePath);

  return (
    !EXCLUDED_NAMES.has(name) &&
    !name.startsWith(".env.") &&
    !name.endsWith(".log")
  );
}

export async function copyTemplate(
  projectDirectory: string,
  technologies: Iterable<string> = []
): Promise<void> {
  const sourceDirectory = resolveTemplateSource(technologies);

  let sourceStats;

  try {
    sourceStats = await stat(sourceDirectory);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not access template source ${sourceDirectory}: ${reason}`);
  }

  if (!sourceStats.isDirectory()) {
    throw new Error(`Template source is not a directory: ${sourceDirectory}`);
  }

  try {
    await mkdir(projectDirectory, { recursive: true });
    await cp(sourceDirectory, projectDirectory, {
      recursive: true,
      filter: shouldCopy,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not copy template from ${sourceDirectory}: ${reason}`);
  }
}
