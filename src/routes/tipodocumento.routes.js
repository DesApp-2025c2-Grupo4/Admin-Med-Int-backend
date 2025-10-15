const { Router } = require("express");
const { tipoDocControllers } = require("../controllers");
const { requireAttribute } = require("../middleware/generic.middleware");
const tipoDocRoutes = Router();

tipoDocRoutes.post('/', requireAttribute('descripcion', 'TipoDocumento'), tipoDocControllers.createTipoDoc);

tipoDocRoutes.get('/', tipoDocControllers.getTipoDoc);

module.exports = tipoDocRoutes;