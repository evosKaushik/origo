import type { FrontendGenerationContext } from "../../../../generators/frontend/context.js";
import { resolveFrontendProfile } from "../../../../generators/frontend/resolvers/profile.js";
import type { ProjectFeature } from "../../../../types/project.js";
import { generateTailwind } from "./generator.js";

export const tailwindFeature: ProjectFeature = {
  id: "tailwind",
  name: "Tailwind CSS",
  requires: ["react"],
  requiresAny: ["tailwind", "tailwind-v3", "tailwind-v4"],

  apply(context: FrontendGenerationContext) {
    generateTailwind(context, resolveFrontendProfile(context));
  },
};
