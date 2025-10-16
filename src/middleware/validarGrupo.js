const Joi = require('joi')
const grupoSchema = require('./Schemas/grupoSchema')
const validarGenerico = require('./validarGenerico')

const validarGrupo = validarGenerico(grupoSchema, 'Datos de grupo inválidos')

module.exports = validarGrupo;