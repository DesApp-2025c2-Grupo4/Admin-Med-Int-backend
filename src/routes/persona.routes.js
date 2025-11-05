const { Router } = require("express");
const { personaControllers, telefonoControllers, emailControllers, direccionControllers, situacionPersonaControllers } = require("../controllers");
const { requireAttribute, ifPersonaExists } = require('../middleware/generic.middleware');
const validarPersona = require("../middleware/validarPersona.js");
const validarTelefono = require("../middleware/validarTelefono.js");
const validarEmail = require("../middleware/validarEmail.js");
const validarDireccion = require("../middleware/validarDireccion.js");
const validarSituacion = require("../middleware/validarSituacion.js");
const personaRoutes = Router();
const cacheMiddleware  = require('../middleware/redisMiddleware.js')


personaRoutes.get('/', cacheMiddleware.checkCache('persona:list:all'), personaControllers.getPersonas);
personaRoutes.get('/afiliados',cacheMiddleware.checkCache('afiliado:list:all'), personaControllers.getAfiliados)
personaRoutes.get('/afiliados/por-periodo',cacheMiddleware.checkCache('afiliado:list:periodo:'), personaControllers.getAfiliadosPorPeriodo);
personaRoutes.get('/:id',cacheMiddleware.checkCache('persona:'), personaControllers.getPersonaByPk);
personaRoutes.post('/', cacheMiddleware.deleteCache('persona:list:all'), validarPersona, personaControllers.createPersona);
personaRoutes.delete('/:id',cacheMiddleware.deleteCache('persona:'), personaControllers.deletePersona);
personaRoutes.put('/:id', cacheMiddleware.deleteCache('persona:'), personaControllers.actualizarPersona)
//Telefono
personaRoutes.get('/:personaId/telefonos', cacheMiddleware.checkCache('telefono:list:'), telefonoControllers.getTelefonosByPersona);
personaRoutes.post('/:personaId/telefonos', cacheMiddleware.deleteCache('telefono:list:'), cacheMiddleware.deleteCache('persona:'), validarTelefono, requireAttribute('nroTelefono', 'Telefono'), ifPersonaExists, telefonoControllers.addTelefonoToPersona);

//Email
personaRoutes.get('./:personaId/emails', cacheMiddleware.checkCache('email:list:'), emailControllers.getEmailsByPersona);
personaRoutes.post('/:personaId/emails', validarEmail, cacheMiddleware.deleteCache('email:list:'), cacheMiddleware.deleteCache('persona:'), requireAttribute('descripcion', 'Email'), ifPersonaExists, emailControllers.addEmailToPersona);

//Direccion
personaRoutes.get('./:personaId/direcciones', cacheMiddleware.checkCache('direccion:list:'), direccionControllers.getDireccionesByPersona);
personaRoutes.post('/:personaId/direcciones', validarDireccion, cacheMiddleware.deleteCache('direccion:list:'), cacheMiddleware.deleteCache('persona:'), requireAttribute('calle', 'Dirección'), requireAttribute('nro', 'Dirección'), ifPersonaExists, direccionControllers.addDireccionToPersona);

//Situacion
personaRoutes.get("/:personaId/situaciones", ifPersonaExists, cacheMiddleware.checkCache('situacion:list:'), situacionPersonaControllers.getSituacionesByPersona);
personaRoutes.post("/:personaId/situaciones/:situacionId", validarSituacion, cacheMiddleware.deleteCache('situacion:list:'), cacheMiddleware.deleteCache('persona:'), ifPersonaExists, situacionPersonaControllers.addSituacionToPersona);
personaRoutes.delete("/:personaId/situaciones/:situacionId", ifPersonaExists, cacheMiddleware.deleteCache('situacion:list:'), cacheMiddleware.deleteCache('persona:'), situacionPersonaControllers.deleteSituacionFromPersona);

module.exports = personaRoutes;