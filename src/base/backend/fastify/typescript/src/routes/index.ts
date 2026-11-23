import type { FastifyInstance } from "fastify";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.get("/", async () => ({
    name: "{{PROJECT_NAME}}",
    message: "Origo Fastify API is running",
  }));

  app.get("/api/health", async () => ({
    status: "ok",
    service: "{{PROJECT_NAME}}",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }));

  app.get("/api/hello", async (request) => {
    const query = request.query as { name?: string };
    return { message: `Hello, ${query.name ?? "world"}!` };
  });
}
