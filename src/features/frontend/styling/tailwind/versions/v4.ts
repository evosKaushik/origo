import {
  addCssBlock,
  addCssImport,
  parseCss,
  renderCss,
} from "../../../../../generators/frontend/css.js";
import type { FrontendGenerationContext } from "../../../../../generators/frontend/context.js";
import type { FrontendProfile } from "../../../../../generators/frontend/resolvers/profile.js";
import { applyTailwindBundlerIntegration } from "../integrations/index.js";
import {
  defaultTailwindTheme,
  renderTailwindV4Theme,
} from "../templates/theme.js";

export function generateTailwindV4(
  context: FrontendGenerationContext,
  profile: FrontendProfile
): void {
  applyTailwindBundlerIntegration(context, profile);

  const cssPath = "src/index.css";
  const document = parseCss(context.getTextFile(cssPath));

  addCssImport(document, '@import "tailwindcss";');
  addCssBlock(document, renderTailwindV4Theme(defaultTailwindTheme));

  context.addTextFile(cssPath, renderCss(document));
}
