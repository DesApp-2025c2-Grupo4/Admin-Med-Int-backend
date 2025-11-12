const { Router } = require("express");
const { diasControllers } = require('../controllers')
const diasRoutes = Router();

diasRoutes.get('/', diasControllers.getDias)

module.exports = diasRoutes 