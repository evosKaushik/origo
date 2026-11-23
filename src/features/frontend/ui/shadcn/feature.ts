import type { FrontendGenerationContext } from "../../../../generators/frontend/context.js";
import { resolveFrontendProfile } from "../../../../generators/frontend/resolvers/profile.js";
import type { ProjectFeature } from "../../../../types/project.js";
import { generateShadcn } from "./generator.js";

export const shadcnFeature: ProjectFeature = {
  id: "shadcn-ui",
  name: "shadcn/ui",
  requires: ["react", "shadcn-ui"],
  requiresAny: ["tailwind", "tailwind-v3", "tailwind-v4"],

  apply(context: FrontendGenerationContext) {
    generateShadcn(context, resolveFrontendProfile(context));
  },
};
