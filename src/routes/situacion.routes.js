const { Router } = require("express");
const { situacionControllers } = require("../controllers");
const { requireAttribute } = require("../middleware/generic.middleware");
const situacionRoutes = Router();
const cacheMiddleware  = require('../middleware/redisMiddleware.js')

situacionRoutes.get('/', cacheMiddleware.checkCache('situacion:list'), situacionControllers.getSituaciones); 
situacionRoutes.post('/',cacheMiddleware.deleteCache('situacion:list'), requireAttribute('descripcion', 'Situación Terapéutica'), requireAttribute('fechaInicio', 'Situación Terapéutica'), situacionControllers.createSituacion);

module.exports = situacionRoutes;