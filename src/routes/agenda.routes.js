const { Router } = require('express')
const { agendaControllers } = require('../controllers')
const agendaRoutes = Router()
const cacheMiddleware  = require('../middleware/redisMiddleware.js')

agendaRoutes.get('/', cacheMiddleware.checkCache('agenda:list'), agendaControllers.getAgendas)

agendaRoutes.post('/', cacheMiddleware.deleteCache('agenda:list'), agendaControllers.createAgenda )

module.exports = agendaRoutes