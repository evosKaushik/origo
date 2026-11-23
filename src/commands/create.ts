import path from "node:path";

import { selectArchitecture } from "../prompts/architecture.js";
import { selectTechStack } from "../prompts/tech-stack.js";
import { selectCustomStack } from "../prompts/custom-stack.js";
import { selectCustomFullStack } from "../prompts/custom-fullstack.js";
import { selectDatabasePackages } from "../prompts/database-package.js";
import { promptProjectName } from "../prompts/project-name.js";
import { fullStackOptions } from "../config/fullstack.js";
import { resolveDependencies } from "../core/dependency-resolver.js";
import { installDependencies } from "../core/install-dependencies.js";
import { copyTemplate } from "../core/copy-template.js";
import { resolveProjectTarget } from "../core/project-target.js";
import { generateBackendProject } from "../generators/backend/index.js";
import {
  generateFrontendProject,
  writeGeneratedFiles,
} from "../generators/frontend/index.js";
import {
  buildFullStackRootPackageJson,
  writePackageJson,
} from "../generators/package-json/index.js";
import { frontendFrameworkOptions } from "../registry/frameworks.js";
import { DEFAULT_STYLING, stylingOptions } from "../registry/styling.js";
import { logger } from "../ui/logger.js";
import type { ProjectConfig } from "../types/project.js";

function displayList(label: string, items: string[], isLast: boolean): void {
  console.log(`  ${isLast ? "└──" : "├──"} ${label}`);

  if (!items.length) {
    console.log("      └── None");
    return;
  }

  items.forEach((item, index) => {
    const last = index === items.length - 1;
    console.log(`      ${last ? "└──" : "├──"} ${item}`);
  });
}

function displayProjectConfig(config: ProjectConfig): void {
  console.log("\n◆ Project Configuration");
  displayList("Architecture", [config.architecture], false);
  displayList("Tech Stack", config.techStacks, false);
}

function expandStacks(stacks: string[]): string[] {
  return stacks.flatMap((stack) => {
    const preset = fullStackOptions.find((option) => option.value === stack);

    return preset
      ? [stack, ...preset.frontend, ...preset.backend, ...preset.database]
      : [stack];
  });
}

function applyDefaultStyling(selectedStacks: string[], active: Set<string>): void {
  const hasFrontendFramework = frontendFrameworkOptions.some((option) =>
    active.has(option.value)
  );
  const hasStylingLibrary = stylingOptions.some((option) =>
    active.has(option.value)
  );

  if (!hasFrontendFramework || hasStylingLibrary || active.has(DEFAULT_STYLING)) {
    return;
  }

  selectedStacks.push(DEFAULT_STYLING);
  active.add(DEFAULT_STYLING);
}

export async function createCommand(projectInput?: string, targetPathInput?: string) {
  const projectInputValue = projectInput ?? (await promptProjectName());
  const { projectName, projectDirectory } = resolveProjectTarget(
    projectInputValue,
    targetPathInput
  );
  const relativeDirectory = path.relative(process.cwd(), projectDirectory);
  const displayDirectory = relativeDirectory || ".";

  const architecture = await selectArchitecture();
  const active = new Set<string>();
  let selectedStacks: string[];

  selectedStacks = await selectTechStack(architecture, active);

  expandStacks(selectedStacks).forEach((stack) => active.add(stack));

  const customStacks = !selectedStacks.includes("custom")
    ? []
    : architecture === "full-stack"
      ? await selectCustomFullStack(active)
      : await selectCustomStack();

  customStacks.forEach((stack) => active.add(stack));
  const databasePackages = await selectDatabasePackages(active);

  applyDefaultStyling(selectedStacks, active);


  const config: ProjectConfig = {
    architecture,
    techStacks: [
      ...selectedStacks.filter((stack) => stack !== "custom"),
      ...customStacks,
      ...databasePackages,
    ],
  };

  displayProjectConfig(config);

  const technologies = [...config.techStacks];
  const wantsFrontend = active.has("react");
  const wantsBackend = active.has("express") || active.has("fastify");
  const isFullStackLayout =
    architecture === "full-stack" && wantsFrontend && wantsBackend;
  const dependencyTechnologies = [...technologies];

  if (wantsBackend && active.has("typescript")) {
    dependencyTechnologies.push(
      active.has("fastify") ? "fastify-typescript" : "express-typescript"
    );
  }

  logger.info("Resolving package versions from npm...");
  const { dependencies, devDependencies, scripts } =
    await resolveDependencies(dependencyTechnologies);
  let rootDevDependencies: Record<string, string> = {};

  if (isFullStackLayout) {
    const rootPackages = await resolveDependencies(["fullstack-root"]);
    rootDevDependencies = rootPackages.devDependencies;
  }

  const generatedFiles: Array<{
    path: string;
    content: string | Buffer;
    conflict: "ensure" | "overwrite";
  }> = [];
  let frontendGenerated = false;
  let backendGenerated = false;

  if (wantsFrontend) {
    try {
      logger.info("Generating React frontend files...");
      const generatedProject = await generateFrontendProject({
        projectDirectory,
        projectName,
        technologies: [...active],
        dependencies,
        devDependencies,
        scripts,
        rootDirectory: isFullStackLayout ? "client" : "",
        fullStack: isFullStackLayout,
      });

      generatedFiles.push(...generatedProject.files);
      frontendGenerated = true;

      logger.success(
        `Generated React + ${generatedProject.bundler} (${generatedProject.language}) frontend`
      );

      if (generatedProject.appliedFeatures.length) {
        logger.success(`Applied ${generatedProject.appliedFeatures.join(", ")}`);
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      logger.warn(`Could not generate frontend: ${reason}`);
    }
  }

  if (wantsBackend) {
    try {
      logger.info("Generating Node.js backend files...");
      const generatedProject = await generateBackendProject({
        projectDirectory,
        projectName,
        technologies: [...active],
        dependencies,
        devDependencies,
        scripts,
        includePackageJson: !frontendGenerated,
        rootDirectory: isFullStackLayout ? "server" : "",
        standalone: !isFullStackLayout,
      });

      generatedFiles.push(...generatedProject.files);
      backendGenerated = true;

      logger.success(
        `Generated Node.js + ${generatedProject.framework} (${generatedProject.language}) backend`
      );
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);

      if (!frontendGenerated) {
        logger.error(`Could not generate backend: ${reason}`);
        throw error;
      }

      logger.warn(`Could not generate backend: ${reason}`);
    }
  }

  if (generatedFiles.length) {
    await writeGeneratedFiles(projectDirectory, generatedFiles);
    logger.success(`Generated ${generatedFiles.length} project files`);
  }

  const usesFullStackPackages =
    isFullStackLayout && frontendGenerated && backendGenerated;

  if (usesFullStackPackages) {
    await writePackageJson(
      projectDirectory,
      buildFullStackRootPackageJson(projectName, rootDevDependencies)
    );

    logger.success(`Created ${path.join(displayDirectory, "package.json")}`);
  } else if (!frontendGenerated && !backendGenerated) {
    await writePackageJson(projectDirectory, {
      name: projectName,
      version: "1.0.0",
      private: true,
      type: "module",
      scripts,
      dependencies,
      devDependencies,
    });

    logger.success(`Created ${path.join(displayDirectory, "package.json")}`);

    try {
      logger.info("Copying template files...");
      await copyTemplate(projectDirectory, technologies);
      logger.success("Copied React + Vite template");
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      logger.error(`Could not copy template: ${reason}`);
      throw error;
    }
  }

  try {
    logger.info("Installing dependencies...");
    const installDirectories = [projectDirectory];

    if (usesFullStackPackages) {
      installDirectories.push(
        path.join(projectDirectory, "client"),
        path.join(projectDirectory, "server")
      );
    }

    for (const directory of installDirectories) {
      await installDependencies(directory);
    }

    logger.success("Generated package-lock.json files");
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    logger.warn(`Could not install dependencies: ${reason}`);
  }

  return config;
}
