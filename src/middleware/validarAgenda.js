const Joi = require("joi");
const agendaSchema = require("./Schemas/agendaSchema");
const validarGenerico = require("./validarGenerico");

const validarAgenda = validarGenerico( agendaSchema,"Datos de agenda inválidos");

module.exports = validarAgenda;
