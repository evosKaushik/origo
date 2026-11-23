import type { SourceFile } from "ts-morph";

export function addImport(
  source: SourceFile,
  module: string,
  defaultImport: string
) {
  const existing = source
    .getImportDeclarations()
    .find(item =>
      item.getModuleSpecifierValue() === module
    );

  if (existing) {
    if (!existing.getDefaultImport()) {
      existing.setDefaultImport(defaultImport);
    }
    return;
  }

  source.addImportDeclaration({
    moduleSpecifier: module,
    defaultImport,
  });
}

export function addNamedImport(
  source: SourceFile,
  module: string,
  namedImport: string
) {
  const existing = source
    .getImportDeclarations()
    .find(item =>
      item.getModuleSpecifierValue() === module
    );

  if (existing) {
    const alreadyImported = existing
      .getNamedImports()
      .some(item => item.getName() === namedImport);

    if (!alreadyImported) {
      existing.addNamedImport(namedImport);
    }
    return;
  }

  source.addImportDeclaration({
    moduleSpecifier: module,
    namedImports: [namedImport],
  });
}