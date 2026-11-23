import cors from "cors";
import express, { type Express } from "express";

import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
{{DB_ROUTE_IMPORT}}

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.clientUrl }));
  app.use(express.json());

  app.get("/", (_request, response) => {
    response.json({
      name: "{{PROJECT_NAME}}",
      message: "Origo Express API is running",
    });
  });

  app.use("/api", apiRouter);
{{DB_ROUTE_REGISTER}}

  return app;
}
