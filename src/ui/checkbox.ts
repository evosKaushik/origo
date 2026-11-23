import { checkbox, confirm, select, Separator } from "@inquirer/prompts";

export interface PromptOption {
  name: string;
  value: string;
  description?: string;
  checked?: boolean;
}

type Choice = PromptOption | Separator;

interface MultiSelectOptions {
  required?: boolean;
  validate?: (selection: readonly string[]) => boolean | string;
}

export const confirmSelection = async (message: string): Promise<boolean> => {
  return confirm({
    message,
    default: false,
    theme: {
      prefix: "◆",
    },
  });
};

export const multiSelect = async (
  message: string,
  options: Choice[],
  { required = true, validate }: MultiSelectOptions = {}
): Promise<string[]> => {
  return checkbox({
    message,
    choices: options.map((option) =>
      Separator.isSeparator(option)
        ? option
        : {
            name: option.name,
            value: option.value,
            description: option.description,
            checked: option.checked,
          }
    ),
    pageSize: 12,
    loop: false,
    required,
    validate: validate
      ? (choices) => validate(choices.map((choice) => String(choice.value)))
      : undefined,
    theme: {
      prefix: "◆",
      icon: {
        checked: "◉",
        unchecked: "◯",
        cursor: "❯",
      },
    },
  });
};

export const singleSelect = async (
  message: string,
  options: PromptOption[]
): Promise<string> => {
  return select({
    message,
    choices: options.map((option) => ({
      name: option.name,
      value: option.value,
      description: option.description,
    })),
    loop: false,
    theme: {
      prefix: "◆",
    },
  });
};
