const { Router } = require("express");
const registerRoutes = Router()
const { usuarioControllers } = require('../controllers')

registerRoutes.post('/', usuarioControllers.registrar)

module.exports = registerRoutes