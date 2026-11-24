import { execFile } from "node:child_process";
import { cp, rm } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const baseSource = path.join(root, "src", "base");
const baseDestination = path.join(dist, "base");

await rm(dist, { recursive: true, force: true });

const tsc = process.platform === "win32" ? "tsc.cmd" : "tsc";
await execFileAsync(tsc, [], {
  cwd: root,
  stdio: "inherit",
});

await cp(baseSource, baseDestination, {
  recursive: true,
  filter: (source) => !source.endsWith("manifest.ts"),
});

await execFileAsync(process.execPath, [path.join(root, "scripts", "minify.js")], {
  cwd: root,
  stdio: "inherit",
});
