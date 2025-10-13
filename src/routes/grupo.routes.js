const { Router } = require("express");
const { grupoControllers } = require("../controllers")
const grupoRoutes = Router();

grupoRoutes.post('/', grupoControllers.createGrupo);

module.exports = grupoRoutes;