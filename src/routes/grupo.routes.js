const { Router } = require("express");
const { grupoControllers } = require("../controllers");
const validarGrupo = require("../middleware/validarGrupo");
const grupoRoutes = Router();

grupoRoutes.get('/',grupoControllers.getGrupos)
grupoRoutes.get('/:id', grupoControllers.getGrupoByPk)
grupoRoutes.post('/', validarGrupo , grupoControllers.createGrupo);
grupoRoutes.delete('/:id', grupoControllers.deleteGrupo)
grupoRoutes.put('/:id',grupoControllers.actualizarGrupo)
module.exports = grupoRoutes;