import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

const PORT = process.env.PORT || env.PORT;

const server = app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Curriculo IA API rodando na porta ${PORT}`);
});

process.on("SIGTERM", async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});