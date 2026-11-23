import type { FrontendGenerationContext } from "../generators/frontend/context.js";

export type Architecture = "frontend" | "backend" | "full-stack";

export type FrontendStyle = "vanilla" | "tailwind" | "bootstrap" | "sass";

export type BackendLanguage = "typescript" | "javascript";

export type BackendFramework = "express" | "fastify";

export interface PackageMetadata {
  dependencies?: string[];
  devDependencies?: string[];
  scripts?: Record<string, string>;
}

export interface ProjectConfig {
  architecture: Architecture;
  techStacks: string[];
}

export interface ProjectFeature {
  id: string;
  name: string;
  requires: string[];
  requiresAny?: string[];
  apply(context: FrontendGenerationContext): Promise<void> | void;
}


export interface TechStackOption {
  name: string;
  value: string;
  description?: string;

  // Which frameworks can use this option?
  frameworks?: string[];

  // Which bundlers can use this option?
  bundlers?: string[];

  // Required technologies
  requires?: string[];

  requiresAny?: string[];

  // Technologies that cannot be combined
  conflictsWith?: string[];
}

export interface FeatureOption {
  name: string;
  value: string;
  category: string;

  frameworks?: string[];
  bundlers?: string[];

  requires?: string[];
  requiresAny?: string[];
  conflictsWith?: string[];

  packages: string[];
}


export interface StackStep {
  required: boolean;
  options: TechStackOption[];
}

export type FrontendTechStack = {
  bundlers: StackStep;
  frameworks: StackStep;
  languages: StackStep;
  styling: StackStep;
  routing: StackStep;
};

export type BackendTechStack = {
  runtimes: StackStep;
  frameworks: StackStep;
  languages: StackStep;
  databases: StackStep;
};

export interface FullStackOption {
  name: string;
  value: string;
  description: string;
  frontend: string[];
  backend: string[];
  database: string[];
}
