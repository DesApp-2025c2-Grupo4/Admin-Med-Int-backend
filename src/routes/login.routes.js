const { Router } = require("express");
const loginRoutes = Router()
const { usuarioControllers } = require('../controllers')

loginRoutes.post('/', usuarioControllers.login)

module.exports = loginRoutes