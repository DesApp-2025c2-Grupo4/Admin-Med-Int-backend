const redis = require("redis");

const REDIS_DEFAULT_URL = "redis://localhost:6379";

const redisClient = redis.createClient({
  url: process.env.REDIS_URL ?? REDIS_DEFAULT_URL,
  password: process.env.REDIS_PASSWORD ?? "redisPassword123",
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`🔄 Reintentando conexión a Redis (${retries})...`);
      return Math.min(retries * 100, 3000); // Reintenta cada 0.1s, 0.2s, 0.3s... hasta 3s
    },
  },
});

redisClient.on("connect", () => console.log("✅ Redis conectado correctamente"));
redisClient.on("ready", () => console.log("⚡ Redis listo para usar"));
redisClient.on("error", (err) => console.error("❌ Error en Redis:", err.message));
redisClient.on("end", () => console.warn("⚠️ Redis desconectado. Esperando reconexión..."));

// Conectar automáticamente al importar
(async () => {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
    } catch (err) {
      console.error("❌ Error al conectar a Redis:", err.message);
    }
  }
})();

module.exports = redisClient;