
import pc from "picocolors";
import { APP_NAME, TAGLINE, VERSION } from "../constants/app.js";

export function showBanner(): void {
  console.log()
  console.log(
    `  ${pc.green("◎")} ${pc.bold(pc.white(APP_NAME.toUpperCase()))}`
  );

  console.log(`  ${pc.dim(TAGLINE)}`);

  console.log(pc.dim("  ─────────────────────────────────────"));
  console.log();
}
