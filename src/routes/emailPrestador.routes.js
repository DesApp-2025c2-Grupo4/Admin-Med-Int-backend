const { Router } = require("express");
const { emailControllers, emailPrestadorControllers } = require("../controllers");
const emailRoutes = Router();

emailRoutes.post('/', emailPrestadorControllers.addEmailToPrestador)
emailRoutes.delete('/:emailId', emailControllers.deleteEmail);

module.exports = emailRoutes;