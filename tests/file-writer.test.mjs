import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { writeGeneratedFiles } from "../dist/generators/frontend/file-writer.js";

async function withTempDirectory(callback) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "origo-writer-"));

  try {
    await callback(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("file writer creates directories and writes generated files", async () => {
  await withTempDirectory(async (directory) => {
    await writeGeneratedFiles(directory, [
      { path: "src/nested/file.txt", content: "generated", conflict: "ensure" },
    ]);

    assert.equal(
      await readFile(path.join(directory, "src/nested/file.txt"), "utf8"),
      "generated"
    );
  });
});

test("file writer respects ensure and overwrite conflict policies", async () => {
  await withTempDirectory(async (directory) => {
    await writeFile(path.join(directory, "file.txt"), "original");

    await assert.rejects(
      writeGeneratedFiles(directory, [
        { path: "file.txt", content: "changed", conflict: "ensure" },
      ]),
      /Refusing to overwrite existing file/
    );

    await writeGeneratedFiles(directory, [
      { path: "file.txt", content: "original", conflict: "ensure" },
    ]);
    await writeGeneratedFiles(directory, [
      { path: "file.txt", content: "changed", conflict: "overwrite" },
    ]);

    assert.equal(
      await readFile(path.join(directory, "file.txt"), "utf8"),
      "changed"
    );
  });
});

test("file writer refuses paths outside the project root", async () => {
  await withTempDirectory(async (directory) => {
    await assert.rejects(
      writeGeneratedFiles(directory, [
        { path: "../outside.txt", content: "nope", conflict: "ensure" },
      ]),
      /escapes the project root/
    );
  });
});

test("file writer refuses to write through symbolic links", async () => {
  await withTempDirectory(async (directory) => {
    await writeFile(path.join(directory, "target.txt"), "target");
    await symlink(
      path.join(directory, "target.txt"),
      path.join(directory, "link.txt")
    );

    await assert.rejects(
      writeGeneratedFiles(directory, [
        { path: "link.txt", content: "changed", conflict: "overwrite" },
      ]),
      /Refusing to write through a symbolic link/
    );

    assert.equal(
      await readFile(path.join(directory, "target.txt"), "utf8"),
      "target"
    );
  });
});
