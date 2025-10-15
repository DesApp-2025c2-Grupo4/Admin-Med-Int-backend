const { Router } = require("express");
const { planMedicoControllers } = require("../controllers");
const { requireAttribute } = require("../middleware/generic.middleware");
const planMedicoRoutes = Router();

planMedicoRoutes.post('/', requireAttribute('descripcion', 'PlanMedico'), planMedicoControllers.createPlanMedico);

planMedicoRoutes.get('/', planMedicoControllers.getPlanesMedicos);

module.exports = planMedicoRoutes;