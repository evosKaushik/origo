import type { BackendLanguage } from "../../../types/project.js";
import type { BaseFileDefinition } from "../express/manifest.js";

const commonFiles: BaseFileDefinition[] = [
  {
    source: "backend/express/.env",
    destination: ".env",
    kind: "text",
  },
];

const languageFiles: Record<BackendLanguage, BaseFileDefinition[]> = {
  typescript: [
    {
      source: "backend/fastify/typescript/src/app.ts",
      destination: "src/app.ts",
      kind: "text",
    },
    {
      source: "backend/fastify/typescript/src/server.ts",
      destination: "src/server.ts",
      kind: "text",
    },
    {
      source: "backend/express/typescript/src/config/env.ts",
      destination: "src/config/env.ts",
      kind: "text",
    },
    {
      source: "backend/fastify/typescript/src/routes/index.ts",
      destination: "src/routes/index.ts",
      kind: "text",
    },
    {
      source: "backend/express/typescript/tsconfig.server.json",
      destination: "tsconfig.json",
      kind: "text",
    },
  ],
  javascript: [
    {
      source: "backend/fastify/javascript/src/app.js",
      destination: "src/app.js",
      kind: "text",
    },
    {
      source: "backend/fastify/javascript/src/server.js",
      destination: "src/server.js",
      kind: "text",
    },
    {
      source: "backend/express/javascript/src/config/env.js",
      destination: "src/config/env.js",
      kind: "text",
    },
    {
      source: "backend/fastify/javascript/src/routes/index.js",
      destination: "src/routes/index.js",
      kind: "text",
    },
  ],
};

export function getFastifyBaseFiles(
  language: BackendLanguage
): BaseFileDefinition[] {
  return [...commonFiles, ...languageFiles[language]];
}
