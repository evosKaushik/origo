import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  generateBackendProject,
  resolveDatabaseSetup,
} from "../dist/generators/backend/index.js";
import { generateFrontendProject } from "../dist/generators/frontend/index.js";
import { buildFullStackRootPackageJson } from "../dist/generators/package-json/index.js";
import { databasePackageOptions } from "../dist/registry/databases.js";

function createOptions(projectDirectory, technologies) {
  return {
    projectDirectory,
    projectName: "backend-app",
    technologies,
    dependencies: {
      cors: "^2.8.5",
      dotenv: "^17.2.3",
      express: "^5.1.0",
      react: "^19.2.0",
      "react-dom": "^19.2.0",
    },
    devDependencies: {
      "@types/cors": "^2.8.19",
      "@types/express": "^5.0.3",
      "@types/node": "^26.6.6",
      "@types/react": "^19.2.2",
      "@vitejs/plugin-react": "^5.0.4",
      tsx: "^4.20.6",
      typescript: "^7.0.2",
      vite: "^7.1.12",
    },
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
      "dev:server": "tsx watch server/src/server.ts",
      "build:server": "tsc -p server/tsconfig.json",
      "start:server": "node server/dist/server.js",
    },
  };
}

function fileMap(files) {
  return new Map(files.map((file) => [file.path, file.content]));
}

async function withTempDirectory(callback) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "origo-backend-"));

  try {
    await callback(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("generates a Node.js + Express + TypeScript backend in src", async () => {
  await withTempDirectory(async (directory) => {
    const result = await generateBackendProject(
      createOptions(directory, ["nodejs", "express", "typescript", "mongodb"])
    );
    const files = fileMap(result.files);

    assert.equal(result.language, "typescript");
    assert.equal(result.framework, "express");
    assert.equal(result.runtime, "nodejs");

    assert.ok(files.has("src/app.ts"));
    assert.ok(files.has("src/server.ts"));
    assert.ok(files.has("src/config/env.ts"));
    assert.ok(files.has("src/routes/index.ts"));
    assert.ok(files.has("tsconfig.json"));
    assert.ok(files.has("package.json"));
    assert.ok(files.has(".env"));
    assert.ok(files.has("src/config/database.ts"));
    assert.ok(files.has("src/models/todo.ts"));
    assert.ok(files.has("src/services/todos.ts"));
    assert.ok(files.has("src/routes/todos.ts"));
    assert.equal(result.database, "mongodb-driver");
    assert.ok(!files.has("server/src/app.ts"));
    assert.ok(!files.has("src/app.js"));

    assert.match(files.get("src/app.ts"), /backend-app/);
    assert.match(files.get("src/app.ts"), /import cors from "cors"/);
    assert.match(files.get("src/app.ts"), /env\.clientUrl/);
    assert.match(files.get("src/server.ts"), /dotenv\.config/);
    assert.match(files.get("src/routes/index.ts"), /\/health/);
    assert.match(files.get(".env"), /PORT=3000/);
    assert.match(files.get(".env"), /CLIENT_URL=http:\/\/localhost:5173/);
    assert.match(files.get(".env"), /MONGODB_URL=mongodb:\/\/localhost:27017/);
    assert.match(files.get(".env"), /MONGODB_COLLECTION_NAME=todos/);
    assert.match(files.get("src/server.ts"), /connectToDatabase\(\)/);
    assert.match(files.get("src/app.ts"), /app\.use\("\/api\/todos", todoRouter\)/);
    assert.match(files.get("src/routes/todos.ts"), /todoRouter\.get\("\/"/);
    assert.match(files.get("src/routes/todos.ts"), /todoRouter\.post\("\/"/);
    assert.match(files.get("src/routes/todos.ts"), /todoRouter\.put\("\/:id"/);
    assert.match(files.get("src/routes/todos.ts"), /todoRouter\.delete\("\/:id"/);
    assert.doesNotMatch(files.get("src/server.ts"), /{{DB_/);
    assert.doesNotMatch(files.get("src/app.ts"), /{{DB_/);

    const tsconfig = JSON.parse(files.get("tsconfig.json"));
    assert.equal(tsconfig.compilerOptions.module, "NodeNext");
    assert.equal(tsconfig.compilerOptions.outDir, "dist");
    assert.deepEqual(tsconfig.include, ["src/**/*.ts"]);

    const packageJson = JSON.parse(files.get("package.json"));
    assert.equal(packageJson.scripts.dev, "tsx watch src/server.ts");
    assert.equal(packageJson.scripts.build, "tsc -p tsconfig.json");
    assert.equal(packageJson.scripts.start, "node dist/server.js");
  });
});

test("generates a vanilla JavaScript Node.js + Express backend in src", async () => {
  await withTempDirectory(async (directory) => {
    const result = await generateBackendProject(
      createOptions(directory, ["nodejs", "express", "javascript", "mongodb"])
    );
    const files = fileMap(result.files);

    assert.equal(result.language, "javascript");
    assert.ok(files.has("src/app.js"));
    assert.ok(files.has("src/server.js"));
    assert.ok(files.has("src/config/env.js"));
    assert.ok(files.has("src/routes/index.js"));
    assert.ok(files.has(".env"));
    assert.ok(!files.has("src/app.ts"));
    assert.ok(!files.has("tsconfig.json"));

    assert.doesNotMatch(files.get("src/app.js"), /: Express/);
    assert.match(files.get("src/app.js"), /backend-app/);
    assert.match(files.get("src/app.js"), /import cors from "cors"/);
    assert.match(files.get("src/app.js"), /env\.clientUrl/);
    assert.match(files.get("src/server.js"), /dotenv\.config/);

    const packageJson = JSON.parse(files.get("package.json"));
    assert.equal(packageJson.scripts.dev, "node --watch src/server.js");
    assert.equal(packageJson.scripts.build, "node --check src/server.js");
    assert.equal(packageJson.scripts.start, "node src/server.js");
  });
});

test("generates a Node.js + Fastify TypeScript backend", async () => {
  await withTempDirectory(async (directory) => {
    const options = createOptions(directory, [
      "nodejs",
      "fastify",
      "typescript",
    ]);
    options.dependencies = {
      "@fastify/cors": "^11.0.2",
      dotenv: "^17.2.3",
      fastify: "^5.6.1",
    };
    options.devDependencies = {
      "@types/node": "^26.6.6",
      tsx: "^4.20.6",
      typescript: "^7.0.2",
    };

    const result = await generateBackendProject(options);
    const files = fileMap(result.files);

    assert.equal(result.framework, "fastify");
    assert.ok(files.has("src/app.ts"));
    assert.ok(files.has("src/server.ts"));
    assert.ok(files.has("src/config/env.ts"));
    assert.ok(files.has("src/routes/index.ts"));
    assert.ok(files.has("tsconfig.json"));
    assert.ok(files.has(".env"));
    assert.match(files.get("src/app.ts"), /from "fastify"/);
    assert.match(files.get("src/app.ts"), /from "@fastify\/cors"/);
    assert.match(files.get("src/app.ts"), /env\.clientUrl/);
    assert.match(files.get("src/server.ts"), /dotenv\.config/);
    assert.match(files.get("src/routes/index.ts"), /\/api\/health/);
    assert.match(files.get(".env"), /CLIENT_URL=http:\/\/localhost:5173/);

    const packageJson = JSON.parse(files.get("package.json"));
    assert.equal(packageJson.scripts.dev, "tsx watch src/server.ts");
    assert.equal(packageJson.scripts.build, "tsc -p tsconfig.json");
  });
});

test("full-stack projects place frontend in client and backend in server", async () => {
  await withTempDirectory(async (directory) => {
    const options = createOptions(directory, [
      "react",
      "typescript",
      "vite",
      "vanilla",
      "nodejs",
      "express",
    ]);

    const frontend = await generateFrontendProject({
      ...options,
      technologies: ["react", "typescript", "vite", "vanilla"],
      rootDirectory: "client",
      fullStack: true,
    });
    const backend = await generateBackendProject({
      ...options,
      technologies: ["nodejs", "express", "typescript"],
      rootDirectory: "server",
      standalone: false,
    });

    const files = [...frontend.files, ...backend.files];
    const paths = files.map((file) => file.path);
    const fileContents = fileMap(files);

    assert.ok(!paths.includes("package.json"));
    assert.ok(paths.includes("client/package.json"));
    assert.ok(paths.includes("server/package.json"));
    assert.ok(paths.includes("client/src/App.tsx"));
    assert.ok(paths.includes("client/src/components/PingButton.tsx"));
    assert.ok(paths.includes("client/.env"));
    assert.ok(paths.includes("client/index.html"));
    assert.ok(paths.includes("client/tsconfig.json"));
    assert.ok(paths.includes("server/src/server.ts"));
    assert.ok(paths.includes("server/tsconfig.json"));
    assert.ok(paths.includes("server/.env"));
    assert.ok(!paths.includes("src/App.tsx"));
    assert.ok(!paths.includes("src/server.ts"));

    const clientPackageJson = JSON.parse(fileContents.get("client/package.json"));
    assert.equal(clientPackageJson.name, "backend-app-client");
    assert.equal(clientPackageJson.scripts.dev, "vite");
    assert.equal(clientPackageJson.scripts.build, "vite build");
    assert.equal(clientPackageJson.scripts.typecheck, "tsc -p tsconfig.json --noEmit");
    assert.equal(clientPackageJson.dependencies.react, "^19.2.0");

    const serverPackageJson = JSON.parse(fileContents.get("server/package.json"));
    assert.equal(serverPackageJson.name, "backend-app-server");
    assert.equal(serverPackageJson.scripts.dev, "tsx watch src/server.ts");
    assert.equal(serverPackageJson.scripts.build, "tsc -p tsconfig.json");
    assert.equal(serverPackageJson.scripts.start, "node dist/server.js");
    assert.equal(serverPackageJson.dependencies.cors, "^2.8.5");

    assert.match(
      fileContents.get("client/.env"),
      /VITE_API_URL=http:\/\/localhost:3000\/api/
    );
    assert.match(
      fileContents.get("client/src/App.tsx"),
      /import PingButton from "\.\/components\/PingButton"/
    );
    assert.match(fileContents.get("client/src/App.tsx"), /<PingButton \/>/);
    assert.match(
      fileContents.get("client/src/components/PingButton.tsx"),
      /\$\{API_URL\}\/health/
    );
    assert.match(fileContents.get("server/src/app.ts"), /import cors from "cors"/);

    const frontendTsConfig = JSON.parse(fileContents.get("client/tsconfig.json"));
    assert.equal(frontendTsConfig.compilerOptions.types, undefined);

    const backendTsConfig = JSON.parse(fileContents.get("server/tsconfig.json"));
    assert.equal(backendTsConfig.compilerOptions.outDir, "dist");
  });
});

test("full-stack root package.json orchestrates client and server packages", () => {
  const packageJson = buildFullStackRootPackageJson("full-stack-app", {
    concurrently: "^9.2.1",
  });

  assert.equal(packageJson.name, "full-stack-app");
  assert.deepEqual(packageJson.dependencies, {});
  assert.equal(packageJson.devDependencies.concurrently, "^9.2.1");
  assert.match(packageJson.scripts.dev, /npm --prefix client run dev/);
  assert.match(packageJson.scripts.dev, /npm --prefix server run dev/);
  assert.equal(packageJson.scripts["dev:client"], "npm --prefix client run dev");
  assert.equal(packageJson.scripts["dev:server"], "npm --prefix server run dev");
  assert.equal(packageJson.scripts.build, "npm --prefix client run build && npm --prefix server run build");
  assert.equal(packageJson.scripts.start, "npm --prefix server run start");
});

test("database package prompts expose driver and ORM choices", () => {
  assert.deepEqual(
    databasePackageOptions.mongodb.map((option) => option.value),
    ["mongodb-driver", "mongoose"]
  );
  assert.deepEqual(
    databasePackageOptions.postgresql.map((option) => option.value),
    ["postgresql-driver", "prisma", "sequelize"]
  );
});

test("generates Mongoose configuration when Mongoose is selected", async () => {
  await withTempDirectory(async (directory) => {
    const result = await generateBackendProject(
      createOptions(directory, [
        "nodejs",
        "express",
        "typescript",
        "mongodb",
        "mongoose",
      ])
    );
    const files = fileMap(result.files);

    assert.equal(result.database, "mongoose");
    assert.ok(files.has("src/models/todo.ts"));
    assert.match(files.get("src/models/todo.ts"), /TodoModel/);
    assert.match(files.get("src/services/todos.ts"), /TodoModel\.find\(\)/);
    assert.match(files.get("src/routes/todos.ts"), /todoRouter\.delete\("\/:id"/);
    assert.match(files.get("src/config/database.ts"), /from "mongoose"/);
    assert.match(files.get(".env"), /MONGODB_URL=/);
    assert.match(files.get(".env"), /MONGODB_COLLECTION_NAME=todos/);
  });
});

test("resolves PostgreSQL database packages with env and scripts", () => {
  const cases = [
    ["postgresql-driver", "postgresql-driver"],
    ["prisma", "prisma"],
    ["sequelize", "sequelize"],
  ];

  for (const [token, expected] of cases) {
    const setup = resolveDatabaseSetup(
      "typescript",
      "express",
      new Set(["postgresql", token])
    );

    assert.equal(setup.id, expected);
    assert.ok(
      setup.env.includes(
        "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/origo_db"
      )
    );
    assert.ok(setup.env.includes("POSTGRES_TABLE=todos"));
    assert.ok(
      setup.files.some((file) => file.path === "src/config/database.ts")
    );
    assert.ok(setup.files.some((file) => file.path === "src/models/todo.ts"));
    assert.ok(setup.files.some((file) => file.path === "src/services/todos.ts"));
    assert.ok(setup.files.some((file) => file.path === "src/routes/todos.ts"));
    assert.equal(setup.serverConnect, "await connectToDatabase();");
    assert.equal(
      setup.routeRegister,
      '  app.use("/api/todos", todoRouter);'
    );
  }

  const prisma = resolveDatabaseSetup(
    "typescript",
    "express",
    new Set(["postgresql", "prisma"])
  );
  assert.ok(prisma.files.some((file) => file.path === "prisma/schema.prisma"));
  assert.ok(prisma.files.some((file) => file.path === "prisma.config.ts"));
  assert.ok(
    prisma.files.some((file) =>
      file.content.includes('from "@prisma/adapter-pg"')
    )
  );
  assert.equal(prisma.scripts["db:generate"], "prisma generate");
  assert.equal(prisma.scripts["db:push"], "prisma db push");
});
