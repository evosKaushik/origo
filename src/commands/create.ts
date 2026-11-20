import { multiSelect } from "../ui/multiselect.js";

export async function createCommand() {
  const features = await multiSelect(
    "Select features for your project",
    [
      { name: "TypeScript", value: "typescript", checked: true },
      { name: "ESLint", value: "eslint" },
      { name: "Prettier", value: "prettier" },
      { name: "Docker", value: "docker" },
      { name: "Testing", value: "testing" },
    ]
  );

  console.log("\nSelected features:", features.join(", "));
}