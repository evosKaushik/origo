export async function registerRoutes(app) {
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
    const { name } = request.query ?? {};
    return { message: `Hello, ${name ?? "world"}!` };
  });
}
