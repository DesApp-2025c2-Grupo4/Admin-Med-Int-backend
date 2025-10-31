const { Router } = require('express')
const dataFormRoutes = Router()
const { dataFormController } = require('../controllers')

dataFormRoutes.get('/', dataFormController.getDatosParaFormulario)
dataFormRoutes.get('/prestador', dataFormController.getDatosParaPrestadores)

module.exports = dataFormRoutes