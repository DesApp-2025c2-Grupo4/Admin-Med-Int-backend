const { Router } = require("express");
const { grupoControllers } = require("../controllers");
const validarGrupo = require("../middleware/validarGrupo");
const grupoRoutes = Router();
const cacheMiddleware  = require('../middleware/redisMiddleware.js')

grupoRoutes.get('/', cacheMiddleware.checkCache('grupo:list:all'), grupoControllers.getGrupos)
grupoRoutes.get('/:id', cacheMiddleware.deleteCache('grupo:'), grupoControllers.getGrupoByPk)
grupoRoutes.post('/', validarGrupo, cacheMiddleware.deleteCache('grupo:list:all'), grupoControllers.createGrupo);
grupoRoutes.delete('/:id', cacheMiddleware.deleteCache('grupo:'), cacheMiddleware.deleteCache('grupo:list:all'), grupoControllers.deleteGrupo)
grupoRoutes.put('/:id', cacheMiddleware.deleteCache('grupo:'), cacheMiddleware.deleteCache('grupo:list:all'), grupoControllers.actualizarGrupo)
module.exports = grupoRoutes;