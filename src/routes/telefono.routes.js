const { Router } = require("express");
const { telefonoControllers } = require("../controllers");
const telefonoRoutes = Router();
telefonoRoutes.post('/:personaId', telefonoControllers.addTelefonoToPersona);
telefonoRoutes.delete('/:telefonoId', telefonoControllers.deleteTelefono);
telefonoRoutes.put('/:id', telefonoControllers.updateTelefono)

module.exports = telefonoRoutes;