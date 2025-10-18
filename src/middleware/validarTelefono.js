const Joi = require('joi');
const telefonoSchema = require('./Schemas/telefonoSchema'); 
const validarGenerico = require('./validarGenerico'); 

const validarTelefono = validarGenerico(telefonoSchema,'Datos de teléfono inválidos');

module.exports = validarTelefono;