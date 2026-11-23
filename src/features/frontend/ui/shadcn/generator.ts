import type { FrontendGenerationContext } from "../../../../generators/frontend/context.js";
import type { FrontendProfile } from "../../../../generators/frontend/resolvers/profile.js";
import { configureShadcnAlias } from "./patches/vite-config.js";
import { configureShadcnTsConfig } from "./patches/tsconfig.js";
import { createComponentsJson } from "./templates/components-json.js";
import {
  shadcnUtilsJavaScript,
  shadcnUtilsTypeScript,
} from "./templates/lib-utils.js";

export function generateShadcn(
  context: FrontendGenerationContext,
  profile: FrontendProfile
): void {
  const isTypeScript = profile.isTypeScript;

  context.addTextFile("components.json", createComponentsJson(isTypeScript));
  context.addTextFile(
    `src/lib/utils.${isTypeScript ? "ts" : "js"}`,
    isTypeScript ? shadcnUtilsTypeScript : shadcnUtilsJavaScript
  );

  configureShadcnAlias(context, profile);

  if (isTypeScript) {
    configureShadcnTsConfig(context);
  }
}
