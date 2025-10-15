const { Router } = require("express");
const { situacionControllers } = require("../controllers");
const { requireAttribute } = require("../middleware/generic.middleware");
const situacionRoutes = Router();

situacionRoutes.get('/', situacionControllers.getSituaciones); 
situacionRoutes.post('/', requireAttribute('descripcion', 'Situación Terapéutica'), requireAttribute('fechaInicio', 'Situación Terapéutica'), situacionControllers.createSituacion);

module.exports = situacionRoutes;