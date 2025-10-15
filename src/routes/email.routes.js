const { Router } = require("express");
const { emailControllers } = require("../controllers");
const emailRoutes = Router();

emailRoutes.delete('/:emailId', emailControllers.deleteEmail);

module.exports = emailRoutes;