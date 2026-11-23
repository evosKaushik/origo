import { confirmSelection, singleSelect } from "../ui/checkbox.js";
import { backendConfig } from "../config/backend.js";
import { frontendConfig } from "../config/frontend.js";
import { fullStackPreset } from "../config/fullstack.js";
import { isCompatible } from "./compatibility.js";
import type { Architecture, StackStep, TechStackOption } from "../types/project.js";

function compatible(
  options: TechStackOption[],
  active: Set<string>
): TechStackOption[] {
  return options.filter((option) => isCompatible(option, active));
}

async function selectStep(
  message: string,
  step: StackStep,
  active: Set<string>
): Promise<string | null> {
  if (
    !step.required &&
    !(await confirmSelection(`Do you want to ${message.toLowerCase()}?`))
  ) {
    return null;
  }

  const value = await singleSelect(message, step.options);
  active.add(value);
  return value;
}

async function pushSelected(
  selected: string[],
  message: string,
  step: StackStep,
  active: Set<string>
): Promise<void> {
  const value = await selectStep(message, step, active);

  if (value !== null) {
    selected.push(value);
  }
}

export async function selectTechStack(
  architecture: Architecture,
  active: Set<string>
): Promise<string[]> {
  if (architecture === "full-stack") {
    const preset = await selectStep("Select Preset", fullStackPreset, active);

    if (!preset) {
      return [];
    }

    const selected = [preset];
    await pushSelected(selected, "Select Language", backendConfig.languages, active);
    return selected;
  }

  const selected: string[] = [];

  if (architecture === "frontend") {
    await pushSelected(selected, "Select Bundler", frontendConfig.bundlers, active);
    await pushSelected(selected, "Select Framework", frontendConfig.frameworks, active);
    await pushSelected(selected, "Select Language", frontendConfig.languages, active);
    await pushSelected(selected, "Select Styling Library", frontendConfig.styling, active);

    const routing: StackStep = {
      required: frontendConfig.routing.required,
      options: compatible(frontendConfig.routing.options, active),
    };

    if (routing.options.length) {
      await pushSelected(selected, "Select Routing", routing, active);
    }

    return selected;
  }

  await pushSelected(selected, "Select Runtime", backendConfig.runtimes, active);
  await pushSelected(selected, "Select Framework", backendConfig.frameworks, active);
  await pushSelected(selected, "Select Language", backendConfig.languages, active);
  await pushSelected(selected, "Select Database", backendConfig.databases, active);

  return selected;
}
