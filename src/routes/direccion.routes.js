const { Router } = require("express");
const { direccionControllers } = require("../controllers");
const direccionRoutes = Router();

direccionRoutes.delete("/:direccionId", direccionControllers.deleteDireccion);
direccionRoutes.post("/:personaId", direccionControllers.addDireccionToPersona);
direccionRoutes.put("/:id", direccionControllers.updateDireccion);

module.exports = direccionRoutes;