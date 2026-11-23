import { input } from "@inquirer/prompts";

import { isPathLike } from "../core/project-target.js";

export async function promptProjectName(): Promise<string> {
  const name = await input({
    message: "Project name or path",
    default: "my-origo-app",
    theme: {
      prefix: "◆",
    },
    validate: (value) => {
      const trimmed = value.trim();

      if (!trimmed) {
        return "Enter a project name or path";
      }

      if (isPathLike(trimmed)) {
        return true;
      }

      if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(trimmed)) {
        return "Use a project name, ./, ., or a valid path";
      }

      return true;
    },
  });

  return name.trim();
}
