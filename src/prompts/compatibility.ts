import type { FeatureOption, TechStackOption } from "../types/project.js";

type CompatibleOption = TechStackOption | FeatureOption;

export function isCompatible(
  option: CompatibleOption,
  active: Set<string>
): boolean {
  if (option.frameworks?.length && !option.frameworks.some((item) => active.has(item))) {
    return false;
  }

  if (option.bundlers?.length && !option.bundlers.some((item) => active.has(item))) {
    return false;
  }

  if (option.requires?.some((item) => !active.has(item))) {
    return false;
  }

  if (option.requiresAny?.length && !option.requiresAny.some((item) => active.has(item))) {
    return false;
  }

  if (option.conflictsWith?.some((item) => active.has(item))) {
    return false;
  }

  return true;
}
