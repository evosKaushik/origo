
import { checkbox } from "@inquirer/prompts";

interface Option {
  name: string;
  value: string;
  description?: string;
  checked?: boolean;
}

export async function multiSelect(
  message: string,
  options: Option[]
): Promise<string[]> {
  return checkbox({
    message,
    choices: options.map((option) => ({
      name: option.name,
      value: option.value,
      description: option.description,
      checked: option.checked,
    })),
    pageSize: 8,
    required: true,
    theme: {
      prefix: "◆",
      icon: {
        checked: "◉",
        unchecked: "◯",
        cursor: "❯ ",
      },
    },
  });
}
