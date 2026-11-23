import type { FrontendGenerationContext } from "../generators/frontend/context.js";
import type { ProjectFeature } from "../types/project.js";
import { tailwindFeature } from "./frontend/styling/tailwind/index.js";
import { shadcnFeature } from "./frontend/ui/shadcn/index.js";

export const features: ProjectFeature[] = [
  tailwindFeature,
  shadcnFeature,
];

export function isFeatureSelected(
  feature: ProjectFeature,
  context: FrontendGenerationContext
): boolean {
  const required = feature.requires.every((technology) =>
    context.has(technology)
  );
  const requiredAny =
    !feature.requiresAny?.length ||
    feature.requiresAny.some((technology) => context.has(technology));

  return required && requiredAny;
}

export function applyFeatures(
  context: FrontendGenerationContext
): string[] {
  const applied: string[] = [];

  for (const feature of features) {
    if (!isFeatureSelected(feature, context)) {
      continue;
    }

    try {
      feature.apply(context);
      applied.push(feature.name);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`Could not apply ${feature.name}: ${reason}`);
    }
  }

  return applied;
}
