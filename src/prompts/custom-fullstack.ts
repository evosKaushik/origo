import { singleSelect } from "../ui/checkbox.js";
import { databaseOptions } from "../registry/databases.js";
import {
  backendFrameworkOptions,
  frontendFrameworkOptions,
} from "../registry/frameworks.js";

export async function selectCustomFullStack(
  active: Set<string>
): Promise<string[]> {
  const frontend = await singleSelect(
    "Select Frontend Technology",
    frontendFrameworkOptions
  );

  const backend = await singleSelect(
    "Select Backend Technology",
    backendFrameworkOptions.filter((option) => option.value !== "custom")
  );

  const database = await singleSelect("Select Database", databaseOptions);

  [frontend, backend, database].forEach((value) => active.add(value));

  return [frontend, backend, database];
}
