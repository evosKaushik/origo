import { singleSelect } from "../ui/checkbox.js";
import { databasePackageOptions } from "../registry/databases.js";

export async function selectDatabasePackages(
  active: Set<string>
): Promise<string[]> {
  const database = active.has("mongodb")
    ? "mongodb"
    : active.has("postgresql")
      ? "postgresql"
      : null;

  if (!database) {
    return [];
  }

  const selected = await singleSelect(
    `Select ${database === "mongodb" ? "MongoDB" : "PostgreSQL"} package`,
    databasePackageOptions[database]
  );

  active.add(selected);
  return [selected];
}
