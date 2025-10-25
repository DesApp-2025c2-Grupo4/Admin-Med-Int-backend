const { Router } = require("express");
const { prestadorControllers, telefonoPrestadorControllers, emailPrestadorControllers } = require("../controllers");
const { requireAttribute } = require('../middleware/generic.middleware');
const validarTelefono = require("../middleware/validarTelefono.js");
const validarEmail = require("../middleware/validarEmail.js");
const validarPrestador = require("../middleware/validarPrestador.js")
const prestadorRoutes = Router();

prestadorRoutes.get('/', prestadorControllers.getPrestadores);
prestadorRoutes.get('/:id', prestadorControllers.getPrestadorByPk);
prestadorRoutes.post('/', validarPrestador ,prestadorControllers.createPrestador);
prestadorRoutes.delete('/:id', prestadorControllers.deletePrestador);
prestadorRoutes.put('/:id', prestadorControllers.updatePrestador);

//agregar middleware de validacion genericos

//Telefono
prestadorRoutes.get('/:prestadorId/telefonos', telefonoPrestadorControllers.getTelefonosByPrestador);
prestadorRoutes.post('/:prestadorId/telefonos', validarTelefono, requireAttribute('nroTelefono', 'TelefonoPrestador'), telefonoPrestadorControllers.addTelefonoToPrestador);

//Email
prestadorRoutes.get('/:prestadorId/emails', emailPrestadorControllers.getEmailsByPrestador);
prestadorRoutes.post('/:prestadorId/emails', validarEmail ,requireAttribute('descripcion', 'EmailPrestador'), emailPrestadorControllers.addEmailToPrestador);


module.exports = prestadorRoutes;