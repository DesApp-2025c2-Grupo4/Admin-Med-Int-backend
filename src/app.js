//--------------- Importaciones
//Express
const express = require('express')

//Redis
const redisClient = require('./db/config/redis.js')

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


const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('src/doc/swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//Configuración
app.use(express.json())

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },{
    origin: "https://sami-medicina-git-deploy-alvaro-66b76f5a.vercel.app", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//-------------- Listo
app.listen(PORT, async () => {
  try {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);

    if (process.env.NODE_ENV === 'production') {
      await db.sequelize.sync({force:true}); // crea tablas
      console.log("🗂️ Tablas listas");

      await require('./db/seeders/20251015225226-persona-data.js')
      .up(db.sequelize.getQueryInterface(), db.Sequelize);
      await require('./db/seeders/20251021120000-prestadores-data.js')
      .up(db.sequelize.getQueryInterface(), db.Sequelize);
      await require('./db/seeders/20251024000019-dias-de-la-semana-data.js')
      .up(db.sequelize.getQueryInterface(), db.Sequelize);
      
      console.log("✅ Seeders ejecutados correctamente");
    }

  } catch (error) {
    console.error("❌ Error al iniciar servidor:", error);
  }
});

// ------------ Exporto
module.exports = {
  app
}
