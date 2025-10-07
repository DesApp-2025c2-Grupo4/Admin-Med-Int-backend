// Importación de dotenv
const dotenv = require('dotenv')
dotenv.config()

// Cargo variables de entorno
const DB_USER = process.env.DB_USER || 'admin'
const DB_PASSWORD = process.env.DB_PASSWORD || 'admin123'
const DB_NAME = process.env.DB_NAME || 'db_admin_med_integral'
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT || 5431
const DB_DIALECT = process.env.DB_DIALECT || 'postgres'

// Configuración de DB
module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: DB_DIALECT
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
}
