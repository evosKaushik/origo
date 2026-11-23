import { loadReactBaseFiles } from "../base-loader.js";
import { renderTemplate } from "../template.js";
import type { FrontendGenerationContext } from "../context.js";
import type { FrontendProfile } from "./profile.js";

export async function resolveReactBase(
  context: FrontendGenerationContext,
  profile: FrontendProfile
): Promise<void> {
  const files = await loadReactBaseFiles(profile.style, profile.isFullStack);
  const values = {
    TITLE: `Origo — ${profile.bundlerLabel} + React`,
    ENTRY_SCRIPT: `/src/main.${profile.sourceExtension}`,
    APP_FILE: `src/App.${profile.sourceExtension}`,
    HEADLINE_PREFIX: `${profile.bundlerLabel} +`,
    PING_IMPORT: profile.isFullStack
      ? `import PingButton from "./components/PingButton";`
      : "",
    PING_BUTTON: profile.isFullStack ? `<PingButton />` : "",
  };

  if (profile.isFullStack) {
    context.addTextFile(
      ".env",
      `VITE_API_URL=http://localhost:3000/api\n`
    );
  }

  for (const file of files) {
    const content =
      typeof file.content === "string"
        ? renderTemplate(file.content, values)
        : file.content;

    context.addFile(file.destination, content);
  }
}
