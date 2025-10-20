const { Router } = require("express");
const { prestadorControllers, telefonoPrestadorControllers, emailPrestadorControllers } = require("../controllers");
const validarTelefono = require("../middleware/validarTelefono.js");
const prestadorRoutes = Router();

prestadorRoutes.get('/', prestadorControllers.getPrestadores);
prestadorRoutes.get('/:id', prestadorControllers.getPrestadorByPk);
prestadorRoutes.post('/', prestadorControllers.createPrestador);
prestadorRoutes.delete('/:id', prestadorControllers.deletePrestador);


//Telefono
prestadorRoutes.get('/:prestadorId/telefonos', telefonoPrestadorControllers.getTelefonosByPrestador);
prestadorRoutes.post('/:prestadorId/telefonos', validarTelefono, requireAttribute('nroTelefono', 'Telefono'), ifPrestadorExists, telefonoPrestadorControllers.addTelefonoToPrestador);

//Email
prestadorRoutes.get('./:prestadorId/emails', emailPrestadorControllers.getEmailsByPrestador);
prestadorRoutes.post('/:prestadorId/emails', validarEmail ,requireAttribute('descripcion', 'Email'), ifPrestadorExists, emailPrestadorControllers.addEmailToPrestador);


module.exports = prestadorRoutes;