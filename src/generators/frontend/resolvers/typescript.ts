import type { FrontendGenerationContext } from "../context.js";
import type { FrontendProfile } from "./profile.js";

export function resolveTypeScriptConfig(
  context: FrontendGenerationContext,
  profile: FrontendProfile
): void {
  if (!profile.isTypeScript) {
    return;
  }

  context.addJsonFile("tsconfig.json", {
    compilerOptions: {
      target: "ES2022",
      useDefineForClassFields: true,
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      module: "ESNext",
      moduleResolution: "Bundler",
      jsx: "react-jsx",
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      isolatedModules: true,
      verbatimModuleSyntax: true,
      noFallthroughCasesInSwitch: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
    },
    include: [
      "src",
      profile.bundler === "vite"
        ? `vite.config.${profile.configExtension}`
        : "src",
    ],
  });
}
