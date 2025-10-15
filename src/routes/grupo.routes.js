const { Router } = require("express");
const { grupoControllers } = require("../controllers")
const grupoRoutes = Router();

grupoRoutes.get('/',grupoControllers.getGrupos)

grupoRoutes.post('/', grupoControllers.createGrupo);

module.exports = grupoRoutes;