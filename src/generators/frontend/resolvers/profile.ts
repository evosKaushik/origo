import type { FrontendGenerationContext } from "../context.js";
import type { FrontendStyle } from "../../../types/project.js";

export type FrontendLanguage = "typescript" | "javascript";
export type FrontendBundler = "vite" | "webpack" | "rsbuild";

export interface FrontendProfile {
  framework: "react";
  language: FrontendLanguage;
  bundler: FrontendBundler;
  isTypeScript: boolean;
  sourceExtension: "tsx" | "jsx";
  configExtension: "ts" | "js";
  bundlerLabel: string;
  style: FrontendStyle;
  isFullStack: boolean;
}

const bundlerLabels: Record<FrontendBundler, string> = {
  vite: "Vite",
  webpack: "Webpack",
  rsbuild: "Rsbuild",
};

export function resolveFrontendStyle(
  context: FrontendGenerationContext
): FrontendStyle {
  if (
    context.has("tailwind") ||
    context.has("tailwind-v3") ||
    context.has("tailwind-v4")
  ) {
    return "tailwind";
  }

  if (context.has("bootstrap")) {
    return "bootstrap";
  }

  if (context.has("sass") || context.has("scss")) {
    return "sass";
  }

  return "vanilla";
}

export function resolveFrontendProfile(
  context: FrontendGenerationContext
): FrontendProfile {
  const language: FrontendLanguage = context.has("typescript")
    ? "typescript"
    : "javascript";
  const bundler: FrontendBundler = context.has("webpack")
    ? "webpack"
    : context.has("rsbuild")
      ? "rsbuild"
      : "vite";
  const isTypeScript = language === "typescript";

  return {
    framework: "react",
    language,
    bundler,
    isTypeScript,
    sourceExtension: isTypeScript ? "tsx" : "jsx",
    configExtension: isTypeScript ? "ts" : "js",
    bundlerLabel: bundlerLabels[bundler],
    style: resolveFrontendStyle(context),
    isFullStack: context.options.fullStack ?? false,
  };
}
