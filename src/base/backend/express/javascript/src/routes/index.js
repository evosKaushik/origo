import { Router } from "express";

export const apiRouter = Router();

apiRouter.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});

apiRouter.get("/hello", (request, response) => {
  const name = typeof request.query.name === "string" ? request.query.name : "Origo";

  response.json({
    message: `Hello, ${name}!`,
  });
});
