import { applyFeatures } from "../../features/index.js";
import { buildPackageJson } from "../package-json/build-package-json.js";
import {
  FrontendGenerationContext,
  type FrontendGenerationOptions,
  type GeneratedFile,
} from "./context.js";
import {
  resolveReactBase,
  resolveBundlerConfig,
  resolveFrontendProfile,
  resolveLanguage,
  resolveTypeScriptConfig,
} from "./resolvers/index.js";
import { validateGeneratedProject } from "./validate.js";

export interface GeneratedFrontendProject {
  files: GeneratedFile[];
  appliedFeatures: string[];
  language: string;
  bundler: string;
}

function projectScripts(
  options: FrontendGenerationOptions
): Record<string, string> {
  const scripts: Record<string, string> = {
    dev: options.scripts.dev ?? "vite",
    build: options.scripts.build ?? "vite build",
    preview: options.scripts.preview ?? "vite preview",
  };

  if (options.technologies.includes("typescript")) {
    scripts.typecheck = "tsc -p tsconfig.json --noEmit";
  }

  return scripts;
}

export async function generateFrontendProject(
  options: FrontendGenerationOptions
): Promise<GeneratedFrontendProject> {
  const context = new FrontendGenerationContext(options);
  const profile = resolveFrontendProfile(context);
  const includePackageJson = options.includePackageJson ?? true;

  if (includePackageJson) {
    context.addJsonFile(
      "package.json",
      buildPackageJson({
        name: options.fullStack
          ? `${options.projectName}-client`
          : options.projectName,
        version: "1.0.0",
        private: true,
        type: "module",
        scripts: projectScripts(options),
        dependencies: options.dependencies,
        devDependencies: options.devDependencies,
      })
    );
  }

  await resolveReactBase(context, profile);
  resolveLanguage(context, profile);
  resolveBundlerConfig(context, profile);
  resolveTypeScriptConfig(context, profile);

  const appliedFeatures = applyFeatures(context);

  validateGeneratedProject(context, profile, includePackageJson);

  return {
    files: context.finalize(),
    appliedFeatures,
    language: profile.language,
    bundler: profile.bundler,
  };
}
