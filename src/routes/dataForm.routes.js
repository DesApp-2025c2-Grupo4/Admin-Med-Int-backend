const { Router } = require('express')
const dataFormRoutes = Router()
const { dataFormController } = require('../controllers')

dataFormRoutes.get('/', dataFormController.getDatosParaFormulario)

module.exports = dataFormRoutes