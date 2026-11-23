import { Node, SyntaxKind, type SourceFile } from "ts-morph";

import type { FrontendGenerationContext } from "../context.js";
import type { FrontendProfile } from "./profile.js";

const TYPE_SOURCE_FILES = [
  "src/App.tsx",
  "src/main.tsx",
  "src/components/Counter.tsx",
  "src/components/OrigoLogo.tsx",
  "src/components/PingButton.tsx",
];

export function stripTypeScriptSyntax(source: SourceFile): void {
  for (const declaration of [
    ...source.getDescendantsOfKind(SyntaxKind.TypeAliasDeclaration),
    ...source.getDescendantsOfKind(SyntaxKind.InterfaceDeclaration),
  ]) {
    declaration.remove();
  }

  for (const parameter of source
    .getDescendants()
    .filter(Node.isParameterDeclaration)) {
    parameter.removeType();
  }

  for (const variable of source
    .getDescendants()
    .filter(Node.isVariableDeclaration)) {
    variable.removeType();
  }

  for (const call of source.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    for (const typeArgument of call.getTypeArguments()) {
      call.removeTypeArgument(typeArgument);
    }
  }

  for (const declaration of source.getImportDeclarations()) {
    if (declaration.isTypeOnly()) {
      declaration.remove();
      continue;
    }

    for (const specifier of declaration.getNamedImports()) {
      if (specifier.isTypeOnly()) {
        specifier.remove();
      }
    }
  }
}

export function resolveLanguage(
  context: FrontendGenerationContext,
  profile: FrontendProfile
): void {
  if (profile.isTypeScript) {
    return;
  }

  for (const sourcePath of TYPE_SOURCE_FILES) {
    if (!context.hasFile(sourcePath)) {
      continue;
    }

    const source = context.getSourceFile(sourcePath);
    stripTypeScriptSyntax(source);
    context.renameFile(sourcePath, sourcePath.replace(/\.tsx$/, ".jsx"));
  }
}
