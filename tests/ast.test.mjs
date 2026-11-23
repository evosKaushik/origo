import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { Project } from "ts-morph";

import {
  addImport,
  addNamedImport,
  getDefineConfigObject,
  upsertObjectProperty,
} from "../dist/composer/ast/index.js";
import { createAstContext } from "../dist/composer/ast/context.js";

function count(text, pattern) {
  return text.match(pattern)?.length ?? 0;
}

test("AST import helpers are idempotent", () => {
  const project = new Project({ useInMemoryFileSystem: true });
  const source = project.createSourceFile(
    "/test.ts",
    `export const value = 1;\n`
  );

  addNamedImport(source, "node:url", "fileURLToPath");
  addNamedImport(source, "node:url", "fileURLToPath");
  addImport(source, "vite", "defineConfig");
  addImport(source, "vite", "defineConfig");

  const text = source.getFullText();

  assert.equal(count(text, /fileURLToPath/g), 1);
  assert.equal(count(text, /from "node:url"/g), 1);
  assert.equal(count(text, /defineConfig/g), 1);
  assert.equal(count(text, /from "vite"/g), 1);
});

test("AST object helpers can upsert config options without duplication", () => {
  const project = new Project({ useInMemoryFileSystem: true });
  const source = project.createSourceFile(
    "/vite.config.ts",
    `import { defineConfig } from "vite";

export default defineConfig({ plugins: [] });
`
  );

  const object = getDefineConfigObject(source);

  upsertObjectProperty(object, "base", '"./"');
  upsertObjectProperty(object, "base", '"/app"');

  const text = source.getFullText();

  assert.equal(count(text, /base:/g), 1);
  assert.match(text, /base: "\/app"/);
});

test("AST config helper reports missing defineConfig clearly", () => {
  const project = new Project({ useInMemoryFileSystem: true });
  const source = project.createSourceFile("/config.ts", `export default {};\n`);

  assert.throws(() => getDefineConfigObject(source), /defineConfig\(\) not found/);
});

test("one AST context stays scoped to one project root", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "origo-ast-"));

  try {
    const context = createAstContext(root);

    const source = context.createSourceFile("src/main.ts", "export const x = 1;\n");
    assert.equal(source.getFilePath(), path.join(root, "src/main.ts"));
    assert.throws(
      () => context.createSourceFile("../escape.ts", "export const x = 1;\n"),
      /escapes the project root/
    );

    context.removeSourceFile("src/main.ts");
    assert.equal(context.getSourceFileIfExists("src/main.ts"), undefined);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
