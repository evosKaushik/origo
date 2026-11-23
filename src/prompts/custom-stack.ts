
import { input } from "@inquirer/prompts";

export async function selectCustomStack(): Promise<string[]> {
    const custom = await input({
        message: "Enter your custom technologies (comma separated)",
        validate: (value) =>
            value.trim().length > 0 ||
            "Please enter at least one technology",
    });

    return custom
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}
