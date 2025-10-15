const { Router } = require("express");
const { telefonoControllers } = require("../controllers");
const telefonoRoutes = Router();

telefonoRoutes.delete('/:telefonoId', telefonoControllers.deleteTelefono);

module.exports = telefonoRoutes;