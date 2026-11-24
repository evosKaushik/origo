import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { minify } from "terser";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const templateRoot = path.join(dist, "base");

async function collectJavaScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (fullPath === templateRoot) {
        continue;
      }

      files.push(...(await collectJavaScriptFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = await collectJavaScriptFiles(dist);

for (const file of files) {
  const source = await readFile(file, "utf8");
  const mapPath = `${file}.map`;

  let existingMap;

  try {
    existingMap = JSON.parse(await readFile(mapPath, "utf8"));
  } catch {}

  const result = await minify(source, {
    module: true,
    compress: { passes: 2 },
    mangle: true,
    format: { comments: false },
    sourceMap: existingMap
      ? {
          content: existingMap,
          filename: path.basename(file),
          url: `${path.basename(file)}.map`,
        }
      : false,
  });

  if (!result.code) {
    continue;
  }

  await writeFile(file, result.code);

  if (existingMap && result.map) {
    await writeFile(mapPath, result.map);
  }
}
