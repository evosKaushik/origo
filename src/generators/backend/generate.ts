import type {
  BackendFramework,
  BackendLanguage,
} from "../../types/project.js";
import { renderTemplate } from "../frontend/template.js";
import { buildPackageJson } from "../package-json/build-package-json.js";
import { loadBackendBaseFiles } from "./base-loader.js";
import {
  BackendGenerationContext,
  type BackendGenerationOptions,
  type GeneratedBackendFile,
} from "./context.js";
import {
  resolveDatabaseSetup,
  type DatabaseSetupId,
} from "./resolvers/database.js";

export interface GeneratedBackendProject {
  files: GeneratedBackendFile[];
  language: BackendLanguage;
  framework: BackendFramework;
  database: DatabaseSetupId;
  runtime: "nodejs";
}

function serverScripts(language: BackendLanguage): Record<string, string> {
  if (language === "typescript") {
    return {
      dev: "tsx watch src/server.ts",
      build: "tsc -p tsconfig.json",
      start: "node dist/server.js",
    };
  }

  return {
    dev: "node --watch src/server.js",
    build: "node --check src/server.js",
    start: "node src/server.js",
  };
}

export function resolveBackendLanguage(
  context: BackendGenerationContext
): BackendLanguage {
  return context.has("typescript") ? "typescript" : "javascript";
}

export function resolveBackendFramework(
  context: BackendGenerationContext
): BackendFramework {
  return context.has("fastify") ? "fastify" : "express";
}

export async function generateBackendProject(
  options: BackendGenerationOptions
): Promise<GeneratedBackendProject> {
  const context = new BackendGenerationContext(options);
  const language = resolveBackendLanguage(context);
  const framework = resolveBackendFramework(context);
  const database = resolveDatabaseSetup(
    language,
    framework,
    context.technologies
  );
  const files = await loadBackendBaseFiles(framework, language);

  for (const file of files) {
    const content =
      typeof file.content === "string"
        ? renderTemplate(file.content, {
            PROJECT_NAME: options.projectName,
            DB_IMPORT: database.serverImport,
            DB_CONNECT: database.serverConnect,
            DB_ROUTE_IMPORT: database.routeImport,
            DB_ROUTE_REGISTER: database.routeRegister,
          })
        : file.content;

    context.addFile(file.destination, content);
  }

  context.addTextFile(".env", `${database.env.join("\n")}\n`);

  for (const file of database.files) {
    context.addTextFile(file.path, file.content);
  }

  if (options.includePackageJson ?? true) {
    const scripts = {
      ...serverScripts(language),
      ...database.scripts,
    };

    context.addJsonFile(
      "package.json",
      buildPackageJson({
        name: context.rootDirectory
          ? `${options.projectName}-${context.rootDirectory}`
          : options.projectName,
        version: "1.0.0",
        private: true,
        type: "module",
        scripts,
        dependencies: options.dependencies,
        devDependencies: options.devDependencies,
      })
    );
  }

  return {
    files: context.finalize(),
    language,
    framework,
    database: database.id,
    runtime: "nodejs",
  };
}
