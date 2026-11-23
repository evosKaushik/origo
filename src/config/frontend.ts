import type { FrontendTechStack } from "../types/project.js";
import { bundlerOptions } from "../registry/bundlers.js";
import { frontendFrameworkOptions } from "../registry/frameworks.js";
import { stylingOptions } from "../registry/styling.js";
import { routingOptions } from "../registry/routing.js";

export const frontendConfig: FrontendTechStack = {
  bundlers: { required: true, options: bundlerOptions },
  frameworks: { required: true, options: frontendFrameworkOptions },
  languages: {
    required: true,
    options: [
      { name: "TypeScript", value: "typescript" },
      { name: "JavaScript", value: "javascript" },
    ],
  },
  styling: { required: false, options: stylingOptions },
  routing: { required: false, options: routingOptions },
};
