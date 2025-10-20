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

    // Solo en producción
    if (process.env.NODE_ENV === 'production') {
      const { sequelize } = db;
      const { QueryTypes } = require('sequelize');


      if (parseInt(result[0].count) === 0) {
        console.log("🌱 Base vacía, corriendo seeders automáticamente...");
        await require('./db/seeders/20250101-mi-seed.js').up(db.sequelize.getQueryInterface(), db.Sequelize);
        console.log("✅ Seeders ejecutados correctamente");
      }
    }
  } catch (error) {
    console.error("❌ Error al iniciar servidor:", error);
  }
});
// ------------ Exporto
module.exports = {
  app
}