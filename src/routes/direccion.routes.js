const { Router } = require("express");
const { direccionControllers } = require("../controllers");
const direccionRoutes = Router();
const cacheMiddleware  = require('../middleware/redisMiddleware.js')


direccionRoutes.delete("/:direccionId", cacheMiddleware.deleteCache('persona:'), direccionControllers.deleteDireccion);
direccionRoutes.post("/:personaId", cacheMiddleware.deleteCache('persona:'), direccionControllers.addDireccionToPersona);
direccionRoutes.put("/:id", cacheMiddleware.deleteCache('persona:'), direccionControllers.updateDireccion);

module.exports = direccionRoutes;