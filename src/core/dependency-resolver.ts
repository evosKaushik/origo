import { fullStackOptions } from "../config/fullstack.js";
import { packageRegistry } from "../registry/packages.js";
import {
  resolvePackageVersions,
  type VersionResolverOptions,
} from "./version-resolver.js";

export interface ResolvedDependencies {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}

export interface CollectedDependencies {
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
}

function expandPresets(technologies: string[]): string[] {
  return technologies.flatMap((technology) => {
    const preset = fullStackOptions.find((option) => option.value === technology);

    return preset
      ? [...preset.frontend, ...preset.backend, ...preset.database]
      : [technology];
  });
}

function sort(record: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(record).sort(([left], [right]) => left.localeCompare(right))
  );
}

export function collectDependencies(
  technologies: string[]
): CollectedDependencies {
  const dependencies = new Set<string>();
  const devDependencies = new Set<string>();
  const scripts: Record<string, string> = {};

  for (const technology of new Set(expandPresets(technologies))) {
    const metadata = packageRegistry[technology];

    if (!metadata) {
      continue;
    }

    metadata.dependencies?.forEach((name) => dependencies.add(name));
    metadata.devDependencies?.forEach((name) => devDependencies.add(name));
    Object.assign(scripts, metadata.scripts);
  }

  devDependencies.forEach((name) => dependencies.delete(name));

  return {
    dependencies: [...dependencies].sort(),
    devDependencies: [...devDependencies].sort(),
    scripts: sort(scripts),
  };
}

export async function resolveDependencies(
  technologies: string[],
  options: VersionResolverOptions = {}
): Promise<ResolvedDependencies> {
  const collected = collectDependencies(technologies);
  const versions = await resolvePackageVersions(
    [...collected.dependencies, ...collected.devDependencies],
    options
  );

  return {
    dependencies: Object.fromEntries(
      collected.dependencies.map((name) => [name, versions[name]])
    ),
    devDependencies: Object.fromEntries(
      collected.devDependencies.map((name) => [name, versions[name]])
    ),
    scripts: collected.scripts,
  };
}
