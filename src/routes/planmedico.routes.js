const { Router } = require("express");
const { planMedicoControllers } = require("../controllers");
const { requireAttribute } = require("../middleware/generic.middleware");
const planMedicoRoutes = Router();
const cacheMiddleware  = require('../middleware/redisMiddleware.js')

planMedicoRoutes.post('/', requireAttribute('descripcion', 'PlanMedico'), cacheMiddleware.deleteCache('planMedico:list'), planMedicoControllers.createPlanMedico);

planMedicoRoutes.get('/', cacheMiddleware.checkCache('planMedico:list'), cacheMiddleware.deleteCache('dataform:general'), planMedicoControllers.getPlanesMedicos);

module.exports = planMedicoRoutes;