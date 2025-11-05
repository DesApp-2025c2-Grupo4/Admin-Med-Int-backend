const { Router } = require("express");
const { emailControllers} = require("../controllers");
const emailRoutes = Router();
const cacheMiddleware  = require('../middleware/redisMiddleware.js')

emailRoutes.post('/:personaId', cacheMiddleware.deleteCache('persona:'), emailControllers.addEmailToPersona)
emailRoutes.delete('/:emailId', cacheMiddleware.deleteCache('persona:'), emailControllers.deleteEmail);
emailRoutes.put('/:id', cacheMiddleware.deleteCache('persona:'), emailControllers.updateEmail)

module.exports = emailRoutes;