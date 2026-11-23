import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function installDependencies(projectDirectory: string): Promise<void> {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";

  await execFileAsync(
    npm,
    ["install", "--no-audit", "--no-fund"],
    {
      cwd: projectDirectory,
      maxBuffer: 10 * 1024 * 1024,
    }
  );
}
