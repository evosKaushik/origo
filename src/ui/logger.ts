import pc from "picocolors";

export const logger = {
  info(message: string) {
    console.log(`${pc.blue("ℹ")} ${message}`);
  },

  success(message: string) {
    console.log(`${pc.green("✔")} ${message}`);
  },

  error(message: string) {
    console.log(`${pc.red("✖")} ${message}`);
  },

  warn(message: string) {
    console.log(`${pc.yellow("⚠")} ${message}`);
  },
};