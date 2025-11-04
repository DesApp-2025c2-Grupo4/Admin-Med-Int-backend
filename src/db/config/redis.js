const redis = require("redis");
const REDIS_DEFAULT_URL = "redis://localhost:6379";
const redisClient = redis.createClient({
  url: process.env.REDIS_URL ?? REDIS_DEFAULT_URL,
  password: process.env.REDIS_PASSWORD ?? "redisPassword123",
  connectTimeout: 10000,
});

redisClient.on("error", (err) => console.log("No se ha podido conectar con Redis Client: ", err));
redisClient.on("connect", () => console.log("Redis Client connectó correctamente"));

module.exports = redisClient;