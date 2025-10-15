const { Router } = require("express");
const { personaControllers } = require("../controllers")
const personaRoutes = Router();

personaRoutes.get('/', personaControllers.getPersonas);

personaRoutes.post('/', personaControllers.createPersona);

personaRoutes.delete('/:id', personaControllers.deletePersona);

module.exports = personaRoutes;