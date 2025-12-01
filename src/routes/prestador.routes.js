const { Router } = require("express");
const { prestadorControllers, telefonoPrestadorControllers, emailPrestadorControllers } = require("../controllers");
const { requireAttribute } = require('../middleware/generic.middleware');
const validarTelefono = require("../middleware/validarTelefono.js");
const validarEmail = require("../middleware/validarEmail.js");
const prestadorRoutes = Router();
const cacheMiddleware  = require('../middleware/redisMiddleware.js')
const validarPrestador = require("../middleware/validarPrestador.js");
const { validarCuilCuitUnico } = require("../middleware/validarCamposUnicos.js");

prestadorRoutes.get('/', cacheMiddleware.checkCache('prestador:list'),  prestadorControllers.getPrestadores);
prestadorRoutes.get('/por-periodo',cacheMiddleware.checkCache('prestador:list:periodo:'), prestadorControllers.getPrestadoresPorPeriodo);
prestadorRoutes.get('/por-especialidad/:especialidadId', cacheMiddleware.checkCache('prestador:list:especialidad:'), prestadorControllers.getPrestadoresPorEspecialidad);
prestadorRoutes.get('/por-codigo-postal/:codigoPostal', cacheMiddleware.checkCache('prestador:list:codigoPostal:'), prestadorControllers.getPrestadoresPorCodigoPostal);
prestadorRoutes.get('/sin-agenda', cacheMiddleware.checkCache('prestador:list:sin-agenda'), prestadorControllers.getPrestadoresSinAgenda);
prestadorRoutes.get('/:id', cacheMiddleware.checkCache('prestador:'), prestadorControllers.getPrestadorByPk);
prestadorRoutes.post('/', cacheMiddleware.deleteCache('prestador:list'),validarCuilCuitUnico, validarPrestador ,prestadorControllers.createPrestador);
prestadorRoutes.delete('/:id', cacheMiddleware.deleteCache('prestador:list'), cacheMiddleware.deleteCache('prestador:'), prestadorControllers.deletePrestador);
prestadorRoutes.put('/:id', cacheMiddleware.deleteCache('prestador:list'), cacheMiddleware.deleteCache('prestador:'), prestadorControllers.updatePrestador);

//Telefono
prestadorRoutes.get('/:prestadorId/telefonos', cacheMiddleware.checkCache('prestadorTelefonos:list:'), telefonoPrestadorControllers.getTelefonosByPrestador);
prestadorRoutes.post('/:prestadorId/telefonos', cacheMiddleware.deleteCache('prestadorTelefonos:list:'),cacheMiddleware.deleteCache('prestador:'), validarTelefono, requireAttribute('nroTelefono', 'TelefonoPrestador'), telefonoPrestadorControllers.addTelefonoToPrestador);

//Email
prestadorRoutes.get('/:prestadorId/emails', cacheMiddleware.checkCache('prestadorEmails:list:'), emailPrestadorControllers.getEmailsByPrestador);
prestadorRoutes.post('/:prestadorId/emails', cacheMiddleware.deleteCache('prestadorEmails:list:'), cacheMiddleware.deleteCache('prestador:'), validarEmail, requireAttribute('descripcion', 'EmailPrestador'), emailPrestadorControllers.addEmailToPrestador);


module.exports = prestadorRoutes;