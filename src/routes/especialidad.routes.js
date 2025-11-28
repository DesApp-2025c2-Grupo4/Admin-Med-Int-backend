const { Router } = require("express");
const { especialidadControllers } = require("../controllers");
const cacheMiddleware = require('../middleware/redisMiddleware.js');
const especialidadRoutes = Router()

especialidadRoutes.get('/', cacheMiddleware.checkCache('especialidad:list:'), especialidadControllers.getEspecialidades);
especialidadRoutes.get('/:id', cacheMiddleware.checkCache('especialidad:'), especialidadControllers.getEspecialidadByPk);

module.exports = especialidadRoutes;