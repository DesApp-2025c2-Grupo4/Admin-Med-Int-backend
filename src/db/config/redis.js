const redis = require("redis");

// URL de tu instancia en Render (sin password)
const REDIS_URL = "redis://red-d4b21b24d50c73cvmv9g:6379";

// Crear cliente Redis
const redisClient = redis.createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`🔄 Reintentando conexión a Redis (${retries})...`);
      return Math.min(retries * 100, 3000); // Reintenta cada 0.1s, 0.2s... hasta 3s
    },
  },
});

// Eventos informativos
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
