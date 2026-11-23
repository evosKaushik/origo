import type { PackageMetadata } from "../types/project.js";
import {
  tailwindDependencies,
  tailwindV3Dependencies,
} from "../features/frontend/styling/tailwind/dependencies.js";
import { shadcnDependencies } from "../features/frontend/ui/shadcn/dependencies.js";

export type { PackageMetadata } from "../types/project.js";

export const packageRegistry: Record<string, PackageMetadata> = {
  vite: {
    devDependencies: ["vite"],
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
  },
  rsbuild: {
    devDependencies: ["@rsbuild/core"],
    scripts: {
      dev: "rsbuild dev",
      build: "rsbuild build",
      preview: "rsbuild preview",
    },
  },
  webpack: {
    devDependencies: ["webpack", "webpack-cli", "webpack-dev-server"],
    scripts: {
      dev: "webpack serve --mode development",
      build: "webpack --mode production",
    },
  },
  parcel: {
    devDependencies: ["parcel"],
    scripts: {
      dev: "parcel index.html",
      build: "parcel build index.html",
    },
  },

  react: {
    dependencies: ["react", "react-dom"],
    devDependencies: [
      "@vitejs/plugin-react",
      "@types/react",
      "@types/react-dom",
    ],
  },
  vue: {
    dependencies: ["vue"],
    devDependencies: ["@vitejs/plugin-vue"],
  },
  svelte: {
    dependencies: ["svelte"],
    devDependencies: ["@sveltejs/vite-plugin-svelte"],
  },
  angular: {
    dependencies: [
      "@angular/common",
      "@angular/compiler",
      "@angular/core",
      "@angular/platform-browser",
      "@angular/router",
      "rxjs",
      "zone.js",
    ],
    devDependencies: ["@angular/cli", "@angular-devkit/build-angular"],
    scripts: {
      dev: "ng serve",
      build: "ng build",
    },
  },
  solid: {
    dependencies: ["solid-js"],
    devDependencies: ["vite-plugin-solid"],
  },
  preact: {
    dependencies: ["preact"],
    devDependencies: ["@preact/preset-vite"],
  },
  vanilla: {},
  "fullstack-root": {
    devDependencies: ["concurrently"],
  },

  express: {
    dependencies: ["cors", "dotenv", "express"],
    scripts: {
      "dev:server": "node --watch server/src/server.js",
      "build:server": "node --check server/src/server.js",
      "start:server": "node server/src/server.js",
    },
  },
  "express-typescript": {
    devDependencies: [
      "@types/cors",
      "@types/express",
      "@types/node",
      "tsx",
    ],
    scripts: {
      "dev:server": "tsx watch server/src/server.ts",
      "build:server": "tsc -p server/tsconfig.json",
      "start:server": "node server/dist/server.js",
    },
  },
  fastify: {
    dependencies: ["@fastify/cors", "dotenv", "fastify"],
    scripts: {
      "dev:server": "node --watch server/src/server.js",
      "build:server": "node --check server/src/server.js",
      "start:server": "node server/src/server.js",
    },
  },
  "fastify-typescript": {
    devDependencies: ["@types/node", "tsx"],
    scripts: {
      "dev:server": "tsx watch server/src/server.ts",
      "build:server": "tsc -p server/tsconfig.json",
      "start:server": "node server/dist/server.js",
    },
  },
  nestjs: {
    dependencies: [
      "@nestjs/common",
      "@nestjs/core",
      "@nestjs/platform-express",
      "reflect-metadata",
      "rxjs",
    ],
    devDependencies: ["@nestjs/cli"],
    scripts: {
      dev: "nest start --watch",
      build: "nest build",
    },
  },
  hono: { dependencies: ["hono"] },
  gin: {},
  custom: {},

  nodejs: {},
  bun: {},
  deno: {},
  go: {},

  typescript: { devDependencies: ["typescript", "@types/node"] },
  javascript: {},
  "css-modules": {},

  tailwind: tailwindDependencies,
  "tailwind-v3": tailwindV3Dependencies,
  "tailwind-v4": tailwindDependencies,
  bootstrap: { dependencies: ["bootstrap"] },
  css: {},
  sass: { devDependencies: ["sass"] },

  "react-router": { dependencies: ["react-router-dom"] },
  "tanstack-router": { dependencies: ["@tanstack/react-router"] },
  "vue-router": { dependencies: ["vue-router"] },
  "svelte-routing": { dependencies: ["svelte-routing"] },

  mongodb: {},
  "mongodb-driver": { dependencies: ["mongodb"] },
  mongoose: { dependencies: ["mongoose"] },
  postgresql: {},
  "postgresql-driver": {
    dependencies: ["pg"],
    devDependencies: ["@types/pg"],
  },
  prisma: {
    dependencies: ["@prisma/adapter-pg", "@prisma/client"],
    devDependencies: ["prisma"],
  },
  sequelize: { dependencies: ["pg", "sequelize"] },
  mysql: { dependencies: ["mysql2"] },
  sqlite: { dependencies: ["better-sqlite3"] },
  redis: { dependencies: ["redis"] },
  none: {},

  "shadcn-ui": shadcnDependencies,
  "radix-ui": {
    dependencies: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
  },
  "tailwind-ui": {},
  "aceternity-ui": {},

  vitest: {
    devDependencies: ["vitest"],
    scripts: { test: "vitest" },
  },
  jest: {
    devDependencies: ["jest", "@types/jest"],
    scripts: { test: "jest" },
  },
  playwright: {
    devDependencies: ["@playwright/test"],
    scripts: { "test:e2e": "playwright test" },
  },
  "testing-library-react": {
    devDependencies: ["@testing-library/react", "@testing-library/jest-dom"],
  },
  "testing-library-vue": {
    devDependencies: ["@testing-library/vue"],
  },

  eslint: {
    devDependencies: ["eslint", "@eslint/js", "typescript-eslint"],
    scripts: { lint: "eslint ." },
  },
  prettier: {
    devDependencies: ["prettier"],
    scripts: { format: "prettier --write ." },
  },
  biome: {
    devDependencies: ["@biomejs/biome"],
    scripts: {
      lint: "biome check .",
      format: "biome format --write .",
    },
  },
  husky: {
    devDependencies: ["husky"],
    scripts: { prepare: "husky" },
  },
  "lint-staged": { devDependencies: ["lint-staged"] },

  docker: {},
  "github-actions": {},

  "storybook-react": {
    devDependencies: ["storybook", "@storybook/react-vite"],
    scripts: {
      storybook: "storybook dev -p 6006",
      "build-storybook": "storybook build",
    },
  },
  "storybook-vue": {
    devDependencies: ["storybook", "@storybook/vue3-vite"],
    scripts: {
      storybook: "storybook dev -p 6006",
      "build-storybook": "storybook build",
    },
  },
  turborepo: { devDependencies: ["turbo"] },
  changesets: {
    devDependencies: ["@changesets/cli"],
    scripts: { changeset: "changeset" },
  },
};
