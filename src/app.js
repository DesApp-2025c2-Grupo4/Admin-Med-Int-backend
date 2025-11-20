//--------------- Importaciones
//Express
const express = require('express')

//Redis
const redisClient = require('./db/config/redis.js')

//Cors
const cors = require('cors')

//Swagger

const swaggerUi = require('swagger-ui-express');
const openapiSpecification = require("./docs/swagger.js");

//Dotenv
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT || 3000

//DB
const db = require('./db/models')

//-------------- Instancio
const app = express()

//Configuración
app.use(express.json())

app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//-------------- Listo
app.listen(PORT, async () => {
  try {
    //await db.sequelize.sync({ force: true })
    console.log(`Servidor Corriendo en http://localhost:${PORT}`)
    await redisClient.connect();
  } catch (error) {
    console.log(error)
  }
})

// ------------ Exporto
module.exports = {
  app
}