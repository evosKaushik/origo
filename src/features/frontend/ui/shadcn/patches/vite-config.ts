import { Node } from "ts-morph";

import {
  addNamedImport,
  addObjectProperty,
  getDefineConfigObject,
  upsertObjectProperty,
} from "../../../../../composer/ast/index.js";
import type { FrontendGenerationContext } from "../../../../../generators/frontend/context.js";
import type { FrontendProfile } from "../../../../../generators/frontend/resolvers/profile.js";

const ALIAS_VALUE = 'fileURLToPath(new URL("./src", import.meta.url))';

export function configureShadcnAlias(
  context: FrontendGenerationContext,
  profile: FrontendProfile
): void {
  const source = context.getSourceFile(`vite.config.${profile.configExtension}`);
  const object = getDefineConfigObject(source);

  addNamedImport(source, "node:url", "fileURLToPath");

  const resolve = object.getProperty("resolve");

  if (!resolve) {
    addObjectProperty(
      object,
      "resolve",
      `{ alias: { "@": ${ALIAS_VALUE} } }`
    );
    return;
  }

  if (!Node.isPropertyAssignment(resolve)) {
    throw new Error("resolve property must be an object");
  }

  const resolveObject = resolve.getInitializer();

  if (!resolveObject || !Node.isObjectLiteralExpression(resolveObject)) {
    resolve.setInitializer(`{ alias: { "@": ${ALIAS_VALUE} } }`);
    return;
  }

  const alias = resolveObject.getProperty("alias");

  if (!alias) {
    addObjectProperty(resolveObject, "alias", `{ "@": ${ALIAS_VALUE} }`);
    return;
  }

  if (!Node.isPropertyAssignment(alias)) {
    throw new Error("resolve.alias property must be an object");
  }

  const aliasObject = alias.getInitializer();

  if (!aliasObject || !Node.isObjectLiteralExpression(aliasObject)) {
    alias.setInitializer(`{ "@": ${ALIAS_VALUE} }`);
    return;
  }

  upsertObjectProperty(aliasObject, '"@"', ALIAS_VALUE);
}
