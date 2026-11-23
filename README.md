# Create Origo App

`@evoskaushik/create-origo-app` is an interactive CLI for generating ready-to-run React and Node.js projects. It creates files in memory, applies stack-specific transformations, and writes a clean project layout with resolved dependencies and automatic installs.

## Requirements

- Node.js `>=20`
- npm
- Internet access when generating a project, because dependency versions are resolved from the npm registry and generated dependencies are installed automatically

## Install and use

After the package is published or available from your configured registry:

```bash
npm i -g @evoskaushik/create-origo-app@latest
origo my-app
```

You can also run it without a global install:

```bash
npx @evoskaushik/create-origo-app my-app
```

The CLI accepts:

```bash
origo <project-name> [project-path]
```

Examples:

```bash
origo my-app
origo my-app ./workspace
```

If this package is installed from GitHub Packages, configure npm first:

```bash
# .npmrc in your home directory or project directory
@evoskaushik:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

`GITHUB_TOKEN` must be able to read packages. For public usage, the package visibility must also allow anonymous or authenticated reads.

## Local development setup

From the repository root:

```bash
npm install
npm run typecheck
npm test
```

Useful scripts:

| Script | Purpose |
| --- | --- |
| `npm run build` | Compile TypeScript and copy canonical base files into `dist/base` |
| `npm run dev` | Watch TypeScript and restart the built CLI |
| `npm run typecheck` | Type-check source without emitting files |
| `npm test` | Build and run all tests in `tests/*.test.mjs` |
| `npm run try:cli` | Build and start the local interactive CLI |
| `npm run preview` | Build and preview the npm tarball contents with `npm pack --dry-run` |
| `npm run pack:local` | Build and create a local `.tgz` package for install testing |

## Preview the package before publishing

### Preview tarball contents

```bash
npm run preview
```

This runs `npm pack --dry-run`, so you can confirm that only the intended files, mainly `dist`, `README.md`, and `package.json`, will be published.

### Install a local tarball in another folder

```bash
npm run pack:local
cd /tmp
npx /absolute/path/to/origo/source-code/evoskaushik-create-origo-app-0.1.0.tgz demo-app
```

The exact `.tgz` name depends on the package version. You can also install it globally from the tarball:

```bash
npm i -g /absolute/path/to/evoskaushik-create-origo-app-0.1.0.tgz
origo demo-app
```

### Link the local package

```bash
npm run build
npm link
cd /tmp
origo linked-app
```

Clean up with:

```bash
npm unlink -g @evoskaushik/create-origo-app
```

## Features

### Architecture selection

- Frontend projects
- Backend projects
- Full-stack projects

### Presets

- MERN: MongoDB, Express, React, Node.js
- PERN: PostgreSQL, Express, React, Node.js
- Custom full-stack: choose frontend, backend, and database interactively

### Frontend generation

- React with Vite
- TypeScript or JavaScript output
- Canonical in-source React base files transformed in memory
- Styling support:
  - Vanilla CSS
  - Tailwind CSS v3/v4
  - Bootstrap
  - Sass/SCSS
- shadcn/ui integrations for Tailwind projects
- Generated `vite-env.d.ts` for Vite client and CSS module typings
- Full-stack projects include a `PingButton` that calls the backend `/api/health` endpoint

### Backend generation

- Express or Fastify
- TypeScript or JavaScript output
- CORS configured from `CLIENT_URL`
- dotenv loaded from `../.env` for both `src` and `dist`
- Health endpoint
- Automatic dependency version resolution from npm
- Automatic `npm install` in the generated project

### Database support

Choose one database package during generation:

| Database | Package options |
| --- | --- |
| MongoDB | Official MongoDB driver, Mongoose |
| PostgreSQL | `pg`, Prisma, Sequelize |

Every database setup generates environment variables, connection/config files, and Todo CRUD:

- `src/models/todo.*`
- `src/services/todos.*`
- `src/routes/todos.*`
- `GET /api/todos`
- `GET /api/todos/:id`
- `POST /api/todos`
- `PUT /api/todos/:id`
- `DELETE /api/todos/:id`

Prisma generation also creates:

- `prisma/schema.prisma` with a `Todo` model
- `prisma.config.ts`
- `db:generate` and `db:push` scripts

### Full-stack layout

Full-stack projects deliberately create separate packages:

```text
my-app/
├── package.json          # root orchestrator
├── client/
│   ├── package.json
│   ├── package-lock.json
│   ├── node_modules/
│   ├── .env
│   └── src/
└── server/
    ├── package.json
    ├── package-lock.json
    ├── node_modules/
    ├── .env
    └── src/
```

Root scripts orchestrate both packages:

```bash
npm run dev
npm run build
npm run dev:client
npm run dev:server
npm run build:client
npm run build:server
npm run start
```

Client environment:

```env
VITE_API_URL=http://localhost:3000/api
```

Server environment includes:

```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Database-specific variables are appended when a database is selected.

## How the generator works

- Canonical base files live under `src/base`.
- Code and config transformations use `ts-morph` through `src/composer/ast`.
- Frontend and backend generators build file lists in memory before writing anything.
- `src/generators/frontend/file-writer.ts` prevents writes outside the project root and refuses symlink escapes.
- `scripts/build.js` compiles TypeScript and copies base files to `dist/base`.
- Published packages include only `dist`, plus npm's standard `README.md` and `package.json`.

## Current support and roadmap

Currently implemented:

- React + Vite frontend generation
- Express and Fastify backend generation
- MongoDB and PostgreSQL packages listed above
- Tailwind, Bootstrap, Sass, and vanilla styles
- shadcn/ui integration
- Todo CRUD for all database packages
- Full-stack split packages with root orchestration

Currently limited or planned:

- Webpack and Rsbuild generation currently throw a clear “not implemented” error.
- Frontend framework options beyond React are not fully generated yet.
- React Router and TanStack Router prompts exist but routing generation is still planned.
- CSS Modules prompt option is listed but has no dedicated feature generator yet.

## Contributing

1. Fork the repository and create a branch:

   ```bash
   git checkout -b feat/my-change
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Make changes in `src`.
4. Add or update tests under `tests/*.test.mjs`.
5. Do not edit generated `dist` files; they are rebuilt from `src`.
6. Run checks:

   ```bash
   npm run typecheck
   npm test
   npm run preview
   ```

7. Commit with a concise message and open a pull request.

### Where to make changes

| Change | Location |
| --- | --- |
| Canonical generated files | `src/base` |
| Frontend generation | `src/generators/frontend` |
| Backend generation | `src/generators/backend` |
| AST transformations | `src/composer/ast` |
| Optional frontend features | `src/features` |
| Stack choices and prompts | `src/config`, `src/prompts`, `src/registry` |
| Dependency mappings | `src/registry/packages.ts` |
| CLI flow | `src/commands` |
| Build behavior | `scripts/build.js` |
| Tests | `tests` |

### Pull request checklist

- `npm run typecheck` passes
- `npm test` passes
- `npm run preview` shows the expected package contents
- Generated projects still build for affected stacks
- README updated when behavior or usage changes
- No secrets, local paths, or generated `dist` files committed

## Maintainer publishing

Publishing is configured for GitHub Packages through `publishConfig`:

```bash
npm version patch
npm publish
```

Package visibility is controlled in the registry settings. Use `npm run preview` before publishing to confirm the tarball contents.
