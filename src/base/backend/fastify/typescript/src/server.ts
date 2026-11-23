import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDirectory, "../.env") });
{{DB_IMPORT}}

const { createApp } = await import("./app.js");
const { env } = await import("./config/env.js");
{{DB_CONNECT}}

const app = await createApp();
const address = await app.listen({ host: "0.0.0.0", port: env.port });

console.log(`Server listening on ${address}`);

function shutdown(): void {
  app.close().then(() => {
    console.log("Server closed");
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
