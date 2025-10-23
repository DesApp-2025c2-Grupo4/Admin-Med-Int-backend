const personaRoutes = require('./persona.routes')
const grupoRoutes = require('./grupo.routes')
const tipoDocRoutes = require('./tipodocumento.routes')
const planMedicoRoutes = require('./planmedico.routes')
const telefonoRoutes = require('./telefono.routes')
const emailRoutes = require('./email.routes')
const direccionRoutes = require('./direccion.routes')
const situacionRoutes = require('./situacion.routes')
const dataFormRoutes = require('./dataForm.routes')
const prestadorRoutes = require('./prestador.routes.js');
const agendaRoutes = require('./agenda.routes.js')

module.exports = {
    personaRoutes,
    grupoRoutes,
    tipoDocRoutes,
    planMedicoRoutes,
    telefonoRoutes,
    emailRoutes,
    direccionRoutes,
    situacionRoutes,
    dataFormRoutes,
    prestadorRoutes,
    agendaRoutes
};