const { Router } = require("express");
const { emailControllers} = require("../controllers");
const emailRoutes = Router();

emailRoutes.post('/:personaId', emailControllers.addEmailToPersona)
emailRoutes.delete('/:emailId', emailControllers.deleteEmail);
emailRoutes.put('/:id', emailControllers.updateEmail)

module.exports = emailRoutes;