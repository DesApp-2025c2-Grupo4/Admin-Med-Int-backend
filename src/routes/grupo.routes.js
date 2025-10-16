const { Router } = require("express");
const { grupoControllers } = require("../controllers");
const validarGrupo = require("../middleware/validarGrupo");
const grupoRoutes = Router();

grupoRoutes.get('/',grupoControllers.getGrupos)
grupoRoutes.get('/:id', grupoControllers.getGrupoByPk)
grupoRoutes.post('/', validarGrupo ,grupoControllers.createGrupo);

module.exports = grupoRoutes;