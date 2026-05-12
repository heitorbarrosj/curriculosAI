import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

const server = app.listen(env.PORT, () => {
  console.log(`Curriculo IA API rodando na porta ${env.PORT}`);
});

process.on("SIGTERM", async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
