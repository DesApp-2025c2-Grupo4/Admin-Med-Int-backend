const { Router } = require("express");
const { tipoDocControllers } = require("../controllers")
const tipoDocRoutes = Router();

tipoDocRoutes.post('/', tipoDocControllers.createTipoDoc);

module.exports = tipoDocRoutes;