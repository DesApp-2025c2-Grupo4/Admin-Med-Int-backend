const Joi = require("joi");
const agendaDiaSchema = require("./agendaDiaSchema");

const agendaSchema = Joi.object({
  prestadorId: Joi.number().integer().positive().required().messages({
    "number.base": "prestadorId debe ser un número",
    "number.integer": "prestadorId debe ser un número entero",
    "number.positive": "prestadorId debe ser un número positivo",
    "any.required": "prestadorId es un campo obligatorio",
  }),

  especialidadId: Joi.number().integer().positive().required().messages({
    "number.base": "especialidadId debe ser un número",
    "number.integer": "especialidadId debe ser un número entero",
    "number.positive": "especialidadId debe ser un número positivo",
    "any.required": "especialidadId es un campo obligatorio",
  }),

  direccionId: Joi.number().integer().positive().required().messages({
    "number.base": "direccionId debe ser un número",
    "number.integer": "direccionId debe ser un número entero",
    "number.positive": "direccionId debe ser un número positivo",
    "any.required": "direccionId es un campo obligatorio",
  }),

  agendas: Joi.array().items(agendaDiaSchema).min(1).required().messages({
    "array.base": "Las agendas deben ser un arreglo",
    "array.min": "Debe haber al menos un día en la agenda",
    "any.required": "Las agendas son un campo obligatorio",
  }),
});

module.exports = agendaSchema;
