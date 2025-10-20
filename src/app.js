//--------------- Importaciones
//Express
const express = require('express')

//Cors
const cors = require('cors')

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
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);

    // En producción, crear las tablas si no existen
    if (process.env.NODE_ENV === 'production') {
      await db.sequelize.sync(); // 👈 Esto crea todas las tablas si no existen
      console.log("🗂️ Tablas sincronizadas con la base de datos");
    }

  } catch (error) {
    console.error("❌ Error al iniciar servidor:", error);
  }
});

// ------------ Exporto
module.exports = {
  app
}