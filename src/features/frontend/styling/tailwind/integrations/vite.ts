import { Node, SyntaxKind } from "ts-morph";

import {
  addArrayElement,
  addImport,
  getDefineConfigObject,
} from "../../../../../composer/ast/index.js";
import type { FrontendGenerationContext } from "../../../../../generators/frontend/context.js";
import type { FrontendProfile } from "../../../../../generators/frontend/resolvers/profile.js";

export function integrateTailwindVite(
  context: FrontendGenerationContext,
  profile: FrontendProfile
): void {
  const configPath = `vite.config.${profile.configExtension}`;
  const source = context.getSourceFile(configPath);

  addImport(source, "@tailwindcss/vite", "tailwindcss");

  const object = getDefineConfigObject(source);
  const plugins = object.getProperty("plugins");

  if (!plugins || !Node.isPropertyAssignment(plugins)) {
    throw new Error("plugins property not found");
  }

  const pluginsArray = plugins.getInitializerIfKind(
    SyntaxKind.ArrayLiteralExpression
  );

  if (!pluginsArray) {
    throw new Error("plugins must be an array");
  }

  addArrayElement(pluginsArray, "tailwindcss()");
}
