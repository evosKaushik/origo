import type { FrontendGenerationContext } from "../context.js";
import type { FrontendProfile } from "./profile.js";

export function resolveBundlerConfig(
  context: FrontendGenerationContext,
  profile: FrontendProfile
): void {
  if (profile.bundler !== "vite") {
    throw new Error(
      `${profile.bundlerLabel} base configuration is not implemented yet`
    );
  }

  const configPath = `vite.config.${profile.configExtension}`;

  context.addTextFile(
    configPath,
    `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`
  );
}
