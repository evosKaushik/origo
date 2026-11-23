import { Node, type ObjectLiteralExpression, type SourceFile } from "ts-morph";

import { findCallExpression } from "./expressions.js";

export function getDefineConfigObject(source: SourceFile): ObjectLiteralExpression {
  const config = findCallExpression(source, "defineConfig");

  if (!config) {
    throw new Error("defineConfig() not found");
  }

  const object = config.getArguments()[0];

  if (!object || !Node.isObjectLiteralExpression(object)) {
    throw new Error("Invalid Vite configuration");
  }

  return object;
}
