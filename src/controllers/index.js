const personaControllers = require('./persona.controllers');
const grupoControllers = require('./grupo.controllers')
const tipoDocControllers = require('./tipodocumento.controllers')    
const planMedicoControllers = require('./planmedico.controllers')
const telefonoControllers = require('./telefono.controllers')
const emailControllers = require('./email.controllers')
const direccionControllers = require('./direccion.controllers')
const situacionControllers = require('./situacion.controllers')
const situacionPersonaControllers = require('./situacion.persona.controllers')
const dataFormController = require('./formData.controller')
module.exports = {
    personaControllers,
    grupoControllers,
    tipoDocControllers,
    planMedicoControllers,
    telefonoControllers,
    emailControllers,
    direccionControllers,
    situacionControllers,
    situacionPersonaControllers,
    dataFormController
};