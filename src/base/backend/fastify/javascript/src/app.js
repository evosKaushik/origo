import cors from "@fastify/cors";
import Fastify from "fastify";

import { env } from "./config/env.js";
import { registerRoutes } from "./routes/index.js";
{{DB_ROUTE_IMPORT}}

export async function createApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: env.clientUrl });
  await app.register(registerRoutes);
{{DB_ROUTE_REGISTER}}

  return app;
}
