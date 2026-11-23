import type { FrontendGenerationContext } from "./context.js";
import type { FrontendProfile } from "./resolvers/profile.js";

export function validateGeneratedProject(
  context: FrontendGenerationContext,
  profile: FrontendProfile,
  includePackageJson = true
): void {
  const required = [
    ...(includePackageJson ? ["package.json"] : []),
    "index.html",
    `src/App.${profile.sourceExtension}`,
    `src/main.${profile.sourceExtension}`,
    `vite.config.${profile.configExtension}`,
  ];

  if (profile.isTypeScript) {
    required.push("tsconfig.json", "src/vite-env.d.ts");
  }

  const styleFiles = {
    vanilla: ["src/App.css", "src/index.css"],
    tailwind: ["src/index.css"],
    bootstrap: ["src/index.css"],
    sass: ["src/App.scss", "src/index.scss"],
  };

  required.push(...styleFiles[profile.style]);

  if (profile.isFullStack) {
    required.push(".env");
    required.push(`src/components/PingButton.${profile.sourceExtension}`);

    if (profile.style === "sass") {
      required.push("src/components/PingButton.scss");
    }
  }

  for (const relativePath of required) {
    if (!context.hasFile(relativePath)) {
      throw new Error(`Generated project is missing ${relativePath}`);
    }
  }
}
