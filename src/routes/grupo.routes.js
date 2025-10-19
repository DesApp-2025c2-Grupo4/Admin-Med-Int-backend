const { Router } = require("express");
const { grupoControllers } = require("../controllers");
const validarGrupo = require("../middleware/validarGrupo");
const grupoRoutes = Router();

grupoRoutes.get('/',grupoControllers.getGrupos)
grupoRoutes.get('/:id', grupoControllers.getGrupoByPk)
grupoRoutes.post('/', grupoControllers.createGrupo);
grupoRoutes.post('/', grupoControllers.createGrupo);
grupoRoutes.delete('/:id', grupoControllers.deleteGrupo)
module.exports = grupoRoutes;