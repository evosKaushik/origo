import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  FrontendGenerationContext,
} from "../dist/generators/frontend/context.js";
import { generateFrontendProject } from "../dist/generators/frontend/generate.js";
import { validateGeneratedProject } from "../dist/generators/frontend/validate.js";
import {
  resolveBundlerConfig,
  resolveFrontendProfile,
  resolveLanguage,
  resolveReactBase,
  resolveTypeScriptConfig,
} from "../dist/generators/frontend/resolvers/index.js";
import { applyFeatures } from "../dist/features/index.js";

function createOptions(projectDirectory, technologies) {
  return {
    projectDirectory,
    projectName: "test-app",
    technologies,
    dependencies: {
      react: "^19.2.0",
      "react-dom": "^19.2.0",
    },
    devDependencies: {
      "@types/node": "^26.6.6",
      "@types/react": "^19.2.2",
      "@vitejs/plugin-react": "^5.0.4",
      typescript: "^7.0.2",
      vite: "^7.1.12",
    },
    scripts: {
      dev: "vite",
      build: "vite build",
    },
  };
}

function fileMap(files) {
  return new Map(files.map((file) => [file.path, file.content]));
}

function count(text, pattern) {
  return text.match(pattern)?.length ?? 0;
}

async function withTempDirectory(callback) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "origo-frontend-"));

  try {
    await callback(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("generates a TypeScript React + Vite base from canonical files", async () => {
  await withTempDirectory(async (directory) => {
    const result = await generateFrontendProject(
      createOptions(directory, ["react", "typescript", "vite", "vanilla"])
    );
    const files = fileMap(result.files);

    assert.equal(result.language, "typescript");
    assert.equal(result.bundler, "vite");
    assert.deepEqual(result.appliedFeatures, []);
    assert.ok(files.has("src/App.tsx"));
    assert.ok(files.has("src/main.tsx"));
    assert.ok(files.has("src/components/Counter.tsx"));
    assert.ok(files.has("vite.config.ts"));
    assert.ok(files.has("tsconfig.json"));
    assert.ok(files.has("package.json"));
    assert.ok(files.has("public/origo-logo.svg"));

    const html = files.get("index.html");
    assert.match(html, /\/src\/main\.tsx/);
    assert.doesNotMatch(html, /\{\{.*\}\}/);

    const app = files.get("src/App.tsx");
    assert.match(app, /Vite \+ <span>React<\/span>/);
    assert.match(app, /src\/App\.tsx/);
    assert.doesNotMatch(app, /\{\{.*\}\}/);

    const packageJson = JSON.parse(files.get("package.json"));
    assert.equal(packageJson.name, "test-app");
    assert.equal(packageJson.scripts.dev, "vite");
  });
});

test("generates JavaScript output by transforming TypeScript source", async () => {
  await withTempDirectory(async (directory) => {
    const result = await generateFrontendProject(
      createOptions(directory, ["react", "vite", "vanilla"])
    );
    const files = fileMap(result.files);

    assert.equal(result.language, "javascript");
    assert.ok(files.has("src/App.jsx"));
    assert.ok(files.has("src/main.jsx"));
    assert.ok(files.has("src/components/Counter.jsx"));
    assert.ok(files.has("vite.config.js"));
    assert.ok(!files.has("tsconfig.json"));
    assert.ok(!files.has("src/App.tsx"));

    assert.match(files.get("index.html"), /\/src\/main\.jsx/);
    assert.match(files.get("src/App.jsx"), /src\/App\.jsx/);
    assert.doesNotMatch(files.get("src/components/Counter.jsx"), /useState<number>/);
  });
});

test("applies Tailwind v4 and shadcn/ui to the same generated files", async () => {
  await withTempDirectory(async (directory) => {
    const result = await generateFrontendProject(
      createOptions(directory, [
        "react",
        "typescript",
        "vite",
        "vanilla",
        "tailwind",
        "shadcn-ui",
      ])
    );
    const files = fileMap(result.files);

    assert.deepEqual(result.appliedFeatures, ["Tailwind CSS", "shadcn/ui"]);

    const viteConfig = files.get("vite.config.ts");
    assert.match(viteConfig, /@tailwindcss\/vite/);
    assert.match(viteConfig, /node:url/);
    assert.match(viteConfig, /tailwindcss\(\)/);
    assert.match(viteConfig, /"@": fileURLToPath/);

    const css = files.get("src/index.css");
    assert.match(css, /@import "tailwindcss";/);
    assert.match(css, /@theme/);
    assert.ok(css.indexOf('@import "tailwindcss";') < css.indexOf("@theme"));

    assert.match(files.get("src/App.tsx"), /min-h-screen/);
    assert.match(files.get("src/components/Counter.tsx"), /inline-flex/);
    assert.ok(!files.has("src/App.css"));

    assert.ok(files.has("src/lib/utils.ts"));
    assert.ok(files.has("components.json"));

    const tsconfig = JSON.parse(files.get("tsconfig.json"));
    assert.equal(tsconfig.compilerOptions.paths["@/*"][0], "./src/*");
    assert.equal(tsconfig.compilerOptions.baseUrl, undefined);
  });
});

test("reapplying multiple features does not duplicate transformations", async () => {
  await withTempDirectory(async (directory) => {
    const options = createOptions(directory, [
      "react",
      "typescript",
      "vite",
      "vanilla",
      "tailwind",
      "shadcn-ui",
    ]);
    const context = new FrontendGenerationContext(options);
    const profile = resolveFrontendProfile(context);

    await resolveReactBase(context, profile);
    resolveLanguage(context, profile);
    resolveBundlerConfig(context, profile);
    resolveTypeScriptConfig(context, profile);
    applyFeatures(context);
    applyFeatures(context);

    const files = fileMap(context.finalize());
    const viteConfig = files.get("vite.config.ts");

    assert.equal(count(viteConfig, /tailwindcss\(\)/g), 1);
    assert.equal(count(viteConfig, /fileURLToPath/g), 2);
    assert.equal(count(viteConfig, /"@":/g), 1);

    const css = files.get("src/index.css");
    assert.equal(count(css, /@import "tailwindcss";/g), 1);
    assert.equal(count(css, /@theme/g), 1);
  });
});

test("uses Bootstrap classes and styles when Bootstrap is selected", async () => {
  await withTempDirectory(async (directory) => {
    const options = createOptions(directory, [
      "react",
      "typescript",
      "vite",
      "bootstrap",
    ]);
    options.dependencies.bootstrap = "^5.3.8";

    const result = await generateFrontendProject(options);
    const files = fileMap(result.files);

    assert.ok(files.has("src/index.css"));
    assert.ok(!files.has("src/App.css"));
    assert.match(
      files.get("src/App.tsx"),
      /import "bootstrap\/dist\/css\/bootstrap.min.css"/
    );
    assert.match(files.get("src/App.tsx"), /min-vh-100/);
    assert.match(files.get("src/App.tsx"), /d-flex/);
    assert.match(files.get("src/components/Counter.tsx"), /btn btn-lg/);
    assert.match(files.get("src/index.css"), /\.hero-accent/);
  });
});

test("uses Sass files and syntax when Sass is selected", async () => {
  await withTempDirectory(async (directory) => {
    const options = createOptions(directory, [
      "react",
      "typescript",
      "vite",
      "sass",
    ]);
    options.devDependencies.sass = "^1.93.2";

    const result = await generateFrontendProject(options);
    const files = fileMap(result.files);

    assert.ok(files.has("src/App.scss"));
    assert.ok(files.has("src/index.scss"));
    assert.ok(!files.has("src/App.css"));
    assert.ok(!files.has("src/index.css"));
    assert.match(files.get("src/main.tsx"), /import "\.\/index\.scss"/);
    assert.match(files.get("src/App.tsx"), /import "\.\/App\.scss"/);
    assert.match(files.get("src/App.scss"), /\$brand:/);
    assert.match(files.get("src/App.scss"), /\.background-glow \{/);
  });
});

test("rejects validation when required files are missing", async () => {
  await withTempDirectory(async (directory) => {
    const options = createOptions(directory, [
      "react",
      "typescript",
      "vite",
      "vanilla",
    ]);
    const context = new FrontendGenerationContext(options);
    const profile = resolveFrontendProfile(context);

    assert.throws(
      () => validateGeneratedProject(context, profile),
      /Generated project is missing package.json/
    );
  });
});
