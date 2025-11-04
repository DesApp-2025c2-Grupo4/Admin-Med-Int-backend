const { Router } = require("express");
const { emailControllers, emailPrestadorControllers } = require("../controllers");
const emailRoutes = Router();
const cacheMiddleware  = require('../middleware/redisMiddleware.js')


emailRoutes.post('/', cacheMiddleware.deleteCache('prestador:list'), emailPrestadorControllers.addEmailToPrestador)
emailRoutes.delete('/:emailId', cacheMiddleware.deleteCache('persona:'), cacheMiddleware.deleteCache('prestador:'), emailControllers.deleteEmail);

module.exports = emailRoutes;