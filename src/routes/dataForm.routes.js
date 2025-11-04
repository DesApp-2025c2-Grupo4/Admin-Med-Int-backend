const { Router } = require('express')
const dataFormRoutes = Router()
const { dataFormController } = require('../controllers')
const cacheMiddleware  = require('../middleware/redisMiddleware.js')

dataFormRoutes.get('/', cacheMiddleware.checkCache('dataform:general'), dataFormController.getDatosParaFormulario)
dataFormRoutes.get('/prestador', cacheMiddleware.checkCache('dataform:prestador'), dataFormController.getDatosParaPrestadores)

module.exports = dataFormRoutes