const { Router } = require("express");
const { personaControllers, telefonoControllers, emailControllers, direccionControllers, situacionPersonaControllers } = require("../controllers");
const { requireAttribute, ifPersonaExists } = require('../middleware/generic.middleware');
const validarPersona = require("../middleware/validarPersona.js");
const validarTelefono = require("../middleware/validarTelefono.js");
const validarEmail = require("../middleware/validarEmail.js");
const personaRoutes = Router();

personaRoutes.get('/', personaControllers.getPersonas);
personaRoutes.get('/:id', personaControllers.getPersonaByPk);
personaRoutes.post('/', validarPersona ,personaControllers.createPersona);
personaRoutes.delete('/:id', personaControllers.deletePersona);
//Telefono
personaRoutes.get('/:personaId/telefonos', telefonoControllers.getTelefonosByPersona);
personaRoutes.post('/:personaId/telefonos', validarTelefono, requireAttribute('nroTelefono', 'Telefono'), ifPersonaExists, telefonoControllers.addTelefonoToPersona);

//Email
personaRoutes.get('./:personaId/emails', emailControllers.getEmailsByPersona);
personaRoutes.post('/:personaId/emails', validarEmail ,requireAttribute('descripcion', 'Email'), ifPersonaExists, emailControllers.addEmailToPersona);

//Direccion
personaRoutes.get('./:personaId/direcciones', direccionControllers.getDireccionesByPersona);
personaRoutes.post('/:personaId/direcciones', requireAttribute('calle', 'Dirección'), requireAttribute('nro', 'Dirección'), ifPersonaExists, direccionControllers.addDireccionToPersona);

//Situacion
personaRoutes.get("/:personaId/situaciones", ifPersonaExists, situacionPersonaControllers.getSituacionesByPersona);
personaRoutes.post("/:personaId/situaciones/:situacionId", ifPersonaExists, situacionPersonaControllers.addSituacionToPersona);
personaRoutes.delete("/:personaId/situaciones/:situacionId", ifPersonaExists, situacionPersonaControllers.deleteSituacionFromPersona);

module.exports = personaRoutes;