const { Router } = require('express')
const { agendaControllers } = require('../controllers')
const agendaRoutes = Router()

agendaRoutes.get('/', agendaControllers.getAgendas)

agendaRoutes.post('/', agendaControllers.createAgenda )

agendaRoutes.delete('/:id', agendaControllers.eliminarUnaAgenda)

module.exports = agendaRoutes