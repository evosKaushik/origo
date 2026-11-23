import {
  addCssBlock,
  parseCss,
  renderCss,
} from "../../../../../generators/frontend/css.js";
import type { FrontendGenerationContext } from "../../../../../generators/frontend/context.js";
import type { FrontendProfile } from "../../../../../generators/frontend/resolvers/profile.js";
import {
  createTailwindV3Config,
  defaultTailwindTheme,
} from "../templates/theme.js";

const CSS_DIRECTIVES = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

export function generateTailwindV3(
  context: FrontendGenerationContext,
  _profile: FrontendProfile
): void {
  const cssPath = "src/index.css";
  const document = parseCss(context.getTextFile(cssPath));

  addCssBlock(document, CSS_DIRECTIVES);
  context.addTextFile(cssPath, renderCss(document));

  context.addTextFile(
    "tailwind.config.js",
    `export default ${JSON.stringify(
      createTailwindV3Config(defaultTailwindTheme),
      null,
      2
    )};\n`
  );

  context.addTextFile(
    "postcss.config.js",
    `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`
  );
}
