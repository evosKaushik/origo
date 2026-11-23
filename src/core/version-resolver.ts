import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { logger } from "../ui/logger.js";

const execFileAsync = promisify(execFile);

interface NpmVersionMetadata {
  deprecated?: string;
}

interface NpmPackument {
  "dist-tags"?: {
    latest?: string;
  };
  versions?: Record<string, NpmVersionMetadata>;
}

export interface VersionResolverOptions {
  registryUrl?: string;
  timeoutMs?: number;
}

const versionCache = new Map<string, Promise<string>>();

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (nextIndex < items.length) {
        const index = nextIndex;
        nextIndex += 1;
        results[index] = await mapper(items[index]);
      }
    })
  );

  return results;
}

function encodePackageName(name: string): string {
  return name.startsWith("@")
    ? `@${encodeURIComponent(name.slice(1))}`
    : encodeURIComponent(name);
}

function parseVersion(version: string): [number, number, number] | null {
  const match = /^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(version);

  if (!match) {
    return null;
  }

  return [Number(match[1]), Number(match[2] ?? 0), Number(match[3] ?? 0)];
}

function compareVersions(
  left: [number, number, number] | null,
  right: [number, number, number] | null
): number {
  if (!left || !right) {
    return 0;
  }

  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) {
      return left[index] - right[index];
    }
  }

  return 0;
}

function getRegistryUrl(options: VersionResolverOptions): string {
  return (
    options.registryUrl ??
    process.env.NPM_CONFIG_REGISTRY ??
    "https://registry.npmjs.org"
  ).replace(/\/$/, "");
}

async function npmView(
  name: string,
  options: VersionResolverOptions
): Promise<string | undefined> {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const args = ["view", name, "version", "--json"];

  if (options.registryUrl) {
    args.push("--registry", getRegistryUrl(options));
  }

  const { stdout } = await execFileAsync(npm, args, {
    timeout: options.timeoutMs ?? 20000,
    maxBuffer: 1024 * 1024,
  });

  const parsed: unknown = JSON.parse(stdout);

  if (Array.isArray(parsed)) {
    return typeof parsed[0] === "string" ? parsed[0] : undefined;
  }

  return typeof parsed === "string" ? parsed : undefined;
}

async function fetchPackument(
  name: string,
  options: VersionResolverOptions
): Promise<NpmPackument> {
  const url = `${getRegistryUrl(options)}/${encodePackageName(name)}`;
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.npm.install-v1+json" },
    signal: AbortSignal.timeout(options.timeoutMs ?? 20000),
  });

  if (!response.ok) {
    throw new Error(`npm registry returned ${response.status}`);
  }

  return (await response.json()) as NpmPackument;
}

async function findVersion(
  name: string,
  options: VersionResolverOptions
): Promise<string> {
  try {
    const latest = await npmView(name, options);

    if (latest) {
      return latest;
    }
  } catch {}

  const packument = await fetchPackument(name, options);
  const versions = packument.versions ?? {};
  const latest = packument["dist-tags"]?.latest;
  const candidates = Object.keys(versions)
    .filter((version) => !version.includes("-"))
    .sort((left, right) =>
      compareVersions(parseVersion(right), parseVersion(left))
    );

  if (latest && !latest.includes("-")) {
    candidates.unshift(latest);
  }

  for (const candidate of new Set(candidates)) {
    if (!versions[candidate]?.deprecated) {
      return candidate;
    }
  }

  throw new Error(`No version found for ${name}`);
}

export async function resolvePackageVersion(
  name: string,
  options: VersionResolverOptions = {}
): Promise<string> {
  const key = `${getRegistryUrl(options)}|${name}`;
  const cached = versionCache.get(key);

  if (cached) {
    return cached;
  }

  const pending = (async () => {
    let lastError: unknown;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await findVersion(name, options);
      } catch (error) {
        lastError = error;

        if (attempt < 2) {
          await new Promise((resolve) =>
            setTimeout(resolve, 250 * (attempt + 1))
          );
        }
      }
    }

    throw lastError;
  })().catch((error) => {
    versionCache.delete(key);
    throw error;
  });

  versionCache.set(key, pending);
  return pending;
}

export async function resolvePackageVersions(
  names: string[],
  options: VersionResolverOptions = {}
): Promise<Record<string, string>> {
  const entries = await mapWithConcurrency(
    [...new Set(names)],
    3,
    async (name) => {
      try {
        const version = await resolvePackageVersion(name, options);
        return [name, `^${version}`] as const;
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        logger.warn(`Could not resolve ${name}: ${reason}. Using latest.`);
        return [name, "latest"] as const;
      }
    }
  );

  return Object.fromEntries(
    entries.sort(([left], [right]) => left.localeCompare(right))
  );
}
