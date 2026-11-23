import { Router, type Request, type Response } from "express";

export const apiRouter = Router();

apiRouter.get("/health", (_request: Request, response: Response) => {
  response.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});

apiRouter.get("/hello", (request: Request, response: Response) => {
  const name = typeof request.query.name === "string" ? request.query.name : "Origo";

  response.json({
    message: `Hello, ${name}!`,
  });
});
