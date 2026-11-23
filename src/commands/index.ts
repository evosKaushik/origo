import { showBanner } from "../ui/banner.js";
import { createCommand } from "./create.js";


export async function runCLI() {
  showBanner();

  const args = process.argv.slice(2);

  if (args.length > 2) {
    throw new Error("Usage: origo <project-name> [project-path]");
  }

  const [projectName, projectPath] = args;

  await createCommand(projectName, projectPath);
}