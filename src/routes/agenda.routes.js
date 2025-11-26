const { Router } = require('express')
const { agendaControllers } = require('../controllers')
const agendaRoutes = Router()
const cacheMiddleware  = require('../middleware/redisMiddleware.js')
const validarAgenda = require('../middleware/validarAgenda.js')
const validarHorario = require('../middleware/validarHorario.js')

agendaRoutes.get('/', cacheMiddleware.checkCache('agenda:list'), agendaControllers.getAgendas)

agendaRoutes.post('/', cacheMiddleware.deleteCache('agenda:list'), validarAgenda, validarHorario  ,agendaControllers.createAgenda )

agendaRoutes.delete('/:id', agendaControllers.eliminarUnaAgenda)

agendaRoutes.get('/:id', agendaControllers.getAgendaById)

agendaRoutes.put('/:id', validarAgenda ,agendaControllers.updateAgenda)

module.exports = agendaRoutes