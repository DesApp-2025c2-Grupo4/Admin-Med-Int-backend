const { Router } = require("express");
const { direccionControllers } = require("../controllers");
const direccionRoutes = Router();

direccionRoutes.delete("/direcciones/:direccionId", direccionControllers.deleteDireccion);

module.exports = direccionRoutes;