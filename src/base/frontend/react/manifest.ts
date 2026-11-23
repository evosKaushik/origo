import type { FrontendStyle } from "../../../types/project.js";

export type BaseFileKind = "text" | "binary";

export interface BaseFileDefinition {
  source: string;
  destination: string;
  kind: BaseFileKind;
}

const commonFiles: BaseFileDefinition[] = [
  {
    source: "frontend/react/html/index.html",
    destination: "index.html",
    kind: "text",
  },
  {
    source: "frontend/react/app/vite-env.d.ts",
    destination: "src/vite-env.d.ts",
    kind: "text",
  },
  {
    source: "frontend/react/app/components/OrigoLogo.tsx",
    destination: "src/components/OrigoLogo.tsx",
    kind: "text",
  },
  {
    source: "frontend/react/app/assets/react.svg",
    destination: "src/assets/react.svg",
    kind: "text",
  },
  {
    source: "frontend/react/app/assets/vite.svg",
    destination: "src/assets/vite.svg",
    kind: "text",
  },
  {
    source: "frontend/shared/origo-logo.svg",
    destination: "public/origo-logo.svg",
    kind: "text",
  },
  {
    source: "frontend/shared/favicon.ico",
    destination: "public/favicon.ico",
    kind: "binary",
  },
];

const styleFiles: Record<FrontendStyle, BaseFileDefinition[]> = {
  vanilla: [
    {
      source: "frontend/react/app/App.tsx",
      destination: "src/App.tsx",
      kind: "text",
    },
    {
      source: "frontend/react/app/main.tsx",
      destination: "src/main.tsx",
      kind: "text",
    },
    {
      source: "frontend/react/app/App.css",
      destination: "src/App.css",
      kind: "text",
    },
    {
      source: "frontend/react/app/index.css",
      destination: "src/index.css",
      kind: "text",
    },
    {
      source: "frontend/react/app/components/Counter.tsx",
      destination: "src/components/Counter.tsx",
      kind: "text",
    },
  ],
  tailwind: [
    {
      source: "frontend/react/styles/tailwind/App.tsx",
      destination: "src/App.tsx",
      kind: "text",
    },
    {
      source: "frontend/react/app/main.tsx",
      destination: "src/main.tsx",
      kind: "text",
    },
    {
      source: "frontend/react/app/index.css",
      destination: "src/index.css",
      kind: "text",
    },
    {
      source: "frontend/react/styles/tailwind/Counter.tsx",
      destination: "src/components/Counter.tsx",
      kind: "text",
    },
  ],
  bootstrap: [
    {
      source: "frontend/react/styles/bootstrap/App.tsx",
      destination: "src/App.tsx",
      kind: "text",
    },
    {
      source: "frontend/react/app/main.tsx",
      destination: "src/main.tsx",
      kind: "text",
    },
    {
      source: "frontend/react/styles/bootstrap/index.css",
      destination: "src/index.css",
      kind: "text",
    },
    {
      source: "frontend/react/styles/bootstrap/Counter.tsx",
      destination: "src/components/Counter.tsx",
      kind: "text",
    },
  ],
  sass: [
    {
      source: "frontend/react/styles/sass/App.tsx",
      destination: "src/App.tsx",
      kind: "text",
    },
    {
      source: "frontend/react/styles/sass/main.tsx",
      destination: "src/main.tsx",
      kind: "text",
    },
    {
      source: "frontend/react/styles/sass/App.scss",
      destination: "src/App.scss",
      kind: "text",
    },
    {
      source: "frontend/react/styles/sass/index.scss",
      destination: "src/index.scss",
      kind: "text",
    },
    {
      source: "frontend/react/app/components/Counter.tsx",
      destination: "src/components/Counter.tsx",
      kind: "text",
    },
  ],
};

const pingFiles: Record<FrontendStyle, BaseFileDefinition[]> = {
  vanilla: [
    {
      source: "frontend/react/app/components/PingButton.tsx",
      destination: "src/components/PingButton.tsx",
      kind: "text",
    },
  ],
  tailwind: [
    {
      source: "frontend/react/styles/tailwind/PingButton.tsx",
      destination: "src/components/PingButton.tsx",
      kind: "text",
    },
  ],
  bootstrap: [
    {
      source: "frontend/react/styles/bootstrap/PingButton.tsx",
      destination: "src/components/PingButton.tsx",
      kind: "text",
    },
  ],
  sass: [
    {
      source: "frontend/react/styles/sass/PingButton.tsx",
      destination: "src/components/PingButton.tsx",
      kind: "text",
    },
    {
      source: "frontend/react/styles/sass/PingButton.scss",
      destination: "src/components/PingButton.scss",
      kind: "text",
    },
  ],
};

export function getReactBaseFiles(
  style: FrontendStyle,
  fullStack = false
): BaseFileDefinition[] {
  const files = [...styleFiles[style], ...commonFiles];

  if (fullStack) {
    files.push(...pingFiles[style]);
  }

  return files;
}

export const reactBaseFiles = getReactBaseFiles("vanilla");
