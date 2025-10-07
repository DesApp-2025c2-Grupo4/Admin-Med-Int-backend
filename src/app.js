//--------------- Importaciones
//Express
const express = require('express')

//Dotenv
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT || 3000

//DB
const db = require('./db/models')

//-------------- Instancio
const app = express()

//-------------- Listo
app.listen(PORT, async () => {
  try {
    // await db.sequelize.sync({force:false})
    console.log(`Servidor Corriendo en http://localhost:${PORT}`)
  } catch (error) {
    console.log(error)
  }
})

// ------------ Exporto
module.exports = {
  app
}