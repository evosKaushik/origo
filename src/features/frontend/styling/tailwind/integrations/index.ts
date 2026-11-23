import type { FrontendGenerationContext } from "../../../../../generators/frontend/context.js";
import type { FrontendBundler, FrontendProfile } from "../../../../../generators/frontend/resolvers/profile.js";
import { integrateTailwindRsbuild } from "./rsbuild.js";
import { integrateTailwindVite } from "./vite.js";
import { integrateTailwindWebpack } from "./webpack.js";

export function applyTailwindBundlerIntegration(
  context: FrontendGenerationContext,
  profile: FrontendProfile
): void {
  const integrations: Record<
    FrontendBundler,
    (context: FrontendGenerationContext, profile: FrontendProfile) => void
  > = {
    vite: integrateTailwindVite,
    webpack: integrateTailwindWebpack,
    rsbuild: integrateTailwindRsbuild,
  };

  integrations[profile.bundler](context, profile);
}
