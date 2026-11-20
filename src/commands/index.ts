import { showBanner } from "../ui/banner.js";
import { createCommand } from "./create.js";


export async function runCLI() {
  showBanner();
  await createCommand();
}