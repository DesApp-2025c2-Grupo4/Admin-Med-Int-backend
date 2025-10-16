const Joi = require('joi');
const personaSchema = require('./Schemas/personaSchema'); 
const validarGenerico = require('./validarGenerico'); 

const validarPersona = validarGenerico( personaSchema,'Datos de persona inválidos');

module.exports = validarPersona;