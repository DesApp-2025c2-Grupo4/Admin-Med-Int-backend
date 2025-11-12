const Joi = require("joi");
const prestadorSchema = require("./Schemas/prestadorSchema");
const validarGenerico = require("./validarGenerico");

const validarPrestador = validarGenerico(prestadorSchema,"Datos de prestador inválidos");

module.exports = validarPrestador;
