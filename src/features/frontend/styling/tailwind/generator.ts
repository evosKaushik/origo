import type { FrontendGenerationContext } from "../../../../generators/frontend/context.js";
import type { FrontendProfile } from "../../../../generators/frontend/resolvers/profile.js";
import type { TailwindVersion } from "./dependencies.js";
import { generateTailwindV3 } from "./versions/v3.js";
import { generateTailwindV4 } from "./versions/v4.js";

export function resolveTailwindVersion(
  context: FrontendGenerationContext
): TailwindVersion {
  return context.has("tailwind-v3") ? "v3" : "v4";
}

export function generateTailwind(
  context: FrontendGenerationContext,
  profile: FrontendProfile
): void {
  const version = resolveTailwindVersion(context);

  if (version === "v3") {
    generateTailwindV3(context, profile);
    return;
  }

  generateTailwindV4(context, profile);
}
