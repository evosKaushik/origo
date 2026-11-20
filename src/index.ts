#!/usr/bin/env node

import { runCLI } from "./commands/index.js";

runCLI().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});