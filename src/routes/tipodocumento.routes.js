const { Router } = require("express");
const { tipoDocControllers } = require("../controllers");
const { requireAttribute } = require("../middleware/generic.middleware");
const tipoDocRoutes = Router();
const cacheMiddleware  = require('../middleware/redisMiddleware.js')

tipoDocRoutes.post('/', cacheMiddleware.deleteCache('tipoDoc:list'), cacheMiddleware.deleteCache('dataform:general'), requireAttribute('descripcion', 'TipoDocumento'), tipoDocControllers.createTipoDoc);
tipoDocRoutes.get('/', cacheMiddleware.checkCache('tipoDoc:list'), tipoDocControllers.getTipoDoc);

module.exports = tipoDocRoutes;