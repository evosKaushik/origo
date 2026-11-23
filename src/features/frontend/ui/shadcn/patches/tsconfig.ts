import type { FrontendGenerationContext } from "../../../../../generators/frontend/context.js";

type TsConfig = {
  compilerOptions?: {
    baseUrl?: string;
    paths?: Record<string, string[]>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export function configureShadcnTsConfig(
  context: FrontendGenerationContext
): void {
  const file = context.getFile("tsconfig.json");

  if (!file || typeof file.content !== "string") {
    return;
  }

  let config: TsConfig;

  try {
    config = JSON.parse(file.content) as TsConfig;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid tsconfig.json: ${reason}`);
  }

  const compilerOptions = config.compilerOptions ?? {};

  delete compilerOptions.baseUrl;
  compilerOptions.paths = {
    ...(compilerOptions.paths ?? {}),
    "@/*": ["./src/*"],
  };
  config.compilerOptions = compilerOptions;

  context.addJsonFile("tsconfig.json", config);
}
