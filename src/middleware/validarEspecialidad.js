const Joi = require('joi')
const especialidadSchema = require('./Schemas/especialidadSchema')
const validarGenerico = require('./validarGenerico')

const validarEspecialidad = validarGenerico(especialidadSchema, 'Datos de especialidad inválidos')

module.exports = validarEspecialidad;