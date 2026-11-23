import { singleSelect } from "../ui/checkbox.js";
import { architectureOptions } from "../config/architectures.js";
import type { Architecture } from "../types/project.js";

export async function selectArchitecture(): Promise<Architecture> {
  return (await singleSelect(
    "Select Project Architecture",
    architectureOptions
  )) as Architecture;
}
