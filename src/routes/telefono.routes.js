const { Router } = require("express");
const { telefonoControllers } = require("../controllers");
const telefonoRoutes = Router();
const cacheMiddleware  = require('../middleware/redisMiddleware.js')

telefonoRoutes.post('/:personaId', cacheMiddleware.deleteCache('persona:'), telefonoControllers.addTelefonoToPersona);
telefonoRoutes.delete('/:telefonoId', cacheMiddleware.deleteCache('persona:'), telefonoControllers.deleteTelefono);
telefonoRoutes.put('/:id', cacheMiddleware.deleteCache('persona:'), telefonoControllers.updateTelefono)

module.exports = telefonoRoutes;