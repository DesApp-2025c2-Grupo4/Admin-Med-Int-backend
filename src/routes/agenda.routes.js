const { Router } = require('express')
const { agendaControllers } = require('../controllers')
const agendaRoutes = Router()

agendaRoutes.get('/', agendaControllers.getAgendas)

module.exports = agendaRoutes